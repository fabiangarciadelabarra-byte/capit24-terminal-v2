"use client";

import { useEffect, useState } from "react";

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function toggle(symbol) {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  }

  return { watchlist, toggle };
}
