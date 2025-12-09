import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    // Not logged in - redirect to appropriate sign-in page
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/signIn" replace />;
    }
    return <Navigate to="/signIn" replace />;
  }

  // Check if trying to access admin routes
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    // Regular user trying to access admin area - redirect to user area
    return <Navigate to="/user" replace />;
  }

  // Check if admin trying to access user routes
  if (location.pathname.startsWith('/user') && isAdmin) {
    // Admin trying to access user area - redirect to admin area
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;