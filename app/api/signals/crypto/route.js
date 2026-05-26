export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "FINNHUB_API_KEY no está configurada en Vercel" },
      { status: 500 }
    );
  }

  try {
    // 1. Obtener velas 5m desde Finnhub
    const candlesRes = await fetch(
      `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${symbol}&resolution=5&token=${apiKey}`
    );
    const candles = await candlesRes.json();

    if (candles.s !== "ok") {
      return Response.json(
        { error: "Finnhub no devolvió velas válidas", details: candles },
        { status: 500 }
      );
    }

    const closes = candles.c;

    // 2. Calcular RSI
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

    // 3. Calcular EMAs
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

    // 4. Orderflow desde Finnhub (trades)
    const tradesRes = await fetch(
      `https://finnhub.io/api/v1/crypto/trades?symbol=BINANCE:${symbol}&limit=200&token=${apiKey}`
    );
    const tradesData = await tradesRes.json();

    if (!tradesData.data) {
      return Response.json(
        { error: "Finnhub no devolvió trades válidos", details: tradesData },
        { status: 500 }
      );
    }

    let buyVolume = 0;
    let sellVolume = 0;

    tradesData.data.forEach(t => {
      const qty = t.v;
      if (t.c.includes("B")) buyVolume += qty; // comprador
      if (t.c.includes("S")) sellVolume += qty; // vendedor
    });

    const delta = buyVolume - sellVolume;
    const buyersPct = (buyVolume / (buyVolume + sellVolume)) * 100;
    const sellersPct = 100 - buyersPct;

    // 5. Señal final
    let signal = "NEUTRAL";
    let confidence = 0.5;

    if (rsi < 30 && emaTrend === "bullish" && delta > 0) {
      signal = "BUY";
      confidence = 0.8;
    }

    if (rsi > 70 && emaTrend === "bearish" && delta < 0) {
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
      orderflow: {
        delta,
        buyers: buyersPct,
        sellers: sellersPct
      },
      timestamp: Date.now()
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
