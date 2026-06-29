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
  const [connected, setConnected] = useState(false);

  // 1) CREAR EL CHART
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

  // 2) CARGAR DATOS HISTÓRICOS INICIALES
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/crypto/history?symbol=${symbol}`);
        const history: LineData[] = await res.json();

        if (history && history.length > 0) {
          seriesRef.current?.setData(history);
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    }

    loadHistory();
  }, [symbol]);

  // 3) WEBSOCKET EN VIVO
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

        const point: LineData = {
          time: time as UTCTimestamp,
          value: price,
        };

        // Actualizar incrementalmente
        seriesRef.current?.update(point);
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
        <strong>WebSocket:</strong>{" "}
        {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </div>
    </div>
  );
}
