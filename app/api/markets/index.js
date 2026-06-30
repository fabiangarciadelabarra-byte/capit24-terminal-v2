export async function GET() {
  const API_KEY = process.env.FINNHUB_KEY;

  const urls = {
    sp500: `https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${API_KEY}`,
    nasdaq: `https://finnhub.io/api/v1/quote?symbol=^IXIC&token=${API_KEY}`,
    dow: `https://finnhub.io/api/v1/quote?symbol=^DJI&token=${API_KEY}`,
    usd_pen: `https://finnhub.io/api/v1/forex/rates?base=USD&token=${API_KEY}`,
    oil: `https://finnhub.io/api/v1/quote?symbol=OIL&token=${API_KEY}`,
    gold: `https://finnhub.io/api/v1/quote?symbol=XAU&token=${API_KEY}`,
  };

  const results = {};

  for (const key in urls) {
    const res = await fetch(urls[key]);
    results[key] = await res.json();
  }

  return Response.json(results);
}
