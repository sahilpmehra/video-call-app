import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { WebRTCService } from '../services/webRTC';
import SocketService from '../services/socketService';
import VideoGrid from '../components/call/VideoGrid';
import CallControls from '../components/call/CallControls';

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
        const baseUrl = window.location.origin;
        const roomLink = `${baseUrl}/?room=${roomId}`;
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

                // 2. Get local stream and add tracks to peer connection
                const stream = await rtcService.getUserMedia();
                setLocalStream(stream);

                // 3. Wait for tracks to be added to peer connection
                await Promise.all(stream.getTracks().map(track => {
                    return rtcService.addTrack(track, stream);
                }));

                // 4. Only join room after everything is set up
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
        <div className="flex flex-col h-[100dvh] bg-gray-900 p-4">
            <VideoGrid
                remoteStream={remoteStream}
                localStream={localStream}
            />
            <CallControls
                isCreator={isCreator}
                onShareLink={handleShareLink}
                onEndCall={handleEndCall}
                onLeaveCall={handleLeaveCall}
                showCopiedMessage={showCopiedMessage}
            />
        </div>
    );
};

export default CallScreen;