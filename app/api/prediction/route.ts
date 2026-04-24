import { NextRequest } from "next/server";
import { cachedFetch } from "@/lib/cache";
import { generatePrediction } from "@/lib/prediction";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coin");

  if (!coinId) {
    return Response.json({ error: "Missing coin parameter" }, { status: 400 });
  }

  try {
    // Uses cache — if chart route already fetched 30-day data, this is instant
    const chartData = await cachedFetch<{ prices: [number, number][] }>(
      `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=idr&days=30`,
      300_000
    );

    const prices = chartData.prices.map((p) => p[1]);
    const currentPrice = prices[prices.length - 1];
    const prediction = generatePrediction(prices, currentPrice);

    return Response.json(prediction);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: message },
      { status: 502 }
    );
  }
}
