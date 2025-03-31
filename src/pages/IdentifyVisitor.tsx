import Footer from "../components/Footer";
import Header from "../components/Header";
import FaceRecognition from "../components/FaceRecognition";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handleUserIdentified = (user: {
    dni: string;
    nombres: string;
    apellidos: string;
    descriptor_facial: number[];
    fotografia: string;
  }) => {
    setIdentifiedUser(user);
    console.log("Usuario identificado:", user);
  };

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Seleccione una opción</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>
          <div className="h-60 flex flex-col gap-y-7 items-center sm:max-lg:mb-5 pt-10 text-#003b74">
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
              onClick={() => handleRoute("/authvisitor")}
            >
              <img src={Arrow} alt="" className="rotate-180" />
              <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Atrás
              </div>
            </div>
          </div>

          <FaceRecognition onUserIdentified={handleUserIdentified} />
          {identifiedUser ? (
            <p>
              Usuario autenticado: {identifiedUser.nombres} (ID:{" "}
              {identifiedUser.dni})
            </p>
          ) : (
            <p>Esperando identificación...</p>
          )}

          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default IdentifyVisitor;
