"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function MiniChart({ data }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: 240,
      height: 80,
      layout: {
        background: { color: "#0d1117" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: { visible: false },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
    });

    const lineSeries = chart.addLineSeries({
      color: data[data.length - 1].value >= data[0].value ? "#16c784" : "#ea3943",
      lineWidth: 2,
    });

    lineSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        marginTop: "10px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}


