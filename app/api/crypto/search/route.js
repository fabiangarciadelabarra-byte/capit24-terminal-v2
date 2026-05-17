export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json([]);
  }

  const url = `https://api.coingecko.com/api/v3/search?query=${query}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const data = await res.json();

    const results = data.coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.thumb,
    }));

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: "Search error", details: error });
  }
}
