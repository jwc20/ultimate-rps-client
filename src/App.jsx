import React, { useState, useEffect, useRef, useCallback } from "react";
import Lobby from "./pages/LobbyPage";
import Room from "./pages/RoomPage";
import Login from "./pages/LoginPage";


// Main App Component
export default function App() {
    const [screen, setScreen] = useState("login");
    const [playerId, setPlayerId] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(null);

    useEffect(() => {
        const savedId = localStorage.getItem("playerId");
        const savedName = localStorage.getItem("playerName");
        if (savedId && savedName) {
            setPlayerId(savedId);
            setPlayerName(savedName);
            setScreen("lobby");
        }
    }, []);

    const handleLogin = (id, name) => {
        setPlayerId(id);
        setPlayerName(name);
        localStorage.setItem("playerId", id);
        localStorage.setItem("playerName", name);
        setScreen("lobby");
    };

    const handleJoinRoom = (roomId) => {
        setCurrentRoomId(roomId);
        setScreen("room");
    };

    const handleLeaveRoom = () => {
        setCurrentRoomId(null);
        setScreen("lobby");
    };

    const handleLogout = () => {
        setPlayerId(null);
        setPlayerName(null);
        localStorage.removeItem("playerId");
        localStorage.removeItem("playerName");
        setScreen("login");
    };

    return (
        <div>
            {screen === "login" && <Login onLogin={handleLogin} />}
            {screen === "lobby" && (
                <>
                    <Lobby
                        playerId={playerId}
                        playerName={playerName}
                        onJoinRoom={handleJoinRoom}
                    />
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
            {screen === "room" && (
                <Room
                    roomId={currentRoomId}
                    playerId={playerId}
                    playerName={playerName}
                    onLeaveRoom={handleLeaveRoom}
                />
            )}
        </div>
    );
}
