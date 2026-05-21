"use client";

export default function SymbolSelector({ symbol, setSymbol }) {
  const symbols = ["btcusdt", "ethusdt", "solusdt", "bnbusdt"];

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      {symbols.map((s) => (
        <button
          key={s}
          onClick={() => setSymbol(s)}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: symbol === s ? "#000" : "#fff",
            color: symbol === s ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {s.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
