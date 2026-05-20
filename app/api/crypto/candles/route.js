export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const interval = searchParams.get("interval") || "1h";
    const limit = searchParams.get("limit") || "200";

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Binance devolvió HTML o texto no JSON:", text);
      return Response.json({ error: "Invalid response from Binance" }, { status: 500 });
    }

    if (!Array.isArray(data)) {
      console.error("Binance NO devolvió un array:", data);
      return Response.json({ error: "Unexpected Binance response" }, { status: 500 });
    }

    const formatted = data.map(c => ({
      time: c[0] / 1000,
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4])
    }));

    return Response.json(formatted);

  } catch (err) {
    console.error("Error fetching candles:", err);
    return Response.json({ error: "Failed to fetch candles" }, { status: 500 });
  }
}
