import * as React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "../pages/LoginPage";

function AuthStatus() {
    const { user, signout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignout = async () => {
        await signout();
        navigate("/");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        if (
            location.pathname === "/login" ||
            location.pathname === "/register"
        ) {
            return <></>;
        }
        return <></>;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "30px",
                zIndex: 1000,
                // background: "rgba(36,36,36,0.95)",
                borderRadius: "6px",
                padding: "8px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                minWidth: "120px",
            }}
        >
            <span style={{ fontWeight: "bold" }}>{user.username}</span>
            <button
                onClick={handleSignout}
                disabled={loading}
                style={{
                    marginLeft: "12px",
                }}
            >
                {loading ? "Signing out..." : "Sign out"}
            </button>
        </div>
    );
  }

export { AuthStatus };