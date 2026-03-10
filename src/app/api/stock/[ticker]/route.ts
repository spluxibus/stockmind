import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFMPService } from "@/lib/services/fmp";
import { normalizeTicker } from "@/lib/constants/sp500";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticker } = await params;
    const normalizedTicker = normalizeTicker(ticker);

    const fmp = getFMPService();
    const [profile, quote] = await Promise.allSettled([
      fmp.getCompanyProfile(normalizedTicker),
      fmp.getStockQuote(normalizedTicker),
    ]);

    return NextResponse.json({
      profile: profile.status === "fulfilled" ? profile.value : null,
      quote: quote.status === "fulfilled" ? quote.value : null,
    });
  } catch (err) {
    console.error("[API] Stock data error:", err);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
