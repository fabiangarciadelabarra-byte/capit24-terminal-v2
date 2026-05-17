export const runtime = "nodejs";

import axios from "axios";

export async function GET() {
  try {
    const ids = [
      "bitcoin",
      "ethereum",
      "solana",
      "binancecoin",
      "ripple",
      "cardano",
      "dogecoin",
      "avalanche-2",
      "polkadot",
      "tron"
    ].join(",");

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

    const { data } = await axios.get(url, { timeout: 5000 });

    return Response.json({
      BTC: data.bitcoin,
      ETH: data.ethereum,
      SOL: data.solana,
      BNB: data.binancecoin,
      XRP: data.ripple,
      ADA: data.cardano,
      DOGE: data.dogecoin,
      AVAX: data["avalanche-2"],
      DOT: data.polkadot,
      TRX: data.tron
    });

  } catch (error) {
    console.error("CoinGecko error:", error?.message || error);

    return Response.json(
      { error: true, message: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}






