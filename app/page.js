"use client";

import useCryptoPrices from "./hooks/useCryptoPrices";
import PriceCard from "./components/PriceCard";

export default function Page() {
  const { data, loading, error } = useCryptoPrices();

  if (loading) return <p style={{ padding: 20 }}>Cargando precios...</p>;
  if (error) return <p style={{ padding: 20 }}>Error al cargar precios</p>;

  const coins = [
    { key: "BTC", name: "Bitcoin (BTC)" },
    { key: "ETH", name: "Ethereum (ETH)" },
    { key: "SOL", name: "Solana (SOL)" },
    { key: "BNB", name: "Binance Coin (BNB)" },
    { key: "XRP", name: "XRP (XRP)" },
    { key: "ADA", name: "Cardano (ADA)" },
    { key: "DOGE", name: "Dogecoin (DOGE)" },
    { key: "AVAX", name: "Avalanche (AVAX)" },
    { key: "DOT", name: "Polkadot (DOT)" },
    { key: "TRX", name: "Tron (TRX)" }
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
          gap: "20px"
        }}
      >
        {coins.map((c) => (
          <PriceCard
            key={c.key}
            title={c.name}
            price={data[c.key].usd}
            change={data[c.key].usd_24h_change}
            marketCap={data[c.key].usd_market_cap}
          />
        ))}
      </div>
    </div>
  );
}

