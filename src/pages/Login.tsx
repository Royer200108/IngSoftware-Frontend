import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

function Login() {
  const navigate = useNavigate();
  //Almacena los valores escritos en los inputs del formulario
  const [formData, setFormData] = useState<{
    correo: string;
    password: string;
  }>({
    correo: "",
    password: "",
  });

  //Actualiza en tiempo real todo lo que se escribe dentro de la consola
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    console.log("FORMATEADO: ", formData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Adios");

    try {
      console.log("Hola");
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("El resultado del login es: ", result);

      if (!response.ok) throw new Error(result.error);

      navigate("/");

      //console.log(response);
    } catch (error) {
      console.log("Hola");
      console.error("Error de autenticación:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className="h-70 flex flex-col items-center sm:max-lg:mb-5">
          <p className="text-3xl pt-5">Ingresa tu correo y contraseña</p>
          <form
            className="w-4/5 h-40 pt-10 flex flex-col items-center gap-y-3"
            onSubmit={handleSubmit}
          >
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Correo Electrónico:</label>
              <input
                name="correo"
                type="email"
                placeholder="Email"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2">
              <label className="w-1/3">Contraseña:</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-4/5 w-2/3 lg:flex justify-end pl-2 pr-2 hover:text-blue-700 cursor-pointer">
              <p>¿No tienes un usuario?</p>
            </div>

            <button className="rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white">
              Iniciar Sesión
            </button>
          </form>
        </div>
        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
