"use client";

import { useState } from "react";
import WorldMap from "../components/map/WorldMap";
import CountryPanelDrawer from "../components/country/CountryPanelDrawer";

export default function WorldPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="flex w-full h-screen bg-[#0d0d0d] overflow-hidden">

      {/* Mapa Mundial */}
      <div className="flex-1">
        <WorldMap
          onSelectCountry={(code) => {
            setSelectedCountry(code);

            // Integración con tu terminal Capit24
            if (typeof window !== "undefined" && (window as any).Capit24Terminal) {
              (window as any).Capit24Terminal.setCountry(code);
            }
          }}
        />
      </div>

      {/* Panel del País */}
      <CountryPanelDrawer
        countryCode={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}

