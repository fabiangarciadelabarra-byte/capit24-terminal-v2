"use client";

import { useEffect, useState } from "react";

// IMPORTS
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import MarketTable from "./components/MarketTable";

import useCryptoPrices from "./hooks/useCryptoPrices";
import useMarketData from "./hooks/useMarketData";

export default function Home() {
  const { prices, loading } = useCryptoPrices();
  const { market, loading: marketLoading } = useMarketData();

  // ESTADOS PRINCIPALES
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [candles, setCandles] = useState([]);

  // ESTADOS PARA INTERVALO Y DÍAS
  const [interval, setInterval] = useState("1h");
  const [days, setDays] = useState(1);

  // PRECIO EN TIEMPO REAL
  const [livePrice, setLivePrice] = useState(null);

  // FETCH DE VELAS
  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(
          `/api/crypto/history?symbol=${selectedSymbol}&interval=${interval}&days=${days}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setCandles(data);
        } else {
          setCandles([]);
        }
      } catch (error) {
        console.error("Error fetching candles:", error);
        setCandles([]);
      }
    }

    fetchCandles();
  }, [selectedSymbol, interval, days]);

  // PRECIO EN TIEMPO REAL (cada 5 segundos)
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`/api/crypto/price?symbol=${selectedSymbol}`);
        const data = await res.json();
        setLivePrice(data.price);
      } catch (error) {
        console.error("Error fetching live price:", error);
      }
    }

    fetchPrice(); // llamada inicial
    const intervalId = setInterval(fetchPrice, 5000); // cada 5s

    return () => clearInterval(intervalId);
  }, [selectedSymbol]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Capit24 Terminal</h1>

      {/* TARJETAS DE PRECIOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {loading || !prices ? (
          <p>Cargando precios...</p>
        ) : (
          Object.entries(prices).map(([symbol, info]) => (
            <div
              key={symbol}
              onClick={() => setSelectedSymbol(symbol + "USDT")}
              style={{ cursor: "pointer" }}
            >
              <PriceCard
                data={{
                  symbol,
                  price: info.usd,
                  market_cap: info
