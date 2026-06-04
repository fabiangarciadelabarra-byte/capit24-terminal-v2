import { NextResponse } from "next/server";

// Timeframes permitidos (1h y 4h desactivados)
const ALLOWED_TF = ["1m", "5m", "15m", "30m", "1d"];

// Mapeo de símbolos a CoinGecko
const COINGECKO_IDS = {
  btc: "bitcoin",
  eth: "ethereum",
  bnb: "binancecoin",
  ada: "cardano",
  atom: "cosmos",
  aave: "aave",
  algo: "algorand",
  avax: "avalanche-2",
  sol: "solana",
  xrp: "ripple",
};

// ---- Indicadores ----
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

// ---- Agrupación de velas (simulación de TF) ----
function aggregateCandles(raw, groupSize) {
  const result = [];
  for (let i = 0; i < raw.length; i += groupSize) {
    const chunk = raw.slice(i, i + groupSize);
    if (chunk.length < groupSize) break;

    const t = chunk[0][0];
    const o = chunk[0][1];
    const h = Math.max(...chunk.map((c) => c[2]));
    const l = Math.min(...chunk.map((c) => c[3]));
    const c = chunk[chunk.length - 1][4];

    result.push([t, o, h, l, c]);
  }
  return result;
}

// ---- Handler principal ----
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = (searchParams.get("symbol") || "").toLowerCase();
    const tf = ALLOWED_TF.includes(searchParams.get("tf"))
      ? searchParams.get("tf")
      : "1m";

    if (!COINGECKO_IDS[symbol]) {
      return NextResponse.json(
        { error: "Símbolo no soportado" },
        { status: 400 }
      );
    }

    const id = COINGECKO_IDS[symbol];

    // CoinGecko OHLC (1m o 1d)
    const url =
      tf === "1d"
        ? `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=90`
        : `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1`;

    const resp = await fetch(url, { cache: "no-store" });

    if (!resp.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos de CoinGecko" },
        { status: 502 }
      );
    }

    let raw = await resp.json();

    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json(
        { error: "Sin datos OHLC de CoinGecko" },
        { status: 502 }
      );
    }

    // Simulación de TF
    const GROUP_MAP = {
      "1m": 1,
      "5m": 5,
      "15m": 15,
      "30m": 30,
      "1d": 1440,
    };

    if (tf !== "1m" && tf !== "1d") {
      raw = aggregateCandles(raw, GROUP_MAP[tf]);
    }

    const times = raw.map((c) => c[0]);
    const opens = raw.map((c) => c[1]);
    const highs = raw.map((c) => c[2]);
    const lows = raw.map((c) => c[3]);
    const closes = raw.map((c) => c[4]);

    const price = closes[closes.length - 1];

    const ema20Val = ema(closes, 20);
    const ema50Val = ema(closes, 50);
    const ema200Val = ema(closes, 200);
    const rsiVal = rsi(closes, 14);

    const trend = deriveTrend(price, ema20Val, ema50Val, ema200Val);
    const signal = deriveSignal(price, ema20Val, rsiVal);
    const confidence = deriveConfidence(rsiVal);

    const updatedAt = new Date(times[times.length - 1]).toISOString();

    const chart = {
      o: opens,
      h: highs,
      l: lows,
      c: closes,
      t: times,
      tf,
    };

    return NextResponse.json({
      symbol,
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
    console.error("Error en /api/signals/crypto (CoinGecko):", err);
    return NextResponse.json(
      { error: "Error interno en el motor de señales" },
      { status: 500 }
    );
  }
}
