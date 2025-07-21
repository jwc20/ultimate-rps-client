import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Login } from "../components/login";

function AuthStatus() {
  const { user, signout, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
        <>
            <p>not logged in</p>
            <Login />
        </>
    )
  }

  return (
    <p>
      Welcome {user.username}!{" "}
      <button onClick={handleSignout} disabled={loading}>
        {loading ? 'Signing out...' : 'Sign out'}
      </button>
    </p>
  );
}

export { AuthStatus };