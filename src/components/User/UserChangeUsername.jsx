import {useAuth} from "../../hooks/useAuth";
import {apiClient} from "../../api/apiClient";
import {useState, useEffect} from "react";


function UserChangeUsername({userId}) {
    const [error, setError] = useState(null);
    const [newUsername, setNewUsername] = useState('');



    const handleSubmitUsername = async (event) => {
        event.preventDefault();
        try {
            const data = {
                username: newUsername
            };
            const response = await apiClient.put(`/users/${userId}/change-username`, data);
            console.log(response);
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <>
            <div>
                <h2>Edit Username:</h2>
                <form onSubmit={handleSubmitUsername}>
                    <table>
                        <tbody>
                        <tr>
                            <td>New Username:</td>
                            <td>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit">Update Username</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </form>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
        </>
    )
}

export {UserChangeUsername}