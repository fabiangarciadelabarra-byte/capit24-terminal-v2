export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return Response.json({ error: "Missing symbol" });
  }

  // CoinGecko usa IDs, no símbolos. Necesitamos buscar el ID primero.
  const searchUrl = `https://api.coingecko.com/api/v3/search?query=${symbol}`;

  try {
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const searchData = await searchRes.json();

    if (!searchData.coins || searchData.coins.length === 0) {
      return Response.json({ error: "Symbol not found" });
    }

    const coinId = searchData.coins[0].id;

    // Ahora pedimos la info completa del activo
    const infoUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;

    const infoRes = await fetch(infoUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const info = await infoRes.json();

    const formatted = {
      id: info.id,
      name: info.name,
      symbol: info.symbol.toUpperCase(),
      image: info.image.large,
      market_cap: info.market_data.market_cap.usd,
      circulating_supply: info.market_data.circulating_supply,
      total_supply: info.market_data.total_supply,
      ath: info.market_data.ath.usd,
      ath_date: info.market_data.ath_date.usd,
      description: info.description.en,
      rank: info.market_cap_rank,
    };

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "Info error", details: error });
  }
}
