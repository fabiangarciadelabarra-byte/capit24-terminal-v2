"use client";

export default function NewsPanel({ news }) {
  // Protección total
  if (!Array.isArray(news) || news.length === 0) {
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
        <h2>Noticias recientes</h2>
        <p style={{ opacity: 0.7 }}>No hay noticias disponibles.</p>
      </div>
    );
  }

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
      <h2>Noticias recientes</h2>

      {news.map((item, i) => (
        <div
          key={i}
          style={{
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #222",
          }}
        >
          <a
            href={item.url || "#"}
            target="_blank"
            style={{ color: "#4ea1ff", fontSize: "18px" }}
          >
            {item.title || "Sin título"}
          </a>

          <p style={{ opacity: 0.7, marginTop: "5px" }}>
            {item.source || "Fuente desconocida"} —{" "}
            {item.published_at
              ? new Date(item.published_at).toLocaleString()
              : "Fecha no disponible"}
          </p>
        </div>
      ))}
    </div>
  );
}
