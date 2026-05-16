"use client";

import { useState } from "react";

export default function ScreenerPanel({ market }) {
  if (!market || market.length === 0) return null;

  const [sortKey, setSortKey] = useState("market_cap");
  const [minVolume, setMinVolume] = useState(0);
  const [minChange, setMinChange] = useState(-100);

  // Filtrar
  const filtered = market.filter(
    (c) =>
      c.total_volume >= minVolume &&
      c.price_change_percentage_24h >= minChange
  );

  // Ordenar
  const sorted = [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);

  // Top Movers
  const topGainers = [...market]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const topLosers = [...market]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  // Volatilidad (High Volatility)
  const highVolatility = [...market]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#111",
        borderRadius: "10px",
        border: "1px solid #333",
      }}
    >
      <h2>Screener Avanzado</h2>

      {/* FILTROS */}
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label>Volumen mínimo</label>
          <input
            type="number"
            value={minVolume}
            onChange={(e) => setMinVolume(Number(e.target.value))}
            style={{ width: "120px", padding: "6px", background: "#222", color: "white" }}
          />
        </div>

        <div>
          <label>Cambio mínimo 24h (%)</label>
          <input
            type="number"
            value={minChange}
            onChange={(e) => setMinChange(Number(e.target.value))}
            style={{ width: "120px", padding: "6px", background: "#222", color: "white" }}
          />
        </div>

        <div>
          <label>Ordenar por</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            style={{ padding: "6px", background: "#222", color: "white" }}
          >
            <option value="market_cap">Market Cap</option>
            <option value="total_volume">Volumen</option>
            <option value="current_price">Precio</option>
            <option value="price_change_percentage_24h">% Cambio 24h</option>
          </select>
        </div>
      </div>

      {/* RESULTADOS */}
      <div style={{ marginTop: "20px" }}>
        {sorted.slice(0, 20).map((coin) => (
          <div
            key={coin.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {coin.name} ({coin.symbol.toUpperCase()})
            </span>
            <span>${coin.current_price.toLocaleString()}</span>
            <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
            <span>Vol: {coin.total_volume.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* TOP MOVERS */}
      <h3 style={{ marginTop: "30px" }}>Top Gainers (24h)</h3>
      {topGainers.map((c) => (
        <p key={c.id} style={{ color: "#16c784" }}>
          {c.name}: {c.price_change_percentage_24h.toFixed(2)}%
        </p>
      ))}

      <h3 style={{ marginTop: "20px" }}>Top Losers (24h)</h3>
      {topLosers.map((c) => (
        <p key={c.id} style={{ color: "#ea3943" }}>
          {c.name}: {c.price_change_percentage_24h.toFixed(2)}%
        </p>
      ))}

      <h3 style={{ marginTop: "20px" }}>High Volatility</h3>
      {highVolatility.map((c) => (
        <p key={c.id} style={{ color: "#f3c623" }}>
          {c.name}: {c.price_change_percentage_24h.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}
