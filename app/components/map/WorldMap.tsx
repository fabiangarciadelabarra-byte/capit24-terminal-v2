"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { animated, useSpring } from "react-spring";

// Datos de ejemplo (luego los conectamos a tus APIs reales)
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
  if (inflation > 50) return "#ff4d4d"; // rojo fuerte
  if (inflation > 10) return "#ff944d"; // naranja
  return "#4dff88"; // verde
}

export default function WorldMap({ onSelectCountry }: { onSelectCountry: (code: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="relative w-full h-full">

      {/* Tooltip global */}
      <ReactTooltip id="country-tooltip" />

      {/* Botón modo oscuro */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 z-50 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-[#333]"
      >
        {darkMode ? "Modo Claro" : "Modo Oscuro"}
      </button>

      {/* Mapa */}
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const name = geo.properties.NAME;
                const code = geo.properties.ISO_A2;

                const inflation = inflationData[code];
                const fillColor = getColorByInflation(inflation);

                const props = useSpring({
                  fill: fillColor,
                  config: { tension: 200, friction: 20 },
                });

                return (
                  <animated.g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      data-tooltip-id="country-tooltip"
                      data-tooltip-content={`${name} (${code}) — Inflación: ${inflation || "N/A"}%`}
                      onClick={() => {
                        onSelectCountry(code);

                        // Integración con tu terminal Capit24
                        if (typeof window !== "undefined" && (window as any).Capit24Terminal) {
                          (window as any).Capit24Terminal.setCountry(code);
                        }
                      }}
                      style={{
                        default: {
                          fill: props.fill.get(),
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
                  </animated.g>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
