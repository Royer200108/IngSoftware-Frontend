// src/components/IngresosPorCentro.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);


interface IngresoCentro {
  centro_regional: string;
  cantidad_ingresos: number;
}

interface Props {
  data: IngresoCentro[];
}

const IngresosPorCentro: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.centro_regional),
    datasets: [
      {
        label: 'Ingresos por centro regional',
        data: data.map(entry => entry.cantidad_ingresos),
        backgroundColor: '#17a2b8',
      },
    ],
  };
  return (
    <div className="max-w-3xl mx-auto">
      <Bar data={chartData} />
    </div>
  );
  
};

export default IngresosPorCentro;
