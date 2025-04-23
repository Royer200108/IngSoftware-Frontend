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
import AuthEmployee from "./pages/identifyEmployee/AuthEmployee";
import IdentifyStudent from "./pages/identifyStudents/IdentifyStudent";
import IdentifyEmployee from "./pages/identifyEmployee/IdentifyEmployee";
import IdentifyByAccount from "./pages/identifyStudents/IdentifyByAccount";
import IdentifyByEmployeeNumber from "./pages/identifyEmployee/IdentifyByEmployeeNumber";
import SignUp from "./pages/SignUp";
import ReportPage from "./pages/ReportPage";
import HomePage from "./pages/HomePage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
//import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePageAdmin from "./pages/HomePageAdmin";


function App() {
  return (
    <AuthProvider>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}

export default App;

function AppRouter() {
  //Variables para verificar la autenticacion
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Funcion para verificar si el usuario tiene un rol permitido (Se ejecuta al entrar a esta pantalla)
  // Si el usuario está autenticado y tiene un rol, redirige a la página correspondiente
  useEffect(() => {
    if (isLoading) return;

    // Solo redirige si estamos en login y el usuario está autenticado
    if (user && role !== null && location.pathname === "/login") {
      navigate(role === 1 ? "/homepageadmin" : "/", { replace: true });
    }

    // Si no hay usuario y no estamos en login, redirige a login
    if (!user && role === null && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [user, role, isLoading, location.pathname, navigate]);

  // Si la autenticacion esta cargando, muestra un mensaje de carga
  if (isLoading) return <div>Cargando...</div>;

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />

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

      <Route
        path="/identifyvisitor/:motivo_visita"
        element={
          <RoleProtectedRoute allowedRoles={[2]}>
            <IdentifyVisitor />
          </RoleProtectedRoute>
        }
      />

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
      <Route
        path="/authemployee"
        element={
          <RoleProtectedRoute allowedRoles={[2]}>
            <AuthEmployee />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/identifyemployee/:motivo_visita"
        element={
          <RoleProtectedRoute allowedRoles={[2]}>
            <IdentifyEmployee />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/IdentifyByEmployeeNumber/:motivo_visita"
        element={
          <RoleProtectedRoute allowedRoles={[2]}>
            <IdentifyByEmployeeNumber />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/identifybyaccount/:motivo_visita"
        element={
          <RoleProtectedRoute allowedRoles={[2]}>
            <IdentifyByAccount />
          </RoleProtectedRoute>
        }
      />
      {/* Ruta solo para administradores (rol 1) */}
      <Route
        path="/homepageadmin"
        element={
          <RoleProtectedRoute allowedRoles={[1]}>
            <HomePageAdmin />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <RoleProtectedRoute allowedRoles={[1]}>
            <ReportPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <RoleProtectedRoute allowedRoles={[1]}>
            <SignUp />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}
