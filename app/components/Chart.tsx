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

    // === DRAW SR LEVELS ===
    const drawSR = (supports: number[], resistances: number[], candles: any[]) => {
      srLinesRef.current.forEach((l) => l.remove());
      srLinesRef.current = [];

      if (!candles || candles.length === 0) return;

      const firstTime = candles[0].time;
      const lastTime = candles[candles.length - 1].time;

      supports.forEach((lvl) => {
        const line = mainChart.addLineSeries({
          color: "lime",
          lineWidth: 1,
          priceLineVisible: false,
        });

        line.setData([
          { time: firstTime, value: lvl },
          { time: lastTime, value: lvl },
        ]);

        srLinesRef.current.push(line);
      });

      resistances.forEach((lvl) => {
        const line = mainChart.addLineSeries({
          color: "red",
          lineWidth: 1,
          priceLineVisible: false,
        });

        line.setData([
          { time: firstTime, value: lvl },
          { time: lastTime, value: lvl },
        ]);

        srLinesRef.current.push(line);
      });
    };

    // === DRAW LIQUIDITY ZONES ===
    const drawLiquidityZones = (zones: any[], candles: any[]) => {
      liquidityZonesRef.current.forEach((z) => z.remove());
      liquidityZonesRef.current = [];

      if (!zones || zones.length === 0 || !candles || candles.length === 0) return;

      zones.forEach((z) => {
        const color =
          z.type === "FVG_UP"
            ? "rgba(255, 215, 0, 0.25)"
            : z.type === "FVG_DOWN"
            ? "rgba(255, 0, 0, 0.25)"
            : z.type === "EQH"
            ? "rgba(255, 0, 0, 0.35)"
            : "rgba(0, 255, 0, 0.35)";

        const rectTop = mainChart.addAreaSeries({
          topColor: color,
          bottomColor: color,
          lineColor: color,
          lineWidth: 0,
        });

        rectTop.setData([
          { time: z.startTime, value: z.high },
          { time: z.endTime, value: z.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: color,
          bottomColor: color,
          lineColor: color,
          lineWidth: 0,
        });

        rectBottom.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        const topLine = mainChart.addLineSeries({
          color: color.replace("0.25", "1").replace("0.35", "1"),
          lineWidth: 1,
        });

        topLine.setData([
          { time: z.startTime, value: z.high },
          { time: z.endTime, value: z.high },
        ]);

        const bottomLine = mainChart.addLineSeries({
          color: color.replace("0.25", "1").replace("0.35", "1"),
          lineWidth: 1,
        });

        bottomLine.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        liquidityZonesRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };

    // === DRAW ORDER BLOCKS ===
    const drawOrderBlocks = (blocks: any[], candles: any[]) => {
      orderBlocksRef.current.forEach((b) => b.remove());
      orderBlocksRef.current = [];

      if (!blocks || blocks.length === 0 || !candles || candles.length === 0) return;

      blocks.forEach((ob) => {
        const isBullish = ob.type === "BULLISH_OB";

        const rectColor = isBullish
          ? "rgba(0, 255, 0, 0.20)"
          : "rgba(255, 0, 0, 0.20)";

        const lineColor = isBullish
          ? "rgba(0, 255, 0, 1)"
          : "rgba(255, 0, 0, 1)";

        const rectTop = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 0,
        });

        rectTop.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 0,
        });

        rectBottom.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        const topLine = mainChart.addLineSeries({
          color: lineColor,
          lineWidth: 1,
        });

        topLine.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const bottomLine = mainChart.addLineSeries({
          color: lineColor,
          lineWidth: 1,
        });

        bottomLine.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        orderBlocksRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };

    // === DRAW BREAKER BLOCKS ===
    const drawBreakerBlocks = (blocks: any[], candles: any[]) => {
      breakerBlocksRef.current.forEach((b) => b.remove());
      breakerBlocksRef.current = [];

      if (!blocks || blocks.length === 0 || !candles || candles.length === 0) return;

      blocks.forEach((bb) => {
        const isBullish = bb.type === "BULLISH_BREAKER";

        const rectColor = isBullish
          ? "rgba(0, 150, 255, 0.20)" // azul institucional
          : "rgba(255, 140, 0, 0.20)"; // naranja institucional

        const lineColor = isBullish
          ? "rgba(0, 150, 255, 1)"
          : "rgba(255, 140, 0, 1)";

        const rectTop = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 0,
        });

        rectTop.setData([
          { time: bb.startTime, value: bb.high },
          { time: bb.endTime, value: bb.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 0,
        });

        rectBottom.setData([
          { time: bb.startTime, value: bb.low },
          { time: bb.endTime, value: bb.low },
        ]);

        const topLine = mainChart.addLineSeries({
          color: lineColor,
          lineWidth: 1,
        });

        topLine.setData([
          { time: bb.startTime, value: bb.high },
          { time: bb.endTime, value: bb.high },
        ]);

        const bottomLine = mainChart.addLineSeries({
          color: lineColor,
          lineWidth: 1,
        });

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

    // === FETCH SIGNALS ===
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

    // === FETCH SR ===
    const fetchSR = async () => {
      const res = await fetch(`/api/sr?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();

      if (!json.supports || !json.resistances) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();

      if (!candleJson.candles) return;

      drawSR(json.supports, json.resistances, candleJson.candles);
    };

    // === FETCH LIQUIDITY ZONES ===
    const fetchLiquidityZones = async () => {
      const res = await fetch(`/api/liquidity-zones?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();

      if (!json.zones) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();

      if (!candleJson.candles) return;

      drawLiquidityZones(json.zones, candleJson.candles);
    };

    // === FETCH ORDER BLOCKS ===
    const fetchOrderBlocks = async () => {
      const res = await fetch(`/api/orderblocks?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();

      if (!json.blocks) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();

      if (!candleJson.candles) return;

      drawOrderBlocks(json.blocks, candleJson.candles);
    };

    // === FETCH BREAKER BLOCKS ===
    const fetchBreakerBlocks = async () => {
      const res = await fetch(`/api/breakerblocks?symbol=${symbol}&tf=${tf}`);
      const json = await res.json();

      if (!json.blocks) return;

      const candleRes = await fetch(`/api/indicators?symbol=${symbol}&tf=${tf}`);
      const candleJson = await candleRes.json();

      if (!candleJson.candles) return;

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
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#aaa" }}>
        RSI (14)
      </div>
      <div ref={rsiRef} style={{ width: "100%", height: "160px" }} />

      {/* MACD PANEL */}
      <div style={{ marginTop: "20px", fontSize: "14
