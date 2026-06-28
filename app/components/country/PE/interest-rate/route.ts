import { NextResponse } from "next/server";

// -----------------------------
// 1. TradingEconomics — Interest Rate
// -----------------------------
async function fetchFromTradingEconomics(): Promise<any | null> {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;

    const url =
      `https://api.tradingeconomics.com/country/peru/interest-rate?c=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];

    return {
      value: item.LatestValue || null,
      lastUpdate: item.Date || null,
      source: "TradingEconomics",
    };
  } catch {
    return null;
  }
}

// -----------------------------
// 2. BCRP — Tasa de Política Monetaria
// -----------------------------
async function fetchFromBCRP(): Promise<any | null> {
  try {
    // Serie: Tasa de referencia del BCRP
    const url =
      "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PN01279PM/json";

    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const series = json?.data;
    if (!series || series.length === 0) return null;

    const last = series[0];

    return {
      value: parseFloat(last.value) || null,
      lastUpdate: last.date || null,
      source: "BCRP",
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
      interestRate: te,
    });
  }

  // 2. BCRP (fallback)
  const bcrp = await fetchFromBCRP();

  if (bcrp) {
    return NextResponse.json({
      country: "PE",
      interestRate: bcrp,
    });
  }

  // 3. Si ambas fallan
  return NextResponse.json(
    {
      country: "PE",
      interestRate: null,
      error: "No interest rate data available for Peru",
    },
    { status: 404 }
  );
}
