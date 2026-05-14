"use client";

import useCryptoPrice from "@/hooks/useCryptoPrice";
import PriceCard from "@/components/PriceCard";
import BigChart from "@/components/BigChart";

export default function Page() {
  const { data, loading, error } = useCryptoPrice();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const coins = [
    { key: "BTC" },
    { key: "ETH" },
    { key: "SOL" },
    { key: "BNB" },
    { key: "XRP" },
    { key: "ADA" },
    { key: "DOGE" },
    { key: "AVAX" },
    { key: "DOT" },
    { key: "TRX" },
  ];

  // Datos de velas (temporal, luego lo conectamos a API real)
  const candles = [
    { time: "2024-05-01", open: 62000, high: 63000, low: 61000, close: 62500 },
    { time: "2024-05-02", open: 62500, high: 64000, low: 62000, close: 63800 },
    { time: "2024-05-03", open: 63800, high: 64500, low: 63000, close: 63200 },
    { time: "2024-05-04", open: 63200, high: 63500, low: 62000, close: 62200 },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Capit24 Terminal – Dashboard
      </h1>

      {/* Tarjetas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {coins.map((coin) => (
          <PriceCard key={coin.key} symbol={coin.key} data={data} />
        ))}
      </div>

      {/* Gráfico grande */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          BTC/USDT – Candlestick
        </h2>
        <BigChart data={candles} />
      </div>
    </div>
  );
}
