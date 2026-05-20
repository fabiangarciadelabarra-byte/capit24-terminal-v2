export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "500";

    const url = `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`;

    const res = await fetch(url);

    // Binance a veces devuelve HTML o texto → lo capturamos
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Binance devolvió HTML o texto no JSON:", text);
      return Response.json(
        { error: "Invalid response from Binance" },
        { status: 500 }
      );
    }

    // Validación: debe ser array
    if (!Array.isArray(data)) {
      console.error("Binance NO devolvió un array:", data);
      return Response.json(
        { error: "Unexpected Binance response" },
        { status: 500 }
      );
    }

    let buyVolume = 0;
    let sellVolume = 0;

    data.forEach((t) => {
      const qty = parseFloat(t.q || 0);
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
      trades: data.length,
    });
  } catch (err) {
    console.error("Error fetching orderflow:", err);
    return Response.json(
      { error: "Failed to fetch orderflow" },
      { status: 500 }
    );
  }
}
