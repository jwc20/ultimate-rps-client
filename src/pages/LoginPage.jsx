import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Login } from "../components/login";

function LoginPage() {
    return (
        <div>
            <h2>Login</h2>
            <p>You must log in to view the page</p>
            <Login />
        </div>
    );
}

export { LoginPage };
