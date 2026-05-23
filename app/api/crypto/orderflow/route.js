export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "200";

    const workerUrl = `https://binance-proxy.fabiangarciadelabarra.workers.dev/orderflow?symbol=${symbol}&limit=${limit}`;

    const response = await fetch(workerUrl);

    // Si Cloudflare devuelve vacío, NO intentes parsear
    const raw = await response.text();

    if (!raw || raw.trim() === "") {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" }
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      // Si no es JSON válido, devuelve vacío
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Si Binance devuelve array directo
    if (Array.isArray(data)) {
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Si viene envuelto en data o result
    const trades = data.data || data.result || [];

    return new Response(JSON.stringify(trades), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Orderflow API error",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
