export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const tf = searchParams.get("tf") || "15";

  if (!symbol) {
    return Response.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const url = `https://capit24.com/api/indicators?symbol=${symbol}&tf=${tf}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.candles) {
      return Response.json({ error: "Invalid indicator data" });
    }

    const { ema20, ema50, rsi14, macd } = data;

    const last = ema20.length - 1;

    const signals = [];

    // === EMA CROSS ===
    const emaCrossUp =
      ema20[last - 1].value < ema50[last - 1].value &&
      ema20[last].value > ema50[last].value;

    const emaCrossDown =
      ema20[last - 1].value > ema50[last - 1].value &&
      ema20[last].value < ema50[last].value;

    // === RSI ===
    const rsi = rsi14[rsi14.length - 1].value;
    const rsiBuy = rsi < 30;
    const rsiSell = rsi > 70;

    // === MACD ===
    const macdLine = macd.macdLine[last].value;
    const signalLine = macd.signal[last].value;

    const macdCrossUp =
      macd.macdLine[last - 1].value < macd.signal[last - 1].value &&
      macdLine > signalLine;

    const macdCrossDown =
      macd.macdLine[last - 1].value > macd.signal[last - 1].value &&
      macdLine < signalLine;

    // === Señales ===
    if (emaCrossUp || rsiBuy || macdCrossUp) {
      signals.push({
        type: "BUY",
        time: data.candles[last].time,
        strength:
          (emaCrossUp ? 1 : 0) +
          (rsiBuy ? 1 : 0) +
          (macdCrossUp ? 1 : 0),
      });
    }

    if (emaCrossDown || rsiSell || macdCrossDown) {
      signals.push({
        type: "SELL",
        time: data.candles[last].time,
        strength:
          (emaCrossDown ? 1 : 0) +
          (rsiSell ? 1 : 0) +
          (macdCrossDown ? 1 : 0),
      });
    }

    return Response.json({ signals });
  } catch (err) {
    return Response.json({ error: "Signal error", details: err });
  }
}
