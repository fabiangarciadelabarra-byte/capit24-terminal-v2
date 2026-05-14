export const runtime = "nodejs";

import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coin = searchParams.get("coin") || "bitcoin";
    const days = searchParams.get("days") || "1";

    // 🔥 USAMOS EL ENDPOINT CORRECTO PARA VELAS
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=${days}`;

    const { data } = await axios.get(url);

    // 🔥 FORMATO CORRECTO PARA CANDLESTICK
    const candles = data.map(([timestamp, open, high, low, close]) => ({
      time: Math.floor(timestamp / 1000),
      open,
      high,
      low,
      close,
    }));

    return Response.json(candles);
  } catch (error) {
    console.error("OHLC error:", error?.message);
    return Response.json({ error: true }, { status: 500 });
  }
}

