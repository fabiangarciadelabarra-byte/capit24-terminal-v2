"use client";

import { useState } from "react";

export default function ScreenerPanel({ market }) {
  if (!market || market.length === 0) return null;

  const [sortKey, setSortKey] = useState("market_cap");
  const [minVolume, setMinVolume] = useState(0);
  const [minChange, setMinChange] = useState(-100);

  // Función segura para formatear números
  const safeNumber = (value) =>
    typeof value === "number" ? value.toLocaleString() : "—";

  const safePercent = (value) =>
    typeof value === "number" ? value.toFixed(2) + "%" : "—";

  // Filtrar datos válidos
  const filtered = market.filter((c) => {
    const vol = c?.total_volume ?? 0;
    const change = c?.price_change_percentage_24h ?? -999;

    return vol >= minVolume && change >= minChange;
  });

  // Ordenar con protección
  const sorted = [...filtered].sort((a, b) => {
    const A = a?.[sortKey] ?? -999999999;
    const B = b?.[sortKey] ?? -999999999;
    return B - A;
  });

  // Top Gainers
  const topGainers = [...market]
    .filter((c) => typeof c?.price_change_percentage_24h === "number")
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  // Top Losers
  const topLosers = [...market]
    .filter((c) => typeof c?.price_change_percentage_24h === "number")
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  // High Volatility
  const highVolatility = [...market]
    .filter((c) => typeof c?.price_change_percentage_24h === "number")
    .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
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
              {coin?.name ?? "—"} ({coin?.symbol?.toUpperCase() ?? "—"})
            </span>
            <span>${safeNumber(coin?.current_price)}</span>
            <span>{safePercent(coin?.price_change_percentage_24h)}</span>
            <span>Vol: {safeNumber(coin?.total_volume)}</span>
          </div>
        ))}
      </div>

      {/* TOP MOVERS */}
      <h3 style={{ marginTop: "30px" }}>Top Gainers (24h)</h3>
      {topGainers.map((c) => (
        <p key={c.id} style={{ color: "#16c784" }}>
          {c.name}: {safePercent(c.price_change_percentage_24h)}
        </p>
      ))}

      <h3 style={{ marginTop: "20px" }}>Top Losers (24h)</h3>
      {topLosers.map((c) => (
        <p key={c.id} style={{ color: "#ea3943" }}>
          {c.name}: {safePercent(c.price_change_percentage_24h)}
        </p>
      ))}

      <h3 style={{ marginTop: "20px" }}>High Volatility</h3>
      {highVolatility.map((c) => (
        <p key={c.id} style={{ color: "#f3c623" }}>
          {c.name}: {safePercent(c.price_change_percentage_24h)}
        </p>
      ))}
    </div>
  );
}
