import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Login } from "../components/Login";

function LoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate("/lobby", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div>
            <h2>Login</h2>
            <p>You must log in to view the page</p>
            <Login />
        </div>
    );
}

export { LoginPage };
