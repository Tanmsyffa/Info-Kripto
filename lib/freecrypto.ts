/**
 * FreeCryptoAPI client — used for instant live prices.
 * Docs: https://freecryptoapi.com/documentation
 * Free tier: 100k req/month, /getData endpoint
 */

const FREECRYPTO_BASE = "https://api.freecryptoapi.com/v1";

interface FreeCryptoSymbol {
  symbol: string;
  last: string;
  last_btc: string;
  lowest: string;
  highest: string;
  date: string;
  daily_change_percentage: string;
  source_exchange: string;
}

interface FreeCryptoResponse {
  status: string | boolean;
  symbols?: FreeCryptoSymbol[];
  error?: string;
}

/**
 * Fetch live price data from FreeCryptoAPI for one or more symbols.
 * Symbols should be uppercase (e.g., "BTC", "ETH+SOL+XRP").
 */
export async function getFreeCryptoData(
  symbols: string
): Promise<FreeCryptoSymbol[]> {
  const apiKey = process.env.FREECRYPTO_API_KEY;
  if (!apiKey) {
    throw new Error("FREECRYPTO_API_KEY not configured");
  }

  const res = await fetch(
    `${FREECRYPTO_BASE}/getData?symbol=${encodeURIComponent(symbols)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    }
  );

  if (!res.ok) {
    throw new Error(`FreeCryptoAPI error: ${res.status}`);
  }

  const data: FreeCryptoResponse = await res.json();

  if (data.status === false || data.error) {
    throw new Error(data.error || "FreeCryptoAPI request failed");
  }

  return data.symbols || [];
}

/**
 * Map of CoinGecko IDs to FreeCryptoAPI symbols.
 * FreeCryptoAPI uses trading symbols (BTC, ETH, etc.)
 */
const COINGECKO_TO_SYMBOL: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  ripple: "XRP",
  binancecoin: "BNB",
  solana: "SOL",
  "usd-coin": "USDC",
  dogecoin: "DOGE",
  cardano: "ADA",
  tron: "TRX",
  avalanche: "AVAX", // Note: might be AVAX-2078 
  shiba: "SHIB",
  "shiba-inu": "SHIB",
  chainlink: "LINK",
  "bitcoin-cash": "BCH",
  polkadot: "DOT",
  uniswap: "UNI",
  litecoin: "LTC",
  "near-protocol": "NEAR",
  "matic-network": "MATIC",
  polygon: "POL",
  stellar: "XLM",
  monero: "XMR",
  "internet-computer": "ICP",
  cosmos: "ATOM",
  "ethereum-classic": "ETC",
  filecoin: "FIL",
  hedera: "HBAR",
  "lido-dao": "LDO",
  aptos: "APT",
  arbitrum: "ARB",
  optimism: "OP",
  "the-graph": "GRT",
  fantom: "FTM",
  algorand: "ALGO",
  aave: "AAVE",
  "the-sandbox": "SAND",
  decentraland: "MANA",
  "axie-infinity": "AXS",
  eos: "EOS",
  theta: "THETA",
  neo: "NEO",
  tezos: "XTZ",
  iota: "IOTA",
  "flow-token": "FLOW",
  kucoin: "KCS",
  maker: "MKR",
  "injective-protocol": "INJ",
  render: "RNDR",
  "render-token": "RNDR",
  sui: "SUI",
  sei: "SEI",
  celestia: "TIA",
  pepe: "PEPE",
  bonk: "BONK",
  floki: "FLOKI",
  kaspa: "KAS",
  "fetch-ai": "FET",
  ondo: "ONDO",
  jupiter: "JUP",
  pendle: "PENDLE",
  starknet: "STRK",
  wormhole: "W",
  worldcoin: "WLD",
  "first-digital-usd": "FDUSD",
  usds: "USDS",
  "wrapped-bitcoin": "WBTC",
  "leo-token": "LEO",
  dai: "DAI",
  mantle: "MNT",
  "thorchain": "RUNE",
  "okb": "OKB",
  "cronos": "CRO",
  "vechain": "VET",
  "gala": "GALA",
  "immutable-x": "IMX",
  "pyth-network": "PYTH",
};

/**
 * Convert a CoinGecko ID to a FreeCryptoAPI symbol.
 * Falls back to uppercase ID if not in the map.
 */
export function coinIdToSymbol(coinGeckoId: string): string {
  return COINGECKO_TO_SYMBOL[coinGeckoId] || coinGeckoId.toUpperCase();
}

/**
 * Get live price for a single coin by CoinGecko ID.
 * Returns null if FreeCryptoAPI doesn't have the symbol.
 */
export async function getFreeCryptoPrice(coinGeckoId: string): Promise<{
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  source: string;
  lastUpdated: string;
} | null> {
  try {
    const symbol = coinIdToSymbol(coinGeckoId);
    const data = await getFreeCryptoData(symbol);

    if (data.length === 0) return null;

    const coin = data[0];
    return {
      price: parseFloat(coin.last),
      change24h: parseFloat(coin.daily_change_percentage),
      high24h: parseFloat(coin.highest),
      low24h: parseFloat(coin.lowest),
      source: coin.source_exchange,
      lastUpdated: coin.date,
    };
  } catch {
    return null;
  }
}

/**
 * Get live prices for multiple coins at once (batch).
 * FreeCryptoAPI supports symbols joined with "+".
 */
export async function getFreeCryptoPrices(
  coinGeckoIds: string[]
): Promise<Map<string, FreeCryptoSymbol>> {
  const symbolToId = new Map<string, string>();
  const symbols: string[] = [];

  for (const id of coinGeckoIds) {
    const symbol = coinIdToSymbol(id);
    symbolToId.set(symbol, id);
    symbols.push(symbol);
  }

  // FreeCryptoAPI accepts symbols joined by "+"
  // Batch in groups of 20 to avoid URL length issues
  const result = new Map<string, FreeCryptoSymbol>();

  for (let i = 0; i < symbols.length; i += 20) {
    const batch = symbols.slice(i, i + 20);
    try {
      const data = await getFreeCryptoData(batch.join("+"));
      for (const item of data) {
        const id = symbolToId.get(item.symbol);
        if (id) result.set(id, item);
      }
    } catch {
      // Skip failed batches
    }
  }

  return result;
}
