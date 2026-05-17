"use client";

export default function SentimentPanel({ sentiment }) {
  if (!sentiment) return null;

  const fg = sentiment.fear_greed;
  const social = sentiment.social;

  const mood =
    fg.value >= 70 || social.galaxy_score >= 70
      ? "Bullish"
      : fg.value <= 30 || social.galaxy_score <= 30
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
          <strong>Fear & Greed Index:</strong> {fg.value} ({fg.classification})
        </p>

        <p>
          <strong>Social Galaxy Score:</strong> {social.galaxy_score}
        </p>

        <p style={{ marginTop: "15px", color: moodColor, fontSize: "20px" }}>
          <strong>Market Mood: {mood}</strong>
        </p>
      </div>
    </div>
  );
}
