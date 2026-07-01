"use client";

import { useEffect, useState } from "react";
import { useCountryStore } from "../store/countryStore";

export default function CountriesPage() {
  const countryCode = useCountryStore((state) => state.country);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!countryCode) return;

    async function load() {
      const res = await fetch(`/api/countries/${countryCode}`);
      const json = await res.json();
      setData(json);
    }

    load();
  }, [countryCode]);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Perfil Económico por País</h1>
        <p className="text-[#999] mt-2">Datos reales del World Bank</p>
      </header>

      {/* ESTADOS */}
      {!countryCode ? (
        <p className="text-[#aaa]">
          Selecciona un país desde el mapa en /worldmap
        </p>
      ) : !data ? (
        <p className="text-[#aaa]">Cargando datos reales...</p>
      ) : (
        <>
          {/* PAÍS */}
          <section className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] mb-10">
            <h2 className="text-xl font-semibold">País Seleccionado</h2>
            <p className="text-lg mt-4">
              <strong>Código:</strong> {data.code}
            </p>
          </section>

          {/* INDICADORES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Indicadores Económicos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Inflación */}
              <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
                <h3 className="text-lg font-semibold">Inflación</h3>
                <p className="text-[#aaa] mt-2">
                  {data.inflation ?? "N/A"} %
                </p>
              </div>

              {/* PIB */}
              <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
                <h3 className="text-lg font-semibold">PIB</h3>
                <p className="text-[#aaa] mt-2">
                  {data.gdp ? `$${data.gdp.toLocaleString()}` : "N/A"}
                </p>
              </div>

              {/* Crecimiento */}
              <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
                <h3 className="text-lg font-semibold">Crecimiento Económico</h3>
                <p className="text-[#aaa] mt-2">
                  {data.growth ?? "N/A"} %
                </p>
              </div>

              {/* Población */}
              <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
                <h3 className="text-lg font-semibold">Población</h3>
                <p className="text-[#aaa] mt-2">
                  {data.population
                    ? data.population.toLocaleString()
                    : "N/A"}
                </p>
              </div>

            </div>
          </section>
        </>
      )}
    </div>
  );
}
