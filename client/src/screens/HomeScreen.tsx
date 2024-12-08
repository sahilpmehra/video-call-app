import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            navigate(`/call/${roomId}`);
        }
    };

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 7);
        navigate(`/call/${newRoomId}`);
    };

    return (
        <div className="home-screen">
            <h1>Video Chat App</h1>
            <form onSubmit={handleJoinRoom}>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button type="submit">Join Room</button>
            </form>
            <button onClick={handleCreateRoom}>Create New Room</button>
        </div>
    );
};

export default HomeScreen;