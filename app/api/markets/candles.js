export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.FINNHUB_API_KEY;

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=60&from=1672531200&to=1704067200&token=${API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  return Response.json(json);
}
