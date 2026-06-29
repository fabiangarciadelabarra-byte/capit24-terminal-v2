"use client";

import CountryPanel from "./CountryPanel";

export default function CountryPanelDrawer({
  countryCode,
  onClose,
}: {
  countryCode: string | null;
  onClose: () => void;
}) {
  if (!countryCode) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0d0d0d] border-l border-[#1a1a1a] shadow-xl p-6 overflow-y-auto z-50">
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white mb-4"
      >
        Cerrar ✕
      </button>

      <CountryPanel countryCode={countryCode} />
    </div>
  );
}
