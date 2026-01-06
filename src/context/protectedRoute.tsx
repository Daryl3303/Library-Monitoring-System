import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // 🚫 Not logged in
  if (!authType) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/signIn" replace />;
    }
    return <Navigate to="/signIn" replace />;
  }

  // 🚫 User trying to access admin
  if (location.pathname.startsWith("/admin") && authType !== "admin") {
    return <Navigate to="/user" replace />;
  }

  // 🚫 Admin trying to access user
  if (location.pathname.startsWith("/user") && authType !== "user") {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
