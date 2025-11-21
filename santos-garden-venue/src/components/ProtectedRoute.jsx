import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuth();

  // No está logueado → manda al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si es solo admins → validar rol
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/events" replace />;
  }

  return children;
}


