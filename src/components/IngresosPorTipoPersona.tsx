// src/components/IngresosPorTipoPersona.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface IngresoTipoPersona {
  tipo_persona: string;
  cantidad_ingresos: number;
}

interface Props {
  data: IngresoTipoPersona[];
}

const IngresosPorTipoPersona: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.tipo_persona),
    datasets: [
      {
        label: 'Ingresos',
        data: data.map(entry => entry.cantidad_ingresos),
        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default IngresosPorTipoPersona;
