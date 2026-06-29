export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const tf = searchParams.get("tf") || "1";

  if (!symbol) {
    return Response.json({ error: "Missing symbol" }, { status: 400 });
  }

  const url = `https://capit24.com/api/candles?symbol=${symbol}&tf=${tf}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Candle error", details: err });
  }
}
