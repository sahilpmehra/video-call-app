interface CreatorControlsProps {
    onShareLink: () => void;
    onEndCall: () => void;
    showCopiedMessage: boolean;
}

const CreatorControls = ({ onShareLink, onEndCall, showCopiedMessage }: CreatorControlsProps) => (
    <div className="relative space-x-4">
        <button
            onClick={onShareLink}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
        >
            Share Link
        </button>
        {showCopiedMessage && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm">
                Link copied!
            </div>
        )}

        <button
            onClick={onEndCall}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
        >
            End Call
        </button>
    </div>
);

export default CreatorControls; 