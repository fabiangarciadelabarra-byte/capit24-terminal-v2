"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export default function WorldMap({ onSelectCountry }: { onSelectCountry: (code: string) => void }) {
  return (
    <div className="w-full h-full">
      <ComposableMap projection="geoMercator">
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = geo.properties.ISO_A2;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelectCountry(code)}
                  style={{
                    default: { fill: "#1a1a1a", outline: "none" },
                    hover: { fill: "#4da6ff", outline: "none" },
                    pressed: { fill: "#005bb5", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
