"use client";

import { useBinanceWS } from "../hooks/useBinanceWS";

export default function TradesBTC() {
  const trade = useBinanceWS("btcusdt@trade");

  if (!trade) return <div>Cargando trades...</div>;

  return (
    <div>
      <h3>Último trade</h3>
      <p>Precio: {trade.p}</p>
      <p>Cantidad: {trade.q}</p>
      <p>Side: {trade.m ? "Venta" : "Compra"}</p>
    </div>
  );
}
