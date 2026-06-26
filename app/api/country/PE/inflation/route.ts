import { NextResponse } from "next/server";

// -----------------------------
// 1. TradingEconomics
// -----------------------------
async function fetchFromTradingEconomics(): Promise<any | null> {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;

    const url =
      `https://api.tradingeconomics.com/country/peru/inflation?c=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];

    return {
      monthly: item.Monthly || null,
      annual: item.Yearly || null,
      lastUpdate: item.LastUpdate || null,
      source: "TradingEconomics",
    };
  } catch {
    return null;
  }
}

// -----------------------------
// 2. Banco Central del Perú (BCRP)
// -----------------------------
async function fetchFromBCRP(): Promise<any | null> {
  try {
    // API pública del BCRP (inflación mensual)
    const url =
      "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PN01273PM/json";

    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const series = json?.periods;
    if (!series || series.length === 0) return null;

    const last = series[0];

    return {
      monthly: parseFloat(last.value) || null,
      annual: null, // BCRP no siempre da anual directo
      lastUpdate: last.date || null,
      source: "BCRP",
    };
  } catch {
    return null;
  }
}

// -----------------------------
// 3. Banco Mundial (inflación anual)
// -----------------------------
async function fetchFromWorldBank(): Promise<any | null> {
  try {
    const url =
      "https://api.worldbank.org/v2/country/PE/indicator/FP.CPI.TOTL.ZG?format=json";

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
// 4. Handler principal
// -----------------------------
export async function GET() {
  // 1. TradingEconomics
  const te = await fetchFromTradingEconomics();
  if (te) {
    return NextResponse.json({
      country: "PE",
      inflation: te,
    });
  }

  // 2. BCRP
  const bcrp = await fetchFromBCRP();

  // 3. Banco Mundial (solo anual)
  const wb = await fetchFromWorldBank();

  // Normalización
  const inflation = {
    monthly: bcrp?.monthly ?? null,
    annual: wb?.annual ?? bcrp?.annual ?? null,
    lastUpdate: bcrp?.lastUpdate ?? wb?.lastUpdate ?? null,
    source: bcrp ? "BCRP + WorldBank" : "WorldBank",
  };

  return NextResponse.json({
    country: "PE",
    inflation,
  });
}
