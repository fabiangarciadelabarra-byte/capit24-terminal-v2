"use client";

export default function SentimentPanel({ sentiment }) {
  if (!sentiment) return null;

  // Asegurar estructura válida
  const fg = sentiment.fear_greed ?? {};
  const social = sentiment.social ?? {};

  const fgValue = Number(fg.value ?? 0);
  const fgClass = fg.classification ?? "-";

  const socialScore = Number(social.galaxy_score ?? 0);

  const mood =
    fgValue >= 70 || socialScore >= 70
      ? "Bullish"
      : fgValue <= 30 || socialScore <= 30
      ? "Bearish"
      : "Neutral";

  const moodColor =
    mood === "Bullish" ? "#16c784" : mood === "Bearish" ? "#ea3943" : "#f3c623";

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#111",
        borderRadius: "10px",
        border: "1px solid #333",
      }}
    >
      <h2>Market Sentiment</h2>

      <div style={{ marginTop: "15px" }}>
        <p>
          <strong>Fear & Greed Index:</strong> {fgValue} ({fgClass})
        </p>

        <p>
          <strong>Social Galaxy Score:</strong> {socialScore}
        </p>

        <p style={{ marginTop: "15px", color: moodColor, fontSize: "20px" }}>
          <strong>Market Mood: {mood}</strong>
        </p>
      </div>
    </div>
  );
}
