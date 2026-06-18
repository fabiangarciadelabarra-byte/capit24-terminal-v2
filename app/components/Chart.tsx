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

    const drawSR = (supports: number[], resistances: number[], candles: any[]) => {
      srLinesRef.current.forEach((l) => l.remove());
      srLinesRef.current = [];

      if (!candles?.length) return;

      const firstTime = candles[0].time;
      const lastTime = candles[candles.length - 1].time;

      supports.forEach((lvl) => {
        const line = mainChart.addLineSeries({ color: "lime", lineWidth: 1, priceLineVisible: false });
        line.setData([{ time: firstTime, value: lvl }, { time: lastTime, value: lvl }]);
        srLinesRef.current.push(line);
      });

      resistances.forEach((lvl) => {
        const line = mainChart.addLineSeries({ color: "red", lineWidth: 1, priceLineVisible: false });
        line.setData([{ time: firstTime, value: lvl }, { time: lastTime, value: lvl }]);
        srLinesRef.current.push(line);
      });
    };

    const drawLiquidityZones = (zones: any[], candles: any[]) => {
      liquidityZonesRef.current.forEach((z) => z.remove());
      liquidityZonesRef.current = [];

      if (!zones?.length || !candles?.length) return;

      zones.forEach((z) => {
        const color =
          z.type === "FVG_UP" ? "rgba(255,215,0,0.25)" :
          z.type === "FVG_DOWN" ? "rgba(255,0,0,0.25)" :
          z.type === "EQH" ? "rgba(255,0,0,0.35)" :
          "rgba(0,255,0,0.35)";

        const rectBottom = mainChart.addAreaSeries({
          topColor: color,
          bottomColor: color,
          lineColor: color,
          lineWidth: 1,
        });

        rectBottom.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        const topLine = mainChart.addLineSeries({ color, lineWidth: 1 });
        topLine.setData([
          { time: z.startTime, value: z.high },
          { time: z.endTime, value: z.high },
        ]);

        const bottomLine = mainChart.addLineSeries({ color, lineWidth: 1 });
        bottomLine.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        liquidityZonesRef.current.push(rectBottom, topLine, bottomLine);
      });
    };

    const drawOrderBlocks = (blocks: any[], candles: any[]) => {
      orderBlocksRef.current.forEach((b) => b.remove());
      orderBlocksRef.current = [];

      if (!blocks?.length || !candles?.length) return;

      blocks.forEach((ob) => {
        const isBullish = ob.type === "BULLISH_OB";
        const rectColor = isBullish ? "rgba(0,255,0,0.20)" : "rgba(255,0,0,0.20)";
        const lineColor = isBullish ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)";

        const rectTop = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectTop.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectBottom.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        const topLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        topLine.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const bottomLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        bottomLine.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        orderBlocksRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };
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

    const drawSR = (supports: number[], resistances: number[], candles: any[]) => {
      srLinesRef.current.forEach((l) => l.remove());
      srLinesRef.current = [];

      if (!candles?.length) return;

      const firstTime = candles[0].time;
      const lastTime = candles[candles.length - 1].time;

      supports.forEach((lvl) => {
        const line = mainChart.addLineSeries({ color: "lime", lineWidth: 1, priceLineVisible: false });
        line.setData([{ time: firstTime, value: lvl }, { time: lastTime, value: lvl }]);
        srLinesRef.current.push(line);
      });

      resistances.forEach((lvl) => {
        const line = mainChart.addLineSeries({ color: "red", lineWidth: 1, priceLineVisible: false });
        line.setData([{ time: firstTime, value: lvl }, { time: lastTime, value: lvl }]);
        srLinesRef.current.push(line);
      });
    };

    const drawLiquidityZones = (zones: any[], candles: any[]) => {
      liquidityZonesRef.current.forEach((z) => z.remove());
      liquidityZonesRef.current = [];

      if (!zones?.length || !candles?.length) return;

      zones.forEach((z) => {
        const color =
          z.type === "FVG_UP" ? "rgba(255,215,0,0.25)" :
          z.type === "FVG_DOWN" ? "rgba(255,0,0,0.25)" :
          z.type === "EQH" ? "rgba(255,0,0,0.35)" :
          "rgba(0,255,0,0.35)";

        const rectBottom = mainChart.addAreaSeries({
          topColor: color,
          bottomColor: color,
          lineColor: color,
          lineWidth: 1,
        });

        rectBottom.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        const topLine = mainChart.addLineSeries({ color, lineWidth: 1 });
        topLine.setData([
          { time: z.startTime, value: z.high },
          { time: z.endTime, value: z.high },
        ]);

        const bottomLine = mainChart.addLineSeries({ color, lineWidth: 1 });
        bottomLine.setData([
          { time: z.startTime, value: z.low },
          { time: z.endTime, value: z.low },
        ]);

        liquidityZonesRef.current.push(rectBottom, topLine, bottomLine);
      });
    };

    const drawOrderBlocks = (blocks: any[], candles: any[]) => {
      orderBlocksRef.current.forEach((b) => b.remove());
      orderBlocksRef.current = [];

      if (!blocks?.length || !candles?.length) return;

      blocks.forEach((ob) => {
        const isBullish = ob.type === "BULLISH_OB";
        const rectColor = isBullish ? "rgba(0,255,0,0.20)" : "rgba(255,0,0,0.20)";
        const lineColor = isBullish ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)";

        const rectTop = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectTop.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const rectBottom = mainChart.addAreaSeries({
          topColor: rectColor,
          bottomColor: rectColor,
          lineColor: rectColor,
          lineWidth: 1,
        });

        rectBottom.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        const topLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        topLine.setData([
          { time: ob.startTime, value: ob.high },
          { time: ob.endTime, value: ob.high },
        ]);

        const bottomLine = mainChart.addLineSeries({ color: lineColor, lineWidth: 1 });
        bottomLine.setData([
          { time: ob.startTime, value: ob.low },
          { time: ob.endTime, value: ob.low },
        ]);

        orderBlocksRef.current.push(rectTop, rectBottom, topLine, bottomLine);
      });
    };
