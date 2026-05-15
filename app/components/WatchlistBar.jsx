"use client";

export default function WatchlistBar({ watchlist, onSelect }) {
  if (!watchlist || watchlist.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        background: "#111",
        borderRadius: "10px",
        border: "1px solid #333",
        display: "flex",
        gap: "15px",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {watchlist.map((symbol) => (
        <div
          key={symbol}
          onClick={() => onSelect(symbol)}
          style={{
            padding: "10px 15px",
            background: "#222",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #444",
            fontSize: "14px",
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
}
