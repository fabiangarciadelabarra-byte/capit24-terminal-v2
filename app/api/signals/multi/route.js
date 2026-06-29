import { NextResponse } from "next/server";

const symbols = [
  "btc", "eth", "bnb", "ada", "atom",
  "aave", "algo", "avax", "sol", "xrp"
];

// Solo 1m permitido
const ALLOWED_TF = ["1m"];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tf = "1m"; // fijo

    const results = [];

    for (const symbol of symbols) {
      try {
        const url = `https://capit24-terminal-v2.vercel.app/api/signals/crypto?symbol=${symbol}&tf=1m`;
        const resp = await fetch(url);

        if (!resp.ok) throw new Error("Crypto engine error");

        const data = await resp.json();

        results.push({
          symbol,
          price: data.price ?? null,
          rsi: data.indicators?.rsi ?? null,
          ema20: data.indicators?.ema20 ?? null,
          ema50: data.indicators?.ema50 ?? null,
          ema200: data.indicators?.ema200 ?? null,
          trend: data.trend ?? "neutral",
          signal: data.signal ?? "neutral",
          confidence: data.confidence ?? 0,
          updatedAt: data.updatedAt ?? null,
        });

      } catch (err) {
        results.push({
          symbol,
          price: null,
          rsi: null,
          ema20: null,
          ema50: null,
          ema200: null,
          trend: "neutral",
          signal: "neutral",
          confidence: 0,
          updatedAt: null,
        });
      }
    }

    return NextResponse.json(results);

  } catch (err) {
    console.error("Error en /api/signals/multi:", err);
    return NextResponse.json(
      { error: "Error al obtener señales" },
      { status: 500 }
    );
  }
}
