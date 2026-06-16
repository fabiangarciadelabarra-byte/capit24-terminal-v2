"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface Props {
  symbol: string;
}

export default function Chart({ symbol }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: "#111" },
        textColor: "white",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: "#333",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#0f0",
      downColor: "#f00",
      borderUpColor: "#0f0",
      borderDownColor: "#f00",
      wickUpColor: "#0f0",
      wickDownColor: "#f00",
    });

    const fetchCandles = async () => {
      const res = await fetch(`/api/candles?symbol=${symbol}&tf=1`);
      const json = await res.json();

      if (json?.s !== "ok") return;

      const candles = json.t.map((t: number, i: number) => ({
        time: t,
        open: json.o[i],
        high: json.h[i],
        low: json.l[i],
        close: json.c[i],
      }));

      candleSeries.setData(candles);
    };

    const fetchPrice = async () => {
      const res = await fetch(`/api/quote?symbol=${symbol}`);
      const json = await res.json();

      if (json?.c) {
        candleSeries.update({
          time: Math.floor(Date.now() / 1000),
          open: json.c,
          high: json.c,
          low: json.c,
          close: json.c,
        });
      }
    };

    fetchCandles();
    fetchPrice();

    const interval = setInterval(() => {
      fetchPrice();
    }, 10000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px",
      }}
    />
  );
}
