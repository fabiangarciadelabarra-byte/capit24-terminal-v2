"use client";

import { useBinanceWS } from "../hooks/useBinanceWS";

export default function OrderbookBTC() {
  const depth = useBinanceWS("btcusdt@depth");

  if (!depth) return <div>Cargando orderbook...</div>;

  const bids = depth.bids?.slice(0, 10) || [];
  const asks = depth.asks?.slice(0, 10) || [];

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <h3>Bids</h3>
        {bids.map(([p, q], i) => (
          <div key={i}>{p} — {q}</div>
        ))}
      </div>

      <div>
        <h3>Asks</h3>
        {asks.map(([p, q], i) => (
          <div key={i}>{p} — {q}</div>
        ))}
      </div>
    </div>
  );
}
