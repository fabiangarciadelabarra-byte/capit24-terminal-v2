export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "100";

    const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`;

    const res = await fetch(url);

    // Binance a veces devuelve HTML o texto → lo capturamos
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Binance devolvió HTML o texto no JSON:", text);
      return Response.json({ error: "Invalid response from Binance" }, { status: 500 });
    }

    // Validación: bids y asks deben existir y ser arrays
    if (!data || !Array.isArray(data.bids) || !Array.isArray(data.asks)) {
      console.error("Binance NO devolvió bids/asks válidos:", data);
      return Response.json({ error: "Unexpected Binance response" }, { status: 500 });
    }

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
