export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "1000";

    const url = `https://binance-proxy.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/trades&symbol=${symbol}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener orderflow desde Binance (Proxy)",
          status: response.status
        }),
        { status: 500 }
      );
    }

    // FIX: Binance devuelve texto, no JSON directo
    const raw = await response.text();
    const data = JSON.parse(raw);

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
