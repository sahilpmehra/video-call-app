import ParticipantVideo from "../ParticipantVideo";
import UserVideo from "../UserVideo";

interface VideoGridProps {
    remoteStream: MediaStream | null;
    localStream: MediaStream | null;
}

const VideoGrid = ({ remoteStream, localStream }: VideoGridProps) => (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        {remoteStream && <ParticipantVideo stream={remoteStream} />}
        {localStream && <UserVideo stream={localStream} />}
    </div>
);

export default VideoGrid; 