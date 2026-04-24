import { NextRequest } from "next/server";
import { cachedFetch } from "@/lib/cache";
import { getFreeCryptoPrice } from "@/lib/freecrypto";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("id");

  if (!coinId) {
    return Response.json({ error: "Missing id parameter" }, { status: 400 });
  }

  try {
    // Fetch both sources in parallel:
    // 1. CoinGecko for metadata (name, image, market_data details)
    // 2. FreeCryptoAPI for real-time price (faster, more reliable)
    const [coinGeckoData, freeCryptoPrice] = await Promise.allSettled([
      cachedFetch<Record<string, unknown>>(
        `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
        90_000 // longer cache since we supplement with live price
      ),
      getFreeCryptoPrice(coinId),
    ]);

    // CoinGecko must succeed for metadata
    if (coinGeckoData.status === "rejected") {
      return Response.json(
        { error: "Failed to fetch coin data" },
        { status: 502 }
      );
    }

    const coin = coinGeckoData.value as Record<string, unknown>;

    // If FreeCryptoAPI returned live data, override the price fields
    if (
      freeCryptoPrice.status === "fulfilled" &&
      freeCryptoPrice.value
    ) {
      const live = freeCryptoPrice.value;
      const md = coin.market_data as Record<string, unknown>;
      if (md) {
        // Override with live prices
        const currentPrice = md.current_price as Record<string, number>;
        if (currentPrice) currentPrice.usd = live.price;

        const high24h = md.high_24h as Record<string, number>;
        if (high24h) high24h.usd = live.high24h;

        const low24h = md.low_24h as Record<string, number>;
        if (low24h) low24h.usd = live.low24h;

        md.price_change_percentage_24h = live.change24h;

        // Add source info
        (coin as Record<string, unknown>)._liveSource = {
          provider: "freecryptoapi",
          exchange: live.source,
          lastUpdated: live.lastUpdated,
        };
      }
    }

    return Response.json(coin);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
