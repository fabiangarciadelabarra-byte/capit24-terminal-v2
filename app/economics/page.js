"use client";

export default function EconomicsPage() {
  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-white p-10">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Indicadores Económicos Globales</h1>
        <p className="text-[#999] mt-2">
          Datos macroeconómicos del mundo
        </p>
      </header>

      {/* GRID DE INDICADORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* INFLACIÓN */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Inflación Global</h2>
          <p className="text-[#aaa] mt-2">Conectar API del World Bank</p>
        </div>

        {/* PIB */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">PIB Mundial</h2>
          <p className="text-[#aaa] mt-2">Conectar API del IMF</p>
        </div>

        {/* TASAS DE INTERÉS */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Tasas de Interés</h2>
          <p className="text-[#aaa] mt-2">Conectar API OECD</p>
        </div>

        {/* DEUDA */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Deuda Pública</h2>
          <p className="text-[#aaa] mt-2">Conectar API del World Bank</p>
        </div>

        {/* BALANZA COMERCIAL */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Balanza Comercial</h2>
          <p className="text-[#aaa] mt-2">Conectar API del IMF</p>
        </div>

        {/* CRECIMIENTO */}
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <h2 className="text-xl font-semibold">Crecimiento Económico</h2>
          <p className="text-[#aaa] mt-2">Conectar API OECD</p>
        </div>

      </div>

      {/* SECCIÓN DE GRÁFICOS */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Gráficos Globales</h2>

        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <p className="text-[#aaa]">
            Aquí colocaremos gráficos reales (inflación, PIB, tasas) usando APIs.
          </p>
        </div>
      </section>

    </div>
  );
}
