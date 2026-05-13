"use client";

import { useEffect, useState } from "react";

export default function useCryptoPrices(refreshInterval = 5000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchPrices() {
    try {
      const res = await fetch("/api/crypto/prices");
      const json = await res.json();
      setData(json);
      setError(false);
    } catch (err) {
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

  return { data, loading, error };
}
