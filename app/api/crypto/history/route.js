export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=500`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const data = await response.json();

  // Si Binance bloquea la IP, devolvemos el mensaje tal cual
  if (!Array.isArray(data)) {
    return Response.json({ error: "Binance error", data });
  }

  const candles = data.map(c => ({
    time: c[0] / 1000,
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4])
  }));

  return Response.json(candles);
}
