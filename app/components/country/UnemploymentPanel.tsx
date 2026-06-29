"use client";

import { useEffect, useState } from "react";

export default function UnemploymentPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/country/PE/unemployment");
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = await res.json();
        setData(json.unemployment);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <div className="p-4 bg-[#0d0d0d] text-white rounded-lg">Cargando desempleo…</div>;

  if (error || !data)
    return <div className="p-4 bg-[#0d0d0d] text-red-400 rounded-lg">No se pudo cargar el desempleo.</div>;

  return (
    <div className="p-6 bg-[#0d0d0d] text-white rounded-xl border border-[#1a1a1a] shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#4da6ff]">🇵🇪 Desempleo — Perú</h2>

      <div className="space-y-3">
        <div>
          <span className="text-gray-400">Tasa de desempleo:</span>
          <span className="ml-2 text-lg font-semibold">{data.value}%</span>
        </div>

        <div>
          <span className="text-gray-400">Última actualización:</span>
          <span className="ml-2">{data.lastUpdate}</span>
        </div>

        <div>
          <span className="text-gray-400">Fuente:</span>
          <span className="ml-2 text-[#4da6ff]">{data.source}</span>
        </div>
      </div>
    </div>
  );
}
