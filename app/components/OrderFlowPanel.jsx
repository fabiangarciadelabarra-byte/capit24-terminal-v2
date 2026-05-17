"use client";

export default function OrderFlowPanel({ candles }) {
  if (!candles || candles.length === 0) return null;

  // Volumen total
  const totalVolume = candles.reduce((sum, c) => sum + Number(c.volume || 0), 0);

  // Volumen comprador (velas verdes)
  const buyVolume = candles
    .filter((c) => Number(c.close) > Number(c.open))
    .reduce((sum, c) => sum + Number(c.volume || 0), 0);

  // Volumen vendedor (velas rojas)
  const sellVolume = candles
    .filter((c) => Number(c.close) < Number(c.open))
    .reduce((sum, c) => sum + Number(c.volume || 0), 0);

  const buyPct = ((buyVolume / totalVolume) * 100).toFixed(1);
  const sellPct = ((sellVolume / totalVolume) * 100).toFixed(1);

  // Heatmap simple basado en volumen
  const maxVol = Math.max(...candles.map((c) => Number(c.volume || 0)));

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
        {candles.map((c, i) => {
          const intensity = Number(c.volume) / maxVol;
          const color = `rgba(255, 165, 0, ${intensity})`; // naranja

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
