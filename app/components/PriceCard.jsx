"use client";

export default function PriceCard({ data, toggle, watchlist }) {
  if (!data) return null;

  const {
    symbol = "-",
    price,
    market_cap,
    change_24h
  } = data;

  // Valores seguros
  const safePrice = Number(price ?? 0);
  const safeMarketCap = Number(market_cap ?? 0);
  const safeChange = Number(change_24h ?? 0);

  const formattedPrice = safePrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });

  const formattedMarketCap = safeMarketCap.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const formattedChange = safeChange.toFixed(2);

  const changeColor = safeChange >= 0 ? "green" : "red";

  return (
    <div
      style={{
        position: "relative",
        padding: "20px",
        borderRadius: "10px",
        background: "#111",
        color: "white",
        border: "1px solid #333",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
    >
      {/* ⭐ BOTÓN DE FAVORITO */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle(symbol + "USDT");
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          color: watchlist.includes(symbol + "USDT") ? "gold" : "#555",
        }}
      >
        ★
      </button>

      <h2>{symbol}</h2>

      <p style={{ fontSize: "22px", margin: "10px 0" }}>
        {formattedPrice}
      </p>

      <p style={{ margin: "5px 0" }}>
        Market Cap: {formattedMarketCap}
      </p>

      <p style={{ margin: "5px 0", color: changeColor }}>
        24h: {formattedChange}%
      </p>
    </div>
  );
}
