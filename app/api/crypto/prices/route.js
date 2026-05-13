import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://api.coincap.io/v2/assets?ids=bitcoin,ethereum"
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
    console.error("Error fetching crypto prices:", error);
    return Response.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}


