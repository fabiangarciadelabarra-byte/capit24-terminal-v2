export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "200";

    const workerUrl = `https://binance-proxy.fabiangarciadelabarra.workers.dev/orderflow?symbol=${symbol}&limit=${limit}`;

    const response = await fetch(workerUrl);
    const raw = await response.text();

    let data = JSON.parse(raw);

    // Si aggTrades devuelve un array directo, úsalo tal cual
    if (Array.isArray(data)) {
      // OK
    } else if (data && typeof data === "object") {
      data = data.data || data.result || [];
    } else {
      data = [];
    }

    const trades = data.map(t => ({
      id: t.a,
      price: parseFloat(t.p),
      qty: parseFloat(t.q),
      time: t.T,
      isBuyerMaker: t.m
    }));

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
