"use client";

import { useState, useEffect } from "react";
import Chart from "./components/Chart";

export default function Page() {
  const [market, setMarket] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");

  // Obtener datos del mercado
  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await fetch("/api/market");
        const data = await res.json();
        setMarket(data);
      } catch (error) {
        console.error("Error fetching market:", error);
      }
    }

    fetchMarket();
  }, []);

  // Obtener la cripto seleccionada (FIX aplicado)
  const selectedCoin = market.find(
    (c: any) => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Capit24 Terminal</h1>

      {/* Selector de símbolo */}
      <select
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        {market.map((coin: any) => (
          <option key={coin.symbol} value={coin.symbol}>
            {coin.symbol}
          </option>
        ))}
      </select>

      {/* Chart */}
      {selectedCoin && (
        <Chart data={selectedCoin.history} />
      )}
    </div>
  );
}
