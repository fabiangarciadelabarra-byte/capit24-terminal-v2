export async function GET() {
  try {
    // Fear & Greed Index
    const fgRes = await fetch("https://api.alternative.me/fng/?limit=1");
    const fgData = await fgRes.json();
    const fearGreed = fgData.data?.[0] || null;

    // Funding Rate (Binance Futures)
    const fundingRes = await fetch("https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT");
    const fundingData = await fundingRes.json();

    // Open Interest (Binance Futures)
    const oiRes = await fetch("https://fapi.binance.com/futures/data/openInterestHist?symbol=BTCUSDT&period=5m&limit=1");
    const oiData = await oiRes.json();
    const openInterest = oiData?.[0] || null;

    return Response.json({
      fearGreed,
      fundingRate: fundingData.lastFundingRate,
      nextFundingTime: fundingData.nextFundingTime,
      openInterest
    });
  } catch (err) {
    console.error("Error fetching sentiment:", err);
    return Response.json({ error: "Failed to fetch sentiment" }, { status: 500 });
  }
}
