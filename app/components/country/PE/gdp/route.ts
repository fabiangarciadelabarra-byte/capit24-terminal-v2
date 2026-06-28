import { NextResponse } from "next/server";

// -----------------------------
// 1. TradingEconomics (PIB)
// -----------------------------
async function fetchFromTradingEconomics(): Promise<any | null> {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;

    const url =
      `https://api.tradingeconomics.com/country/peru/gdp?c=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];

    return {
      quarterly: item.LatestValue || null,
      annual: item.Yearly || null,
      lastUpdate: item.Date || null,
      source: "TradingEconomics",
    };
  } catch {
    return null;
  }
}

// -----------------------------
// 2. Banco Mundial (PIB anual)
// -----------------------------
async function fetchFromWorldBank(): Promise<any | null> {
  try {
    const url =
      "https://api.worldbank.org/v2/country/PE/indicator/NY.GDP.MKTP.CD?format=json";

    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.[1];
    if (!data || data.length === 0) return null;

    const last = data[0];

    return {
      annual: last.value || null,
      lastUpdate: last.date || null,
      source: "WorldBank",
    };
  } catch {
    return null;
  }
}

// -----------------------------
// 3. Handler principal
// -----------------------------
export async function GET() {
  // 1. TradingEconomics
  const te = await fetchFromTradingEconomics();
  if (te) {
    return NextResponse.json({
      country: "PE",
      gdp: te,
    });
  }

  // 2. Banco Mundial (fallback)
  const wb = await fetchFromWorldBank();

  const gdp = {
    quarterly: null,
    annual: wb?.annual ?? null,
    lastUpdate: wb?.lastUpdate ?? null,
    source: "WorldBank",
  };

  return NextResponse.json({
    country: "PE",
    gdp,
  });
}
