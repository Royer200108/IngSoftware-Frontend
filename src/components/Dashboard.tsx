// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import IngresosPorDia from './IngresosPorDia';
import IngresosPorTipoPersona from './IngresosPorTipoPersona';
import IngresosPorCentro from './IngresosPorCentro';
import IngresosPorMetodo from './IngresosPorMetodo';

 function Dashboard() {
  const [porDia, setPorDia] = useState([]);
  const [porTipo, setPorTipo] = useState([]);
  const [porCentro, setPorCentro] = useState([]);
  const [porMetodo, setPorMetodo] = useState([]);

  useEffect(() => {
  
    fetch('http://localhost:3000/ingresos/por-dia')
      .then(res => res.json())
      .then(data => setPorDia(data));

    fetch('http://localhost:3000/ingresos/por-tipo')
      .then(res => res.json())
      .then(data => setPorTipo(data));

    fetch('http://localhost:3000/ingresos/por-centro')
      .then(res => res.json())
      .then(data => setPorCentro(data));

    fetch('http://localhost:3000/ingresos/por-metodo')
      .then(res => res.json())
      .then(data => setPorMetodo(data));
  }, []);

  return (
    <div className="p-6 grid gap-10 grid-cols-1 md:grid-cols-2">
      <div className="shadow-lg rounded-xl p-4 border">
        <h2 className="text-lg font-semibold mb-2">Ingresos por Día</h2>
        <IngresosPorDia data={porDia} />
      </div>

      <div className="shadow-lg rounded-xl p-4 border">
        <h2 className="text-lg font-semibold mb-2">Ingresos por Tipo de Persona</h2>
        <IngresosPorTipoPersona data={porTipo} />
      </div>

      <div className="shadow-lg rounded-xl p-4 border">
        <h2 className="text-lg font-semibold mb-2">Ingresos por Centro Regional</h2>
        <IngresosPorCentro data={porCentro} />
      </div>

      <div className="shadow-lg rounded-xl p-4 border">
        <h2 className="text-lg font-semibold mb-2">Ingresos por Método</h2>
        <IngresosPorMetodo data={porMetodo} />
      </div>
    </div>
  );
}
export default Dashboard;