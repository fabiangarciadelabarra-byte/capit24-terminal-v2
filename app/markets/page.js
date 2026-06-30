"use client";

export default function MarketsPage() {
  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Mercados Globales</h1>
        <p className="text-[#999] mt-2">
          Bolsas, divisas y commodities
        </p>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ÍNDICES BURSÁTILES */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Índices Bursátiles</h2>
          <p className="text-[#aaa] mt-2">
            Conectar API Finnhub (SPX, NASDAQ, EURO STOXX, etc.)
          </p>
        </div>

        {/* DIVISAS */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Divisas</h2>
          <p className="text-[#aaa] mt-2">
            USD, EUR, GBP, JPY, PEN, BRL…
          </p>
        </div>

        {/* COMMODITIES */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Commodities</h2>
          <p className="text-[#aaa] mt-2">
            Oro, petróleo, cobre, trigo…
          </p>
        </div>

      </div>

      {/* SECCIÓN DE GRÁFICOS */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Gráficos de Mercado</h2>

        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <p className="text-[#aaa]">
            Aquí vamos a integrar datos en tiempo real desde Finnhub
            (precios, velas, volumen, etc.).
          </p>
        </div>
      </section>

    </div>
  );
}
