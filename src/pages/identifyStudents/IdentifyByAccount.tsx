import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SuccessModal from "../../components/SuccessModal";

import { useAuth } from "../../context/AuthContext"; // Importa el contexto
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Arrow from "../../assets/blue_arrow.png";

function IdentifyByAccount() {
  const navigate = useNavigate();
  const motivo = useParams();
  console.log("El motivo de visita es: ", motivo.motivo_visita);
    
  const { user } = useAuth(); // Obtener el usuario desde el contexto

  const [identifiedStudent, setIdentifiedStudent] = useState<{
    nombres: string;
    apellidos: string;
    numero_cuenta: string;
    nombre_carrera: string;
    centro_regional: string;
    fotografia: string;
    id_persona: string;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const handleRoute = (url: string) => {
    navigate(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (identifiedStudent) {
      try {
        // Asegúrate de que el motivo de visita y el uuid_usuario se estén pasando correctamente
        const formResponse = await fetch(
          "http://localhost:3000/persona/registrarIngreso",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_persona: identifiedStudent.id_persona, // Cambiar según tu modelo de datos
              motivo_visita: motivo.motivo_visita, // Motivo de la visita
              metodo_ingreso: "Numero de Cuenta",
              uuid_usuario: user?.id // Enviamos el uuid del guardia
            }),
          }
        );

        if (!formResponse.ok) {
          throw new Error("Error en el registro");
        }

        console.log("Usuario registrado exitosamente");
        setShowModal(true); // Mostramos el modal
      } catch (error) {
        console.error("Error de autenticación:", error);
      }
    }
  };

  const verifyAccountNumber = async (accountNumber: string) => {
    console.log("Número de cuenta a enviar:", accountNumber);

    try {
      const response = await fetch(
        `http://localhost:3000/persona/buscarEstudiante?numeroCuenta=${accountNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la verificación: ${errorText}`);
      }

      const data = await response.json();
      console.log("Datos del estudiante:", data[0]);
      setIdentifiedStudent(data[0]);
    } catch (error) {
      console.error("Error al verificar número de cuenta:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Ingrese el número de cuenta</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>
          <div className="flex flex-col gap-y-7 items-center pt-10">
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer"
              onClick={() => handleRoute("/authstudent")}
            >
              <img src={Arrow} alt="" className="rotate-180" />
              <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Atrás
              </div>
            </div>

            <div className="flex flex-col items-center gap-y-5">
              <form
                className="flex flex-col gap-y-4 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyAccountNumber(accountNumber);
                }}
              >
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Número de cuenta"
                  className="border-2 p-2 rounded-sm"
                />
                <button
                  type="submit"
                  className="rounded-sm bg-[#003B74] p-2 pl-5 pr-5 mt-5 hover:bg-[#003274] text-white cursor-pointer"
                >
                  Verificar
                </button>
              </form>
            </div>
          </div>

          {identifiedStudent ? (
            <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
              <div className="w-6/6">
                {/* Foto en la parte superior */}
                <div className="flex flex-row justify-center pt-5">
                  <img
                    src={identifiedStudent.fotografia}
                    alt="Foto del estudiante"
                    className="w-20 h-20 rounded-full border-2 border-gray-400"
                  />
                </div>

                {/* Datos del estudiante debajo de la foto */}
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-2/6">Usuario: </p>
                  <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedStudent.nombres} {identifiedStudent.apellidos}
                  </p>
                </div>
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-2/6">Cuenta:</p>
                  <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedStudent.numero_cuenta}
                  </p>
                </div>
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-2/6">Carrera:</p>
                  <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedStudent.nombre_carrera}
                  </p>
                </div>
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <p className="w-2/6">Centro Regional:</p>
                  <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                    {identifiedStudent.centro_regional}
                  </p>
                </div>

                <div className="flex flex-col gap-x-10 w-6/6 p-2 items-center">
                  <button
                    className="rounded-sm bg-[#003B74] p-1 pl-5 pr-5 mt-5 hover:bg-[#003274] text-white cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Registrar visita
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>Este usuario no es un estudiante</div>
          )}

          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>

      {showModal && <SuccessModal setShowModal={setShowModal} />}
    </>
  );
}

export default IdentifyByAccount;
