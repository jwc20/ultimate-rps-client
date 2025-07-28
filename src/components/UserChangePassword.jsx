import {useAuth} from "../hooks/useAuth";
import {apiClient} from "../api/apiClient";
import {useState, useEffect} from "react";

function UserChangePassword({ userId }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmitPassword = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await apiClient.put(`/users/${userId}/change-password`, {password});
            // Update the user object with the new password
            console.log(response);
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div>
            <div>
                <h2>Edit Password:</h2>
                <form onSubmit={handleSubmitPassword}>
                    <table>
                        <tbody>
                        <tr>
                            <td>Current Password:</td>
                            <td>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>New Password:</td>
                            <td>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Confirm New Password:</td>
                            <td>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit">Change</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </form>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
}

export {UserChangePassword}