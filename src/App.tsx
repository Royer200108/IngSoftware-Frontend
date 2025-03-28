import "./App.css";

import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

function App() {
  const navigate = useNavigate();

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

    if (!data.isAuthenticated) {
      navigate("/login"); // Redirigir si no hay sesión activa
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    verSesion();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
