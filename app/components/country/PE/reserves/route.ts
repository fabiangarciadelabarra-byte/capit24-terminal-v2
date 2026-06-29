import { NextResponse } from "next/server";

// TradingEconomics — Reserves
async function fetchFromTradingEconomics() {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;
    const url = `https://api.tradingeconomics.com/country/peru/foreign-exchange-reserves?c=${apiKey}`;

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

// BCRP — Reservas Internacionales
async function fetchFromBCRP() {
  try {
    const url =
      "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PM05110PM/json";

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

export async function GET() {
  const te = await fetchFromTradingEconomics();
  if (te) return NextResponse.json({ country: "PE", reserves: te });

  const bcrp = await fetchFromBCRP();
  if (bcrp) return NextResponse.json({ country: "PE", reserves: bcrp });

  return NextResponse.json(
    { country: "PE", reserves: null, error: "No reserves data" },
    { status: 404 }
  );
}
