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
        <div className="relative aspect-w-9 aspect-h-16 md:aspect-video bg-gray-800 rounded-lg overflow-hidden m-2">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                Participant
            </div>
        </div>
    );
};

export default ParticipantVideo;