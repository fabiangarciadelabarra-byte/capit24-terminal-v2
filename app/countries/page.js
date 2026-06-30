"use client";

import { useState } from "react";

export default function CountriesPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Perfil Económico por País</h1>
        <p className="text-[#999] mt-2">
          Información macroeconómica detallada por país
        </p>
      </header>

      {/* PAÍS SELECCIONADO */}
      <section className="mb-10">
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">País Seleccionado</h2>

          {selectedCountry ? (
            <div className="mt-4">
              <p className="text-lg">Código: {selectedCountry}</p>
              <p className="text-[#aaa] mt-2">Conectar datos reales aquí</p>
            </div>
          ) : (
            <p className="text-[#aaa] mt-2">
              Selecciona un país desde el mapa en /worldmap
            </p>
          )}
        </div>
      </section>

      {/* INDICADORES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Indicadores Económicos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">Inflación</h3>
            <p className="text-[#aaa] mt-2">Conectar API World Bank</p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">PIB</h3>
            <p className="text-[#aaa] mt-2">Conectar API IMF</p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">Tasa de Interés</h3>
            <p className="text-[#aaa] mt-2">Conectar API OECD</p>
          </div>

        </div>
      </section>

    </div>
  );
}
