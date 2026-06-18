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

  const srLinesRef = useRef<any[]>([]);
  const liquidityZonesRef = useRef<any[]>([]);
  const orderBlocksRef = useRef<any[]>([]);
  const breakerBlocksRef = useRef<any[]>([]);

  const [tf, setTf] = useState("15");

  useEffect(() => {
    if (!mainRef.current || !rsiRef.current || !macdRef.current) return;

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

    const ema20Series = mainChart.addLineSeries({ color: "#FFD700", lineWidth: 2 });
    const ema50Series = mainChart.addLineSeries({ color: "#00BFFF", lineWidth: 2 });
    const ema200Series = mainChart.addLineSeries({ color: "#FF00FF", lineWidth: 2 });
    const vwapSeries = mainChart.addLineSeries({ color: "#FFFFFF", lineWidth: 2 });

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

    const rsiSeries = rsiChart.addLineSeries({ color: "#FFA500", lineWidth: 2 });

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

    const macdLineSeries = macdChart.addLineSeries({ color: "#00FF00", lineWidth: 2 });
    const signalSeries = macdChart.addLineSeries({ color: "#FF0000", lineWidth: 2 });
    const histogramSeries = macdChart.addHistogramSeries({ color: "#888" });
        orderBlocksRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };

    // === DRAW BREAKER BLOCKS ===
    const drawBreakerBlocks = (blocks: any[], candles: any[]) => {
      breakerBlocksRef.current.forEach((b) => b.remove());
      breakerBlocksRef.current = [];

      if (!blocks?.length || !candles?.length) return;

      blocks.forEach((bb) => {
        const isBullish = bb.type === "BULLISH_BREAKER";
        const rectColor = isBullish ? "rgba(0,150,255,0.20)" : "rgba(255,140,0,0.20)";
        const lineColor = isBullish ? "rgba(0,150,255,1)" : "rgba(255,140,0,1)";

        const rectTop = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectTop.setData([
          { time: bb.startTime, value: bb.high },
          { time: bb.endTime, value: bb.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectBottom.setData([
          { time: bb.startTime, value: bb.low },
          { time: bb.endTime, value: bb.low },
        ]);

        const topLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        topLine.setData([
          { time: bb.startTime, value: bb.high },
          { time: bb.endTime, value: bb.high },
        ]);

        const bottomLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        bottomLine.setData([
          { time: bb.startTime, value: bb.low },
          { time: bb.endTime, value: bb.low },
        ]);

        breakerBlocksRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };

    // === FETCH INDICATORS ===
    const fetchIndicators = async () => {
      const res = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.candles) return;

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

    // === FETCH SIGNALS ===
    const fetchSignals = async () => {
      const res = await fetch(`/api/signals?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.signals) return;

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

    // === FETCH SR ===
    const fetchSR = async () => {
      const res = await fetch(`/api/sr?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.supports || !json?.resistances) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();
      if (!candleJson?.candles) return;

      drawSR(json.supports, json.resistances, candleJson.candles);
    };

    // === FETCH LIQUIDITY ZONES ===
    const fetchLiquidityZones = async () => {
      const res = await fetch(`/api/liquidity-zones?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.zones) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();
      if (!candleJson?.candles) return;

      drawLiquidityZones(json.zones, candleJson.candles);
    };

    // === FETCH ORDER BLOCKS ===
    const fetchOrderBlocks = async () => {
      const res = await fetch(`/api/orderblocks?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.blocks) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();
      if (!candleJson?.candles) return;

      drawOrderBlocks(json.blocks, candleJson.candles);
    };

    // === FETCH BREAKER BLOCKS ===
    const fetchBreakerBlocks = async () => {
      const res = await fetch(`/api/breakerblocks?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();
      if (!json?.blocks) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();
      if (!candleJson?.candles) return;

      drawBreakerBlocks(json.blocks, candleJson.candles);
    };

    // === FIRST LOAD ===
    fetchIndicators();
    fetchSignals();
    fetchSR();
    fetchLiquidityZones();
    fetchOrderBlocks();
    fetchBreakerBlocks();

    // === REAL-TIME UPDATE ===
    const interval = setInterval(() => {
      fetchIndicators();
      fetchSignals();
      fetchSR();
      fetchLiquidityZones();
      fetchOrderBlocks();
      fetchBreakerBlocks();
    }, 10000);

    return () => clearInterval(interval);
  }, [symbol, tf]);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
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

      <div ref={mainRef} style={{ width: "100%", height: "420px" }} />

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#aaa" }}>
        RSI (14)
      </div>
      <div ref={rsiRef} style={{ width: "100%", height: "160px" }} />

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#aaa" }}>
        MACD (12, 26, 9)
      </div>
      <div ref={macdRef} style={{ width: "100%", height: "180px" }} />
    </div>
  );
}
