"use client";

import { useState } from "react";

export default function SearchBar({ data, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = query.length === 0
    ? []
    : data.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div style={{ marginTop: "20px", position: "relative" }}>
      <input
        type="text"
        placeholder="Buscar BTC, ETH, SOL..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#111",
          color: "white",
          fontSize: "16px",
        }}
      />

      {query.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            width: "100%",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "8px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {filtered.length === 0 && (
            <p style={{ padding: "10px", color: "#777" }}>No encontrado</p>
          )}

          {filtered.map((coin) => (
            <div
              key={coin.symbol}
              onClick={() => {
                onSelect(coin.symbol.toUpperCase() + "USDT");
                setQuery("");
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #222",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img src={coin.image} width={20} height={20} />
              <span>
                {coin.name} ({coin.symbol.toUpperCase()})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
