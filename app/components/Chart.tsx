"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineSeries,
  AreaSeries,
  Axis,
  Tooltip,
} from "react-charts";

interface PricePoint {
  time: number;
  price: number;
}

export default function RealTimeChart({ symbol = "BINANCE:BTCUSDT" }) {
  const [connected, setConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  // Buffer circular de datos
  const dataRef = useRef<PricePoint[]>([]);
  const chartDataRef = useRef([{ label: "Price", data: [] as PricePoint[] }]);

  const [, forceRender] = useState({}); // Para refrescar el chart sin re-renderizar todo

  const wsRef = useRef<WebSocket | null>(null);

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
          const time = json.data[0].t;

          setLastPrice(price);

          // Guardar en buffer
          dataRef.current.push({ time, price });

          // Mantener solo los últimos 800 puntos
          if (dataRef.current.length > 800) {
            dataRef.current.shift();
          }

          // Actualizar chartDataRef sin re-renderizar todo
          chartDataRef.current = [
            {
              label: "Price",
              data: [...dataRef.current],
            },
          ];

          // Forzar actualización del chart
          forceRender({});
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

  // -----------------------------
  // ⚙ Configuración del Chart
  // -----------------------------
  const primaryAxis = {
    getValue: (d: PricePoint) => new Date(d.time),
  };

  const secondaryAxis = {
    getValue: (d: PricePoint) => d.price,
  };

  return (
    <div className="w-full h-[500px] bg-black rounded-lg p-4 border border-gray-800">
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

      {/* Chart */}
      <Chart
        options={{
          data: chartDataRef.current,
          primaryAxis,
          secondaryAxis,
          tooltip: true,
          dark: true,
        }}
      >
        <LineSeries />
        <AreaSeries />
        <Tooltip />
      </Chart>
    </div>
  );
}
