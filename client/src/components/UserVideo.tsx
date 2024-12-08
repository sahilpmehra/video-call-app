import { useEffect, useRef } from 'react';

interface UserVideoProps {
    stream: MediaStream | null;
}

const UserVideo = ({ stream }: UserVideoProps) => {
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
                muted
                playsInline
                className="user-video"
            />
        </div>
    );
};

export default UserVideo;