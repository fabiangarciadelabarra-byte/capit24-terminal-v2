export const runtime = "nodejs";

import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true",
      { timeout: 5000 }
    );

    return Response.json({
      BTC: {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        marketCap: data.bitcoin.usd_market_cap
      },
      ETH: {
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
        marketCap: data.ethereum.usd_market_cap
      }
    });

  } catch (error) {
    console.error("CoinGecko error:", error?.message || error);

    return Response.json({
      BTC: { price: null, error: true },
      ETH: { price: null, error: true }
    }, { status: 500 });
  }
}






