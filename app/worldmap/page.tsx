"use client";

import WorldMap from "../components/map/WorldMap";

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#0d0d0d] text-white">
      <WorldMap
        onSelectCountry={(code) => {
          console.log("País seleccionado:", code);
        }}
      />
    </div>
  );
}
