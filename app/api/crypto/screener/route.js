export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false";

    const res = await fetch(url, {
      headers: { "x-cg-demo-api-key": "CG-7f5f8c1f-4b2a-4b8a-8c1d-1234567890" }
    });

    const data = await res.json();

    const filtered = data.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
    );

    return Response.json(filtered);
  } catch (err) {
    console.error("Error fetching screener:", err);
    return Response.json({ error: "Failed to fetch screener" }, { status: 500 });
  }
}
