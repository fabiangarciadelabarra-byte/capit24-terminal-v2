"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  ISeriesApi,
  LineData,
} from "lightweight-charts";

interface PricePoint {
  time: number;
  price: number;
}

export default function Chart({ symbol = "BINANCE:BTCUSDT" }) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const dataBuffer = useRef<LineData[]>([]);

  const [connected, setConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  // -----------------------------
  // 🔥 Crear el chart una sola vez
  // -----------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#FFFFFF",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    seriesRef.current = chartRef.current.addLineSeries({
      color: "#4ade80",
      lineWidth: 2,
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  // -----------------------------
  // 🔥 WebSocket Finnhub
  // -----------------------------
  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket(
        `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`
      );

      wsRef.current.onopen = () => {
        setConnected(true);
        wsRef.current?.send(
          JSON.stringify({ type: "subscribe", symbol })
        );
      };

      wsRef.current.onmessage = (event) => {
        const json = JSON.parse(event.data);

        if (json.type === "trade" && json.data?.length > 0) {
          const price = json.data[0].p;
          const time = Math.floor(json.data[0].t / 1000);

          setLastPrice(price);

          import { UTCTimestamp } from "lightweight-charts";

const point: LineData = {
  time: (time as UTCTimestamp),
  value: price
};

          dataBuffer.current.push(point);

          // Mantener solo los últimos 800 puntos
          if (dataBuffer.current.length > 800) {
            dataBuffer.current.shift();
          }

          // Actualizar el chart
          seriesRef.current?.setData(dataBuffer.current);
        }
      };

      wsRef.current.onclose = () => {
        setConnected(false);
        setTimeout(connect, 1500); // reconexión automática
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [symbol]);

  return (
    <div className="w-full">
      {/* Estado de conexión */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>

        <span className="text-white text-sm">
          {connected ? "Conectado" : "Reconectando..."}
        </span>

        {lastPrice && (
          <span className="ml-auto text-green-400 font-bold text-lg">
            ${lastPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Contenedor del chart */}
      <div
        ref={chartContainerRef}
        className="w-full h-[500px] border border-gray-800 rounded-lg"
      />
    </div>
  );
}
