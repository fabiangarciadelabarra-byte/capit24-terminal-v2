import { NextResponse } from "next/server";

// TradingEconomics — Trade Balance
async function fetchFromTradingEconomics() {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_KEY;
    const url = `https://api.tradingeconomics.com/country/peru/balance-of-trade?c=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];

    return {
      balance: item.LatestValue || null,
      lastUpdate: item.Date || null,
      source: "TradingEconomics",
    };
  } catch {
    return null;
  }
}

// BCRP — Exportaciones e Importaciones
async function fetchFromBCRP() {
  try {
    const urlExports =
      "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PM05111PM/json";
    const urlImports =
      "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PM05112PM/json";

    const resExp = await fetch(urlExports);
    const resImp = await fetch(urlImports);

    if (!resExp.ok || !resImp.ok) return null;

    const expJson = await resExp.json();
    const impJson = await resImp.json();

    const exp = expJson?.data?.[0];
    const imp = impJson?.data?.[0];

    if (!exp || !imp) return null;

    return {
      exports: parseFloat(exp.value) || null,
      imports: parseFloat(imp.value) || null,
      balance: parseFloat(exp.value) - parseFloat(imp.value),
      lastUpdate: exp.date || imp.date || null,
      source: "BCRP",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const te = await fetchFromTradingEconomics();
  if (te) return NextResponse.json({ country: "PE", tradeBalance: te });

  const bcrp = await fetchFromBCRP();
  if (bcrp) return NextResponse.json({ country: "PE", tradeBalance: bcrp });

  return NextResponse.json(
    { country: "PE", tradeBalance: null, error: "No trade balance data" },
    { status: 404 }
  );
}
