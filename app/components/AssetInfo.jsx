"use client";

export default function AssetInfo({ info }) {
  if (!info) return null;

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

      <p>Rank: #{info.rank}</p>
      <p>Market Cap: ${info.market_cap.toLocaleString()}</p>
      <p>Circulating Supply: {info.circulating_supply.toLocaleString()}</p>
      <p>Total Supply: {info.total_supply?.toLocaleString() || "N/A"}</p>
      <p>ATH: ${info.ath.toLocaleString()}</p>
      <p>ATH Date: {new Date(info.ath_date).toLocaleDateString()}</p>

      <h3 style={{ marginTop: "20px" }}>Descripción</h3>
      <p style={{ opacity: 0.8 }}>
        {info.description?.slice(0, 500) || "Sin descripción disponible."}...
      </p>
    </div>
  );
}
