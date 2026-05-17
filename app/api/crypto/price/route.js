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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let symbol = searchParams.get("symbol") || "BTCUSDT";

  const cgSymbol = SYMBOL_MAP[symbol] || "bitcoin";

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cgSymbol}&vs_currencies=usd`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const data = await response.json();

  if (!data[cgSymbol]) {
    return Response.json({ error: "CoinGecko error", data });
  }

  return Response.json({
    symbol,
    price: data[cgSymbol].usd
  });
}
