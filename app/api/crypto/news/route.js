export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return Response.json({ error: "Missing symbol" });
  }

  const url = `https://cryptopanic.com/api/v1/posts/?auth_token=bb8e6e8b7f7a0b7b8a&currencies=${symbol}&public=true`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const data = await res.json();

    const formatted = data.results.map((item) => ({
      title: item.title,
      source: item.source.title,
      url: item.url,
      published_at: item.published_at,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "News error", details: error });
  }
}
