import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const { setUser, setRole, user, role } = useAuth();
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [correoError, setcorreoError] = useState("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "correo") {
      setcorreoError(
        validatecorreo(value) ? "" : "Correo electrónico no válido"
      );
    }
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setError(null);
    // Vaciar los campos del formulario
    setFormData({
      correo: "",
      password: "",
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); // Resetear el error al intentar nuevamente

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      if (!response.ok) {
        const errorMessage =
          text || "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
        setError(errorMessage);
        setShowModal(true);
        return;
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        throw new Error("Respuesta del servidor no válida");
      }

      setUser(result.user);

      const rolResponse = await fetch(`${API_BASE_URL}/auth/rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid_guardia: result.user.id }),
      });

      const rolData = await rolResponse.json();
      const rolId = rolData[0]?.id_rol;
      setRole(rolId);
    } catch (error) {
      console.error("Error de autenticación:", error);
      setError("Ocurrió un error inesperado. Por favor, inténtalo más tarde.");
      setShowModal(true);
    }
  }

  useEffect(() => {
    if (user && role !== null) {
      if (role === 1) navigate("/reports");
      else if (role === 2) navigate("/");
    }
  }, [user, role, navigate]);

  if (user && role !== null) {
    return <div>Redireccionando...</div>;
  }

  // Función para formatear el correo con el patron correo@xyz.xyz
  function validatecorreo(correo: string) {
    const correoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return correoPattern.test(correo);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        {/* Modal de Error */}

        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <p className="text-3xl pt-5">Ingresa tu correo y contraseña</p>
        </div>

        <div className="flex flex-col items-center pt-5">
          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            <form
              className="flex flex-col w-3/3 pt-5 items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Correo Electrónico:</label>
                <input
                  value={formData.correo}
                  name="correo"
                  type="email"
                  placeholder="Email"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                  required
                />
              </div>
              {correoError && (
                <p className="text-red-500 text-sm">{correoError}</p>
              )}
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Contraseña:</label>
                <input
                  value={formData.password}
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end p-2 w-6/6">
                <p
                  className="hover:text-blue-700 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  ¿No tienes un usuario?
                </p>
              </div>
              <button
                type="submit"
                className={
                  formData.correo && formData.password && !correoError
                    ? `rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white cursor-pointer`
                    : `rounded-sm bg-gray-400 p-1 pl-5 pr-5  text-white `
                }
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white rounded-sm shadow-lg p-6 opacity-100 text-center">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Error al iniciar sesión
            </h3>
            <p className="mb-4">{error}</p>

            <button
              onClick={closeModal}
              className="mt-4 bg-[#003B74] text-white px-4 py-2 rounded-sm hover:bg-[#003274] cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
