"use client";

import { useState, useEffect } from "react";
import { getCountryProfile } from "./services/getCountryProfile";

export default function WorldMapPage() {
  const [countryCode, setCountryCode] = useState("US");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const profile = await getCountryProfile(countryCode);
      setData(profile);
      setLoading(false);
    }

    load();
  }, [countryCode]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">WorldMap</h1>

      {/* Selector de país */}
      <select
        className="border p-2 rounded mb-4"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
      >
        <option value="US">United States</option>
        <option value="PE">Peru</option>
        <option value="BR">Brazil</option>
        <option value="MX">Mexico</option>
        <option value="CL">Chile</option>
        <option value="AR">Argentina</option>
      </select>

      {/* Loading */}
      {loading && <p>Cargando datos...</p>}

      {/* Datos */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Macro */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Macro</h2>
            <p><strong>PIB:</strong> {data.macro.gdpGrowth}%</p>
            <p><strong>Inflación:</strong> {data.macro.inflation}%</p>
            <p><strong>Tasa de interés:</strong> {data.macro.interestRate}%</p>
            <p><strong>Riesgo país:</strong> {data.macro.risk}</p>
            <p><strong>Deuda:</strong> {data.macro.debt}%</p>
            <p><strong>Reservas:</strong> {data.macro.reserves}B</p>
            <p><strong>Rating:</strong> {data.macro.rating}</p>
          </div>

          {/* Mercado */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Mercado</h2>
            <p><strong>Índice principal:</strong> {data.market.mainIndex.name}</p>
            <p><strong>Valor:</strong> {data.market.mainIndex.value}</p>
            <p><strong>Cambio:</strong> {data.market.mainIndex.change}%</p>
            <p><strong>Volatilidad:</strong> {data.market.volatility}</p>
            <p><strong>Sentimiento:</strong> {data.market.sentiment}</p>
          </div>

          {/* Sectores */}
          <div className="border p-4 rounded shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Sectores</h2>
            <ul className="space-y-2">
              {data.sectors.map((sector: any, i: number) => (
                <li key={i} className="border p-2 rounded">
                  <strong>{sector.name}</strong> — {sector.performance}% — {sector.risk} — {sector.trend}
                </li>
              ))}
            </ul>
          </div>

          {/* Recomendación */}
          <div className="border p-4 rounded shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Recomendación</h2>
            <p><strong>Pequeño inversor:</strong> {data.recommendation.smallInvestor}</p>
            <p><strong>Mediano inversor:</strong> {data.recommendation.mediumInvestor}</p>
            <p><strong>Gran inversor:</strong> {data.recommendation.largeInvestor}</p>
          </div>

        </div>
      )}
    </div>
  );
}
