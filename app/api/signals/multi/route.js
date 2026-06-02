import { NextResponse } from 'next/server';

// Timeframes permitidos
const ALLOWED_TF = ['1h', '4h', '1d'];

// 🔧 Aquí conectas tu lógica real de señales
// Puedes llamar a tu proveedor, a otra API interna, o a tu módulo de cálculo
async function getSignalsByTimeframe(tf) {
  // Ejemplo 1: si ya tienes un endpoint interno en tu backend:
  // const res = await fetch(`https://capit24.com/signals/multi?tf=${tf}`, { cache: 'no-store' });

  // Ejemplo 2: si usas tu propia lógica local (reemplaza esto con tu implementación real):
  // return await buildSignalsForTimeframe(tf);

  // Por ahora, como placeholder, devolvemos 1 objeto de ejemplo:
  return {
    BTC: {
      symbol: 'btc',
      price: 67000,
      signal: tf === '1h' ? 'SELL' : tf === '4h' ? 'HOLD' : 'BUY',
      confidence: tf === '1h' ? 30 : tf === '4h' ? 45 : 60,
      trend: tf === '1h' ? 'DOWNTREND' : tf === '4h' ? 'SIDEWAYS' : 'UPTREND',
      chart: {
        ohlc: [],
      },
    },
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tfParam = searchParams.get('tf');

    // Timeframe por defecto
    const tf = ALLOWED_TF.includes(tfParam) ? tfParam : '1d';

    const data = await getSignalsByTimeframe(tf);

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error('Error en /api/signals/multi:', error);
    return NextResponse.json(
      { error: 'Error al obtener señales multi-timeframe' },
      { status: 500 }
    );
  }
}
