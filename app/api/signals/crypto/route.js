import { NextResponse } from "next/server";

// ---------------------------------------------
// CACHE POR ACTIVO (independiente)
// ---------------------------------------------
const CACHE = {};
const CACHE_TTL = 30000; // 30 segundos

// ---------------------------------------------
// Helpers optimizados
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
// ALGORITMO TIPO BINANCE (SEÑALES)
// ---------------------------------------------
function generateSignal({ ema20, ema50, ema200, rsi }) {
  let trend = "SIDEWAYS";

  if (ema20 > ema50 && ema50 > ema200) trend = "UPTREND";
  if (ema20 < ema50 && ema50 < ema200) trend = "DOWNTREND";

  // Señales fuertes
  if (ema20 > ema50 && rsi < 30) return { signal: "BUY", confidence: 80, trend };
  if (ema20 < ema50 && rsi > 70) return { signal: "SELL", confidence: 80, trend };

  // Señales moderadas
  if (ema20 > ema50) return { signal: "BUY", confidence: 60, trend };
  if (ema20 < ema50) return { signal: "SELL", confidence: 60, trend };

  // Mercado lateral
  return { signal: "HOLD", confidence: 0, trend };
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
// ENDPOINT PRINCIPAL CORREGIDO + SEÑALES BINANCE
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

    if (!currentRes.ok) {
      if (CACHE[symbol]) return NextResponse.json(CACHE[symbol].data);
      return NextResponse.json({ error: "Error obteniendo datos actuales" }, { status: 500 });
    }

    const current = await currentRes.json();
    const price = current.market_data.current_price.usd;

    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
    );

    const chartData = chartRes.ok ? await chartRes.json() : { prices: [] };

    const closes = chartData.prices.map(([, p]) => p);
    const times = chartData.prices.map(([ts]) => Math.floor(ts / 1000));

    const ema20Raw = ema(closes, 20);
    const ema50Raw = ema(closes, 50);
    const ema200Raw = ema(closes, 200);
    const rsiRaw = rsi(closes, 14);

    const ema20 = ema20Raw.at(-1) || null;
    const ema50 = ema50Raw.at(-1) || null;
    const ema200 = ema200Raw.at(-1) || null;
    const rsiValue = rsiRaw.at(-1) || null;

    const { signal, confidence, trend } = generateSignal({
      ema20,
      ema50,
      ema200,
      rsi: rsiValue
    });

    const response = {
      symbol,
      price,
      indicators: {
        ema20,
        ema50,
        ema200,
        rsi: rsiValue
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
