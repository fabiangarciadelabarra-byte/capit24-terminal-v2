export async function GET() {
  try {
    // Fear & Greed Index (Alternative.me)
    const fearRes = await fetch("https://api.alternative.me/fng/");
    const fearData = await fearRes.json();

    const fearValue = fearData?.data?.[0]?.value || "50";
    const fearClassification = fearData?.data?.[0]?.value_classification || "Neutral";

    // Social Sentiment (LunarCrush - endpoint público)
    const socialRes = await fetch("https://api.lunarcrush.com/v2?data=market");
    const socialData = await socialRes.json();

    const socialScore = socialData?.data?.[0]?.galaxy_score || 50;

    return Response.json({
      fear_greed: {
        value: fearValue,
        classification: fearClassification,
      },
      social: {
        galaxy_score: socialScore,
      },
    });
  } catch (error) {
    return Response.json({
      fear_greed: { value: "50", classification: "Neutral" },
      social: { galaxy_score: 50 },
    });
  }
}
