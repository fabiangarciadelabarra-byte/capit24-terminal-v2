"use client";

import { useEffect, useState } from "react";
import { useCountryStore } from "../store/countryStore";

export default function CountriesPage() {
  const countryCode = useCountryStore((state) => state.country);
  const [countryName, setCountryName] = useState<string | null>(null);

  // Diccionario simple para nombres de países (luego lo reemplazamos con API real)
  const countryNames: Record<string, string> = {
    PE: "Perú",
    AR: "Argentina",
    US: "Estados Unidos",
    MX: "México",
    BR: "Brasil",
    CL: "Chile",
  };

  useEffect(() => {
    if (countryCode) {
      setCountryName(countryNames[countryCode] || "País desconocido");
    }
  }, [countryCode]);

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
      <section className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] mb-10">
        <h2 className="text-xl font-semibold">País Seleccionado</h2>

        {countryCode ? (
          <div className="mt-4">
            <p className="text-lg">
              <strong>Código:</strong> {countryCode}
            </p>
            <p className="text-lg mt-2">
              <strong>Nombre:</strong> {countryName}
            </p>
          </div>
        ) : (
          <p className="text-[#aaa] mt-2">
            Selecciona un país desde el mapa en /worldmap
          </p>
        )}
      </section>

      {/* INDICADORES ECONÓMICOS */}
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
