import CreatorControls from './CreatorControls';
import ParticipantControls from './ParticipantControls';

interface CallControlsProps {
    isCreator: boolean;
    onShareLink: () => void;
    onEndCall: () => void;
    onLeaveCall: () => void;
    showCopiedMessage: boolean;
}

const CallControls = ({
    isCreator,
    onShareLink,
    onEndCall,
    onLeaveCall,
    showCopiedMessage
}: CallControlsProps) => (
    <div className="relative bottom-0 left-0 right-0 p-4 flex justify-center items-center space-x-4 bg-gradient-to-t to-transparent">
        {isCreator ? (
            <CreatorControls
                onShareLink={onShareLink}
                onEndCall={onEndCall}
                showCopiedMessage={showCopiedMessage}
            />
        ) : (
            <ParticipantControls onLeaveCall={onLeaveCall} />
        )}
    </div>
);

export default CallControls; 