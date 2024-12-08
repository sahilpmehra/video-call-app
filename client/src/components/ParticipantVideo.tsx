import { useEffect, useRef } from 'react';

interface ParticipantVideoProps {
    stream: MediaStream | null;
}

const ParticipantVideo = ({ stream }: ParticipantVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="participant-video"
            />
        </div>
    );
};

export default ParticipantVideo;