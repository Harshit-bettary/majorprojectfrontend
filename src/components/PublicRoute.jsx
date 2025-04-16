import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/user/dashboard" replace /> : children;
};

export default PublicRoute;
