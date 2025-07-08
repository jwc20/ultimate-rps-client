import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for saved user data
        const savedId = localStorage.getItem("playerId");
        const savedName = localStorage.getItem("playerName");
        if (savedId && savedName) {
            setUser({ id: savedId, name: savedName });
        }
        setLoading(false);
    }, []);

    const login = (id, name) => {
        const userData = { id, name };
        setUser(userData);
        localStorage.setItem("playerId", id);
        localStorage.setItem("playerName", name);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("playerId");
        localStorage.removeItem("playerName");
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
