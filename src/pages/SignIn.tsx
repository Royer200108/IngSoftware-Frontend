import Footer from "../components/Footer";
import Header from "../components/Header";
//import supabase from "../client";

import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({
    identidad: "",
    nombre: "",
    apellidos: "",
    rol: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/register/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      console.log("Usuario registrado exitosamente");
      navigate("/homepage", { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className="h-100 flex flex-col items-center sm:max-lg:mb-5">
          <p className="text-3xl pt-5">Ingresa tus datos de registro</p>
          <form
            className="w-4/5 h-40 pt-10 flex flex-col items-center gap-y-3"
            onSubmit={handleSubmit}
          >
            {/* Campo Identidad con formateo automático */}
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Identidad:</label>
              <input
                name="identidad"
                type="text"
                placeholder="0000-0000-00000"
                value={formData.identidad} // Se mantiene sincronizado con el estado
                maxLength={15} // 13 números + 2 guiones
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Nombres</label>
              <input
                name="nombre"
                type="text"
                placeholder="Primer y segundo nombre"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Apellidos</label>
              <input
                name="apellidos"
                type="text"
                placeholder="Primer y segundo apellido"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 ">
              <label className="w-1/3">Rol:</label>
              <select
                name="rol"
                className="bg-gray-200 rounded-sm border-gray-300 border-2 w-56"
                onChange={handleChange}
              >
                <option value="1">Empleado</option>
                <option value="2">Guardia</option>
              </select>
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Correo Electrónico:</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 ">
              <label className="w-1/3">Contraseña:</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <button
              className="rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white"
              disabled={!!emailError}
            >
              Crear usuario
            </button>
          </form>
        </div>
        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />
    </div>
  );
}

export default SignIn;
