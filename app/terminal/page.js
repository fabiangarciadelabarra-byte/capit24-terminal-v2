"use client";

import { useChartSettings } from "../hooks/useChartSettings";
import SymbolSelector from "../components/SymbolSelector";
import TimeframeSelector from "../components/TimeframeSelector";

import Chart from "../components/Chart";

import TickerBTC from "../components/TickerBTC";
import OrderbookBTC from "../components/OrderbookBTC";
import TradesBTC from "../components/TradesBTC";
// import KlineBTC from "../components/KlineBTC"; // REMOVIDO PARA QUE NO TAPE EL CHART

export default function TerminalPage() {
  const { symbol, timeframe, setSymbol, setTimeframe } = useChartSettings();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Capit24 Terminal - {symbol.toUpperCase()}</h1>

      <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />

      {/* CHART PRINCIPAL */}
      <Chart symbol={symbol} />

      {/* MÓDULOS DEL TERMINAL */}
      <TickerBTC />
      <OrderbookBTC />
      <TradesBTC />

      {/* KlineBTC removido temporalmente */}
      {/* <KlineBTC /> */}
    </main>
  );
}
