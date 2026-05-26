export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  try {
    // 1. Obtener velas 5m
    const klinesRes = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=100`
    );
    const klines = await klinesRes.json();

    // Convertir velas a precios de cierre
    const closes = klines.map(k => parseFloat(k[4]));

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

    // 4. Orderflow (aggTrades)
    const tradesRes = await fetch(
      `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=200`
    );
    const trades = await tradesRes.json();

    let buyVolume = 0;
    let sellVolume = 0;

    trades.forEach(t => {
      const qty = parseFloat(t.q);
      if (t.m === false) buyVolume += qty; // comprador agresivo
      else sellVolume += qty; // vendedor agresivo
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

    // 6. Precio actual
    const lastClose = closes[closes.length - 1];

    // 7. Respuesta final
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
