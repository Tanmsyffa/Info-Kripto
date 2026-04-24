import { cachedFetch } from "./cache";
import { getFreeCryptoPrice } from "./freecrypto";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

/**
 * Fetch coin detail using CoinGecko (cached) + FreeCryptoAPI (live price override).
 * This runs server-side, so we call both APIs directly (no internal API route needed).
 */
export async function fetchCoinDetail(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type CoinData = Record<string, any>;

  // Fetch CoinGecko metadata + FreeCryptoAPI live price in parallel
  const [coinGeckoResult, freeCryptoResult] = await Promise.allSettled([
    cachedFetch<CoinData>(
      `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
      90_000
    ),
    getFreeCryptoPrice(id),
  ]);

  // CoinGecko must succeed
  if (coinGeckoResult.status === "rejected") {
    throw new Error("Failed to fetch coin data from CoinGecko");
  }

  const coin = coinGeckoResult.value;

  // Override with FreeCryptoAPI live price if available
  if (
    freeCryptoResult.status === "fulfilled" &&
    freeCryptoResult.value
  ) {
    const live = freeCryptoResult.value;
    const md = coin.market_data;
    if (md) {
      // Calculate USD to IDR rate from CoinGecko data
      let rate = 15500; // fallback rate
      if (md.current_price?.idr && md.current_price?.usd) {
        rate = md.current_price.idr / md.current_price.usd;
      }

      if (md.current_price) {
        md.current_price.usd = live.price;
        md.current_price.idr = live.price * rate;
      }
      if (md.high_24h) {
        md.high_24h.usd = live.high24h;
        md.high_24h.idr = live.high24h * rate;
      }
      if (md.low_24h) {
        md.low_24h.usd = live.low24h;
        md.low_24h.idr = live.low24h * rate;
      }
      md.price_change_percentage_24h = live.change24h;

      coin._liveSource = {
        provider: "freecryptoapi",
        exchange: live.source,
        lastUpdated: live.lastUpdated,
      };
    }
  }

  return coin;
}

export async function fetchCoins(page = 1, perPage = 50) {
  return cachedFetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
    60_000
  );
}

export async function fetchCoinChart(id: string, days: string = "7") {
  return cachedFetch(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=idr&days=${days}`,
    120_000
  );
}

export async function fetchTrending() {
  return cachedFetch(`${COINGECKO_BASE}/search/trending`, 300_000);
}

export async function fetchGlobal() {
  return cachedFetch(`${COINGECKO_BASE}/global`, 120_000);
}

export async function searchCoins(query: string) {
  return cachedFetch(
    `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`,
    300_000
  );
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "—";
  if (price >= 100) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(price);
}

export function formatMarketCap(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(2)} Triliun`;
  if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(2)} Miliar`;
  if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(2)} Juta`;
  if (value >= 1e3) return `Rp ${(value / 1e3).toFixed(2)} Ribu`;
  return `Rp ${value.toFixed(2)}`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatVolume(value: number | null | undefined): string {
  return formatMarketCap(value);
}
