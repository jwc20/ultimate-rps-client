import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const LoginPage = () => {
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/lobby');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) {
            setError("Please enter a player name");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await api.login(playerName);
            login(data.player_id, data.player_name);
            navigate('/lobby');
        } catch (error) {
            console.error("Login error:", error);
            setError("Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl font-bold text-center mb-6">🎮 Enter Game</h1>
                <p className="text-gray-600 text-center mb-6">
                    Choose your player name to start playing!
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Player Name"
                    maxLength={20}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    type="submit"
                    disabled={loading || !playerName.trim()}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                    {loading ? "Entering..." : "Enter Lobby"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
