import { NextResponse } from "next/server";

// TradingEconomics — Government Debt
async function fetchFromTradingEconomics() {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;
    const url = `https://api.tradingeconomics.com/country/peru/government-debt-to-gdp?c=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];

    return {
      percentGDP: item.LatestValue || null,
      lastUpdate: item.Date || null,
      source: "TradingEconomics",
    };
  } catch {
    return null;
  }
}

// Banco Mundial — Debt fallback
async function fetchFromWorldBank() {
  try {
    const url =
      "https://api.worldbank.org/v2/country/PE/indicator/GC.DOD.TOTL.GD.ZS?format=json";

    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.[1];
    if (!data || data.length === 0) return null;

    const last = data[0];

    return {
      percentGDP: last.value || null,
      lastUpdate: last.date || null,
      source: "WorldBank",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const te = await fetchFromTradingEconomics();
  if (te) return NextResponse.json({ country: "PE", publicDebt: te });

  const wb = await fetchFromWorldBank();
  if (wb) return NextResponse.json({ country: "PE", publicDebt: wb });

  return NextResponse.json(
    { country: "PE", publicDebt: null, error: "No public debt data" },
    { status: 404 }
  );
}
