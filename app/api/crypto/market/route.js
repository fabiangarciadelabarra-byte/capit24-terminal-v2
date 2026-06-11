export async function GET() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY
      },
    });

    const data = await response.json();

    const formatted = data.map((coin) => ({
      symbol: coin.symbol?.toUpperCase() ?? "",
      name: coin.name ?? "",
      price: coin.current_price ?? 0,
      market_cap: coin.market_cap ?? 0,
      volume_24h: coin.total_volume ?? 0,
      change_24h: coin.price_change_percentage_24h ?? 0,
      image: coin.image ?? "",
      rank: coin.market_cap_rank ?? 0,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "CoinGecko error", details: error });
  }
}
