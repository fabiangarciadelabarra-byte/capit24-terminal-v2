"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface Props {
  symbol: string;
}

export default function Chart({ symbol }: Props) {
  const mainRef = useRef<HTMLDivElement>(null);
  const rsiRef = useRef<HTMLDivElement>(null);
  const macdRef = useRef<HTMLDivElement>(null);

  const [tf, setTf] = useState("15");

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

    fetchIndicators();

    const interval = setInterval(fetchIndicators, 10000);
    return () => clearInterval(interval);
  }, [symbol, tf]);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {/* TIMEFRAME SELECTOR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "1m", value: "1" },
          { label: "5m", value: "5" },
          { label: "15m", value: "15" },
          { label: "30m", value: "30" },
          { label: "1h", value: "60" },
          { label: "2h", value: "120" },
          { label: "1D", value: "1d" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTf(t.value)}
            style={{
              padding: "6px 12px",
              background: tf === t.value ? "#444" : "#222",
              color: "white",
              borderRadius: "6px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* MAIN CHART */}
      <div ref={mainRef} style={{ width: "100%", height: "420px" }} />

      {/* RSI PANEL */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#aaa",
        }}
      >
        RSI (14)
      </div>
      <div ref={rsiRef} style={{ width: "100%", height: "160px" }} />

      {/* MACD PANEL */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#aaa",
        }}
      >
        MACD (12, 26, 9)
      </div>
      <div ref={macdRef} style={{ width: "100%", height: "180px" }} />
    </div>
  );
}
