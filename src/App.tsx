import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthVisitor from "./pages/AuthVisitor";
import AuthEmployeeEstudent from "./pages/AuthEmployeeEstudent";
import RegisterVisitor from "./pages/RegisterVisitor";
import IdentifyVisitor from "./pages/IdentifyVisitor";
import SignUp from "./pages/SignUp";
import ReportPage from "./pages/ReportPage";
import HomePage from "./pages/HomePage";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión activa
  useEffect(() => {
    async function verificarSesion() {
      try {
        const response = await fetch(
          "http://localhost:3000/auth/verificarLogin",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.error("Error al verificar sesión");
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!data.isAuthenticated) {
          navigate("/login");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error en la verificación de sesión:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }

    verificarSesion();
  }, [navigate]);

  // Verificar el rol del usuario cuando ya tenemos su ID
  useEffect(() => {
    if (!user) return;

    async function verificarRol() {
      try {
        const rolResponse = await fetch("http://localhost:3000/auth/rol", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid_guardia: user?.id }),
        });

        if (!rolResponse.ok) {
          console.error("Error al obtener el rol del usuario");
          return;
        }

        const role = await rolResponse.json();
        console.log("Rol del usuario:", role[0]?.id_rol);

        if (role[0]?.id_rol === 1) {
          navigate("/reports");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error al obtener el rol:", error);
      }
    }

    verificarRol();
  }, [user, navigate]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/authvisitor" element={<AuthVisitor />} />
      <Route path="/authclient" element={<AuthEmployeeEstudent />} />
      <Route path="/registervisitor" element={<RegisterVisitor />} />
      <Route
        path="/identifyvisitor/:motivo_visita"
        element={<IdentifyVisitor userState={user!} />}
      />
      <Route path="/reports" element={<ReportPage />} />
    </Routes>
  );
}

export default App;
