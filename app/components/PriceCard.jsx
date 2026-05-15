"use client";

export default function PriceCard({ data, toggle, watchlist }) {
  if (!data) return null;

  const {
    symbol,
    price = 0,
    market_cap = 0,
    change_24h = 0
  } = data;

  const formattedPrice = Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });

  const formattedMarketCap = Number(market_cap).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const formattedChange = Number(change_24h).toFixed(2);

  const changeColor = change_24h >= 0 ? "green" : "red";

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
