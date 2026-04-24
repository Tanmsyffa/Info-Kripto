import { cachedFetch } from "@/lib/cache";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET() {
  try {
    // Fetch global data first
    const globalData = await cachedFetch<{ data: unknown }>(
      `${COINGECKO_BASE}/global`,
      300_000 // 5 minutes
    );

    // Then fetch trending (staggered to avoid rate limit)
    const trendingData = await cachedFetch<{ coins: unknown[] }>(
      `${COINGECKO_BASE}/search/trending`,
      300_000
    );

    return Response.json({
      global: globalData.data,
      trending: (trendingData.coins || []).slice(0, 7),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: message },
      { status: 502 }
    );
  }
}
