import Footer from "../components/Footer";
import Header from "../components/Header";
//import supabase from "../client";

import Arrow from "../assets/blue_arrow.png";

import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    identidad: "",
    nombre: "",
    apellidos: "",
    rol: 1,
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  // Función para formatear la identidad con el patrón xxxx-xxxx-xxxxx
  const formatIdentity = (value: string) => {
    // Eliminar caracteres no numéricos
    value = value.replace(/\D/g, "");

    let formattedValue = "";

    if (value.length > 4) {
      formattedValue += value.substring(0, 4) + "-";
      if (value.length > 8) {
        formattedValue += value.substring(4, 8) + "-";
        formattedValue += value.substring(8, 13);
      } else {
        formattedValue += value.substring(4, 8);
      }
    } else {
      formattedValue = value;
    }

    return formattedValue;
  };

  function validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "identidad" ? formatIdentity(value) : value,
    }));

    if (name === "email") {
      setEmailError(validateEmail(value) ? "" : "Correo electrónico no válido");
    }

    console.log("FORMATEADO:", formData);
  }

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setFormData;
    console.log("La data enviada es: ", formData);
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      console.log("Usuario registrado exitosamente");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <p className="pb-3 text-2xl">Seleccione una opción</p>
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <div
            className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
            onClick={() => handleRoute("/login")}
          >
            <img src={Arrow} alt="" className="rotate-180" />
            <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
              Atrás
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
          {/**Aqui iba el formulario */}
          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col  w-3/3 pt-5 items-center"
            >
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Identidad:</label>
                <input
                  name="identidad"
                  type="text"
                  placeholder="0000-0000-00000"
                  value={formData.identidad}
                  maxLength={15}
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Nombres</label>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Primer y segundo nombre"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Apellidos</label>
                <input
                  name="apellidos"
                  type="text"
                  placeholder="Primer y segundo apellido"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Rol:</label>
                <select
                  name="rol"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                >
                  <option value="1">Empleado</option>
                  <option value="2">Guardia</option>
                </select>
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Correo Electrónico:</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
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
              <button
                className=" rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white mt-10 cursor-pointer"
                disabled={!!emailError}
              >
                Crear usuario
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

export default SignUp;
