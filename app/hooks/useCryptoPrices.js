"use client";

import { useEffect, useState } from "react";

export default function useCryptoPrices(refreshInterval = 5000) {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchPrices() {
    try {
      const res = await fetch("/api/crypto/prices", {
        cache: "no-store" // 🔥 DESACTIVA CACHÉ PARA QUE SIEMPRE LLEGUE DATA FRESCA
      });

      const json = await res.json();
      setPrices(json);
      setError(false);
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices(); // primera carga

    const interval = setInterval(fetchPrices, refreshInterval);

    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
}
