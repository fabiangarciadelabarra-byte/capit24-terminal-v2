"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function BigChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  // Crear el gráfico SOLO UNA VEZ
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#000" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#0f0",
      downColor: "#f00",
      borderUpColor: "#0f0",
      borderDownColor: "#f00",
      wickUpColor: "#0f0",
      wickDownColor: "#f00",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove(); // 🔥 Se destruye SOLO UNA VEZ
    };
  }, []);

  // Actualizar datos SIN recrear el gráfico
  useEffect(() => {
    if (!seriesRef.current) return;

    if (Array.isArray(data) && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px",
      }}
    />
  );
}
