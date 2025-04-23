import Footer from "../components/Footer";
import Header from "../components/Header";

//Pagina que se muestra en caso de que el usuario ingrese una url indefinida
function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <p className="text-3xl pt-5">Página no encontrada</p>
        </div>

        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
