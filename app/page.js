"use client";

import { useEffect, useState } from "react";

// IMPORTS
import PriceCard from "./components/PriceCard";
import BigChart from "./components/BigChart";
import MarketTable from "./components/MarketTable";
import AssetInfo from "./components/AssetInfo";
import NewsPanel from "./components/NewsPanel";

import useCryptoPrices from "./hooks/useCryptoPrices";
import useMarketData from "./hooks/useMarketData";
import useSearch from "./hooks/useSearch";

export default function Home() {
  const { prices, loading } = useCryptoPrices();
  const { market, loading: marketLoading } = useMarketData();
  const { results, loading: searchLoading, search } = useSearch();

  // ESTADOS PRINCIPALES
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [candles, setCandles] = useState([]);

  // ESTADOS PARA INTERVALO Y DÍAS
  const [interval, setInterval] = useState("1h");
  const [days, setDays] = useState(1);

  // PRECIO EN TIEMPO REAL
  const [livePrice, setLivePrice] = useState(null);

  // ESTADO DEL BUSCADOR
  const [query, setQuery] = useState("");

  // ESTADO PARA INFO DEL ACTIVO
  const [assetInfo, setAssetInfo] = useState(null);

  // ESTADO PARA NOTICIAS
  const [news, setNews] = useState([]);

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

  // INFO DEL ACTIVO (PASO 6)
  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await fetch(`/api/crypto/info?symbol=${selectedSymbol}`);
        const data = await res.json();
        setAssetInfo(data);
      } catch (error) {
        console.error("Error loading asset info:", error);
      }
    }

    loadInfo();
  }, [selectedSymbol]);

  // NOTICIAS DEL ACTIVO (PASO 7)
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch(`/api/crypto/news?symbol=${selectedSymbol}`);
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error loading news:", error);
      }
    }

    loadNews();
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
                  market_cap: info.usd_market_cap,
                  change_24h: info.usd_24h_change,
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* BUSCADOR */}
      <div style={{ marginTop: "30px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar BTC, ETH, SOL..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        />

        {/* RESULTADOS DEL BUSCADOR */}
        {query.length > 1 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              marginTop: "5px",
              borderRadius: "6px",
              padding: "10px",
            }}
          >
            {searchLoading ? (
              <p>Buscando...</p>
            ) : results.length === 0 ? (
              <p>No se encontraron resultados</p>
            ) : (
              results.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => {
                    setSelectedSymbol(coin.symbol + "USDT");
                    setQuery("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <img src={coin.image} width={24} height={24} />
                  <span>
                    {coin.name} ({coin.symbol})
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* PANEL DE MERCADO */}
      <h2 style={{ marginTop: "40px" }}>Market Overview</h2>

      {marketLoading ? (
        <p>Cargando mercado...</p>
      ) : (
        <MarketTable data={market} onSelect={setSelectedSymbol} />
      )}

      {/* GRÁFICO GRANDE */}
      <h2 style={{ marginTop: "40px" }}>
        {selectedSymbol} – Candlestick Chart ({interval}, {days}D)
      </h2>

      {/* PRECIO EN TIEMPO REAL */}
      <h3 style={{ marginTop: "10px", color: "#16c784" }}>
        Precio actual: {livePrice ? livePrice.toLocaleString() : "Cargando..."}
      </h3>

      {/* BOTONES DE INTERVALOS */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setInterval("5m")}>5m</button>
        <button onClick={() => setInterval("15m")}>15m</button>
        <button onClick={() => setInterval("1h")}>1h</button>
        <button onClick={() => setInterval("4h")}>4h</button>
      </div>

      {/* BOTONES DE DÍAS */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setDays(1)}>1D</button>
        <button onClick={() => setDays(7)}>7D</button>
        <button onClick={() => setDays(30)}>30D</button>
        <button onClick={() => setDays(90)}>90D</button>
        <button onClick={() => setDays(365)}>1Y</button>
      </div>

      {/* GRÁFICO */}
      <BigChart data={Array.isArray(candles) ? candles : []} />

      {/* PANEL DE INFORMACIÓN DEL ACTIVO */}
      <AssetInfo info={assetInfo} />

      {/* PANEL DE NOTICIAS */}
      <NewsPanel news={news} />
    </div>
  );
}
