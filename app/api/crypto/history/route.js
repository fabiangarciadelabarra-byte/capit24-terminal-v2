export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const interval = searchParams.get("interval") || "1h";
    const limit = searchParams.get("limit") || "200";

    const url = `https://binance-proxy.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/klines&symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener histórico desde Binance (Proxy)",
          status: response.status
        }),
        { status: 500 }
      );
    }

    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      // Si no es JSON, devuelve texto plano
      return new Response(
        JSON.stringify({
          error: "Respuesta no válida desde Binance",
          raw
        }),
        { status: 500 }
      );
    }

    // Si es string o no tiene formato esperado
    if (typeof data === "string") {
      return new Response(
        JSON.stringify({
          error: "Binance devolvió texto en lugar de JSON",
          details: data
        }),
        { status: 500 }
      );
    }

    // Si tiene propiedad 'data' y es array
    if (data && Array.isArray(data.data)) {
      data = data.data;
    }

    // Si no es array, devuelve error con contenido
    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          error: "Binance devolvió un formato inesperado",
          details: data
        }),
        { status: 500 }
      );
    }

    // Procesar velas
    const candles = data.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
      volume: parseFloat(c[5])
    }));

    return new Response(JSON.stringify(candles), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error interno en /api/crypto/history",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
