export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "bitcoin";

  // CoinGecko usa IDs, no tickers. Ejemplos:
  // BTC = bitcoin
  // ETH = ethereum
  // SOL = solana
  // XRP = ripple
  // ADA = cardano

  const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=1&interval=hourly`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const data = await response.json();

  if (!data.prices) {
    return Response.json({ error: "CoinGecko error", data });
  }

  // Convertimos el formato de CoinGecko a OHLC
  const candles = data.prices.map((p, i) => {
    const time = p[0] / 1000;
    const price = p[1];

    // CoinGecko no da OHLC por hora, así que usamos el precio como close
    return {
      time,
      open: price,
      high: price,
      low: price,
      close: price
    };
  });

  return Response.json(candles);
}

