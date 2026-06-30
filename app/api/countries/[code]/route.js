export async function GET(request, { params }) {
  const { code } = params;

  async function fetchIndicator(indicator) {
    const url = `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json`;
    const res = await fetch(url);
    const json = await res.json();
    return json?.[1]?.[0]?.value || null;
  }

  const inflation = await fetchIndicator("NY.GDP.DEFL.KD.ZG");
  const gdp = await fetchIndicator("NY.GDP.MKTP.CD");
  const growth = await fetchIndicator("NY.GDP.MKTP.KD.ZG");
  const population = await fetchIndicator("SP.POP.TOTL");

  return Response.json({
    code,
    inflation,
    gdp,
    growth,
    population,
  });
}
