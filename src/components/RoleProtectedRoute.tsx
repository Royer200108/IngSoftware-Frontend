import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RoleProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles: number[]; // Ej: [1] para admin, [2] para user
};

function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { role, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  if (!allowedRoles.includes(role!)) {
    // Redirigir según el rol actual
    if (role === 1) return <Navigate to="/reports" />;
    if (role === 2) return <Navigate to="/" />;
    //if (role !== 1 && role !== 2) return <Navigate to="/login" />;
    return <Navigate to="/login" />;
  }

  return children;
}

export default RoleProtectedRoute;
