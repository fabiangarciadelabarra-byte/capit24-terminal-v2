export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return Response.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    // Llamamos a tu Worker seguro en Cloudflare
    const res = await fetch(`https://capit24.com/api/quote?symbol=${symbol}`);
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Proxy error", details: error },
      { status: 500 }
    );
  }
}
