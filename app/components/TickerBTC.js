"use client";

import { useBinanceWS } from "../hooks/useBinanceWS";

export default function TickerBTC() {
  const ticker = useBinanceWS("btcusdt@ticker");

  if (!ticker) return <div>Cargando precio...</div>;

  return (
    <div>
      <h3>Precio BTCUSDT</h3>
      <p>Actual: {ticker.c}</p>
      <p>Cambio 24h: {ticker.P}%</p>
      <p>Máximo: {ticker.h}</p>
      <p>Mínimo: {ticker.l}</p>
    </div>
  );
}
