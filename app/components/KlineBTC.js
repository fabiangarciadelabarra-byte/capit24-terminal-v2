"use client";

import { useBinanceWS } from "../hooks/useBinanceWS";
import { useChartSettings } from "../hooks/useChartSettings";

export default function KlineBTC() {
  const { symbol, timeframe } = useChartSettings();

  // Stream dinámico según símbolo y timeframe
  const stream = `${symbol.toLowerCase()}@kline_${timeframe}`;
  const msg = useBinanceWS(stream);

  if (!msg) return <div>Cargando vela...</div>;

  const k = msg.k;

  return (
    <div>
      <h3>Vela {timeframe}</h3>
      <p>Open: {k.o}</p>
      <p>High: {k.h}</p>
      <p>Low: {k.l}</p>
      <p>Close: {k.c}</p>
      <p>Volumen: {k.v}</p>
      <p>Cerrada: {k.x ? "Sí" : "No"}</p>
    </div>
  );
}
