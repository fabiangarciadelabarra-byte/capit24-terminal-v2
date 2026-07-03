"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export default function WorldMapPage() {
  const [countryCode, setCountryCode] = useState("US");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hoverCountry, setHoverCountry] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/worldmap/api/macro/${countryCode}`);
        const profile = await res.json();
        setData(profile);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
      setLoading(false);
    }
    load();
  }, [countryCode]);

  return (
    <div className="p-6 flex gap-6">

      {/* MAPA */}
      <div className="w-2/3 relative">
        <h1 className="text-3xl font-bold mb-4">WorldMap</h1>

        <ComposableMap projection="geoMercator">
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {(geos: { geographies: any[] }) =>
              geos.geographies.map((geo: any) => {
                const iso = geo.properties.ISO_A2;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoverCountry(iso)}
                    onMouseLeave={() => setHoverCountry(null)}
                    onClick={() => setCountryCode(iso)}
                    style={{
                      default: { fill: "#D6D6DA", outline: "none" },
                      hover: { fill: "#F53", outline: "none" },
                      pressed: { fill: "#E42", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* TOOLTIP */}
        {hoverCountry && data?.macro && (
          <div
            className="absolute bg-white p-3 rounded shadow text-sm pointer-events-none"
            style={{ top: 20, left: 20 }}
          >
            <p className="font-bold">{hoverCountry}</p>
            <p>PIB: {data.macro.gdpGrowth}%</p>
            <p>Inflación: {data.macro.inflation}%</p>
            <p>Tasa: {data.macro.interestRate}%</p>
            <p>Riesgo: {data.macro.risk}</p>
            <p>Rating: {data.macro.rating}</p>
          </div>
        )}
      </div>

      {/* PANEL LATERAL */}
      <div className="w-1/3">
        {loading && <p>Cargando datos...</p>}

        {data?.macro && (
          <div className="space-y-6">

            {/* MACRO */}
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

            {/* MERCADO */}
            {data.market && (
              <div className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Mercado</h2>
                <p><strong>Índice principal:</strong> {data.market.mainIndex?.name}</p>
                <p><strong>Valor:</strong> {data.market.mainIndex?.value}</p>
                <p><strong>Cambio:</strong> {data.market.mainIndex?.change}%</p>
                <p><strong>Volatilidad:</strong> {data.market.volatility}</p>
                <p><strong>Sentimiento:</strong> {data.market.sentiment}</p>
              </div>
            )}

            {/* SECTORES */}
            {Array.isArray(data.sectors) && (
              <div className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Sectores</h2>
                <ul className="space-y-2">
                  {data.sectors.map((sector: any, i: number) => (
                    <li key={i} className="border p-2 rounded">
                      <strong>{sector.name}</strong> — {sector.performance}% — {sector.risk} — {sector.trend}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RECOMENDACIÓN */}
            {data.recommendation && (
              <div className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Recomendación</h2>
                <p><strong>Pequeño inversor:</strong> {data.recommendation.smallInvestor}</p>
                <p><strong>Mediano inversor:</strong> {data.recommendation.mediumInvestor}</p>
                <p><strong>Gran inversor:</strong> {data.recommendation.largeInvestor}</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
