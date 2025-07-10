import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const AuthContext = createContext(null);

// Generate player data using backend auto-login
const generatePlayerData = async () => {
    try {
        const response = await api.autoLogin();
        return {
            id: response.player_id,
            name: response.player_name
        };
    } catch (error) {
        console.error("Failed to generate player data:", error);
        throw error;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                // First, try to load from localStorage
                const storedUser = localStorage.getItem('playerData');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);

                    // TODO check userData
                    
                    setUser(userData);
                    setLoading(false);
                    return;
                }

                // If no stored data, generate new user data using backend
                const playerData = await generatePlayerData();
                setUser(playerData);
                
                // Store in localStorage
                localStorage.setItem('playerData', JSON.stringify(playerData));
            } catch (error) {
                console.error("Error initializing user:", error);
                
                // If backend fails, check localStorage as fallback
                const storedUser = localStorage.getItem('playerData');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                }
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const login = (id, name) => {
        const userData = { id, name };
        setUser(userData);
        
        // Store in localStorage
        localStorage.setItem('playerData', JSON.stringify(userData));
    };

    const logout = async () => {
        // Clear localStorage
        localStorage.removeItem('playerData');
        setUser(null);

        // Generate new user instead of navigating to login
        try {
            const playerData = await generatePlayerData();
            setUser(playerData);
            
            // Store new user in localStorage
            localStorage.setItem('playerData', JSON.stringify(playerData));
        } catch (error) {
            console.error("Failed to generate new user on logout:", error);
            // Fallback to login page if we can't generate a new user
            navigate('/login');
        }
    };

    // Regenerate player data
    const regeneratePlayerName = async () => {
        try {
            const playerData = await generatePlayerData();
            setUser(playerData);
            
            // Update localStorage
            localStorage.setItem('playerData', JSON.stringify(playerData));
            
            return playerData.name;
        } catch (error) {
            console.error("Failed to regenerate player name:", error);
            // Fallback to local generation
            const newName = generatePlayerName();
            const updatedUser = { ...user, name: newName };
            setUser(updatedUser);
            
            // Update localStorage
            localStorage.setItem('playerData', JSON.stringify(updatedUser));
            
            return newName;
        }
    };

    // Clear stored data (useful for debugging or reset functionality)
    const clearStoredData = () => {
        localStorage.removeItem('playerData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            regeneratePlayerName,
            clearStoredData
        }}>
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