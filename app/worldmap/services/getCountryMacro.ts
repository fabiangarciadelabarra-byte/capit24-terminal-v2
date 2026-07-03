export async function getCountryMacro(countryCode: string) {
  const url = `https://cold-hill-2663.fabiangarciadelabarra.workers.dev/${countryCode}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.macro;
}
