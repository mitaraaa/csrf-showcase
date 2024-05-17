import { Navigate, Outlet } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
