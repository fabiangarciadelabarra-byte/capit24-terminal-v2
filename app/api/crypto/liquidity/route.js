export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";
  const limit = searchParams.get("limit") || "100";

  const workerUrl = `https://dawn-sky-9923.fabiangarciadelabarra.workers.dev/?endpoint=/api/v3/depth&symbol=${symbol}&limit=${limit}`;

  try {
    const response = await fetch(workerUrl);
    const data = await response.json();

    return Response.json(data, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return Response.json(
      { error: "Error al obtener liquidez desde el proxy", status: 451 },
      { status: 451 }
    );
  }
}
