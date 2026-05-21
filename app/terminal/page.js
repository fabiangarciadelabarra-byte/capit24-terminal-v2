"use client";

import { useChartSettings } from "../../hooks/useChartSettings";
import SymbolSelector from "../../components/SymbolSelector";
import TimeframeSelector from "../../components/TimeframeSelector";
import RealtimeCandleChart from "../../components/RealtimeCandleChart";

import TickerBTC from "../../components/TickerBTC";
import OrderbookBTC from "../../components/OrderbookBTC";
import TradesBTC from "../../components/TradesBTC";
import KlineBTC from "../../components/KlineBTC";

export default function TerminalPage() {
  const { symbol, timeframe, setSymbol, setTimeframe } = useChartSettings();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Capit24 Terminal — {symbol.toUpperCase()}</h1>

      <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />

      <RealtimeCandleChart symbol={symbol} timeframe={timeframe} />

      <TickerBTC />
      <OrderbookBTC />
      <TradesBTC />
      <KlineBTC />
    </main>
  );
}
