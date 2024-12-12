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
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                You
            </div>
        </div>
    );
};

export default UserVideo;