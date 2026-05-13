"use client";

export default function PriceCard({ title, price, change, marketCap }) {
  const isPositive = change >= 0;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "#0d1117",
        border: "1px solid #1f2937",
        width: "260px",
        color: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)"
      }}
    >
      <h3 style={{ marginBottom: "10px", fontSize: "20px" }}>{title}</h3>

      <p style={{ fontSize: "28px", fontWeight: "bold" }}>
        ${price.toLocaleString()}
      </p>

      <p
        style={{
          color: isPositive ? "#16c784" : "#ea3943",
          fontWeight: "bold",
          marginTop: "5px"
        }}
      >
        {isPositive ? "▲" : "▼"} {change.toFixed(2)}%
      </p>

      <p style={{ marginTop: "10px", opacity: 0.7 }}>
        Market Cap: ${marketCap.toLocaleString()}
      </p>
    </div>
  );
}
