// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';
import Layout from './components/layout/Layout';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/lobby" element={<LobbyPage />} />
                            <Route path="/room/:roomId" element={<RoomPage />} />
                        </Route>
                    </Route>
                    <Route path="/" element={<Navigate to="/lobby" replace />} />
                    <Route path="*" element={<Navigate to="/lobby" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
