export async function GET() {
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&convert=USD";

  try {
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
      },
    });

    const json = await response.json();
    const data = json.data;

    const formatted = data.map((coin) => ({
      symbol: coin.symbol,
      name: coin.name,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      volume_24h: coin.quote.USD.volume_24h,
      change_24h: coin.quote.USD.percent_change_24h,
      rank: coin.cmc_rank,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "CMC error", details: error });
  }
}
