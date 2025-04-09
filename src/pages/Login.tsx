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
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <p className="text-3xl pt-5">Ingresa tu correo y contraseña</p>
        </div>

        <div className="flex flex-col items-center pt-5">
          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            {/**Aqui iba el formulario */}
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

              <button className="w-3/6 rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white mt-10">
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

/**
 *
 *
 */
