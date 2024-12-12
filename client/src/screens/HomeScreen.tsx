import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            navigate(`/call/${roomId}`, { state: { isCreator: false } });
        }
    };

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 7);
        navigate(`/call/${newRoomId}`, { state: { isCreator: true } });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center my-32 text-gray-800">Sahil's Video Chat App</h1>
                <form onSubmit={handleJoinRoom} className="space-y-4 mb-8">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Join Room
                    </button>
                </form>
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-center text-gray-800 mb-8">Or</h1>
                    <button
                        onClick={handleCreateRoom}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Create New Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;