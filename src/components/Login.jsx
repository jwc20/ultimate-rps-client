import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signin, loading, error } = useAuth();
    const [formError, setFormError] = React.useState("");

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");

        if (!username || !password) {
            setFormError("Please enter both username and password");
            return;
        }

        const result = await signin(username, password);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setFormError(result.error || "Login failed");
        }
    };
    return (
        <>
            {(error || formError) && (
                <div style={{ color: "red", marginBottom: "1rem" }}>
                    {error || formError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Username:{" "}
                        <input
                            name="username"
                            type="text"
                            required
                            disabled={loading}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Password:{" "}
                        <input
                            name="password"
                            type="password"
                            required
                            disabled={loading}
                        />
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "2rem" }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </>
    );
}

export { Login };
