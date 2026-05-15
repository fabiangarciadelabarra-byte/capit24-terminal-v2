"use client";

import { useState } from "react";

export default function AlertCreator({ selectedSymbol, addAlert }) {
  const [target, setTarget] = useState("");
  const [condition, setCondition] = useState("above");

  function create() {
    if (!target) return;
    addAlert(selectedSymbol, Number(target), condition);
    setTarget("");
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        background: "#111",
        borderRadius: "10px",
        border: "1px solid #333",
      }}
    >
      <h3>Crear alerta para {selectedSymbol}</h3>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={{ padding: "8px", background: "#222", color: "white" }}
        >
          <option value="above">Precio suba por encima de</option>
          <option value="below">Precio caiga por debajo de</option>
        </select>

        <input
          type="number"
          placeholder="Precio objetivo"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{
            padding: "8px",
            background: "#222",
            color: "white",
            border: "1px solid #333",
          }}
        />

        <button
          onClick={create}
          style={{
            padding: "8px 12px",
            background: "#4ea1ff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Crear
        </button>
      </div>
    </div>
  );
}
