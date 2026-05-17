export async function GET() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const data = await response.json();

    const formatted = data.map((coin) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      market_cap: coin.market_cap,
      volume_24h: coin.total_volume,
      change_24h: coin.price_change_percentage_24h,
      image: coin.image,
      rank: coin.market_cap_rank,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "CoinGecko error", details: error });
  }
}
