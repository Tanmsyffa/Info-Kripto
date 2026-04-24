import { NextRequest } from "next/server";
import { cachedFetch } from "@/lib/cache";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "50";
  const ids = searchParams.get("ids");

  try {
    const idsParam = ids ? `&ids=${ids}` : "";
    const data = await cachedFetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d${idsParam}`,
      300_000 // 5 minutes
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
