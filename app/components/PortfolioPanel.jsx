"use client";

import { useEffect, useState } from "react";

export default function PortfolioPanel({ market }) {
  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState("BTC");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Cargar trades desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_trades");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  // Guardar trades
  const saveTrades = (newTrades) => {
    setTrades(newTrades);
    localStorage.setItem("portfolio_trades", JSON.stringify(newTrades));
  };

  // Agregar operación
  const addTrade = () => {
    if (!symbol || !price || !amount) return;

    const newTrade = {
      symbol,
      price: Number(price),
      amount: Number(amount),
      date: date || new Date().toISOString(),
    };

    const updated = [...trades, newTrade];
    saveTrades(updated);

    setPrice("");
    setAmount("");
    setDate("");
  };

  // Calcular posiciones
  const positions = trades.reduce((acc, t) => {
    if (!acc[t.symbol]) {
      acc[t.symbol] = { amount: 0, totalCost: 0 };
    }
    acc[t.symbol].amount += t.amount;
    acc[t.symbol].totalCost += t.amount * t.price;
    return acc;
  }, {});

  // Convertir a array con cálculos
  const rows = Object.keys(positions).map((sym) => {
    const pos = positions[sym];
    const avg = pos.totalCost / pos.amount;

    const marketCoin = market.find(
      (c) => c.symbol.toUpperCase() === sym.toUpperCase()
    );

    const current = marketCoin?.current_price ?? 0;
    const pnl = (current - avg) * pos.amount;
    const pnlPct = ((current - avg) / avg) * 100;

    return {
      symbol: sym,
      amount: pos.amount,
      avg,
      current,
      pnl,
      pnlPct,
    };
  });

  return (
    <div style={{ marginTop: "40px", padding: "20px", background: "#111", borderRadius: "10px" }}>
      <h2>Portfolio Tracker</h2>

      {/* FORMULARIO */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Símbolo (BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          style={{ padding: "6px", background: "#222", color: "white" }}
        />
        <input
          placeholder="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "6px", background: "#222", color: "white" }}
        />
        <input
          placeholder="Cantidad"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "6px", background: "#222", color: "white" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "6px", background: "#222", color: "white" }}
        />
        <button onClick={addTrade} style={{ padding: "6px 12px" }}>
          Agregar
        </button>
      </div>

      {/* TABLA */}
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Cantidad</th>
            <th>Precio Promedio</th>
            <th>Precio Actual</th>
            <th>PNL</th>
            <th>PNL %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.symbol}>
              <td>{r.symbol}</td>
              <td>{r.amount}</td>
              <td>${r.avg.toLocaleString()}</td>
              <td>${r.current.toLocaleString()}</td>
              <td style={{ color: r.pnl >= 0 ? "#16c784" : "#ea3943" }}>
                ${r.pnl.toLocaleString()}
              </td>
              <td style={{ color: r.pnlPct >= 0 ? "#16c784" : "#ea3943" }}>
                {r.pnlPct.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
