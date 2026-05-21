export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || 1000;

    // URL del Worker Cloudflare (proxy)
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

    // Validación mínima
    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          error: "Binance no devolvió trades válidos",
          data
        }),
        { status: 500 }
      );
    }

    // Normalización del formato
    const trades = data.map((t) => ({
      id: t.id,
      price: t.price,
      qty: t.qty,
      quoteQty: t.quoteQty,
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
