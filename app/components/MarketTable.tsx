"use client";

import { useEffect, useState } from "react";

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  rank: number;
  image: string;
}

interface Props {
  data: CoinData[];
  onSelect: (symbol: string) => void;
  toggle: (symbol: string) => void;
  watchlist: string[];
}

export default function MarketTable({ data, onSelect, toggle, watchlist }: Props) {
  const [realtime, setRealtime] = useState<Record<string, any>>({});
  const [previous, setPrevious] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState<Record<string, "up" | "down" | null>>({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const updatePrices = async () => {
      const results: Record<string, any> = {};
      const prevCopy = { ...previous };
      const flashCopy = { ...flash };

      for (const coin of data) {
        const symbol = coin.symbol.replace("USDT", "");

        try {
          const res = await fetch(`/api/quote?symbol=${symbol}`);
          const json = await res.json();
          results[symbol] = json;

          if (json?.c) {
            const oldPrice = prevCopy[symbol];
            const newPrice = json.c;

            if (oldPrice) {
              if (newPrice > oldPrice) flashCopy[symbol] = "up";
              if (newPrice < oldPrice) flashCopy[symbol] = "down";
            }

            prevCopy[symbol] = newPrice;

            // limpiar animación después de 600ms
            setTimeout(() => {
              setFlash((f) => ({ ...f, [symbol]: null }));
            }, 600);
          }
        } catch (err) {
          console.error("Realtime price error:", symbol, err);
        }
      }

      setPrevious(prevCopy);
      setFlash(flashCopy);
      setRealtime(results);
    };

    updatePrices();

    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <>
      {/* Estilos de animación */}
      <style>
        {`
          .flash-up {
            background-color: rgba(0, 255, 0, 0.25);
            transition: background-color 0.6s ease;
          }
          .flash-down {
            background-color: rgba(255, 0, 0, 0.25);
            transition: background-color 0.6s ease;
          }
        `}
      </style>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr style={{ background: "#222" }}>
            <th style={{ padding: "10px" }}>★</th>
            <th style={{ padding: "10px" }}>Rank</th>
            <th style={{ padding: "10px" }}>Coin</th>
            <th style={{ padding: "10px" }}>Price</th>
            <th style={{ padding: "10px" }}>24h</th>
            <th style={{ padding: "10px" }}>Market Cap</th>
            <th style={{ padding: "10px" }}>Volume</th>
          </tr>
        </thead>

        <tbody>
          {data.map((coin) => {
            const symbol = coin.symbol.replace("USDT", "");
            const live = realtime[symbol];

            const price = live?.c
              ? live.c.toFixed(2)
              : coin.price.toFixed(2);

            const isFav = watchlist.includes(coin.symbol);

            const flashClass =
              flash[symbol] === "up"
                ? "flash-up"
                : flash[symbol] === "down"
                ? "flash-down"
                : "";

            return (
              <tr
                key={coin.symbol}
                onClick={() => onSelect(coin.symbol)}
                style={{
                  cursor: "pointer",
                  background: "#111",
                  borderBottom: "1px solid #333",
                }}
              >
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(coin.symbol);
                  }}
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    color: isFav ? "gold" : "#555",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  ★
                </td>

                <td style={{ padding: "10px" }}>{coin.rank}</td>

                <td
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img src={coin.image} width={24} height={24} />
                  {coin.name} ({coin.symbol})
                </td>

                <td className={flashClass} style={{ padding: "10px" }}>
                  ${price}
                </td>

                <td
                  style={{
                    padding: "10px",
                    color: coin.change_24h >= 0 ? "green" : "red",
                  }}
                >
                  {coin.change_24h.toFixed(2)}%
                </td>

                <td style={{ padding: "10px" }}>
                  ${coin.market_cap.toLocaleString()}
                </td>

                <td style={{ padding: "10px" }}>
                  ${coin.volume_24h.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
