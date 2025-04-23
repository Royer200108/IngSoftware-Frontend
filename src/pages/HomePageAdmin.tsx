import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import Arrow from "../assets/blue_arrow.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function HomePageAdmin() {
  const navigate = useNavigate();
  const { user, setUser, setRole } = useAuth();
  const [guardia, setGuardia] = useState<{
    nombres: string;
    correo: string;
    nombre_rol: string;
  } | null>(null);
  const pages: string[] = ["/signup", "/reports"];

  async function cerrarSesion() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    await response.json();
  }

  // Manejar el logout y redirigir después de cerrar sesión
  async function handleLogout() {
    try {
      await cerrarSesion();
      setUser(null);
      setRole(null);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 0);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  async function obtenerDatosGuardia() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/guardia`, {
        //const response = await fetch(`http://localhost:3000/auth/guardia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid_guardia: user?.id }),
      });

      if (!response.ok) {
        // Imprime el texto plano de la respuesta para ayudarte a depurar
        const errorText = await response.text();
        console.error("Error del servidor:", response.status, errorText);
        return;
      }

      const guadia = await response.json();
      setGuardia(guadia[0]);
    } catch (err) {
      console.error("Error autenticando:", err);
    }
  }

  useEffect(() => {
    obtenerDatosGuardia();
  }, []); // ← solo se ejecuta una vez cuando se monta el componente

  // Navegar a otras páginas
  function handleChange(index: number) {
    navigate(pages[index]);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Página principal</p>
          {/* Muestra el email del usuario */}
          {user && (
            <div className="text-left mb-4">
              <p className="text-sm text-gray-700">
                Bienvenid@, {guardia?.nombre_rol.toLowerCase()}{" "}
                {guardia?.nombres}
                <br />
                Tu correo electronico es: {guardia?.correo}
              </p>
              {/* Muestra el email del usuario */}
            </div>
          )}
          <div className="rounded-sm h-1 bg-gray-400"></div>

          <div className="flex flex-col items-center pt-5">
            <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
              <div className="flex flex-col gap-y-7 pl-5">
                <div
                  className="flex flex-row items-center gap-x-10 cursor-pointer"
                  onClick={() => handleChange(0)}
                >
                  <img src={Arrow} alt="" />
                  <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                    Crear un nuevo usuario del sistema
                  </div>
                </div>
                <div
                  className="flex flex-row items-center gap-x-10 cursor-pointer"
                  onClick={() => handleChange(1)}
                >
                  <img src={Arrow} alt="" />
                  <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                    Ver reportes
                  </div>
                </div>
              </div>

              <div
                className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer"
                onClick={handleLogout}
              >
                <img src={Arrow} alt="" className="rotate-180" />
                <div className="w-70 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Cerrar sesión
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePageAdmin;
