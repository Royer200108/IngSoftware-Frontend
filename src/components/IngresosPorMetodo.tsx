// src/components/IngresosPorMetodo.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface IngresoMetodo {
  metodo_ingreso: string;
  cantidad_ingresos: number;
}

interface Props {
  data: IngresoMetodo[];
}

const IngresosPorMetodo: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.metodo_ingreso),
    datasets: [
      {
        label: 'Método de ingreso',
        data: data.map(entry => entry.cantidad_ingresos),
        backgroundColor: ['#6f42c1', '#20c997', '#fd7e14'],
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto">
      <Doughnut data={chartData} />
    </div>
  );
};

export default IngresosPorMetodo;
