import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RoleProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles: number[]; // [1] para admin, [2] para user
};

function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { role, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  // Si no hay rol (no autenticado), redirige a login
  if (role === null) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige según corresponda
  if (!allowedRoles.includes(role)) {
    return role === 1 ? (
      <Navigate to="/homepageadmin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
}
export default RoleProtectedRoute;
