export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const interval = searchParams.get("interval") || "1h";
    const limit = searchParams.get("limit") || "200";

    // Usamos tu Worker en Cloudflare (EE.UU.)
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

    const data = await response.json();

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
