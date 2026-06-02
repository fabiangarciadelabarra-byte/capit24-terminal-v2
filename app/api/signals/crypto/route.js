import { NextResponse } from "next/server";

// ---------------------------------------------
// CACHE POR ACTIVO (independiente)
// ---------------------------------------------
const CACHE = {};
const CACHE_TTL = 30000; // 30 segundos

// ---------------------------------------------
// Helpers básicos
// ---------------------------------------------
function buildOhlc(prices) {
  return prices.map(([ts, price]) => ({
    time: Math.floor(ts / 1000),
    open: price,
    high: price,
    low: price,
    close: price,
  }));
}

function ema(values, period) {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const result = new Array(values.length - period + 1);

  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result[0] = prev;

  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    result[i - period + 1] = prev;
  }

  return result;
}

function rsi(values, period = 14) {
  if (values.length <= period) return [];

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  gains /= period;
  losses /= period;

  const result = [];
  let rs = losses === 0 ? 0 : gains / losses;
  result.push(100 - 100 / (1 + rs));

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains = (gains * (period - 1) + (diff > 0 ? diff : 0)) / period;
    losses = (losses * (period - 1) + (diff < 0 ? -diff : 0)) / period;

    rs = losses === 0 ? 0 : gains / losses;
    result.push(100 - 100 / (1 + rs));
  }

  return result;
}

// ---------------------------------------------
// Indicadores avanzados: MACD, ADX, Momentum
// ---------------------------------------------
function macd(values, fast = 12, slow = 26, signalPeriod = 9) {
  if (values.length < slow + signalPeriod) return { macdLine: [], signalLine: [], histogram: [] };

  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const offset = emaSlow.length - emaFast.length;
  const macdLine = emaFast.map((v, i) => v - emaSlow[i + offset]);
  const signalLine = ema(macdLine, signalPeriod);
  const histOffset = macdLine.length - signalLine.length;
  const histogram = signalLine.map((v, i) => macdLine[i + histOffset] - v);

  return { macdLine, signalLine, histogram };
}

function adx(values, period = 14) {
  if (values.length <= period + 1) return [];

  const trs = [];
  const plusDM = [];
  const minusDM = [];

  for (let i = 1; i < values.length; i++) {
    const upMove = values[i] - values[i - 1];
    const downMove = values[i - 1] - values[i];

    trs.push(Math.abs(values[i] - values[i - 1]));
    plusDM.push(upMove > 0 && upMove > downMove ? upMove : 0);
    minusDM.push(downMove > 0 && downMove > upMove ? downMove : 0);
  }

  const tr14 = [];
  const plusDM14 = [];
  const minusDM14 = [];

  let trSum = trs.slice(0, period).reduce((a, b) => a + b, 0);
  let plusSum = plusDM.slice(0, period).reduce((a, b) => a + b, 0);
  let minusSum = minusDM.slice(0, period).reduce((a, b) => a + b, 0);

  tr14.push(trSum);
  plusDM14.push(plusSum);
  minusDM14.push(minusSum);

  for (let i = period; i < trs.length; i++) {
    trSum = trSum - trs[i - period] + trs[i];
    plusSum = plusSum - plusDM[i - period] + plusDM[i];
    minusSum = minusSum - minusDM[i - period] + minusDM[i];

    tr14.push(trSum);
    plusDM14.push(plusSum);
    minusDM14.push(minusSum);
  }

  const adxValues = [];
  for (let i = 0; i < tr14.length; i++) {
    if (tr14[i] === 0) {
      adxValues.push(0);
      continue;
    }
    const plusDI = (plusDM14[i] / tr14[i]) * 100;
    const minusDI = (minusDM14[i] / tr14[i]) * 100;
    const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI || 1)) * 100;
    adxValues.push(dx);
  }

  const result = [];
  const smoothPeriod = period;
  if (adxValues.length < smoothPeriod) return [];

  let first = adxValues.slice(0, smoothPeriod).reduce((a, b) => a + b, 0) / smoothPeriod;
  result.push(first);

  for (let i = smoothPeriod; i < adxValues.length; i++) {
    const val = (result[result.length - 1] * (smoothPeriod - 1) + adxValues[i]) / smoothPeriod;
    result.push(val);
  }

  return result;
}

function momentum(values, period = 10) {
  if (values.length <= period) return [];
  const result = [];
  for (let i = period; i < values.length; i++) {
    result.push(values[i] - values[i - period]);
  }
  return result;
}

function volumeProxy(values, period = 10) {
  if (values.length <= period) return [];
  const result = [];
  for (let i = period; i < values.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += Math.abs(values[j] - values[j - 1]);
    }
    result.push(sum);
  }
  return result;
}

// ---------------------------------------------
// ALGORITMO DE SEÑALES PRO
// ---------------------------------------------
function generateProSignal({ ema20, ema50, ema200, rsi, macdHist, adxValue, momValue, volNow, volPrev }) {
  let trend = "SIDEWAYS";

  if (ema20 && ema50 && ema200) {
    if (ema20 > ema50 && ema50 > ema200) trend = "UPTREND";
    if (ema20 < ema50 && ema50 < ema200) trend = "DOWNTREND";
  }

  let score = 0;
  let signal = "HOLD";

  if (ema20 && ema50) {
    if (ema20 > ema50) score += 15;
    if (ema20 < ema50) score -= 15;
  }
  if (ema20 && ema200) {
    if (ema20 > ema200) score += 20;
    if (ema20 < ema200) score -= 20;
  }

  if (rsi !== null && rsi !== undefined) {
    if (rsi < 30) score += 20;
    if (rsi > 70) score -= 20;
  }

  if (macdHist !== null && macdHist !== undefined) {
    if (macdHist > 0) score += 15;
    if (macdHist < 0) score -= 15;
  }

  if (adxValue !== null && adxValue !== undefined) {
    if (adxValue > 25) score *= 1.2;
  }

  if (momValue !== null && momValue !== undefined) {
    if (momValue > 0) score += 10;
    if (momValue < 0) score -= 10;
  }

  if (volNow !== null && volPrev !== null && volNow !== undefined && volPrev !== undefined) {
    if (volNow > volPrev) score *= 1.1;
    if (volNow < volPrev) score *= 0.9;
  }

  const maxAbs = 100;
  if (score > maxAbs) score = maxAbs;
  if (score < -maxAbs) score = -maxAbs;

  const confidence = Math.round(Math.abs(score));

  if (score >= 60) signal = "STRONG BUY";
  else if (score >= 20) signal = "BUY";
  else if (score <= -60) signal = "STRONG SELL";
  else if (score <= -20) signal = "SELL";
  else signal = "HOLD";

  return { signal, confidence, trend };
}

// ---------------------------------------------
// Mapeo CoinGecko
// ---------------------------------------------
const COINGECKO_IDS = {
  btc: "bitcoin",
  eth: "ethereum",
  ada: "cardano",
  atom: "cosmos",
  sol: "solana",
  bnb: "binancecoin",
  xrp: "ripple",
  dot: "polkadot",
  matic: "matic-network",
  avax: "avalanche-2",
  algo: "algorand",
  apt: "aptos",
  arb: "arbitrum",
  axs: "axie-infinity",
  bat: "basic-attention-token",
  bch: "bitcoin-cash",
  fil: "filecoin",
  near: "near",
  hbar: "hedera-hashgraph",
  xlm: "stellar",
  trx: "tron",
  doge: "dogecoin",
  rune: "thorchain",
  ftm: "fantom",
  ltc: "litecoin",
  egld: "elrond-erd-2",
  vet: "vechain",
  mana: "decentraland",
  sand: "the-sandbox",
  imx: "immutable-x",
  ldo: "lido-dao",
  stx: "blockstack",
  kas: "kaspa",
  bonk: "bonk",
  jup: "jupiter-exchange-solana",
  pyth: "pyth-network",
  xmr: "monero",
  qnt: "quant-network",
  cro: "crypto-com-chain",
  flow: "flow",
  chz: "chiliz",
  theta: "theta-token",
  snx: "synthetix-network-token",
  crv: "curve-dao-token",
  dydx: "dydx",
  gmx: "gmx",
  lrc: "loopring",
  enj: "enjincoin",
  zec: "zcash",
  dash: "dash",
  kava: "kava",
  celo: "celo",
  mina: "mina-protocol",
  osmo: "osmosis",
  rose: "oasis-network",
  one: "harmony",
  xtz: "tezos",
  klay: "klay-token",
  waves: "waves",
  hot: "holotoken",
  zil: "zilliqa",
  gala: "gala",
  pepe: "pepe",
  floki: "floki",
  sei: "sei-network",
  woo: "woo-network",
  jasmy: "jasmycoin",
  ondo: "ondo-finance"
};

// ---------------------------------------------
// ENDPOINT PRINCIPAL PRO (90 días)
// ---------------------------------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol")?.toLowerCase() || "btc";

    const id = COINGECKO_IDS[symbol];
    if (!id) {
      return NextResponse.json(
        { error: `Symbol '${symbol}' no está mapeado en CoinGecko.` },
        { status: 400 }
      );
    }

    const now = Date.now();

    if (CACHE[symbol] && now - CACHE[symbol].timestamp < CACHE_TTL) {
      return NextResponse.json(CACHE[symbol].data);
    }

    const currentRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true`
    );

    let price = null;
    if (currentRes.ok) {
      const current = await currentRes.json();
      price = current?.market_data?.current_price?.usd ?? null;
    }

    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=90`
    );

    const chartData = chartRes.ok ? await chartRes.json() : { prices: [] };
    const closes = chartData.prices.map(([, p]) => p);
    const times = chartData.prices.map(([ts]) => Math.floor(ts / 1000));

    if ((price === null || price === undefined) && closes.length > 0) {
      price = closes[closes.length - 1];
    }

    const ema20Raw = ema(closes, 20);
    const ema50Raw = ema(closes, 50);
    const ema200Raw = ema(closes, 200);
    const rsiRaw = rsi(closes, 14);

    const { macdLine, signalLine, histogram } = macd(closes);
    const adxRaw = adx(closes);
    const momRaw = momentum(closes);
    const volRaw = volumeProxy(closes);

    const ema20 = ema20Raw.at(-1) ?? null;
    const ema50 = ema50Raw.at(-1) ?? null;
    const ema200 = ema200Raw.at(-1) ?? null;
    const rsiValue = rsiRaw.at(-1) ?? null;
    const macdHist = histogram.at(-1) ?? null;
    const adxValue = adxRaw.at(-1) ?? null;
    const momValue = momRaw.at(-1) ?? null;
    const volNow = volRaw.at(-1) ?? null;
    const volPrev = volRaw.length > 1 ? volRaw[volRaw.length - 2] : null;

    const { signal, confidence, trend } = generateProSignal({
      ema20,
      ema50,
      ema200,
      rsi: rsiValue,
      macdHist,
      adxValue,
      momValue,
      volNow,
      volPrev
    });

    const response = {
      symbol,
      price,
      indicators: {
        ema20,
        ema50,
        ema200,
        rsi: rsiValue,
        macdHist,
        adx: adxValue,
        momentum: momValue
      },
      signal,
      confidence,
      trend,
      chart: {
        ohlc: buildOhlc(chartData.prices)
      }
    };

    CACHE[symbol] = {
      timestamp: now,
      data: response
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
