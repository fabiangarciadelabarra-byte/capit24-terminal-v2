"use client";

import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useBinanceWS } from "../hooks/useBinanceWS";

export default function RealtimeCandleChart({ symbol, timeframe }) {
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [ready, setReady] = useState(false);

  const stream = `${symbol}@kline_${timeframe}`;
  const kline = useBinanceWS(stream);

  // Esperar a que el div tenga width real
  useEffect(() => {
    if (!chartRef.current) return;

    const checkWidth = () => {
      if (chartRef.current.clientWidth > 0) {
        setReady(true);
      }
    };

    checkWidth();
    const interval = setInterval(checkWidth, 100);

    return () => clearInterval(interval);
  }, []);

  // Crear chart + cargar histórico
  useEffect(() => {
    if (!ready || !chartRef.current) return;

    // Destruir chart anterior si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
    }

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 350,
      layout: { background: { color: "#fff" }, textColor: "#000" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: { timeVisible: true },
    });

    chartInstanceRef.current = chart;

    const candleSeries = chart.addCandlestickSeries();
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      color: "#26a69a",
    });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Cargar histórico desde tu API
    const loadHistory = async () => {
      try {
        const res = await fetch(
          `/api/crypto/history?symbol=${symbol.toUpperCase()}&interval=${timeframe}&limit=500`
        );
        const data = await res.json();

        candleSeries.setData(data);

        // Volumen histórico
        const volumeData = data.map(c => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? "#26a69a" : "#ef5350",
        }));

        volumeSeries.setData(volumeData);
      } catch (err) {
        console.error("Error cargando histórico:", err);
      }
    };

    loadHistory();

    const resize = () => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [ready, symbol, timeframe]);

  // Actualizar en tiempo real
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
        minWidth: "300px",
        height: "350px",
        marginBottom: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    />
  );
}
