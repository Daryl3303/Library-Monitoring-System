import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!userId) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
