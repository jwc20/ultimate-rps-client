import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
    const navigate = useNavigate();
    const { register, loading, error, user } = useAuth();
    const [formError, setFormError] = React.useState("");

    React.useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (!username || !password || !confirmPassword) {
            setFormError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setFormError("Password must be at least 6 characters long");
            return;
        }

        const result = await register(username, password);

        if (result.success) {
            navigate("/", { replace: true });
        } else {
            setFormError(result.error || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>

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

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Confirm Password:{" "}
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            disabled={loading}
                        />
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "2rem" }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export { RegisterPage };
