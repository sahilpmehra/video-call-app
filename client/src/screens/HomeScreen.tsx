import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WelcomeHeader from '../components/home/WelcomeHeader';
import RoomIdInput from '../components/home/RoomIdInput';
import FeatureHighlights from '../components/home/FeatureHighlights';

const HomeScreen = () => {
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const roomIdFromUrl = urlParams.get('room');
        if (roomIdFromUrl) {
            navigate(`/call/${roomIdFromUrl}`, { state: { isCreator: false } });
        }
    }, [location, navigate]);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            setIsLoading(true);
            try {
                await navigate(`/call/${roomId}`, { state: { isCreator: false } });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 7);
        navigate(`/call/${newRoomId}`, { state: { isCreator: true } });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <WelcomeHeader
                    title="Sahil's Video Chat App"
                    description="Connect with anyone, anywhere through secure video calls"
                />
                <FeatureHighlights />
                <RoomIdInput
                    roomId={roomId}
                    setRoomId={setRoomId}
                    isLoading={isLoading}
                    onSubmit={handleJoinRoom}
                />
                <div className="relative my-8 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    onClick={handleCreateRoom}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Create New Room
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;