useEffect(() => {
  if (!mainRef.current || !rsiRef.current || !macdRef.current) return;

  // === MAIN CHART ===
  const mainChart = createChart(mainRef.current, {
    width: mainRef.current.clientWidth,
    height: 420,
    layout: {
      background: { type: ColorType.Solid, color: "#111" },
      textColor: "white",
    },
    grid: {
      vertLines: { color: "#222" },
      horzLines: { color: "#222" },
    },
    timeScale: { borderColor: "#333" },
  });

  const candleSeries = mainChart.addCandlestickSeries({
    upColor: "#0f0",
    downColor: "#f00",
    borderUpColor: "#0f0",
    borderDownColor: "#f00",
    wickUpColor: "#0f0",
    wickDownColor: "#f00",
  });

  const ema20Series = mainChart.addLineSeries({
    color: "#FFD700",
    lineWidth: 2,
  });

  const ema50Series = mainChart.addLineSeries({
    color: "#00BFFF",
    lineWidth: 2,
  });

  const ema200Series = mainChart.addLineSeries({
    color: "#FF00FF",
    lineWidth: 2,
  });

  const vwapSeries = mainChart.addLineSeries({
    color: "#FFFFFF",
    lineWidth: 2,
  });

  // === RSI PANEL ===
  const rsiChart = createChart(rsiRef.current, {
    width: rsiRef.current.clientWidth,
    height: 160,
    layout: {
      background: { type: ColorType.Solid, color: "#111" },
      textColor: "white",
    },
    grid: {
      vertLines: { color: "#222" },
      horzLines: { color: "#222" },
    },
    timeScale: { visible: false },
  });

  const rsiSeries = rsiChart.addLineSeries({
    color: "#FFA500",
    lineWidth: 2,
  });

  // === MACD PANEL ===
  const macdChart = createChart(macdRef.current, {
    width: macdRef.current.clientWidth,
    height: 180,
    layout: {
      background: { type: ColorType.Solid, color: "#111" },
      textColor: "white",
    },
    grid: {
      vertLines: { color: "#222" },
      horzLines: { color: "#222" },
    },
    timeScale: { borderColor: "#333" },
  });

  const macdLineSeries = macdChart.addLineSeries({
    color: "#00FF00",
    lineWidth: 2,
  });

  const signalSeries = macdChart.addLineSeries({
    color: "#FF0000",
    lineWidth: 2,
  });

  const histogramSeries = macdChart.addHistogramSeries({
    color: "#888",
  });

  // === FETCH INDICATORS ===
  const fetchIndicators = async () => {
    const res = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
    const json = await res.json();

    if (!json || !json.candles) return;

    candleSeries.setData(json.candles);
    ema20Series.setData(json.ema20);
    ema50Series.setData(json.ema50);
    ema200Series.setData(json.ema200);
    vwapSeries.setData(json.vwap);

    rsiSeries.setData(json.rsi14);

    macdLineSeries.setData(json.macd.macdLine);
    signalSeries.setData(json.macd.signal);
    histogramSeries.setData(json.macd.histogram);
  };

  // === FETCH SIGNALS (BUY/SELL) ===
  const fetchSignals = async () => {
    const res = await fetch(`/api/signals?symbol=${symbol}&tf=${tf}`);
    const json = await res.json();

    if (!json.signals) return;

    const markers = json.signals.map((s: any) => ({
      time: s.time,
      position: s.type === "BUY" ? "belowBar" : "aboveBar",
      color: s.type === "BUY" ? "lime" : "red",
      shape: s.type === "BUY" ? "arrowUp" : "arrowDown",
      text:
        s.type +
        (s.strength === 3
          ? " (STRONG)"
          : s.strength === 2
          ? " (MEDIUM)"
          : " (WEAK)"),
    }));

    candleSeries.setMarkers(markers);
  };

  // === FIRST LOAD ===
  fetchIndicators();
  fetchSignals();

  // === REAL-TIME UPDATE ===
  const interval = setInterval(() => {
    fetchIndicators();
    fetchSignals();
  }, 10000);

  return () => clearInterval(interval);
}, [symbol, tf]);
