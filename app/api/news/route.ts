import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "cryptocurrency";
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "News API key not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch news" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
