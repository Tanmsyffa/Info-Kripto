import { NextRequest } from "next/server";
import { cachedFetch } from "@/lib/cache";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coin");
  const days = searchParams.get("days") || "7";

  if (!coinId) {
    return Response.json({ error: "Missing coin parameter" }, { status: 400 });
  }

  try {
    const data = await cachedFetch(
      `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=idr&days=${days}`,
      300_000
    );

    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: message },
      { status: 502 }
    );
  }
}
