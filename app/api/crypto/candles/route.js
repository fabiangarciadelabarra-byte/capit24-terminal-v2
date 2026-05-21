export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const interval = searchParams.get("interval") || "1h";
    const limit = searchParams.get("limit") || 500;

    // URL del Worker Cloudflare (proxy)
    const workerUrl = `https://dawn-sky-9923.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/klines&symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(workerUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener candles desde el proxy",
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
          error: "Binance no devolvió velas válidas",
          data
        }),
        { status: 500 }
      );
    }

    // Formato estándar OHLC
    const candles = data.map((c) => ({
      openTime: c[0],
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
      volume: c[5],
      closeTime: c[6]
    }));

    return new Response(JSON.stringify(candles), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error interno en /api/crypto/candles",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
