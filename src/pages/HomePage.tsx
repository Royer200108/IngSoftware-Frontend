import Footer from "../components/Footer";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";

import Arrow from "../assets/blue_arrow.png";

//function HomePage({ token }: Props) {
function HomePage() {
  const navigate = useNavigate();
  const pages: string[] = ["/authclient", "/authvisitor"];

  async function cerrarSesion() {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data.message);
  }

  function handleLogout() {
    cerrarSesion();
    navigate("/login");
  }

  function handleChange(index: number) {
    navigate(pages[index]);
  }

  return (
    <>
      <div>HomePage</div>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
          <p className="pb-3 text-2xl">Página principal</p>
          <div className="rounded-sm h-1 bg-gray-400"></div>

          <div className="h-60 flex flex-col gap-y-7 items-center sm:max-lg:mb-5 pt-10 text-#003b74">
            <div className="flex flex-col gap-y-7 pl-5">
              <div
                className="flex flex-row items-center gap-x-10 cursor-pointer"
                onClick={() => handleChange(0)}
              >
                <img src={Arrow} alt="" />
                <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Identificar empleado o estudiante
                </div>
              </div>
              <div
                className="flex flex-row items-center gap-x-10 cursor-pointer"
                onClick={() => handleChange(1)}
              >
                <img src={Arrow} alt="" />
                <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                  Identificar visitante
                </div>
              </div>
            </div>
            <div
              className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
              onClick={handleLogout}
            >
              <img src={Arrow} alt="" className="rotate-180" />
              <div className="w-70 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
                Cerrar sesión
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

export default HomePage;
