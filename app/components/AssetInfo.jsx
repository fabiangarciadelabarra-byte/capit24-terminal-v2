"use client";

export default function AssetInfo({ info }) {
  if (!info) return null;

  // Helper seguro para evitar crashes
  const safe = (value) =>
    value !== undefined && value !== null
      ? value.toLocaleString()
      : "N/A";

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
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img src={info.image} width={50} height={50} />
        <h2>
          {info.name} ({info.symbol})
        </h2>
      </div>

      <p>Rank: #{info.rank || "N/A"}</p>
      <p>Market Cap: ${safe(info.market_cap)}</p>
      <p>Circulating Supply: {safe(info.circulating_supply)}</p>
      <p>Total Supply: {safe(info.total_supply)}</p>
      <p>ATH: ${safe(info.ath)}</p>

      <p>
        ATH Date:{" "}
        {info.ath_date
          ? new Date(info.ath_date).toLocaleDateString()
          : "N/A"}
      </p>

      <h3 style={{ marginTop: "20px" }}>Descripción</h3>
      <p style={{ opacity: 0.8 }}>
        {info.description
          ? info.description.slice(0, 500)
          : "Sin descripción disponible."}
        ...
      </p>
    </div>
  );
}
