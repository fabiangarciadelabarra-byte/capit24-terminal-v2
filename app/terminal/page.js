import OrderbookBTC from "../../components/OrderbookBTC";
import TradesBTC from "../../components/TradesBTC";
import TickerBTC from "../../components/TickerBTC";
import KlineBTC from "../../components/KlineBTC";

export default function TerminalPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Capit24 Terminal — BTCUSDT (Tiempo Real)</h1>

      <section style={{ marginBottom: "2rem" }}>
        <TickerBTC />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <OrderbookBTC />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <TradesBTC />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <KlineBTC />
      </section>
    </main>
  );
}

