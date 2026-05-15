"use client";

import { useEffect, useState } from "react";

export default function useAlerts() {
  const [alerts, setAlerts] = useState([]);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("alerts");
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  function addAlert(symbol, target, condition) {
    setAlerts((prev) => [
      ...prev,
      { symbol, target, condition, triggered: false }
    ]);
  }

  function markTriggered(index) {
    setAlerts((prev) =>
      prev.map((a, i) => (i === index ? { ...a, triggered: true } : a))
    );
  }

  return { alerts, addAlert, markTriggered };
}
