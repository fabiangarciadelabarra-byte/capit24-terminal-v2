"use client";

import InflationPanel from "./InflationPanel";
import GDPPanel from "./GDPPanel";
import InterestRatePanel from "./InterestRatePanel";

export default function CountryPanel({ countryCode }: { countryCode: string }) {
  return (
    <div className="p-6 bg-[#0d0d0d] text-white rounded-xl border border-[#1a1a1a] shadow-lg w-full">
      
      {/* Header del país */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#4da6ff]">
          Información del país — {countryCode}
        </h1>
        <p className="text-gray-400 text-sm">
          Datos macroeconómicos y financieros en tiempo real.
        </p>
      </div>

      {/* Paneles de servicios */}
      <div className="space-y-10">

        {/* 1. Inflación */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#4da6ff]">
            Inflación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InflationPanel />
          </div>
        </section>

        {/* 2. PIB */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#4da6ff]">
            Producto Interno Bruto (PIB)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GDPPanel />
          </div>
        </section>

        {/* 3. Tasa de interés */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#4da6ff]">
            Tasa de Interés
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InterestRatePanel />
          </div>
        </section>

        {/* Próximos módulos macroeconómicos */}
        {/*
        <UnemploymentPanel />
        <ReservesPanel />
        <TradeBalancePanel />
        <DebtPanel />
        */}
      </div>
    </div>
  );
}
