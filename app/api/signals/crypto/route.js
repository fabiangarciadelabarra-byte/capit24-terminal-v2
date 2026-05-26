export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "bitcoin"; // CoinGecko usa nombres, no tickers

  try {
    // 1. Obtener velas OHLC de CoinGecko (5m = 1 day con resolución alta)
    const ohlcRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol}/ohlc?vs_currency=usd&days=1`
    );
    const ohlc = await ohlcRes.json();

    if (!Array.isArray(ohlc)) {
      return Response.json(
        { error: "CoinGecko no devolvió velas válidas", details: ohlc },
        { status: 500 }
      );
    }

    // CoinGecko devuelve: [timestamp, open, high, low, close]
    const closes = ohlc.map(c => c[4]);
    const volumes = ohlc.map(c => c[5] || 0);

    // 2. RSI
    function calcRSI(values, period = 14) {
      let gains = 0, losses = 0;
      for (let i = 1; i <= period; i++) {
        const diff = values[values.length - i] - values[values.length - i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      return 100 - 100 / (1 + rs);
    }

    const rsi = calcRSI(closes);

    // 3. EMAs
    function calcEMA(values, period) {
      const k = 2 / (period + 1);
      let ema = values[0];
      for (let i = 1; i < values.length; i++) {
        ema = values[i] * k + ema * (1 - k);
      }
      return ema;
    }

    const ema20 = calcEMA(closes, 20);
    const ema50 = calcEMA(closes, 50);
    const ema200 = calcEMA(closes, 200);

    let emaTrend = "neutral";
    if (ema20 > ema50 && ema50 > ema200) emaTrend = "bullish";
    if (ema20 < ema50 && ema50 < ema200) emaTrend = "bearish";

    // 4. Orderflow básico (volumen de velas)
    const lastVolume = volumes[volumes.length - 1];
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const volumeTrend = lastVolume > avgVolume ? "buying" : "selling";

    // 5. Señal final
    let signal = "NEUTRAL";
    let confidence = 0.5;

    if (rsi < 30 && emaTrend === "bullish" && volumeTrend === "buying") {
      signal = "BUY";
      confidence = 0.8;
    }

    if (rsi > 70 && emaTrend === "bearish" && volumeTrend === "selling") {
      signal = "SELL";
      confidence = 0.8;
    }

    const lastClose = closes[closes.length - 1];

    return Response.json({
      symbol,
      signal,
      confidence,
      entry: lastClose,
      tp: lastClose * 1.05,
      sl: lastClose * 0.97,
      trend: emaTrend,
      indicators: {
        rsi,
        ema20,
        ema50,
        ema200
      },
      volume: {
        lastVolume,
        avgVolume,
        volumeTrend
      },
      timestamp: Date.now()
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
