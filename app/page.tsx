"use client";

import { useEffect, useState } from "react";
import PriceCard from "./components/PriceCard";
import MarketTable from "./components/MarketTable";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [market, setMarket] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC");

  // Fetch Market Data
  useEffect(() => {
    fetch("/api/crypto/market")
      .then((res) => res.json())
      .then((data) => setMarket(data));
  }, []);

  // Obtener la cripto seleccionada
  const selectedCoin = market.find(
    (c) => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Capit24 Terminal
      </h1>

      {/* SEARCH BAR */}
      <SearchBar
        data={market}
        onSelect={(symbol: string) => {
          setSelectedSymbol(symbol.replace("USDT", ""));
        }}
      />

      {/* PRICE CARD */}
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
          onSelect={(symbol: string) => {
            setSelectedSymbol(symbol.replace("USDT", ""));
          }}
          toggle={() => {}}
          watchlist={[]}
        />
      </div>
    </div>
  );
}
