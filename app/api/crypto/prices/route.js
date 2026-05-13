import axios from "axios";

export async function GET() {
  try {
    const CMC_API_KEY = process.env.CMC_API_KEY;

    // --- 1. Binance ---
    const binance = await axios.get("https://api.binance.com/api/v3/ticker/price?symbols=[\"BTCUSDT\",\"ETHUSDT\"]");
    const binanceData = {
      BTC: parseFloat(binance.data.find(x => x.symbol === "BTCUSDT").price),
      ETH: parseFloat(binance.data.find(x => x.symbol === "ETHUSDT").price),
    };

    // --- 2. Kraken ---
    const kraken = await axios.get("https://api.kraken.com/0/public/Ticker?pair=XBTUSD,ETHUSD");
    const krakenData = {
      BTC: parseFloat(kraken.data.result.XXBTZUSD.c[0]),
      ETH: parseFloat(kraken.data.result.XETHZUSD.c[0]),
    };

    // --- 3. CoinMarketCap ---
    const cmc = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH",
      { headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY } }
    );

    const cmcData = {
      BTC: cmc.data.data.BTC.quote.USD.price,
      ETH: cmc.data.data.ETH.quote.USD.price,
    };

    // --- Normalización ---
    const response = {
      BTC: {
        binance: binanceData.BTC,
        kraken: krakenData.BTC,
        cmc: cmcData.BTC,
        average: (binanceData.BTC + krakenData.BTC + cmcData.BTC) / 3,
      },
      ETH: {
        binance: binanceData.ETH,
        kraken: krakenData.ETH,
        cmc: cmcData.ETH,
        average: (binanceData.ETH + krakenData.ETH + cmcData.ETH) / 3,
      }
    };

    return Response.json(response);

  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return Response.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
