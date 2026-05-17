{/* TABLA */}
<table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th>Símbolo</th>
      <th>Cantidad</th>
      <th>Precio Promedio</th>
      <th>Precio Actual</th>
      <th>PNL</th>
      <th>PNL %</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((r) => (
      <tr key={r.symbol}>
        <td>{r.symbol}</td>
        <td>{r.amount}</td>
        <td>${r.avg.toLocaleString()}</td>
        <td>${r.current.toLocaleString()}</td>

        {/* PNL */}
        <td style={{ color: r.pnl >= 0 ? "#16c784" : "#ea3943" }}>
          ${r.pnl.toLocaleString()}
        </td>

        {/* PNL % */}
        <td style={{ color: r.pnlPct >= 0 ? "#16c784" : "#ea3943" }}>
          {r.pnlPct.toFixed(2)}%
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* GRÁFICO DE HISTORIAL */}
<PortfolioHistoryChart />
