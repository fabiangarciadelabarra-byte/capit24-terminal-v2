export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "1000";

    // Mirror oficial de Binance en Google Cloud
    const url = `https://api-gcp.binance.com/api/v3/trades?symbol=${symbol}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener orderflow desde Binance (GCP)",
          status: response.status
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    const trades = data.map(t => ({
      id: t.id,
      price: parseFloat(t.price),
      qty: parseFloat(t.qty),
      quoteQty: parseFloat(t.quoteQty),
      time: t.time,
      isBuyerMaker: t.isBuyerMaker
    }));

    return new Response(JSON.stringify(trades), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error interno en /api/crypto/orderflow",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
