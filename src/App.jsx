import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth } from "./auth/RequireAuth";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
// import { HomePage } from "./pages/HomePage";
import { LobbyPage } from "./pages/LobbyPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RoomPage } from "./pages/RoomPage";

import "./App.css";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <LobbyPage />
                            </RequireAuth>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/lobby"
                        element={
                            <RequireAuth>
                                <LobbyPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/room/:roomId"
                        element={
                            <RequireAuth>
                                <RoomPage />
                            </RequireAuth>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
