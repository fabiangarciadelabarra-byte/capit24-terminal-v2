const SYMBOL_MAP = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  SOLUSDT: "solana",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  BNBUSDT: "binancecoin",
  DOGEUSDT: "dogecoin",
  AVAXUSDT: "avalanche-2",
  DOTUSDT: "polkadot",
  LTCUSDT: "litecoin"
};

function groupCandles(prices, intervalMinutes) {
  const groups = {};

  prices.forEach(([timestamp, price]) => {
    const minute = Math.floor(timestamp / 1000 / 60);
    const bucket = Math.floor(minute / intervalMinutes);

    if (!groups[bucket]) {
      groups[bucket] = {
        time: bucket * intervalMinutes * 60,
        open: price,
        high: price,
        low: price,
        close: price
      };
    } else {
      groups[bucket].high = Math.max(groups[bucket].high, price);
      groups[bucket].low = Math.min(groups[bucket].low, price);
      groups[bucket].close = price;
    }
  });

  return Object.values(groups).sort((a, b) => a.time - b.time);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  let symbol = searchParams.get("symbol") || "BTCUSDT";
  let days = searchParams.get("days") || "1";
  let interval = searchParams.get("interval") || "1h";

  const cgSymbol = SYMBOL_MAP[symbol] || "bitcoin";

  const intervalMap = {
    "5m": 5,
    "15m": 15,
    "1h": 60,
    "4h": 240
  };

  const intervalMinutes = intervalMap[interval] || 60;

  const url = `https://api.coingecko.com/api/v3/coins/${cgSymbol}/market_chart?vs_currency=usd&days=${days}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const data = await response.json();

  if (!data.prices) {
    return Response.json({ error: "CoinGecko error", data });
  }

  const candles = groupCandles(data.prices, intervalMinutes);

  return Response.json(candles);
}
