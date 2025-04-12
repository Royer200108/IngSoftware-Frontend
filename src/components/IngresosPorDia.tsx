// src/components/IngresosPorDia.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface IngresoDia {
  fecha: string;
  cantidad_ingresos: number;
}

interface Props {
  data: IngresoDia[];
}

const IngresosPorDia: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.fecha),
    datasets: [
      {
        label: 'Ingresos por día',
        data: data.map(entry => entry.cantidad_ingresos),
        fill: false,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default IngresosPorDia;
