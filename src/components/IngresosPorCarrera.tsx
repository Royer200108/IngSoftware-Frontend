// src/components/IngresosPorCarrera.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface IngresoCarrera {
  carrera: string;
  cantidad_ingresos: number;
}

interface Props {
  data: IngresoCarrera[];
}

const IngresosPorCarrera: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.carrera),
    datasets: [
      {
        label: 'Ingresos por carrera',
        data: data.map(entry => entry.cantidad_ingresos),
        backgroundColor: [
          '#007bff', '#28a745', '#ffc107', '#dc3545',
          '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'
        ],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default IngresosPorCarrera;
