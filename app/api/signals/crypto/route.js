import { NextResponse } from "next/server";

const TF_MAP = {
  "5m": { resolution: "5", count: 300 },
  "15m": { resolution: "15", count: 300 },
  "30m": { resolution: "30", count: 300 },
  "1h": { resolution: "60", count: 300 },
  "4h": { resolution: "240", count: 300 },
  "1d": { resolution: "D", count: 300 },
};

const ALLOWED_TF = Object.keys(TF_MAP);

const SYMBOL_MAP = {
  btc: "BINANCE:BTC-USDT",
  eth: "BINANCE:ETH-USDT",
  bnb: "BINANCE:BNB-USDT",
  ada: "BINANCE:ADA-USDT",
  atom: "BINANCE:ATOM-USDT",
  aave: "BINANCE:AAVE-USDT",
  algo: "BINANCE:ALGO-USDT",
  avax: "BINANCE:AVAX-USDT",
  sol: "BINANCE:SOL-USDT",
  xrp: "BINANCE:XRP-USDT",
};

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// ---- indicadores básicos ----
function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let emaPrev =
    values.slice(0, period).reduce((sum, v) => sum + v, 0) / period;
  for (let i = period; i < values.length; i++) {
    emaPrev = values[i] * k + emaPrev * (1 - k);
  }
  return emaPrev;
}

function rsi(values, period = 14) {
  if (values.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function deriveTrend(price, ema20Val, ema50Val, ema200Val) {
  if (!ema20Val || !ema50Val || !ema200Val) return "neutral";
  if (price > ema20Val && ema20Val > ema50Val && ema50Val > ema200Val)
    return "uptrend";
  if (price < ema20Val && ema20Val < ema50Val && ema50Val < ema200Val)
    return "downtrend";
  return "neutral";
}

function deriveSignal(price, ema20Val, rsiVal) {
  if (!ema20Val || !rsiVal) return "HOLD";
  if (price > ema20Val && rsiVal > 55) return "BUY";
  if (price < ema20Val && rsiVal < 45) return "SELL";
  return "HOLD";
}

function deriveConfidence(rsiVal) {
  if (!rsiVal) return 0;
  const distFrom50 = Math.abs(rsiVal - 50);
  return Math.min(Math.round(distFrom50 * 2), 100);
}

// ---- handler principal ----
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolParam = (searchParams.get("symbol") || "").toLowerCase();
    const tfParam = (searchParams.get("tf") || "1h").toLowerCase();

    if (!SYMBOL_MAP[symbolParam]) {
      return NextResponse.json(
        { error: "Símbolo no soportado" },
        { status: 400 }
      );
    }

    if (!FINNHUB_API_KEY) {
      return NextResponse.json(
        { error: "Falta FINNHUB_API_KEY en el entorno" },
        { status: 500 }
      );
    }

    const tf = ALLOWED_TF.includes(tfParam) ? tfParam : "1h";
    const { resolution, count } = TF_MAP[tf];
    const finnhubSymbol = SYMBOL_MAP[symbolParam];

    const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${encodeURIComponent(
      finnhubSymbol
    )}&resolution=${resolution}&count=${count}&token=${FINNHUB_API_KEY}`;

    const resp = await fetch(url, { cache: "no-store" });

    if (!resp.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos de Finnhub", status: resp.status },
        { status: 502 }
      );
    }

    const data = await resp.json();

    if (data.s !== "ok" || !data.c || data.c.length === 0) {
      return NextResponse.json(
        { error: "Sin datos de Finnhub para este símbolo/timeframe" },
        { status: 502 }
      );
    }

    const closes = data.c.map((v) => Number(v));
    const highs = data.h?.map((v) => Number(v)) || closes;
    const lows = data.l?.map((v) => Number(v)) || closes;
    const opens = data.o?.map((v) => Number(v)) || closes;
    const times = data.t?.map((t) => t * 1000) || [];

    const price = closes[closes.length - 1];

    const ema20Val = ema(closes, 20);
    const ema50Val = ema(closes, 50);
    const ema200Val = ema(closes, 200);
    const rsiVal = rsi(closes, 14);

    const trend = deriveTrend(price, ema20Val, ema50Val, ema200Val);
    const signal = deriveSignal(price, ema20Val, rsiVal);
    const confidence = deriveConfidence(rsiVal);

    const updatedAt =
      times.length > 0 ? new Date(times[times.length - 1]).toISOString() : null;

    const chart = {
      o: opens,
      h: highs,
      l: lows,
      c: closes,
      t: times,
      tf,
    };

    return NextResponse.json({
      symbol: symbolParam,
      price,
      indicators: {
        ema20: ema20Val,
        ema50: ema50Val,
        ema200: ema200Val,
        rsi: rsiVal,
      },
      trend,
      signal,
      confidence,
      updatedAt,
      chart,
      timeframe: tf,
    });
  } catch (err) {
    console.error("Error en /api/signals/crypto (Finnhub):", err);
    return NextResponse.json(
      { error: "Error interno en el motor de señales" },
      { status: 500 }
    );
  }
}
