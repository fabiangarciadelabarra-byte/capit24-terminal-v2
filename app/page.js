"use client";

import useCryptoPrices from "./hooks/useCryptoPrices";
import PriceCard from "./components/PriceCard";

export default function Page() {
  const { data, loading, error } = useCryptoPrices();

  if (loading) return <p style={{ padding: 20 }}>Cargando precios...</p>;
  if (error) return <p style={{ padding: 20 }}>Error al cargar precios</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Capit24 Terminal — Market Overview
      </h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <PriceCard
          title="Bitcoin (BTC)"
          price={data.BTC.price}
          change={data.BTC.change24h}
          marketCap={data.BTC.marketCap}
        />

        <PriceCard
          title="Ethereum (ETH)"
          price={data.ETH.price}
          change={data.ETH.change24h}
          marketCap={data.ETH.marketCap}
        />
      </div>
    </div>
  );
}

