import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import IngresosPorCentro from "../components/IngresosPorCentro";
import IngresosPorDia from "../components/IngresosPorDia";
import IngresosPorMetodo from "../components/IngresosPorMetodo";
import IngresosPorCarrera from "../components/IngresosPorCarrera";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";

import Arrow from "../assets/blue_arrow.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ReportType = "dashboard" | "centro" | "dia" | "metodo" | "carrera";

interface IngresoCentro {
  centro_regional: string;
  cantidad_ingresos: number;
}
interface IngresoDia {
  fecha: string;
  cantidad_ingresos: number;
}
interface IngresoMetodo {
  metodo_ingreso: string;
  cantidad_ingresos: number;
}
interface IngresoCarrera {
  carrera: string;
  cantidad_ingresos: number;
}

function ReportPage() {
  const navigate = useNavigate();

  const [selectedReport, setSelectedReport] = useState<ReportType>("dashboard");
  const [dataCentro, setDataCentro] = useState<IngresoCentro[]>([]);
  const [dataDia, setDataDia] = useState<IngresoDia[]>([]);
  const [dataMetodo, setDataMetodo] = useState<IngresoMetodo[]>([]);
  const [dataCarrera, setDataCarrera] = useState<IngresoCarrera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchCentro = fetch(`${API_BASE_URL}/ingresos/por-centro`).then(
      (res) => res.json()
    );
    const fetchDia = fetch(`${API_BASE_URL}/ingresos/por-dia`).then((res) =>
      res.json()
    );
    const fetchMetodo = fetch(`${API_BASE_URL}/ingresos/por-metodo`).then(
      (res) => res.json()
    );
    const fetchCarrera = fetch(`${API_BASE_URL}/ingresos/por-carrera`).then(
      (res) => res.json()
    );

    Promise.all([fetchCentro, fetchDia, fetchMetodo, fetchCarrera])
      .then(([centro, dia, metodo, carrera]) => {
        setDataCentro(centro);
        setDataDia(dia);
        setDataMetodo(metodo);
        setDataCarrera(carrera);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  return (
    <>
      <Header />
      <div className="p-4">
        <div
          className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer mb-5"
          onClick={() => handleRoute("/homepageadmin")}
        >
          <img src={Arrow} alt="" className="rotate-180" />
          <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
            Atrás
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Reportes</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              selectedReport === "dashboard"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedReport("dashboard")}
          >
            General
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedReport === "centro"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedReport("centro")}
          >
            Por Centro
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedReport === "dia"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedReport("dia")}
          >
            Por Día
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedReport === "metodo"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedReport("metodo")}
          >
            Por Método
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedReport === "carrera"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedReport("carrera")}
          >
            Por Carrera
          </button>
        </div>

        {selectedReport === "dashboard" && <Dashboard />}
        {selectedReport === "centro" && <IngresosPorCentro data={dataCentro} />}
        {selectedReport === "dia" && <IngresosPorDia data={dataDia} />}
        {selectedReport === "metodo" && <IngresosPorMetodo data={dataMetodo} />}
        {selectedReport === "carrera" && (
          <IngresosPorCarrera data={dataCarrera} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default ReportPage;
