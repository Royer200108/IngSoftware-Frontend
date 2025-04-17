import Footer from "../../components/Footer";
import Header from "../../components/Header";
import FaceRecognition from "../../components/FaceRecognition";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Arrow from "../../assets/blue_arrow.png";

/*
interface Props {
  userState: {
    id: string;
    email: string;
  };
}
*/
//function HomePage({ token }: Props) {
function IdentifyStudent() {
  const navigate = useNavigate();
  const motivo = useParams();
  console.log("El motivo de visita es: ", motivo.motivo_visita);
  const { user } = useAuth();

  const [identifiedUser, setIdentifiedUser] = useState<{
    id_persona: string;
    dni: string;
    nombres: string;
    apellidos: string;
    descriptor_facial: number[];
    fotografia: string;
    motivos_visita: string;
    guardia_uuid: string;
  } | null>(null);
  const [identifiedStudent, setIdentifiedStudent] = useState<{
    numero_cuenta: string;
    nombre_carrera: string;
    centro_regional: string;
    estado: string;
  } | null>(null);

  const [identified, setIdenfied] = useState(false);

  const handleUserIdentified = async (usuario: {
    id_persona: string;
    dni: string;
    nombres: string;
    apellidos: string;
    descriptor_facial: number[];
    fotografia: string;
    motivos_visita: string;
    guardia_uuid: string;
  }) => {
    setIdentifiedUser(usuario);
    setIdenfied(true);

    setIdentifiedUser((prevIdentifiedUser) => ({
      id_persona: prevIdentifiedUser?.id_persona || "",
      dni: prevIdentifiedUser?.dni || "",
      nombres: prevIdentifiedUser?.nombres || "",
      apellidos: prevIdentifiedUser?.apellidos || "",
      descriptor_facial: prevIdentifiedUser?.descriptor_facial || [],
      fotografia: prevIdentifiedUser?.fotografia || "",
      motivos_visita: motivo.motivo_visita || "",
      guardia_uuid: user?.id || "",
    }));

    console.log("EL ID DE LA PERSONA A BUSCAR ES: ", usuario.id_persona);

    const estudiante = await verificarEstudiante(usuario.id_persona);
    if (estudiante) {
      setIdentifiedStudent(estudiante); // ya que estás retornando `data` completo
      console.log("AQUI DEBERIA ESTAR LLENO ", estudiante);
    }
  };

  function handleRoute(url: string) {
    navigate(url);
  }

  async function verificarEstudiante(id_persona: string) {
    try {
      const Response = await fetch(
        "http://localhost:3000/persona/verificarEstudiante",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_persona: id_persona,
          }),
        }
      );

      if (!Response.ok) {
        throw new Error("Error en el registro");
      }
      const data = await Response.json();
      console.log("LA DATA OBTENIDA DEL ESTUDIANTE ", data[0]);
      setIdentifiedStudent(data[0]);
      console.log("contenido de identifiedStudent: ", identifiedStudent);
      return data[0];
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  //Envia la información obtenida
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const formResponse = await fetch(
        "http://localhost:3000/persona/registrarIngreso",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_persona: identifiedUser?.id_persona,
            motivo_visita: identifiedUser?.motivos_visita,
            metodo_ingreso: "Reconocimiento Facial",
            uuid_usuario: identifiedUser?.guardia_uuid,
          }),
        }
      );

      if (!formResponse.ok) {
        throw new Error("Error en el registro");
      }

      console.log("Usuario registrado exitosamente");
      navigate("/");
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

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
              onClick={() => handleRoute("/authstudent")}
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

          {identifiedUser?.dni ? (
            <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
              {identifiedStudent ? (
                <div className=" w-6/6">
                  <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                    <p className="w-2/6">Usuario: </p>
                    <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                      {identifiedUser.nombres} {identifiedUser.apellidos}
                    </p>
                  </div>
                  <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                    <p className="w-2/6">Identidad:</p>
                    <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                      {identifiedUser.dni}
                    </p>
                  </div>
                  <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                    <p className="w-2/6">Motivo de visita: </p>
                    <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                      {identifiedUser.motivos_visita}
                    </p>
                  </div>

                  <form className="flex flex-col  w-3/3 p-2 mt-2 items-center border-1 rounded-sm">
                    <p className="text-1xl w-5/6">Datos del estudiante: </p>
                    <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                      <p className="w-2/6">Cuenta: </p>
                      <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                        {identifiedStudent.numero_cuenta}
                      </p>
                    </div>
                    <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                      <p className="w-2/6">Carrera: </p>
                      <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                        {identifiedStudent.nombre_carrera}
                      </p>
                    </div>
                    <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                      <p className="w-2/6">Centro regional: </p>
                      <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                        {identifiedStudent.centro_regional}
                      </p>
                    </div>
                    <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                      <p className="w-2/6">Estado: </p>
                      <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                        {identifiedStudent.estado}
                      </p>
                    </div>
                  </form>

                  <div className="flex flex-col gap-x-10 w-6/6 p-2 items-center ">
                    <button
                      className="rounded-sm bg-[#003B74] p-1 pl-5 pr-5 mt-5 hover:bg-[#003274] text-white cursor-pointer"
                      onClick={handleSubmit}
                    >
                      Registrar visita
                    </button>
                  </div>
                </div>
              ) : (
                <div>Este usuario no es un estudiante</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
              <p>Esperando identificación...</p>
            </div>
          )}

          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default IdentifyStudent;
