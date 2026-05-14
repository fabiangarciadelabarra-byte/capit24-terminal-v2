export const runtime = "nodejs";

import axios from "axios";

const symbolToCoin = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  SOLUSDT: "solana",
  BNBUSDT: "binancecoin",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  DOGEUSDT: "dogecoin",
  AVAXUSDT: "avalanche-2",
  DOTUSDT: "polkadot",
  TRXUSDT: "tron",
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const coin = symbolToCoin[symbol] || "bitcoin";

    // 🔥 CoinGecko OHLC solo funciona bien con estos valores
    const days = "7"; // fuerza estabilidad

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=${days}`;

    const { data } = await axios.get(url);

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

    // 🔥 Nunca rompas el frontend
    return Response.json([], { status: 200 });
  }
}
