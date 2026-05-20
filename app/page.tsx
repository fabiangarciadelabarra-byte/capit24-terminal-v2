"use client";

import { useEffect, useState } from "react";
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import MarketTable from "./components/MarketTable";
import OrderFlowPanel from "./components/OrderFlowPanel";
import LiquidityMapPanel from "./components/LiquidityMapPanel";
import ScreenerPanel from "./components/ScreenerPanel";
import SentimentPanel from "./components/SentimentPanel";

export default function Home() {
  const [market, setMarket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeNumber = (v: any) =>
    typeof v === "number" ? v.toLocaleString() : "—";

  const safePercent = (v: any) =>
    typeof v === "number" ? v.toFixed(2) + "%" : "—";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/market");
        const data = await res.json();

        if (Array.isArray(data)) {
          setMarket(data);
        } else {
          setMarket([]);
        }
      } catch (err) {
        console.error("Error cargando mercado:", err);
        setMarket([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        Cargando datos del mercado…
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>CAPIT24 Terminal</h1>

      {/* CARDS PRINCIPALES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {market.slice(0, 4).map((coin: any) => (
          <PriceCard
            key={coin.id}
            data={coin}
            toggle={() => {}}
            watchlist={false}
          />
        ))}
      </div>

      {/* CHART PRINCIPAL */}
      <div style={{ marginTop: "40px" }}>
        <BigChart data={market} />
      </div>

      {/* TABLA DE MERCADO */}
      <div style={{ marginTop: "40px" }}>
        <MarketTable data={market} />
      </div>

      {/* ORDER FLOW */}
      <div style={{ marginTop: "40px" }}>
        <OrderFlowPanel data={market} />
      </div>

      {/* LIQUIDITY MAP */}
      <div style={{ marginTop: "40px" }}>
        <LiquidityMapPanel data={market} />
      </div>

      {/* SCREENER */}
      <div style={{ marginTop: "40px" }}>
        <ScreenerPanel data={market} />
      </div>

      {/* SENTIMENT */}
      <div style={{ marginTop: "40px" }}>
        <SentimentPanel data={market} />
      </div>
    </div>
  );
}


