export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return Response.json({ error: "Missing symbol" }, { status: 400 });
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return Response.json(json);
  } catch (err) {
    return Response.json({ error: "Finnhub error", details: err });
  }
}

