"use client";

export default function MarketTable({ data, onSelect, toggle, watchlist }) {
  if (!data || data.length === 0) return <p>No market data available.</p>;

  return (
    <table
      style={{
        width: "100%",
        marginTop: "20px",
        borderCollapse: "collapse",
        color: "white",
      }}
    >
      <thead>
        <tr style={{ background: "#222" }}>
          <th style={{ padding: "10px" }}>★</th>
          <th style={{ padding: "10px" }}>Rank</th>
          <th style={{ padding: "10px" }}>Coin</th>
          <th style={{ padding: "10px" }}>Price</th>
          <th style={{ padding: "10px" }}>24h</th>
          <th style={{ padding: "10px" }}>Market Cap</th>
          <th style={{ padding: "10px" }}>Volume</th>
        </tr>
      </thead>

      <tbody>
        {data.map((coin) => {
          const symbol = coin.symbol.toUpperCase() + "USDT";
          const isFav = watchlist.includes(symbol);

          return (
            <tr
              key={coin.id}
              onClick={() => onSelect(symbol)}
              style={{
                cursor: "pointer",
                background: "#111",
                borderBottom: "1px solid #333",
              }}
            >
              {/* ⭐ FAVORITO */}
              <td
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(symbol);
                }}
                style={{
                  padding: "10px",
                  fontSize: "20px",
                  color: isFav ? "gold" : "#555",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                ★
              </td>

              <td style={{ padding: "10px" }}>{coin.market_cap_rank}</td>

              <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={coin.image} width={24} height={24} />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>

              <td style={{ padding: "10px" }}>
                ${coin.current_price.toLocaleString()}
              </td>

              <td
                style={{
                  padding: "10px",
                  color: coin.price_change_percentage_24h >= 0 ? "green" : "red",
                }}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>

              <td style={{ padding: "10px" }}>
                ${coin.market_cap.toLocaleString()}
              </td>

              <td style={{ padding: "10px" }}>
                ${coin.total_volume.toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
