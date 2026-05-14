"use client";

import { useEffect, useState } from "react";

// IMPORTS CORREGIDOS (rutas relativas)
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import useCryptoPrices from "./hooks/useCryptoPrices";

export default function Home() {
  const { prices, loading } = useCryptoPrices();
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [candles, setCandles] = useState([]);

  // Fetch de velas para el gráfico grande
  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(`/api/crypto/history?symbol=${selectedSymbol}`);
        const data = await res.json();

        // Aseguramos que sea un array
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
  }, [selectedSymbol]);

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
        {selectedSymbol} – Candlestick Chart
      </h2>

      <BigChart data={Array.isArray(candles) ? candles : []} />
    </div>
  );
}
