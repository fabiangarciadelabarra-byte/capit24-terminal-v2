export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "FINNHUB_API_KEY no está configurada en Vercel" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
    );
    const news = await res.json();

    const formatted = news.slice(0, 50).map(n => ({
      headline: n.headline,
      source: n.source,
      url: n.url,
      summary: n.summary,
      datetime: n.datetime * 1000,
      image: n.image
    }));

    return Response.json({ news: formatted });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
