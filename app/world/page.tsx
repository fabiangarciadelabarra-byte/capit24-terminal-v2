"use client";

import { useState } from "react";
import WorldMap from "../components/map/WorldMap";
import CountryPanelDrawer from "../components/country/CountryPanelDrawer";

export default function WorldPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="flex w-full h-screen bg-[#0d0d0d]">
      {/* Mapa */}
      <div className="flex-1">
        <WorldMap onSelectCountry={(code) => setSelectedCountry(code)} />
      </div>

      {/* Panel del país */}
      <CountryPanelDrawer
        countryCode={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}
