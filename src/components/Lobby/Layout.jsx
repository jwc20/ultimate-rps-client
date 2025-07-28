import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../../auth/AuthStatus.jsx";

function Layout() {
  return (
    <div className="center">
      <AuthStatus />
      <Outlet />
    </div>
  );
}

export { Layout };