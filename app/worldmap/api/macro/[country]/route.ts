export async function GET(req, { params }) {
  const country = params.country.toUpperCase();

  const res = await fetch(
    `https://cold-hill-2663.fabiangarciadelabarra.workers.dev/${country}`
  );

  const data = await res.json();

  return Response.json(data);
}
