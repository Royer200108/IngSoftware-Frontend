import Footer from "../../components/Footer";
import Header from "../../components/Header";

import { useNavigate } from "react-router-dom";

import Arrow from "../../assets/blue_arrow.png";

//PAGINA MERAMENTE DE NAVEGACION
function AuthStudent() {
  const navigate = useNavigate();

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">
            Seleccione el tipo de autenticación para el Estudiante
          </p>
          <div className="rounded-sm h-1 bg-gray-400"></div>

          <div className="flex flex-col items-center pt-5">
            <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
              {/**Aqui iba el formulario */}

              <div
                className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
                onClick={() => handleRoute("/authemployeestudent")}
              >
                <img src={Arrow} alt="" className="rotate-180" />
                <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Atrás
                </div>
              </div>
              <div className="flex flex-col gap-y-7 pl-5">
                <div
                  className="flex flex-row items-center gap-x-10 cursor-pointer"
                  onClick={() => {
                    navigate(`/identifystudent/Estudio`);
                  }}
                >
                  <img src={Arrow} alt="" />
                  <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                    Reconocimiento facial
                  </div>
                </div>
                <div className="flex flex-row items-center gap-x-10 cursor-pointer">
                  <img src={Arrow} alt="" />
                  <div
                    className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md"
                    onClick={() => handleRoute(`/identifybyaccount/Estudio`)}
                  >
                    Número de cuenta
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-sm h-1 bg-gray-400"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default AuthStudent;
