"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { animated, useSpring } from "react-spring";

// Ejemplo de datos económicos (luego se conectan a tus APIs reales)
const inflationData = {
  PE: 3.2,
  AR: 140,
  US: 3.1,
  MX: 4.5,
  BR: 4.2,
  CL: 3.8,
};

function getColorByInflation(inflation) {
  if (!inflation) return "#1a1a1a";
  if (inflation > 50) return "#ff4d4d"; // rojo fuerte
  if (inflation > 10) return "#ff944d"; // naranja
  return "#4dff88"; // verde
}

export default function WorldMap({ onSelectCountry }) {
  const [tooltip, setTooltip] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="relative w-full h-full">

      {/* Tooltip */}
      <ReactTooltip>{tooltip}</ReactTooltip>

      {/* Toggle Dark Mode */}
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
            {({ geographies }) =>
              geographies.map((geo) => {
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
                      data-tip=""
                      onMouseEnter={() => {
                        setTooltip(`${name} (${code}) — Inflación: ${inflation || "N/A"}%`);
                      }}
                      onMouseLeave={() => {
                        setTooltip("");
                      }}
                      onClick={() => {
                        onSelectCountry(code);

                        // Integración con tu terminal Capit24
                        if (window?.Capit24Terminal) {
                          window.Capit24Terminal.setCountry(code);
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
