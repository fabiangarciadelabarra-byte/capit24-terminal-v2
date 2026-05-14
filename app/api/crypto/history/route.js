export const runtime = "nodejs";

import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";

    // 🔥 Usamos proxy para evitar bloqueo de Binance a Vercel
    const url = `https://corsproxy.io/?https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=500`;

    const { data } = await axios.get(url);

    const candles = data.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
    }));

    return Response.json(candles);
  } catch (error) {
    console.error("Proxy error:", error?.message);
    return Response.json([], { status: 200 });
  }
}
