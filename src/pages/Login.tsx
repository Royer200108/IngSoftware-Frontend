import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importar el contexto

import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("URL de la API:", API_BASE_URL);

function Login() {
  const navigate = useNavigate();
  const { setUser, setRole, user, role } = useAuth(); // Usamos el contexto
  const [formData, setFormData] = useState<{
    correo: string;
    password: string;
  }>({
    correo: "",
    password: "",
  });

  // Actualiza en tiempo real todo lo que se escribe dentro de los inputs del formulario
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  // Función para realizar el login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const text = await response.text();  // Leemos la respuesta como texto
      console.log('Respuesta:', text);  // Puedes ver lo que llega del backend
  
      if (!response.ok) {
        console.error("Respuesta fallida del login:", text);
        throw new Error(text || "Error al iniciar sesión");
      }
  
      let result;
      try {
        result = JSON.parse(text);  // Intentamos convertir el texto a JSON
      } catch (error) {
        throw new Error("No se pudo parsear la respuesta del servidor.");
      }
  
      // Actualizar el contexto con los datos del usuario
      setUser(result.user);
  
      // Obtener el rol del usuario
      const rolResponse = await fetch(`${API_BASE_URL}/auth/rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid_guardia: result.user.id }),
      });
  
      const rolData = await rolResponse.json();
      const rolId = rolData[0]?.id_rol;
      setRole(rolId); // Guardamos el rol en el contexto
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }
  

  // Redirección si ya hay sesión activa
  useEffect(() => {
    if (user && role !== null) {
      if (role === 1) navigate("/reports"); // Si es admin
      else if (role === 2) navigate("/"); // Si es otro rol
    }
  }, [user, role, navigate]);

  // Evitar mostrar el formulario si el usuario ya está autenticado
  if (user && role !== null) {
    return <div>Redireccionando...</div>; // O un spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <p className="text-3xl pt-5">Ingresa tu correo y contraseña</p>
        </div>

        <div className="flex flex-col items-center pt-5">
          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            <form
              className="flex flex-col  w-3/3 pt-5 items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Correo Electrónico:</label>
                <input
                  name="correo"
                  type="email"
                  placeholder="Email"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Contraseña:</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
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
              <button className=" rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white mt-10 cursor-pointer">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
