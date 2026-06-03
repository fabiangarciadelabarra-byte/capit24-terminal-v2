import { NextResponse } from "next/server";

// Timeframe mapping for Binance
const TF_MAP = {
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
};

const ALLOWED_TF = Object.keys(TF_MAP);

// Binance symbols
const SYMBOL_MAP = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  bnb: "BNBUSDT",
  ada: "ADAUSDT",
  atom: "ATOMUSDT",
  aave: "AAVEUSDT",
  algo: "ALGOUSDT",
  avax: "AVAXUSDT",
  sol: "SOLUSDT",
  xrp: "XRPUSDT",
};

// ----------------------
//   INDICATOR HELPERS
// ----------------------

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

function adx(highs, lows, closes, period = 14) {
  if (
    highs.length < period + 1 ||
    lows.length < period + 1 ||
    closes.length < period + 1
  )
    return null;

  const tr = [];
  const plusDM = [];
  const minusDM = [];

  for (let i = 1; i < highs.length; i++) {
    const highDiff = highs[i] - highs[i - 1];
    const lowDiff = lows[i - 1] - lows[i];

    const trueRange = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    tr.push(trueRange);

    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
  }

  const smooth = (arr) => {
    let sum = arr.slice(0, period).reduce((a, b) => a + b, 0);
    const result = [sum];
    for (let i = period; i < arr.length; i++) {
      sum = result[result.length - 1] - result[result.length - 1] / period + arr[i];
      result.push(sum);
    }
    return result;
  };

  const trSmooth = smooth(tr);
  const plusSmooth = smooth(plusDM);
  const minusSmooth = smooth(minusDM);

  const plusDI = plusSmooth.map((v, i) => (v / trSmooth[i]) * 100);
  const minusDI = minusSmooth.map((v, i) => (v / trSmooth[i]) * 100);

  const dx = plusDI.map((v, i) => {
    const diff = Math.abs(v - minusDI[i]);
    const sum = v + minusDI[i];
    return sum === 0 ? 0 : (diff / sum) * 100;
  });

  const adxArr = [];
  let adxVal =
    dx.slice(0, period).reduce((a, b) => a + b, 0) / period;
  adxArr.push(adxVal);

  for (let i = period; i < dx.length; i++) {
    adxVal = (adxVal * (period - 1) + dx[i]) / period;
    adxArr.push(adxVal);
  }

  return adxArr[adxArr.length - 1];
}

function momentum(values, period = 10) {
  if (values.length < period + 1) return null;
  const last = values[values.length - 1];
  const prev = values[values.length - 1 - period];
  return last - prev;
}

function deriveTrend(price, ema20Val, ema50Val, ema200Val) {
  if (!ema20Val || !ema50Val || !ema200Val) return "neutral";
  if (price > ema20Val && ema20Val > ema50Val && ema50Val > ema200Val)
    return "uptrend";
  if (price < ema20Val && ema20Val < ema50Val && ema50Val < ema200Val)
    return "downtrend";
  return "neutral";
}

function deriveSignal(price, ema20Val, rsiVal, adxVal) {
  if (!ema20Val || !rsiVal) return "HOLD";

  if (price > ema20Val && rsiVal > 55) {
    if (!adxVal || adxVal >= 20) return "BUY";
  }

  if (price < ema20Val && rsiVal < 45) {
    if (!adxVal || adxVal >= 20) return "SELL";
  }

  return "HOLD";
}

function deriveConfidence(rsiVal, adxVal) {
  if (!rsiVal) return 0;
  const distFrom50 = Math.abs(rsiVal - 50);
  const rsiScore = Math.min(distFrom50 * 2, 100);
  const adxScore = adxVal ? Math.min(adxVal, 50) * 2 : 40;
  return Math.round(rsiScore * 0.6 + adxScore * 0.4);
}

// ----------------------
//   MAIN HANDLER
// ----------------------

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

    const tf = ALLOWED_TF.includes(tfParam) ? tfParam : "1h";
    const interval = TF_MAP[tf];
    const binanceSymbol = SYMBOL_MAP[symbolParam];

    // Use proxy to bypass Cloudflare/WAF
    const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=300`;
    const proxyUrl = `https://capit24-terminal-v2.vercel.app/api/proxy/binance?url=${encodeURIComponent(url)}`;

    const resp = await fetch(proxyUrl);

    if (!resp.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos de Binance" },
        { status: 502 }
      );
    }

    const raw = await resp.json();

    const opens = raw.map((c) => parseFloat(c[1]));
    const highs = raw.map((c) => parseFloat(c[2]));
    const lows = raw.map((c) => parseFloat(c[3]));
    const closes = raw.map((c) => parseFloat(c[4]));
    const times = raw.map((c) => c[0]);

    const price = closes[closes.length - 1];

    const ema20Val = ema(closes, 20);
    const ema50Val = ema(closes, 50);
    const ema200Val = ema(closes, 200);
    const rsiVal = rsi(closes, 14);
    const adxVal = adx(highs, lows, closes, 14);
    const momVal = momentum(closes, 10);

    const trend = deriveTrend(price, ema20Val, ema50Val, ema200Val);
    const signal = deriveSignal(price, ema20Val, rsiVal, adxVal);
    const confidence = deriveConfidence(rsiVal, adxVal);

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
      symbol: symbolParam,
      price,
      indicators: {
        ema20: ema20Val,
        ema50: ema50Val,
        ema200: ema200Val,
        rsi: rsiVal,
        adx: adxVal,
        momentum: momVal,
      },
      trend,
      signal,
      confidence,
      updatedAt,
      chart,
      timeframe: tf,
    });
  } catch (err) {
    console.error("Error en /api/signals/crypto:", err);
    return NextResponse.json(
      { error: "Error interno en el motor de señales" },
      { status: 500 }
    );
  }
}
