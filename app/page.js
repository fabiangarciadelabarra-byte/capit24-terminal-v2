"use client";

import { useEffect, useState } from "react";

// 🔥 IMPORTS CORREGIDOS (rutas relativas)
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import useCryptoPrices from "./hooks/useCryptoPrices";

export default function Home() {
  const { prices, loading } = useCryptoPrices();
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [candles, setCandles] = useState([]);

  // 🔥 Fetch de velas para el gráfico grande
  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(`/api/crypto/history?symbol=${selectedSymbol}`);
        const data = await res.json();
        setCandles(data);
      } catch (error) {
        console.error("Error fetching candles:", error);
      }
    }

    fetchCandles();
  }, [selectedSymbol]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Capit24 Terminal</h1>

      {/* 🔥 Tarjetas de precios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {loading ? (
          <p>Cargando precios...</p>
        ) : (
          prices.map((crypto) => (
            <div
              key={crypto.symbol}
              onClick={() => setSelectedSymbol(crypto.symbol)}
              style={{ cursor: "pointer" }}
            >
              <PriceCard data={crypto} />
            </div>
          ))
        )}
      </div>

      {/* 🔥 Gráfico grande */}
      <h2 style={{ marginTop: "40px" }}>
        {selectedSymbol} – Candlestick Chart
      </h2>

      <BigChart data={candles} />
    </div>
  );
}
