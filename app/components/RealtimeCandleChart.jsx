"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useBinanceWS } from "../hooks/useBinanceWS";

export default function RealtimeCandleChart({ symbol, timeframe }) {
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const stream = `${symbol}@kline_${timeframe}`;
  const kline = useBinanceWS(stream);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 350,
      layout: { background: { color: "#fff" }, textColor: "#000" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: { timeVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries();
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      color: "#26a69a",
    });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const resize = () => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [symbol, timeframe]);

  useEffect(() => {
    if (!kline || !candleSeriesRef.current) return;

    const k = kline.k;

    candleSeriesRef.current.update({
      time: k.t / 1000,
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c),
    });

    volumeSeriesRef.current.update({
      time: k.t / 1000,
      value: parseFloat(k.v),
      color: k.c >= k.o ? "#26a69a" : "#ef5350",
    });
  }, [kline]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "350px",
        marginBottom: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    />
  );
}
