"use client";

export default function AlertNotifications({ alerts }) {
  const active = alerts.filter((a) => a.triggered);

  if (active.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        background: "#162d18",
        borderRadius: "10px",
        border: "1px solid #1f7a2e",
        color: "#4eff7a",
      }}
    >
      <h3>Alertas activadas</h3>

      {active.map((a, i) => (
        <p key={i}>
          {a.symbol} ha {a.condition === "above" ? "superado" : "caído por debajo de"}{" "}
          {a.target.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
