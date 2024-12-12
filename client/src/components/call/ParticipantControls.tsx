interface ParticipantControlsProps {
    onLeaveCall: () => void;
}

const ParticipantControls = ({ onLeaveCall }: ParticipantControlsProps) => (
    <button
        onClick={onLeaveCall}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
    >
        Leave Call
    </button>
);

export default ParticipantControls; 