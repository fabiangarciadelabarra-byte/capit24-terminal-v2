"use client";

export default function LiquidityMapPanel({ candles }) {
  if (!candles || candles.length === 0) return null;

  // Extraer precios relevantes
  const levels = candles.flatMap((c) => [
    Number(c.high),
    Number(c.low),
    Number(c.open),
    Number(c.close),
  ]);

  // Agrupar niveles cercanos (±0.3%)
  const grouped = [];
  const threshold = 0.003; // 0.3%

  levels.forEach((price) => {
    const existing = grouped.find((g) => Math.abs(g.level - price) / price < threshold);
    if (existing) {
      existing.touches++;
    } else {
      grouped.push({ level: price, touches: 1 });
    }
  });

  // Ordenar por número de toques
  const sorted = grouped.sort((a, b) => b.touches - a.touches);

  // Tomar los 12 niveles más relevantes
  const topLevels = sorted.slice(0, 12);

  const maxTouches = Math.max(...topLevels.map((l) => l.touches));

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
      <h2>Liquidity Map</h2>

      <p style={{ marginTop: "10px" }}>
        Zonas donde el precio ha interactuado repetidamente (soportes y resistencias).
      </p>

      <div style={{ marginTop: "20px" }}>
        {topLevels.map((lvl, i) => {
          const intensity = lvl.touches / maxTouches;
          const color = `rgba(0, 150, 255, ${intensity})`;

          return (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                padding: "8px",
                background: "#222",
                borderRadius: "6px",
                borderLeft: `6px solid ${color}`,
              }}
            >
              <strong>{lvl.level.toLocaleString()}</strong> — {lvl.touches} toques
            </div>
          );
        })}
      </div>
    </div>
  );
}
