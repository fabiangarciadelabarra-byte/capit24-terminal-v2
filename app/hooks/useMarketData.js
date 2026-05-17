"use client";

import { useEffect, useState } from "react";

export default function useMarketData() {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarket() {
      try {
        const res = await fetch("/api/crypto/market");
        const data = await res.json();
        setMarket(data);
      } catch (error) {
        console.error("Error loading market data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMarket();
  }, []);

  return { market, loading };
}
