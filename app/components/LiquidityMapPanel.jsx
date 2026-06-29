"use client";

export default function LiquidityMapPanel({ candles }) {
  if (!Array.isArray(candles) || candles.length === 0) return null;

  // Asegurar valores válidos
  const safeCandles = candles.map((c) => ({
    high: Number(c.high ?? 0),
    low: Number(c.low ?? 0),
    open: Number(c.open ?? 0),
    close: Number(c.close ?? 0),
  }));

  // Extraer precios relevantes
  const levels = safeCandles.flatMap((c) => [
    c.high,
    c.low,
    c.open,
    c.close,
  ]);

  // Filtrar NaN
  const cleanLevels = levels.filter((p) => Number.isFinite(p));

  if (cleanLevels.length === 0) return null;

  // Agrupar niveles cercanos (±0.3%)
  const grouped = [];
  const threshold = 0.003; // 0.3%

  cleanLevels.forEach((price) => {
    const existing = grouped.find(
      (g) =>
        price !== 0 &&
        Math.abs(g.level - price) / price < threshold
    );

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

  const maxTouches = Math.max(...topLevels.map((l) => l.touches), 1);

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
          const safeIntensity = isFinite(intensity) ? intensity : 0;

          return (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                padding: "8px",
                background: "#222",
                borderRadius: "6px",
                borderLeft: `6px solid rgba(0, 150, 255, ${safeIntensity})`,
              }}
            >
              <strong>
                {Number.isFinite(lvl.level)
                  ? lvl.level.toLocaleString()
                  : "-"}
              </strong>{" "}
              — {lvl.touches} toques
            </div>
          );
        })}
      </div>
    </div>
  );
}
