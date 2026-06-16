"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface Props {
  symbol: string;
}

export default function Chart({ symbol }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState("1"); // timeframe seleccionado

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear gráfico
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: "#111" },
        textColor: "white",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      crosshair: { mode: 1 },
      timeScale: { borderColor: "#333" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#0f0",
      downColor: "#f00",
      borderUpColor: "#0f0",
      borderDownColor: "#f00",
      wickUpColor: "#0f0",
      wickDownColor: "#f00",
    });

    // Obtener velas
    const fetchCandles = async () => {
      const res = await fetch(`/api/candles?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();

      if (!json || json.s !== "ok") return;

      const candles = json.t.map((t: number, i: number) => ({
        time: t,
        open: json.o[i],
        high: json.h[i],
        low: json.l[i],
        close: json.c[i],
      }));

      candleSeries.setData(candles);
    };

    // Actualizar precio en vivo
    const fetchPrice = async () => {
      const res = await fetch(`/api/quote?symbol=${symbol}`);
      const json = await res.json();

      if (json?.c) {
        candleSeries.update({
          time: Math.floor(Date.now() / 1000),
          open: json.c,
          high: json.c,
          low: json.c,
          close: json.c,
        });
      }
    };

    fetchCandles();
    fetchPrice();

    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [symbol, tf]);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {/* Selector de timeframes */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "1m", value: "1" },
          { label: "5m", value: "5" },
          { label: "15m", value: "15" },
          { label: "30m", value: "30" },
          { label: "1h", value: "60" },
          { label: "2h", value: "120" },
          { label: "1D", value: "1d" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTf(t.value)}
            style={{
              padding: "6px 12px",
              background: tf === t.value ? "#444" : "#222",
              color: "white",
              borderRadius: "6px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenedor del gráfico */}
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "420px",
        }}
      />
    </div>
  );
}
