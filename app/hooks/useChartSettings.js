"use client";

import { useState } from "react";

export function useChartSettings() {
  const [symbol, setSymbol] = useState("btcusdt");
  const [timeframe, setTimeframe] = useState("1m");

  return {
    symbol,
    timeframe,
    setSymbol,
    setTimeframe,
  };
}
