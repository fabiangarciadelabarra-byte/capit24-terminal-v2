"use client";

export default function MarketTable({ data, onSelect }) {
  return (
    <table
      style={{
        width: "100%",
        marginTop: "40px",
        borderCollapse: "collapse",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
          <th>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>24h</th>
          <th>Market Cap</th>
          <th>Volume</th>
        </tr>
      </thead>

      <tbody>
        {data.map((coin) => (
          <tr
            key={coin.symbol}
            onClick={() => onSelect(coin.symbol.toUpperCase() + "USDT")}
            style={{
              cursor: "pointer",
              borderBottom: "1px solid #222",
              height: "50px",
            }}
          >
            <td>{coin.rank}</td>

            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={coin.image} width={24} height={24} />
              {coin.name} ({coin.symbol.toUpperCase()})
            </td>

            <td>${coin.price.toLocaleString()}</td>

            <td style={{ color: coin.change_24h >= 0 ? "#16c784" : "#ea3943" }}>
              {coin.change_24h?.toFixed(2)}%
            </td>

            <td>${coin.market_cap.toLocaleString()}</td>

            <td>${coin.volume_24h.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
