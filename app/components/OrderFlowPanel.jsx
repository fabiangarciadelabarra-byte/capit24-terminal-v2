"use client";

export default function OrderFlowPanel({ candles }) {
  if (!Array.isArray(candles) || candles.length === 0) return null;

  // Asegurar que cada vela tenga valores válidos
  const safeCandles = candles.map((c) => ({
    open: Number(c.open ?? 0),
    close: Number(c.close ?? 0),
    volume: Number(c.volume ?? 0),
  }));

  // Volumen total
  const totalVolume = safeCandles.reduce((sum, c) => sum + c.volume, 0);

  // Evitar división por cero
  const safeTotal = totalVolume > 0 ? totalVolume : 1;

  // Volumen comprador (velas verdes)
  const buyVolume = safeCandles
    .filter((c) => c.close > c.open)
    .reduce((sum, c) => sum + c.volume, 0);

  // Volumen vendedor (velas rojas)
  const sellVolume = safeCandles
    .filter((c) => c.close < c.open)
    .reduce((sum, c) => sum + c.volume, 0);

  const buyPct = ((buyVolume / safeTotal) * 100).toFixed(1);
  const sellPct = ((sellVolume / safeTotal) * 100).toFixed(1);

  // Heatmap simple basado en volumen
  const maxVol = Math.max(...safeCandles.map((c) => c.volume), 1);

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
      <h2>Order Flow</h2>

      <p style={{ marginTop: "10px" }}>
        <strong>Volumen total:</strong> {totalVolume.toLocaleString()}
      </p>

      <p style={{ color: "#16c784" }}>
        <strong>Buy Volume:</strong> {buyVolume.toLocaleString()} ({buyPct}%)
      </p>

      <p style={{ color: "#ea3943" }}>
        <strong>Sell Volume:</strong> {sellVolume.toLocaleString()} ({sellPct}%)
      </p>

      <h3 style={{ marginTop: "20px" }}>Heatmap de Volumen</h3>

      <div
        style={{
          display: "flex",
          gap: "4px",
          marginTop: "10px",
          overflowX: "auto",
        }}
      >
        {safeCandles.map((c, i) => {
          const intensity = c.volume / maxVol;
          const safeIntensity = isFinite(intensity) ? intensity : 0;

          const color = `rgba(255, 165, 0, ${safeIntensity})`;

          return (
            <div
              key={i}
              style={{
                width: "10px",
                height: "40px",
                background: color,
                borderRadius: "3px",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
