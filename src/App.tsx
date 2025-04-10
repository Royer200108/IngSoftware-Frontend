import "./App.css";

import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthVisitor from "./pages/AuthVisitor";
import AuthEmployeeEstudent from "./pages/AuthEmployeeEstudent";
import RegisterVisitor from "./pages/RegisterVisitor";
import IdentifyVisitor from "./pages/IdentifyVisitor";
import SignUp from "./pages/SignUp";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  async function verSesion() {
    const response = await fetch("http://localhost:3000/auth/verificarLogin", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error al verificar sesión");
      return;
    }

    const data = await response.json();
    console.log("Estado de autenticación:", data);
    setUser(data.user);
    if (!data.isAuthenticated) {
      navigate("/login"); // Redirigir si no hay sesión activa
    }
  }

  useEffect(() => {
    verSesion();
    console.log("El valor del usuario es: ", user);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/authvisitor" element={<AuthVisitor />} />
        <Route path="/authclient" element={<AuthEmployeeEstudent />} />
        <Route path="/registervisitor" element={<RegisterVisitor />} />
        <Route path="/identifyvisitor" element={<IdentifyVisitor />} />
      </Routes>
    </>
  );
}

export default App;
