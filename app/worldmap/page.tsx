"use client";

import WorldMap from "../components/map/WorldMap";

export default function Page() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <WorldMap onSelectCountry={(code: string) => console.log("Selected:", code)} />
    </div>
  );
}
