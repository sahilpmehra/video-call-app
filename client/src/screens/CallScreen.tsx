import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserVideo from '../components/UserVideo';
import ParticipantVideo from '../components/ParticipantVideo';
import { WebRTCService } from '../services/webRTC';
import SocketService from '../services/socketService';

const CallScreen = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [webRTC, setWebRTC] = useState<WebRTCService | null>(null);
    const socket = SocketService.getInstance();

    useEffect(() => {
        const initializeCall = async () => {
            const rtcService = new WebRTCService(socket);
            setWebRTC(rtcService);

            try {
                const stream = await rtcService.getUserMedia();
                setLocalStream(stream);

                // Add local stream tracks to peer connection
                stream.getTracks().forEach(track => {
                    rtcService.addTrack(track, stream);
                });

                // Set up remote stream handling
                rtcService.setOnTrack((event) => {
                    setRemoteStream(event.streams[0]);
                });

                // Join the room
                socket.emit('join-room', roomId);
            } catch (error) {
                console.error('Error setting up call:', error);
            }
        };

        initializeCall();

        return () => {
            webRTC?.cleanup();
        };
    }, [roomId, socket, webRTC]);

    useEffect(() => {
        if (!webRTC) return;

        socket.on('user-connected', async (userId: string) => {
            console.log('User connected:', userId);
            await webRTC.createOffer(userId);
        });

        socket.on('offer', async ({ sdp, caller }: { sdp: RTCSessionDescriptionInit, caller: string }) => {
            console.log('Received offer from:', caller);
            await webRTC.handleOffer(sdp, caller);
        });

        socket.on('answer', async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
            console.log('Received answer');
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
        };
    }, [socket, webRTC]);

    return (
        <div className="call-screen">
            <div className="videos-container">
                <UserVideo stream={localStream} />
                <ParticipantVideo stream={remoteStream} />
            </div>
        </div>
    );
};

export default CallScreen;