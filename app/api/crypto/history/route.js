export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "bitcoin";

  // CoinGecko: precios por minuto para 1 día
  const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const data = await response.json();

  if (!data.prices) {
    return Response.json({ error: "CoinGecko error", data });
  }

  // Agrupar por hora
  const groups = {};

  data.prices.forEach(([timestamp, price]) => {
    const hour = Math.floor(timestamp / 1000 / 3600); // agrupación por hora

    if (!groups[hour]) {
      groups[hour] = {
        time: hour * 3600,
        open: price,
        high: price,
        low: price,
        close: price
      };
    } else {
      groups[hour].high = Math.max(groups[hour].high, price);
      groups[hour].low = Math.min(groups[hour].low, price);
      groups[hour].close = price;
    }
  });

  // Convertir a array ordenado
  const candles = Object.values(groups).sort((a, b) => a.time - b.time);

  return Response.json(candles);
}
