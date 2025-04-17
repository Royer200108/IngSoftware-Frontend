// App.tsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthVisitor from "./pages/AuthVisitor";
import AuthEmployeeEstudent from "./pages/AuthEmployeeEstudent";
import RegisterVisitor from "./pages/RegisterVisitor";
import IdentifyVisitor from "./pages/IdentifyVisitor";
import SignUp from "./pages/SignUp";
import ReportPage from "./pages/ReportPage";
import HomePage from "./pages/HomePage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
//import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // 👈

function App() {
  const { user, role, isLoading } = useAuth(); // 👈
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (user && role !== null && location.pathname === "/login") {
      if (role === 1) navigate("/reports");
      else if (role === 2) navigate("/");
    }
  }, [user, role, isLoading, location.pathname, navigate]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />

        {/* Rutas públicas */}
        <Route path="/authvisitor" element={<AuthVisitor />} />
        <Route path="/registervisitor" element={<RegisterVisitor />} />

        {/* Ruta solo para usuarios normales (rol 2) */}

        <Route
          path="/"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <HomePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/authclient"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <AuthEmployeeEstudent />
            </RoleProtectedRoute>
          }
        />
        {
          <Route
            path="/identifyvisitor/:motivo_visita"
            element={
              <RoleProtectedRoute allowedRoles={[2]}>
                <IdentifyVisitor />
              </RoleProtectedRoute>
            }
          />
        }

        {/* Ruta solo para administradores (rol 1) */}
        <Route
          path="/reports"
          element={
            <RoleProtectedRoute allowedRoles={[1]}>
              <ReportPage />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
