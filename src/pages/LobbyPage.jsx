import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api';
import PlayerInfo from '../components/common/PlayerInfo';
import CreateRoomForm from '../components/forms/CreateRoomForm';
import RoomCard from '../components/room/RoomCard';

const LobbyPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const loadRooms = useCallback(async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Error loading rooms:", error);
        }
    }, []);

    useEffect(() => {
        loadRooms();
        const interval = setInterval(loadRooms, 5000);
        return () => clearInterval(interval);
    }, [loadRooms]);

    const handleCreateRoom = async ({ roomName, maxPlayers, numAction }) => {
        setLoading(true);
        try {
            const data = await api.createRoom(roomName, maxPlayers, numAction, user.id);
            if (data.success) {
                navigate(`/room/${data.room_id}`);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const data = await api.joinRoom(roomId, user.id);
            if (data.success) {
                navigate(`/room/${roomId}`);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Failed to join room");
        }
    };

    return (
        <main className="container">
            <header>
                <h1>🎮 Game Lobby</h1>
            </header>

            <PlayerInfo user={user} />

            <CreateRoomForm onCreateRoom={handleCreateRoom} loading={loading} />

            <section>
                <header>
                    <nav>
                        <ul>
                            <li><h2>Available Rooms</h2></li>
                        </ul>
                        <ul>
                            <li>
                                <button
                                    onClick={loadRooms}
                                    className="secondary"
                                >
                                    Refresh
                                </button>
                            </li>
                        </ul>
                    </nav>
                </header>

                {rooms.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem 0' }}>
                        No rooms available. Create one to get started!
                    </p>
                ) : (
                    <div className="grid">
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                onJoin={handleJoinRoom}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default LobbyPage;