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
        <div className="container" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <form onSubmit={handleSubmit} className="card" style={{width: '400px', margin: '0 auto'}}>
                <h1 className="mb-3">🎮 Enter Game</h1>
                <p className="mb-3">
                    Choose your player name to start playing!
                </p>

                {error && (
                    <div className="mb-3" style={{color: 'var(--form-element-invalid-border-color)'}}>
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Player Name"
                    maxLength={20}
                    className="mb-3"
                />
                <button
                    type="submit"
                    disabled={loading || !playerName.trim()}
                    className="contrast"
                >
                    {loading ? "Entering..." : "Enter Lobby"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
