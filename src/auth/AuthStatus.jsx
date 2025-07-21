import * as React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
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
    if (location.pathname === "/login" || location.pathname === "/register") {
      return <p>not logged in</p>;
    }
    return (
        <>
            <p>not logged in</p>
            <Link to="/login">
              <button>Login</button>
            </Link>
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