"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  LineData,
  UTCTimestamp,
} from "lightweight-charts";

interface ChartProps {
  symbol: string;
}

export default function Chart({ symbol }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const dataBuffer = useRef<LineData[]>([]);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  // Crear el chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: "#000" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      timeScale: {
        borderColor: "#333",
      },
    });

    const lineSeries = chart.addLineSeries({
      color: "#4CAF50",
      lineWidth: 2,
    });

    seriesRef.current = lineSeries;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 400,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // WebSocket
  useEffect(() => {
    if (!symbol) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket("wss://ws.finnhub.io?token=YOUR_TOKEN_HERE");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);

      if (json.type === "trade" && json.data?.length > 0) {
        const price = json.data[0].p;
        const time = Math.floor(json.data[0].t / 1000);

        setLastPrice(price);

        const point: LineData = {
          time: time as UTCTimestamp,
          value: price,
        };

        dataBuffer.current.push(point);

        if (dataBuffer.current.length > 800) {
          dataBuffer.current.shift();
        }

        seriesRef.current?.setData(dataBuffer.current);
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [symbol]);

  return (
    <div>
      <div
        ref={chartContainerRef}
        style={{ width: "100%", height: "400px" }}
      />

      <div style={{ marginTop: "10px", color: "#FFF" }}>
        <strong>Último precio:</strong>{" "}
        {lastPrice ? `$${lastPrice}` : "Cargando..."}  
        <br />
        <strong>WebSocket:</strong>{" "}
        {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </div>
    </div>
  );
}
