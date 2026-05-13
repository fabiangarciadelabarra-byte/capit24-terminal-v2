export const runtime = "nodejs";

import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coin = searchParams.get("coin") || "bitcoin";

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1&interval=hourly`;

    const { data } = await axios.get(url);

    const prices = data.prices.map(([timestamp, price]) => ({
      time: Math.floor(timestamp / 1000),
      value: price,
    }));

    return Response.json(prices);
  } catch (error) {
    return Response.json({ error: true }, { status: 500 });
  }
}
