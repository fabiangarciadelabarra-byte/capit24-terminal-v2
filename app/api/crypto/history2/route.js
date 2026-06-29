export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // CoinGecko usa nombres de monedas, no pares tipo BTCUSDT
    const symbol = (searchParams.get("symbol") || "bitcoin").toLowerCase();
    const interval = searchParams.get("interval") || "1h";

    // CoinGecko solo acepta días, no intervalos exactos
    const daysMap = {
      "1m": 1,
      "5m": 1,
      "15m": 1,
      "30m": 1,
      "1h": 1,
      "4h": 7,
      "1d": 30
    };

    const days = daysMap[interval] || 1;

    const url = `https://api.coingecko.com/api/v3/coins/${symbol}/ohlc?vs_currency=usd&days=${days}`;

    const response = await fetch(url);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error al obtener OHLC desde CoinGecko",
          status: response.status
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          error: "CoinGecko devolvió un formato inesperado",
          details: data
        }),
        { status: 500 }
      );
    }

    // Convertir velas al formato estándar
    const candles = data.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4]
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
