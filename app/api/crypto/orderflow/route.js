export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "1000";

    // Usar tu Worker como proxy
    const workerUrl = `https://dawn-sky-9923.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/trades&symbol=${symbol}&limit=${limit}`;

    const response = await fetch(workerUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener orderflow desde el proxy",
          status: response.status
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          error: "Binance no devolvió trades válidos",
          data
        }),
        { status: 500 }
      );
    }

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

