import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReportGenerator } from "@/lib/services/report-generator";
import { normalizeTicker } from "@/lib/constants/sp500";
import { toApiError } from "@/lib/utils/errors";
import { z } from "zod";

const RequestSchema = z.object({
  ticker: z.string().min(1).max(10),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request
    const body = await request.json();
    const { ticker } = RequestSchema.parse(body);
    const normalizedTicker = normalizeTicker(ticker);

    // Generate or retrieve cached snapshot
    const generator = getReportGenerator();
    const report = await generator.generateSnapshot(normalizedTicker, user.id);

    return NextResponse.json(report);
  } catch (err) {
    console.error("[API] Snapshot error:", err);
    const { error, code } = toApiError(err);
    const status = code === "AUTH_ERROR" ? 401 : code === "VALIDATION_ERROR" ? 400 : code === "RATE_LIMIT" ? 429 : 500;
    return NextResponse.json({ error, code }, { status });
  }
}
