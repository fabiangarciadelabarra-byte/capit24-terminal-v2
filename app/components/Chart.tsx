"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  LineData,
  Time,
} from "lightweight-charts";

interface ChartProps {
  data: LineData<Time>[];
}

export default function Chart({ data }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear el chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      timeScale: {
        borderColor: "#ccc",
      },
      rightPriceScale: {
        borderColor: "#ccc",
      },
    });

    chartRef.current = chart;

    // Crear la serie de línea (API v5)
    const lineSeries = chart.addSeries({
      type: "Line",
    });

    // Aplicar estilos (v5 usa applyOptions)
    lineSeries.applyOptions({
      color: "#4CAF50",
      lineWidth: 2,
    });

    // Cargar datos
    lineSeries.setData(data);

    // Resize automático
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px" }}
    />
  );
}
