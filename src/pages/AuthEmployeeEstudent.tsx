import Footer from "../components/Footer";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";

import Arrow from "../assets/blue_arrow.png";

//function HomePage({ token }: Props) {
function AuthEmployeeEstudent() {
  const navigate = useNavigate();

  function handleLogout() {
    //sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Seleccione una opción</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>

          <div className="h-60 flex flex-col gap-y-7 items-center sm:max-lg:mb-5 pt-10">
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
              onClick={handleLogout}
            >
              <img src={Arrow} alt="" className="rotate-180" />
              <div className="w-70 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Atrás
              </div>
            </div>
            <div className="flex flex-col gap-y-7 pl-5">
              <div className="flex flex-row items-center gap-x-10">
                <img src={Arrow} alt="" />
                <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Identificar empleado
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-10">
                <img src={Arrow} alt="" />
                <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Identificar estudiante
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

export default AuthEmployeeEstudent;
