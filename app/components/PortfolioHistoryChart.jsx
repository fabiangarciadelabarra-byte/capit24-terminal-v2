"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PortfolioHistoryChart() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  if (history.length === 0) {
    return (
      <p style={{ marginTop: "20px", color: "#888" }}>
        Aún no hay historial. Agrega operaciones para comenzar.
      </p>
    );
  }

  const data = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: "Valor del Portafolio",
        data: history.map((h) => h.value),
        borderColor: "#16c784",
        backgroundColor: "rgba(22, 199, 132, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => "$" + v.toLocaleString(),
        },
      },
    },
  };

  return (
    <div style={{ marginTop: "40px", padding: "20px", background: "#111", borderRadius: "10px" }}>
      <h3>Evolución del Portafolio</h3>
      <Line data={data} options={options} />
    </div>
  );
}
