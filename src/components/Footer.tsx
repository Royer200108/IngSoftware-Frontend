import LogoBlancoUnah from "../assets/logo-unah-blanco.png";

function Footer() {
  return (
    <footer className="bg-navs-primary flex flex-col justify-between text-white ">
      <div className="p-10 pt-3 pb-8">
        <h2 className="text-yellow-500 text-2xl">SISTEMA DE REGISTRO</h2>
        <p>Centro Regional</p>
      </div>
      <div className="bg-navs-secondary p-4 pl-10">
        <img src={LogoBlancoUnah} alt="Logo de la UNAH" width={"80px"} />
      </div>
    </footer>
  );
}

export default Footer;
