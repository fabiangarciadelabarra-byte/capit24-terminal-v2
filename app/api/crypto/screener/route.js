export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false";

    const res = await fetch(url);

    // CoinGecko a veces devuelve HTML o texto → lo capturamos
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("CoinGecko devolvió HTML o texto no JSON:", text);
      return Response.json(
        { error: "Invalid response from CoinGecko" },
        { status: 500 }
      );
    }

    // Validación: debe ser array
    if (!Array.isArray(data)) {
      console.error("CoinGecko NO devolvió un array:", data);
      return Response.json(
        { error: "Unexpected CoinGecko response" },
        { status: 500 }
      );
    }

    const filtered = data.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
    );

    return Response.json(filtered);
  } catch (err) {
    console.error("Error fetching screener:", err);
    return Response.json(
      { error: "Failed to fetch screener" },
      { status: 500 }
    );
  }
}
