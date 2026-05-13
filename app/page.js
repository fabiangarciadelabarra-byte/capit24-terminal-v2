"use client";

import useCryptoPrices from "./hooks/useCryptoPrices";

export default function Page() {
  const { data, loading, error } = useCryptoPrices();

  if (loading) return <p>Cargando precios...</p>;
  if (error) return <p>Error al cargar precios</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Capit24 Terminal</h1>

      <div style={{ marginTop: 20 }}>
        <h2>Bitcoin (BTC)</h2>
        <p>Precio: ${data.BTC.price.toLocaleString()}</p>
        <p>Cambio 24h: {data.BTC.change24h.toFixed(2)}%</p>
        <p>Market Cap: ${data.BTC.marketCap.toLocaleString()}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Ethereum (ETH)</h2>
        <p>Precio: ${data.ETH.price.toLocaleString()}</p>
        <p>Cambio 24h: {data.ETH.change24h.toFixed(2)}%</p>
        <p>Market Cap: ${data.ETH.marketCap.toLocaleString()}</p>
      </div>
    </div>
  );
}
