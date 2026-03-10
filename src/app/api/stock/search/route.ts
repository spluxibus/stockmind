import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFMPService } from "@/lib/services/fmp";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }

    const fmp = getFMPService();
    const results = await fmp.searchTicker(query, 10);

    // Filter to US exchanges only
    const filtered = results.filter((r) =>
      ["NASDAQ", "NYSE", "NYSE ARCA", "NYSE MKT"].includes(r.exchangeShortName ?? "")
    );

    return NextResponse.json(filtered.slice(0, 8));
  } catch (err) {
    console.error("[API] Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
