import Footer from "../components/Footer";
import Header from "../components/Header";
import FaceRecognition from "../components/FaceRecognition";

import { useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";

import Arrow from "../assets/blue_arrow.png";

//function HomePage({ token }: Props) {
function IdentifyVisitor() {
  const navigate = useNavigate();
  const [identifiedUser, setIdentifiedUser] = useState<{
    dni: string;
    nombres: string;
    apellidos: string;
    descriptor_facial: number[];
    fotografia: string;
  } | null>(null);
  const [visitReasons, setVisitReasons] = useState<
    { id_motivo_visita: number; descripcion: string }[]
  >([]);
  const [identified, setIdenfied] = useState(false);

  const handleUserIdentified = (user: {
    dni: string;
    nombres: string;
    apellidos: string;
    descriptor_facial: number[];
    fotografia: string;
  }) => {
    setIdentifiedUser(user);
    console.log("Usuario identificado:", user);
    setIdenfied(true);
  };

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  //Actualiza en tiempo real todo lo que se escribe dentro de la consola
  //function handleChange(
  //  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //) {
  //  console.log("Hola");
  //}

  function handleSubmit() {
    console.log("Hola Mundo");
  }

  async function obtenerMotivos() {
    try {
      const responseMotivosVisita = await fetch(
        "http://localhost:3000/persona/motivos",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!responseMotivosVisita.ok) {
        const errorText = await responseMotivosVisita.text(); // Captura el mensaje de error del servidor
        console.error(
          "Error al obtener los motivos de visita:",
          responseMotivosVisita.status,
          errorText
        );
        return;
      }

      const data = await responseMotivosVisita.json();
      console.log("Los motivos recibidos:", data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const data = await obtenerMotivos();

      if (data) {
        setVisitReasons(data);
      }
    };

    initialize();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Seleccione una opción</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>
          <div className=" flex flex-col gap-y-7 items-center pt-10">
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
              onClick={() => handleRoute("/authvisitor")}
            >
              <img src={Arrow} alt="" className="rotate-180" />
              <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Atrás
              </div>
            </div>

            <div className="flex flex-col items-center gap-y-5">
              {identified ? (
                <>
                  <img
                    src={identifiedUser?.fotografia}
                    alt="Fotografía del usuario"
                    className="rounded-2xl w-3/5"
                  />
                </>
              ) : (
                <FaceRecognition onUserIdentified={handleUserIdentified} />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            {identifiedUser ? (
              <div>
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-1/6">Usuario: </p>
                  <p className="w-5/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedUser.nombres} {identifiedUser.apellidos}
                  </p>
                </div>
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-1/6">Identidad:</p>
                  <p className="w-5/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedUser.dni}
                  </p>
                </div>

                <form
                  onClick={handleSubmit}
                  className="flex flex-col  w-3/3 pt-5 items-center"
                >
                  <div className="flex flex-row gap-x-10 w-3/3">
                    <p className="w-1/6">Motivo de visita: </p>
                    <select
                      name="motivosVisita"
                      id="motivos"
                      className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                    >
                      <option key="0"></option>
                      {visitReasons.map((motivo) => (
                        <option key={motivo.id_motivo_visita}>
                          {motivo.descripcion}
                        </option> // Ajusta según la estructura real del objeto
                      ))}
                    </select>
                  </div>

                  <button className="w-2/6 rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white mt-10">
                    Crear usuario
                  </button>
                </form>
              </div>
            ) : (
              <p>Esperando identificación...</p>
            )}
          </div>
          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default IdentifyVisitor;
