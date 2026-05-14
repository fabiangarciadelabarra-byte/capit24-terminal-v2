"use client"; 

import useCryptoPrices from "./hooks/useCryptoPrices";
import PriceCard from "./components/PriceCard";

export default function Page() {
  const { data, loading, error } = useCryptoPrices();

  if (loading) return <p style={{ padding: 20 }}>Cargando precios...</p>;
  if (error) return <p style={{ padding: 20 }}>Error al cargar precios</p>;

  const coins = [
    { key: "BTC", name: "Bitcoin (BTC)", api: "bitcoin" },
    { key: "ETH", name: "Ethereum (ETH)", api: "ethereum" },
    { key: "SOL", name: "Solana (SOL)", api: "solana" },
    { key: "BNB", name: "Binance Coin (BNB)", api: "binancecoin" },
    { key: "XRP", name: "XRP (XRP)", api: "ripple" },
    { key: "ADA", name: "Cardano (ADA)", api: "cardano" },
    { key: "DOGE", name: "Dogecoin (DOGE)", api: "dogecoin" },
    { key: "AVAX", name: "Avalanche (AVAX)", api: "avalanche-2" },
    { key: "DOT", name: "Polkadot (DOT)", api: "polkadot" },
    { key: "TRX", name: "Tron (TRX)", api: "tron" },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Capit24 Terminal — Market Overview
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {coins.map((c) => (
          <PriceCard
            key={c.key}
            title={c.name}
            price={data[c.key].usd}
            change={data[c.key].usd_24h_change}
            marketCap={data[c.key].usd_market_cap}
            coinId={c.api}
          />
        ))}
      </div>
    </div>
  );
}
