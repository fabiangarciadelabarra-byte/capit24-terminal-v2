"use client";

import { useEffect, useState } from "react";
import MiniChart from "./MiniChart";

export default function PriceCard({ title, price, change, marketCap, coinId }) {
  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState("1"); // default 24h

  useEffect(() => {
    async function loadHistory() {
      const res = await fetch(`/api/crypto/history?coin=${coinId}&days=${timeframe}`);
      const json = await res.json();
      setHistory(json);
    }
    loadHistory();
  }, [coinId, timeframe]);

  const isPositive = change >= 0;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "#0d1117",
        border: "1px solid #1f2937",
        width: "260px",
        color: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ marginBottom: "10px", fontSize: "20px" }}>{title}</h3>

      <p style={{ fontSize: "28px", fontWeight: "bold" }}>
        ${price.toLocaleString()}
      </p>

      <p
        style={{
          color: isPositive ? "#16c784" : "#ea3943",
          fontWeight: "bold",
          marginTop: "5px",
        }}
      >
        {isPositive ? "▲" : "▼"} {change.toFixed(2)}%
      </p>

      {/* Timeframe Selector */}
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        {[
          { label: "1h", value: "0.0416" },
          { label: "24h", value: "1" },
          { label: "7d", value: "7" },
          { label: "30d", value: "30" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTimeframe(t.value)}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid #1f2937",
              background: timeframe === t.value ? "#1f2937" : "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {history.length > 0 && <MiniChart data={history} />}

      <p style={{ marginTop: "10px", opacity: 0.7 }}>
        Market Cap: ${marketCap.toLocaleString()}
      </p>
    </div>
  );
}
