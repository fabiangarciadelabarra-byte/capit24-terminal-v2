export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "500";

    const url = `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`;

    const res = await fetch(url);
    const data = await res.json();

    let buyVolume = 0;
    let sellVolume = 0;

    data.forEach(t => {
      const qty = parseFloat(t.q);
      if (t.m) {
        // m = true → buyer is market maker → SELL
        sellVolume += qty;
      } else {
        // m = false → buyer is taker → BUY
        buyVolume += qty;
      }
    });

    return Response.json({
      symbol,
      buyVolume,
      sellVolume,
      delta: buyVolume - sellVolume,
      trades: data.length
    });
  } catch (err) {
    console.error("Error fetching orderflow:", err);
    return Response.json({ error: "Failed to fetch orderflow" }, { status: 500 });
  }
}
