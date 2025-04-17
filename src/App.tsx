// App.tsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthVisitor from "./pages/identifyVisitors/AuthVisitor";
import AuthEmployeeStudent from "./pages/AuthEmployeeStudent";
import RegisterVisitor from "./pages/identifyVisitors/RegisterVisitor";
import IdentifyVisitor from "./pages/identifyVisitors/IdentifyVisitor";
import AuthStudent from "./pages/identifyStudents/AuthStudent";
import IdentifyStudent from "./pages/identifyStudents/IdentifyStudent";
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
          path="/authemployeestudent"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <AuthEmployeeStudent />
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
        <Route
          path="/authvisitor"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <AuthVisitor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/registervisitor"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <RegisterVisitor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/authstudent"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <AuthStudent />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/identifystudent/:motivo_visita"
          element={
            <RoleProtectedRoute allowedRoles={[2]}>
              <IdentifyStudent />
            </RoleProtectedRoute>
          }
        />

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
