import { NextResponse } from "next/server";

// ---------------------------------------------
// Helpers para indicadores
// ---------------------------------------------
function buildOhlcFromPrices(prices) {
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
  const result = [];
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(prev);

  for (let i = period; i < values.length; i++) {
    const current = values[i] * k + prev * (1 - k);
    result.push(current);
    prev = current;
  }
  return result;
}

function rsi(values, period = 14) {
  if (values.length <= period) return [];
  const gains = [];
  const losses = [];

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const result = [];
  let rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
  result.push(100 - 100 / (1 + rs));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }

  return result;
}

// ---------------------------------------------
// Mapeo COMPLETO de símbolos → IDs CoinGecko
// ---------------------------------------------
const COINGECKO_IDS = {
  btc: "bitcoin",
  eth: "ethereum",
  usdt: "tether",
  bnb: "binancecoin",
  sol: "solana",
  xrp: "ripple",
  usdc: "usd-coin",
  ada: "cardano",
  avax: "avalanche-2",
  doge: "dogecoin",
  trx: "tron",
  ton: "the-open-network",
  dot: "polkadot",
  matic: "matic-network",
  link: "chainlink",
  ltc: "litecoin",
  bch: "bitcoin-cash",
  xlm: "stellar",
  atom: "cosmos",
  fil: "filecoin",
  apt: "aptos",
  arb: "arbitrum",
  op: "optimism",
  inj: "injective-protocol",
  near: "near",
  hbar: "hedera-hashgraph",
  sui: "sui",
  aave: "aave",
  mkr: "maker",
  rune: "thorchain",
  algo: "algorand",
  egld: "elrond-erd-2",
  vet: "vechain",
  ftm: "fantom",
  grt: "the-graph",
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
  axs: "axie-infinity",
  theta: "theta-token",
  snx: "synthetix-network-token",
  crv: "curve-dao-token",
  dydx: "dydx",
  gmx: "gmx",
  lrc: "loopring",
  enj: "enjincoin",
  bat: "basic-attention-token",
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
// ENDPOINT PRINCIPAL
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

    // 1) Datos actuales
    const currentRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true`
    );

    if (!currentRes.ok) {
      return NextResponse.json(
        { error: "Error obteniendo datos actuales" },
        { status: 500 }
      );
    }

    const current = await currentRes.json();

    const price = current.market_data.current_price.usd;
    const ema20 = current.market_data.ema_20 || null;
    const ema50 = current.market_data.ema_50 || null;
    const ema200 = current.market_data.ema_200 || null;
    const rsiValue = current.market_data.rsi_14 || null;

    // 2) Datos históricos
    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
    );

    const chartData = chartRes.ok ? await chartRes.json() : { prices: [] };

    const ohlc = buildOhlcFromPrices(chartData.prices || []);
    const closes = (chartData.prices || []).map(([, p]) => p);
    const baseTimes = (chartData.prices || []).map(([ts]) =>
      Math.floor(ts / 1000)
    );

    // 3) Indicadores históricos
    const ema20Values = ema(closes, 20);
    const ema50Values = ema(closes, 50);
    const ema200Values = ema(closes, 200);
    const rsiValues = rsi(closes, 14);

    const ema20Series = ema20Values.map((v, i) => ({
      time: baseTimes[i + (closes.length - ema20Values.length)],
      value: v,
    }));

    const ema50Series = ema50Values.map((v, i) => ({
      time: baseTimes[i + (closes.length - ema50Values.length)],
      value: v,
    }));

    const ema200Series = ema200Values.map((v, i) => ({
      time: baseTimes[i + (closes.length - ema200Values.length)],
      value: v,
    }));

    const rsiSeries = rsiValues.map((v, i) => ({
      time: baseTimes[i + (closes.length - rsiValues.length)],
      value: v,
    }));

    // 4) Respuesta final
    return NextResponse.json({
      symbol,
      price,
      indicators: {
        rsi: rsiValue,
        ema20,
        ema50,
        ema200,
      },
      volume: {
        lastVolume: current.market_data.total_volume.usd || 0,
      },
      chart: {
        ohlc,
        rsi: rsiSeries,
        ema20: ema20Series,
        ema50: ema50Series,
        ema200: ema200Series,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
