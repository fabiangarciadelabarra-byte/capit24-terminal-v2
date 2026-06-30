"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// 1️⃣ IMPORTANTE: importar el store global
import { useCountryStore } from "@/app/store/countryStore";

// Datos de ejemplo
const inflationData: Record<string, number> = {
  PE: 3.2,
  AR: 140,
  US: 3.1,
  MX: 4.5,
  BR: 4.2,
  CL: 3.8,
};

function getColorByInflation(inflation?: number) {
  if (!inflation) return "#1a1a1a";
  if (inflation > 50) return "#ff4d4d";
  if (inflation > 10) return "#ff944d";
  return "#4dff88";
}

export default function WorldMap({ onSelectCountry }: { onSelectCountry: (code: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);

  // 2️⃣ IMPORTANTE: obtener setCountry del store global
  const { setCountry } = useCountryStore();

  return (
    <div className="relative w-full h-full">

      <ReactTooltip id="country-tooltip" />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 z-50 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-[#333]"
      >
        {darkMode ? "Modo Claro" : "Modo Oscuro"}
      </button>

      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const name = geo.properties.NAME;
                const code = geo.properties.ISO_A2;

                const inflation = inflationData[code];
                const fillColor = getColorByInflation(inflation);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={`${name} (${code}) — Inflación: ${inflation || "N/A"}%`}

                    // 3️⃣ AQUÍ está el onClick actualizado
                    onClick={() => {
                      // Guardar país en el store global
                      setCountry(code);

                      // Mantener tu lógica original
                      onSelectCountry(code);
                    }}

                    style={{
                      default: {
                        fill: fillColor,
                        outline: "none",
                        stroke: darkMode ? "#333" : "#ccc",
                      },
                      hover: {
                        fill: "#4da6ff",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#005bb5",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
