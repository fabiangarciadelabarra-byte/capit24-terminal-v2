"use client";

import { useEffect, useState } from "react";

export default function PriceCard({ data, toggle, watchlist }) {
  const [realtime, setRealtime] = useState(null);

  useEffect(() => {
    if (!data?.symbol) return;

    // Convertir BTCUSDT → BTC
    const symbol = data.symbol.replace("USDT", "");

    const fetchPrice = async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${symbol}`);
        const json = await res.json();
        setRealtime(json);
      } catch (err) {
        console.error("Realtime price error:", err);
      }
    };

    fetchPrice(); // primera carga

    const interval = setInterval(fetchPrice, 10000); // cada 10s
    return () => clearInterval(interval);
  }, [data]);

  // Precio final mostrado
  const price = realtime?.c
    ? realtime.c.toFixed(2)
    : data.price?.toFixed(2);

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "#111",
        color: "white",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
        {data.name} ({data.symbol})
      </h2>

      <p style={{ fontSize: "32px", marginTop: "10px" }}>
        ${price}
      </p>

      <p style={{ opacity: 0.7, marginTop: "5px" }}>
        Precio en tiempo real (Finnhub)
      </p>
    </div>
  );
}
