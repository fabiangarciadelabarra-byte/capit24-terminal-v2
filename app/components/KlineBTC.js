"use client";

import { useBinanceWS } from "../hooks/useBinanceWS";

export default function KlineBTC() {
  const msg = useBinanceWS("btcusdt@kline_1m");

  if (!msg) return <div>Cargando vela...</div>;

  const k = msg.k;

  return (
    <div>
      <h3>Vela 1m</h3>
      <p>Open: {k.o}</p>
      <p>High: {k.h}</p>
      <p>Low: {k.l}</p>
      <p>Close: {k.c}</p>
      <p>Volumen: {k.v}</p>
      <p>Cerrada: {k.x ? "Sí" : "No"}</p>
    </div>
  );
}
