import { NextRequest } from "next/server";
import { getFreeCryptoData, coinIdToSymbol } from "@/lib/freecrypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids"); // comma-separated CoinGecko IDs

  if (!ids) {
    return Response.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  try {
    const coinIds = ids.split(",").map((s) => s.trim()).filter(Boolean);
    
    // Convert CoinGecko IDs to FreeCryptoAPI symbols
    const symbolToId = new Map<string, string>();
    const symbols: string[] = [];
    
    for (const id of coinIds) {
      const symbol = coinIdToSymbol(id);
      symbolToId.set(symbol, id);
      symbols.push(symbol);
    }

    // Batch in groups of 20
    const result: Record<string, {
      price: number;
      change24h: number;
      high24h: number;
      low24h: number;
      source: string;
    }> = {};

    for (let i = 0; i < symbols.length; i += 20) {
      const batch = symbols.slice(i, i + 20);
      try {
        const data = await getFreeCryptoData(batch.join("+"));
        for (const item of data) {
          const coinId = symbolToId.get(item.symbol);
          if (coinId) {
            result[coinId] = {
              price: parseFloat(item.last),
              change24h: parseFloat(item.daily_change_percentage),
              high24h: parseFloat(item.highest),
              low24h: parseFloat(item.lowest),
              source: item.source_exchange,
            };
          }
        }
      } catch {
        // Skip failed batches
      }
    }

    return Response.json({ status: "success", data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
