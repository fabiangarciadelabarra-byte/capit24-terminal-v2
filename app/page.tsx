"use client";

import { useEffect, useState } from "react";
import PriceCard from "./components/PriceCard";
import MarketTable from "./components/MarketTable";
import BigChart from "./components/BigChart";
import OrderFlowPanel from "./components/OrderFlowPanel";
import LiquidityMapPanel from "./components/LiquidityMapPanel";
import SentimentPanel from "./components/SentimentPanel";

export default function Home() {
  const [market, setMarket] = useState([]);
  const [candles, setCandles] = useState([]);
  const [orderflow, setOrderflow] = useState(null);
  const [liquidity, setLiquidity] = useState(null);
  const [sentiment, setSentiment] = useState(null);

  // Fetch Market Data
  useEffect(() => {
    fetch("/api/crypto/market")
      .then((res) => res.json())
      .then((data) => setMarket(data));
  }, []);

  // Fetch Candles
  useEffect(() => {
    fetch("/api/crypto/candles?symbol=BTCUSDT&interval=1h&limit=200")
      .then((res) => res.json())
      .then((data) => setCandles(data));
  }, []);

  // Fetch Orderflow
  useEffect(() => {
    fetch("/api/crypto/orderflow?symbol=BTCUSDT")
      .then((res) => res.json())
      .then((data) => setOrderflow(data));
  }, []);

  // Fetch Liquidity
  useEffect(() => {
    fetch("/api/crypto/liquidity?symbol=BTCUSDT")
      .then((res) => res.json())
      .then((data) => setLiquidity(data));
  }, []);

  // Fetch Sentiment
  useEffect(() => {
    fetch("/api/crypto/sentiment")
      .then((res) => res.json())
      .then((data) => setSentiment(data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Capit24 Terminal
      </h1>

      {/* PRICE CARD */}
      <div style={{ marginTop: "20px" }}>
        {market.length > 0 && <PriceCard data={market[0]} />}
      </div>

      {/* MARKET TABLE */}
      <div style={{ marginTop: "40px" }}>
        <MarketTable
          data={market}
          onSelect={() => {}}
          toggle={() => {}}
          watchlist={[]}
        />
      </div>

      {/* BIG CHART */}
      <div style={{ marginTop: "40px" }}>
        <BigChart data={candles} />
      </div>

      {/* ORDER FLOW */}
      <div style={{ marginTop: "40px" }}>
        {orderflow && <OrderFlowPanel data={orderflow} />}
      </div>

      {/* LIQUIDITY MAP */}
      <div style={{ marginTop: "40px" }}>
        {liquidity && <LiquidityMapPanel data={liquidity} />}
      </div>

      {/* SENTIMENT PANEL */}
      <div style={{ marginTop: "40px" }}>
        {sentiment && <SentimentPanel data={sentiment} />}
      </div>
    </div>
  );
}
