import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import Header from "../components/Header";
import IngresosPorCentro from "../components/IngresosPorCentro";

interface IngresoCentro {
  centro_regional: string;
  cantidad_ingresos: number;
}

function ReportPage() {
  const [data, setData] = useState<IngresoCentro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/ingresos/por-centro') 
      .then((response) => response.json())
      .then((data) => {
        setData(data); 
        setLoading(false);
      })
      .catch((error) => {
        setError('Error al obtener los datos');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div>ReportPage</div>
      <IngresosPorCentro data={data} />
      <Footer />
    </>
  );
}

export default ReportPage;
