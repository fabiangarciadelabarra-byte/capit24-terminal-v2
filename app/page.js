"use client";

import { useEffect, useState } from "react";

// IMPORTS CORREGIDOS (rutas relativas)
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import useCryptoPrices from "./hooks/useCryptoPrices";

export default function Home() {
  const { prices, loading } = useCryptoPrices();

  // ESTADOS PRINCIPALES
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [candles, setCandles] = useState([]);

  // NUEVOS ESTADOS PARA INTERVALO Y DÍAS
  const [interval, setInterval] = useState("1h");
  const [days, setDays] = useState(1);

  // Fetch de velas para el gráfico grande
  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(
          `/api/crypto/history?symbol=${selectedSymbol}&interval=${interval}&days=${days}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setCandles(data);
        } else {
          setCandles([]);
        }
      } catch (error) {
        console.error("Error fetching candles:", error);
        setCandles([]);
      }
    }

    fetchCandles();
  }, [selectedSymbol, interval, days]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Capit24 Terminal</h1>

      {/* Tarjetas de precios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {loading || !prices ? (
          <p>Cargando precios...</p>
        ) : (
          Object.entries(prices).map(([symbol, info]) => (
            <div
              key={symbol}
              onClick={() => setSelectedSymbol(symbol + "USDT")}
              style={{ cursor: "pointer" }}
            >
              <PriceCard
                data={{
                  symbol,
                  price: info.usd,
                  market_cap: info.usd_market_cap,
                  change_24h: info.usd_24h_change,
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Gráfico grande */}
      <h2 style={{ marginTop: "40px" }}>
        {selectedSymbol} – Candlestick Chart ({interval}, {days}D)
      </h2>

      {/* BOTONES DE INTERVALOS */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setInterval("5m")}>5m</button>
        <button onClick={() => setInterval("15m")}>15m</button>
        <button onClick={() => setInterval("1h")}>1h</button>
        <button onClick={() => setInterval("4h")}>4h</button>
      </div>

      {/* BOTONES DE DÍAS */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setDays(1)}>1D</button>
        <button onClick={() => setDays(7)}>7D</button>
        <button onClick={() => setDays(30)}>30D</button>
        <button onClick={() => setDays(90)}>90D</button>
        <button onClick={() => setDays(365)}>1Y</button>
      </div>

      {/* Gráfico */}
      <BigChart data={Array.isArray(candles) ? candles : []} />
    </div>
  );
}
