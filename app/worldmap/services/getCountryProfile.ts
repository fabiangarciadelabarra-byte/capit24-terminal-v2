import { getCountryMacro } from "./getCountryMacro";

export async function getCountryProfile(countryCode: string) {
  const macro = await getCountryMacro(countryCode);

  const market = {
    mainIndex: { name: "S&P 500", value: 5200, change: 1.2 },
    volatility: 12.5,
    sentiment: "Greed",
  };

  const sectors = [
    { name: "Tecnología", performance: 3.5, risk: "Medio", trend: "Alcista" },
    { name: "Energía", performance: -1.2, risk: "Alto", trend: "Bajista" },
    { name: "Finanzas", performance: 1.1, risk: "Medio", trend: "Neutral" },
  ];

  const recommendation = {
    smallInvestor: "Sectores defensivos",
    mediumInvestor: "Sectores en crecimiento",
    largeInvestor: "Sectores estratégicos",
  };

  return {
    macro,
    market,
    sectors,
    recommendation,
  };
}
