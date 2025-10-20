import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "src/components/context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return <div>Cargando sesión...</div>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
