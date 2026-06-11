"use client";

import { useEffect, useState } from "react";
import PriceCard from "./components/PriceCard";
import MarketTable from "./components/MarketTable";
import BigChart from "./components/BigChart";
import OrderFlowPanel from "./components/OrderFlowPanel";
import LiquidityMapPanel from "./components/LiquidityMapPanel";
import SentimentPanel from "./components/SentimentPanel";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [market, setMarket] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC"); // ⭐ NUEVO
  const [candles, setCandles] = useState<any[]>([]);
  const [orderflow, setOrderflow] = useState<any>(null);
  const [liquidity, setLiquidity] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);

  // Fetch Market Data
  useEffect(() => {
    fetch("/api/crypto/market")
      .then((res) => res.json())
      .then((data) => setMarket(data));
  }, []);

  // ⭐ Obtener la cripto seleccionada
  const selectedCoin = market.find(
    (c) => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Capit24 Terminal
      </h1>

      {/* ⭐ SEARCH BAR */}
      <SearchBar
        data={market}
        onSelect={(symbol) => {
          setSelectedSymbol(symbol.replace("USDT", "")); // Guardamos solo BTC, ETH, SOL...
        }}
      />

      {/* ⭐ PRICE CARD DINÁMICO */}
      <div style={{ marginTop: "20px" }}>
        {selectedCoin && (
          <PriceCard
            data={selectedCoin}
            toggle={() => {}}
            watchlist={[]}
          />
        )}
      </div>

      {/* MARKET TABLE */}
      <div style={{ marginTop: "40px" }}>
        <MarketTable
          data={market}
          onSelect={(symbol) => {
            setSelectedSymbol(symbol.replace("USDT", ""));
          }}
          toggle={() => {}}
          watchlist={[]}
        />
      </div>

      {/* BIG CHART (lo dejaremos aunque no tenga datos aún) */}
      <div style={{ marginTop: "40px" }}>
        <BigChart data={candles} />
      </div>

      {/* ORDER FLOW */}
      <div style={{ marginTop: "40px" }}>
        {orderflow && <OrderFlowPanel candles={orderflow} />}
      </div>

      {/* LIQUIDITY MAP */}
      <div style={{ marginTop: "40px" }}>
        {liquidity && <LiquidityMapPanel candles={liquidity} />}
      </div>

      {/* SENTIMENT PANEL */}
      <div style={{ marginTop: "40px" }}>
        {sentiment && <SentimentPanel sentiment={sentiment} />}
      </div>
    </div>
  );
}
