"use client";

import Link from "next/link";

export default function TerminalPage() {
  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Capit24 Terminal</h1>
        <p className="text-[#999] mt-2">
          Vista principal del terminal financiero
        </p>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD ECONOMICS */}
        <Link
          href="/economics"
          className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] hover:bg-[#222] transition"
        >
          <h2 className="text-xl font-semibold">Economics</h2>
          <p className="text-[#aaa] mt-2">Indicadores macro globales</p>
        </Link>

        {/* CARD COUNTRIES */}
        <Link
          href="/countries"
          className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] hover:bg-[#222] transition"
        >
          <h2 className="text-xl font-semibold">Countries</h2>
          <p className="text-[#aaa] mt-2">Perfiles económicos por país</p>
        </Link>

        {/* CARD MARKETS */}
        <Link
          href="/markets"
          className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333] hover:bg-[#222] transition"
        >
          <h2 className="text-xl font-semibold">Markets</h2>
          <p className="text-[#aaa] mt-2">Bolsas, divisas y commodities</p>
        </Link>
      </div>

      {/* INDICADORES GLOBALES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Indicadores Globales</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">Inflación Global</h3>
            <p className="text-[#aaa] mt-2">Conectar API del World Bank</p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">PIB Mundial</h3>
            <p className="text-[#aaa] mt-2">Conectar API del IMF</p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <h3 className="text-lg font-semibold">Tasas de Interés</h3>
            <p className="text-[#aaa] mt-2">Conectar API OECD</p>
          </div>
        </div>
      </section>

      {/* NOTICIAS */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Noticias Financieras</h2>

        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <p className="text-[#aaa]">
            Conectar API de noticias (Finnhub / NewsAPI)
          </p>
        </div>
      </section>
    </div>
  );
}
