"use client";

export default function TimeframeSelector({ timeframe, setTimeframe }) {
  const frames = ["1m", "5m", "15m", "1h"];

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      {frames.map((f) => (
        <button
          key={f}
          onClick={() => setTimeframe(f)}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: timeframe === f ? "#000" : "#fff",
            color: timeframe === f ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
