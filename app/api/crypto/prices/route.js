import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://api.coincap.io/v2/assets?ids=bitcoin,ethereum",
      { timeout: 5000 }
    );

    const btc = data.data.find(x => x.id === "bitcoin");
    const eth = data.data.find(x => x.id === "ethereum");

    return Response.json({
      BTC: {
        price: parseFloat(btc.priceUsd),
        change24h: parseFloat(btc.changePercent24Hr),
        marketCap: parseFloat(btc.marketCapUsd)
      },
      ETH: {
        price: parseFloat(eth.priceUsd),
        change24h: parseFloat(eth.changePercent24Hr),
        marketCap: parseFloat(eth.marketCapUsd)
      }
    });

  } catch (error) {
    console.error("CoinCap error:", error.message);

    return Response.json({
      BTC: { price: null, error: true },
      ETH: { price: null, error: true }
    });
  }
}



