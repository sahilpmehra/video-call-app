import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import UserVideo from '../components/UserVideo';
import ParticipantVideo from '../components/ParticipantVideo';
import { WebRTCService } from '../services/webRTC';
import SocketService from '../services/socketService';

const CallScreen = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [webRTC, setWebRTC] = useState<WebRTCService | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const socket = SocketService.getInstance();
    const isCreator = location.state?.isCreator || false;

    const handleEndCall = () => {
        socket.emit('end-call', roomId);
        cleanup();
        navigate('/');
    };

    const handleLeaveCall = () => {
        socket.emit('leave-call', roomId);
        cleanup();
        navigate('/');
    };

    const handleShareLink = async () => {
        const roomLink = `${window.location.origin}/call/${roomId}`;
        try {
            await navigator.clipboard.writeText(roomLink);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const cleanup = () => {
        if (webRTC) {
            webRTC.cleanup();
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        const initializeCall = async () => {
            const rtcService = new WebRTCService(socket);
            setWebRTC(rtcService);

            try {
                // Set up remote stream handling
                // By moving setOnTrack before getting the local media and adding tracks, we ensure that both parties have their ontrack handlers set up before any negotiation begins. This is crucial because WebRTC events can fire very quickly, and if the handler isn't set up early enough, we might miss some track events.
                rtcService.setOnTrack((event) => {
                    setRemoteStream(event.streams[0]);
                });

                const stream = await rtcService.getUserMedia();
                setLocalStream(stream);

                // Add local stream tracks to peer connection
                stream.getTracks().forEach(track => {
                    rtcService.addTrack(track, stream);
                });

                // Join the room
                socket.emit('join-room', roomId, isCreator);
            } catch (error) {
                console.error('Error setting up call:', error);
            }
        };

        initializeCall();

        return () => {
            cleanup();
        };
    }, [roomId, isCreator]);

    useEffect(() => {
        if (!webRTC) return;

        socket.on('call-ended', () => {
            cleanup();
            navigate('/');
        });

        socket.on('user-left', (userId: string) => {
            console.log('User left:', userId);
            setRemoteStream(null);
        });

        socket.on('user-connected', async (userId: string) => {
            console.log('User connected:', userId);
            await webRTC.createOffer(userId);
        });

        socket.on('offer', async ({ sdp, caller }: { sdp: RTCSessionDescriptionInit, caller: string }) => {
            console.log('Received offer from:', caller);
            await webRTC.handleOffer(sdp, caller);
        });

        socket.on('answer', async ({ sdp, answerer }: { sdp: RTCSessionDescriptionInit, answerer: string }) => {
            console.log('Received answer from:', answerer);
            await webRTC.handleAnswer(sdp);
        });

        socket.on('ice-candidate', ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            console.log('Received ICE candidate');
            webRTC.handleIceCandidate(candidate);
        });

        return () => {
            socket.off('user-connected');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('call-ended');
            socket.off('user-left');
        };

    }, [webRTC, socket]);

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <UserVideo stream={localStream} />
                <ParticipantVideo stream={remoteStream} />
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center space-x-4 bg-gradient-to-t from-black/50 to-transparent">
                {isCreator && (
                    <div className="relative">
                        <button
                            onClick={handleShareLink}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
                        >
                            Share Link
                        </button>
                        {showCopiedMessage && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm">
                                Link copied!
                            </div>
                        )}
                    </div>
                )}
                {isCreator ? (
                    <button
                        onClick={handleEndCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
                    >
                        End Call
                    </button>
                ) : (
                    <button
                        onClick={handleLeaveCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
                    >
                        Leave Call
                    </button>
                )}
            </div>
        </div>
    );
};

export default CallScreen;