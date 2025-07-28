import {useAuth} from "../hooks/useAuth";
import {apiClient} from "../api/apiClient";
import {useState, useEffect} from "react";
import {UserChangePassword} from "../components/UserChangePassword.jsx";
import {UserChangeUsername} from "../components/User/UserChangeUsername.jsx";

function UserPage() {
    const {user} = useAuth();
    const [userId, setUserId] = useState(user.id);

    useEffect(() => {
        if (user) {
            setUserId(user.id);
        }
    }, [user]);

    return (
        <>
            <UserChangeUsername userId={userId}/>
            <UserChangePassword userId={userId}/>
        </>
    );
}

export {UserPage};
