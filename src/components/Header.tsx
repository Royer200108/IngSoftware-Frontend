import LogoBlancoUnah from "../assets/logo-unah-blanco.png";

function Header() {
  return (
    <header className="bg-navs-primary flex flex-row justify-between text-white pl-10">
      <div className="p-4 pt-3 pb-10">
        <p>UNAH</p>
        <h2 className="text-yellow-500 text-2xl">SISTEMA DE AUTENTICACIÓN</h2>
      </div>
      <div className="p-4 pr-10">
        <img src={LogoBlancoUnah} alt="Logo de la UNAH" width={"80px"} />
      </div>
    </header>
  );
}

export default Header;
