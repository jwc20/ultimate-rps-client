import {useAuth} from "../../hooks/useAuth.js";
import {apiClient} from "../../api/apiClient.js";
import {useState, useEffect} from "react";

function UserChangePassword({ userId }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmitPassword = async (event) => {
        event.preventDefault();
        const data = {
            current_password: currentPassword,
            new_password: newPassword,
        }
        try {
            const response = await apiClient.put(`/users/${userId}/change-password`, data);
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
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>New Password:</td>
                            <td>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
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