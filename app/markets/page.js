"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MarketsPage() {
  const [data, setData] = useState(null);
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/markets");
      const json = await res.json();
      setData(json);

      const candleRes = await fetch("/api/markets/candles?symbol=AAPL");
      const candleJson = await candleRes.json();

      const formatted = candleJson.c.map((price, i) => ({
        price,
        time: candleJson.t[i],
      }));

      setCandles(formatted);
    }

    load();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">

      <header className="mb-10">
        <h1 className="text-3xl font-bold">Mercados Globales</h1>
        <p className="text-[#999] mt-2">Datos en tiempo real + gráficos</p>
      </header>

      {!data ? (
        <p className="text-[#aaa]">Cargando datos...</p>
      ) : (
        <>
          {/* GRID DE MERCADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <h2 className="text-xl font-semibold">S&P 500</h2>
              <p className="text-[#aaa] mt-2">Precio: {data.sp500.c}</p>
            </div>

            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <h2 className="text-xl font-semibold">NASDAQ</h2>
              <p className="text-[#aaa] mt-2">Precio: {data.nasdaq.c}</p>
            </div>

            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <h2 className="text-xl font-semibold">DOW JONES</h2>
              <p className="text-[#aaa] mt-2">Precio: {data.dow.c}</p>
            </div>

          </div>

          {/* GRÁFICO */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">AAPL — Gráfico de Velas</h2>

            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={candles}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#4da6ff" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
