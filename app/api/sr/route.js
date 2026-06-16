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

    const supports = [];
    const resistances = [];

    // Detectar pivotes
    for (let i = 2; i < candles.length - 2; i++) {
      const c = candles[i];

      const isResistance =
        c.high > candles[i - 1].high &&
        c.high > candles[i - 2].high &&
        c.high > candles[i + 1].high &&
        c.high > candles[i + 2].high;

      const isSupport =
        c.low < candles[i - 1].low &&
        c.low < candles[i - 2].low &&
        c.low < candles[i + 1].low &&
        c.low < candles[i + 2].low;

      if (isResistance) resistances.push(c.high);
      if (isSupport) supports.push(c.low);
    }

    // Agrupar niveles cercanos
    const groupLevels = (levels) => {
      levels.sort((a, b) => a - b);
      const grouped = [];

      levels.forEach((lvl) => {
        if (!grouped.length || Math.abs(grouped[grouped.length - 1] - lvl) > lvl * 0.005) {
          grouped.push(lvl);
        }
      });

      return grouped;
    };

    const finalSupports = groupLevels(supports);
    const finalResistances = groupLevels(resistances);

    return Response.json({
      supports: finalSupports,
      resistances: finalResistances,
    });
  } catch (err) {
    return Response.json({ error: "SR error", details: err });
  }
}
