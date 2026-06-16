export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const tf = searchParams.get("tf") || "15";

  if (!symbol) {
    return Response.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const url = `https://capit24.com/api/candles?symbol=${symbol}&tf=${tf}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.s !== "ok") {
      return Response.json({ error: "Invalid candle data" });
    }

    const candles = data.t.map((t, i) => ({
      time: t,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
    }));

    const zones = [];

    // === FVG (Fair Value Gaps) ===
    for (let i = 2; i < candles.length; i++) {
      const c0 = candles[i - 2];
      const c2 = candles[i];

      // FVG alcista
      if (c0.high < c2.low) {
        zones.push({
          type: "FVG_UP",
          startTime: c0.time,
          endTime: c2.time,
          low: c0.high,
          high: c2.low,
        });
      }

      // FVG bajista
      if (c0.low > c2.high) {
        zones.push({
          type: "FVG_DOWN",
          startTime: c0.time,
          endTime: c2.time,
          low: c2.high,
          high: c0.low,
        });
      }
    }

    // === Equal Highs / Equal Lows ===
    for (let i = 1; i < candles.length; i++) {
      const prev = candles[i - 1];
      const curr = candles[i];

      if (Math.abs(prev.high - curr.high) <= prev.high * 0.0005) {
        zones.push({
          type: "EQH",
          startTime: prev.time,
          endTime: curr.time,
          low: prev.high,
          high: curr.high,
        });
      }

      if (Math.abs(prev.low - curr.low) <= prev.low * 0.0005) {
        zones.push({
          type: "EQL",
          startTime: prev.time,
          endTime: curr.time,
          low: prev.low,
          high: curr.low,
        });
      }
    }

    return Response.json({ zones });
  } catch (err) {
    return Response.json({ error: "Liquidity zone error", details: err });
  }
}
