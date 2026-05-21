import OrderbookBTC from "../components/OrderbookBTC";
import TradesBTC from "../components/TradesBTC";
import TickerBTC from "../components/TickerBTC";
import KlineBTC from "../components/KlineBTC";

export default function TerminalPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Capit24 Terminal — BTCUSDT</h1>

      <TickerBTC />
      <hr />

      <OrderbookBTC />
      <hr />

      <TradesBTC />
      <hr />

      <KlineBTC />
    </main>
  );
}
