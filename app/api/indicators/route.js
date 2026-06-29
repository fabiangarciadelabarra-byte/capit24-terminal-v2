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
      volume: data.v[i],
    }));

    // === INDICADORES ===
    const ema = (period) => {
      const k = 2 / (period + 1);
      let emaArray = [];
      let prev;

      candles.forEach((c, i) => {
        if (i === 0) {
          prev = c.close;
        } else {
          prev = c.close * k + prev * (1 - k);
        }
        emaArray.push({ time: c.time, value: prev });
      });

      return emaArray;
    };

    const ema20 = ema(20);
    const ema50 = ema(50);
    const ema200 = ema(200);

    // RSI
    const rsi = () => {
      let gains = [];
      let losses = [];

      for (let i = 1; i < candles.length; i++) {
        const diff = candles[i].close - candles[i - 1].close;
        gains.push(diff > 0 ? diff : 0);
        losses.push(diff < 0 ? -diff : 0);
      }

      const avgGain = gains.slice(0, 14).reduce((a, b) => a + b) / 14;
      const avgLoss = losses.slice(0, 14).reduce((a, b) => a + b) / 14;

      let rsiArray = [];
      let gain = avgGain;
      let loss = avgLoss;

      for (let i = 14; i < candles.length; i++) {
        gain = (gain * 13 + gains[i - 1]) / 14;
        loss = (loss * 13 + losses[i - 1]) / 14;

        const rs = loss === 0 ? 100 : gain / loss;
        const rsiValue = 100 - 100 / (1 + rs);

        rsiArray.push({ time: candles[i].time, value: rsiValue });
      }

      return rsiArray;
    };

    const rsi14 = rsi();

    // MACD
    const macd = () => {
      const ema12 = ema(12);
      const ema26 = ema(26);

      let macdLine = ema12.map((e, i) => ({
        time: e.time,
        value: e.value - ema26[i].value,
      }));

      // Signal line (EMA9 of MACD)
      const k = 2 / (9 + 1);
      let prev = macdLine[0].value;
      let signal = macdLine.map((m) => {
        prev = m.value * k + prev * (1 - k);
        return { time: m.time, value: prev };
      });

      let histogram = macdLine.map((m, i) => ({
        time: m.time,
        value: m.value - signal[i].value,
      }));

      return { macdLine, signal, histogram };
    };

    const macdData = macd();

    // VWAP
    const vwap = () => {
      let cumulativePV = 0;
      let cumulativeVolume = 0;

      return candles.map((c) => {
        const typical = (c.high + c.low + c.close) / 3;
        cumulativePV += typical * c.volume;
        cumulativeVolume += c.volume;

        return {
          time: c.time,
          value: cumulativePV / cumulativeVolume,
        };
      });
    };

    const vwapData = vwap();

    return Response.json({
      candles,
      ema20,
      ema50,
      ema200,
      rsi14,
      macd: macdData,
      vwap: vwapData,
    });
  } catch (err) {
    return Response.json({ error: "Indicator error", details: err });
  }
}
