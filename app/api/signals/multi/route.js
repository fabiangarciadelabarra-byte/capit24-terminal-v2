// Cache global en memoria del servidor
let cache = {
  timestamp: 0,
  data: null
};

export async function GET() {
  // CORS para Horizons
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // Si el cache tiene menos de 30 segundos → devolver cache
  const now = Date.now();
  if (cache.data && now - cache.timestamp < 30000) {
    return new Response(JSON.stringify(cache.data), { headers });
  }

  // Lista de 80 activos
  const assets = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    BNB: "binancecoin",
    SOL: "solana",
    XRP: "ripple",
    USDC: "usd-coin",
    ADA: "cardano",
    AVAX: "avalanche-2",
    DOGE: "dogecoin",
    TRX: "tron",
    TON: "the-open-network",
    DOT: "polkadot",
    MATIC: "matic-network",
    LINK: "chainlink",
    LTC: "litecoin",
    BCH: "bitcoin-cash",
    XLM: "stellar",
    ATOM: "cosmos",
    FIL: "filecoin",
    APT: "aptos",
    ARB: "arbitrum",
    OP: "optimism",
    INJ: "injective-protocol",
    NEAR: "near",
    HBAR: "hedera-hashgraph",
    SUI: "sui",
    AAVE: "aave",
    MKR: "maker",
    RUNE: "thorchain",
    ALGO: "algorand",
    EGLD: "elrond-erd-2",
    VET: "vechain",
    FTM: "fantom",
    GRT: "the-graph",
    MANA: "decentraland",
    SAND: "the-sandbox",
    IMX: "immutable-x",
    LDO: "lido-dao",
    STX: "blockstack",
    KAS: "kaspa",
    BONK: "bonk",
    JUP: "jupiter-exchange-solana",
    PYTH: "pyth-network",
    XMR: "monero",
    QNT: "quant-network",
    CRO: "crypto-com-chain",
    FLOW: "flow",
    CHZ: "chiliz",
    AXS: "axie-infinity",
    THETA: "theta-token",
    SNX: "synthetix-network-token",
    CRV: "curve-dao-token",
    DYDX: "dydx",
    GMX: "gmx",
    LRC: "loopring",
    ENJ: "enjincoin",
    BAT: "basic-attention-token",
    ZEC: "zcash",
    DASH: "dash",
    KAVA: "kava",
    CELO: "celo",
    MINA: "mina-protocol",
    OSMO: "osmosis",
    ROSE: "oasis-network",
    ONE: "harmony",
    XTZ: "tezos",
    KLAY: "klay-token",
    WAVES: "waves",
    HOT: "holotoken",
    ZIL: "zilliqa",
    GALA: "gala",
    PEPE: "pepe",
    FLOKI: "floki",
    SEI: "sei-network",
    WOO: "woo-network",
    JASMY: "jasmycoin",
    ONDO: "ondo-finance"
  };

  const results = {};

  // Fetch paralelo controlado
  await Promise.all(
    Object.entries(assets).map(async ([symbol, id]) => {
      try {
        const res = await fetch(
          `https://capit24-terminal-v2.vercel.app/api/signals/crypto?symbol=${id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        results[symbol] = data;
      } catch {
        results[symbol] = { error: true };
      }
    })
  );

  // Guardar en cache
  cache = {
    timestamp: now,
    data: results
  };

  return new Response(JSON.stringify(results), { headers });
}
