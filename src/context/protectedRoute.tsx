import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId } = useAuth();

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;