const addTrade = () => {
  if (!symbol || !price || !amount) return;

  const newTrade = {
    symbol,
    price: Number(price),
    amount: Number(amount),
    date: date || new Date().toISOString(),
  };

  // === ACTUALIZAR LISTA DE TRADES ===
  const updated = [...trades, newTrade];
  saveTrades(updated);

  // === CALCULAR POSICIONES ACTUALES ===
  const positions = updated.reduce((acc, t) => {
    if (!acc[t.symbol]) {
      acc[t.symbol] = { amount: 0, totalCost: 0 };
    }
    acc[t.symbol].amount += t.amount;
    acc[t.symbol].totalCost += t.amount * t.price;
    return acc;
  }, {});

  // === CALCULAR VALOR TOTAL DEL PORTAFOLIO ===
  const rows = Object.keys(positions).map((sym) => {
    const pos = positions[sym];
    const avg = pos.totalCost / pos.amount;

    const marketCoin = market.find(
      (c) => c.symbol.toUpperCase() === sym.toUpperCase()
    );

    const current = marketCoin?.current_price ?? 0;

    return {
      symbol: sym,
      amount: pos.amount,
      avg,
      current,
    };
  });

  const totalValue = rows.reduce(
    (acc, r) => acc + r.current * r.amount,
    0
  );

  // === GUARDAR HISTORIAL ===
  const history = JSON.parse(localStorage.getItem("portfolio_history") || "[]");

  history.push({
    date: new Date().toLocaleDateString(),
    value: totalValue,
  });

  localStorage.setItem("portfolio_history", JSON.stringify(history));

  // === LIMPIAR FORMULARIO ===
  setPrice("");
  setAmount("");
  setDate("");
};
