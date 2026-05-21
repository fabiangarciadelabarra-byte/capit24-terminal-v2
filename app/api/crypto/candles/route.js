export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // FIX DEFINITIVO DEL PROBLEMA DEL SYMBOL
    let symbol = searchParams.get("symbol");
    if (!symbol || symbol === "null" || symbol === "undefined" || symbol.trim() === "") {
      symbol = "BTCUSDT";
    }

    const limit = searchParams.get("limit") || 100;

    // URL del Worker Cloudflare (proxy)
    const workerUrl = `https://dawn-sky-9923.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/depth&symbol=${symbol}&limit=${limit}`;

    const response = await fetch(workerUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener liquidez desde el proxy",
          status: response.status
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    // Validación mínima
    if (!data.bids || !data.asks) {
      return new Response(
        JSON.stringify({
          error: "Binance no devolvió bids/asks válidos",
          data
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error interno en /api/crypto/liquidity",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
