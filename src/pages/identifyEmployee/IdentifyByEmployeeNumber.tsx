// src/pages/IdentifyByEmployeeNumber.tsx
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SuccessModal from "../../components/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API BASE URL:", API_BASE_URL);

function IdentifyByEmployeeNumber() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const motivo = useParams();

  const [identifiedEmployee, setIdentifiedEmployee] = useState<{
    id_persona: string;
    numero_empleado: string;
    nombres: string;
    apellidos: string;
    fotografia: string;
    puesto: string;
    centro_regional: string;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [employeeNumber, setEmployeeNumber] = useState("");

  const handleRoute = (url: string) => {
    navigate(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (identifiedEmployee) {
      try {
        const formResponse = await fetch(
          `${API_BASE_URL}/persona/registrarIngreso`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_persona: identifiedEmployee.id_persona,
              motivo_visita: motivo.motivo_visita,
              metodo_ingreso: "Numero de empleado",
              uuid_usuario: user?.id,
            }),
          }
        );

        if (!formResponse.ok) {
          throw new Error("Error en el registro");
        }

        setShowModal(true);
      } catch (error) {
        console.error("Error de autenticación:", error);
      }
    }
  };

  const verifyEmployeeNumber = async (employeeNumber: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/persona/buscarPorNumeroEmpleado?numeroEmpleado=${employeeNumber}`,
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
      
      if (data[0]) {
        const employeeData = data[0];

        // Actualizamos identifiedEmployee con los datos del empleado
        setIdentifiedEmployee(employeeData);
      }
    } catch (error) {
      console.error("Error al verificar número de empleado:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Ingrese el número de empleado</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>
          <div className="flex flex-col gap-y-7 items-center pt-10">
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer"
              onClick={() => handleRoute("/")}
            >
              <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Atrás
              </div>
            </div>

            <div className="flex flex-col items-center gap-y-5">
              <form
                className="flex flex-col gap-y-4 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyEmployeeNumber(employeeNumber);
                }}
              >
                <input
                  type="text"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  placeholder="Número de empleado"
                  className="border-2 p-2 rounded-sm"
                />
                <button
                  type="submit"
                  disabled={!employeeNumber}
                  className="rounded-sm bg-[#003B74] p-2 pl-5 pr-5 mt-5 hover:bg-[#003274] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar
                </button>
              </form>
            </div>
          </div>

          {identifiedEmployee ? (
            <div className=" w-6/6">
              <div className="flex flex-row justify-center pt-5">
                  <img
                    src={identifiedEmployee.fotografia}
                    alt="Foto del empleado"
                    className="rounded-2xl w-3/5"
                  />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <p className="w-2/6">Empleado: </p>
                <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                  {identifiedEmployee.nombres} {identifiedEmployee.apellidos}
                </p>
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <p className="w-2/6">Puesto:</p>
                <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                  {identifiedEmployee.puesto}
                </p>
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <p className="w-2/6">Centro Regional: </p>
                <p className="w-4/6 bg-gray-300 rounded-sm border-gray-300 border-2 pl-2 pr-2 text-gray-700">
                  {identifiedEmployee.centro_regional}
                </p>
              </div>

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
            <div>Este usuario no es un empleado registrado</div>
          )}

          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>

      {showModal && <SuccessModal setShowModal={setShowModal} />}
    </>
  );
}

export default IdentifyByEmployeeNumber;
