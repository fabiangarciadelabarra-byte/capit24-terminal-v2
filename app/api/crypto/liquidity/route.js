export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "100";

    const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`;

    const res = await fetch(url);
    const data = await res.json();

    const bids = data.bids.map(([price, qty]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty)
    }));

    const asks = data.asks.map(([price, qty]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty)
    }));

    return Response.json({
      symbol,
      bids,
      asks
    });
  } catch (err) {
    console.error("Error fetching liquidity:", err);
    return Response.json({ error: "Failed to fetch liquidity" }, { status: 500 });
  }
}
