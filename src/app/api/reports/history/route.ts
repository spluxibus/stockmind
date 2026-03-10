import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("report_history")
      .select("id, ticker, report_type, accessed_at, report_id")
      .eq("user_id", user.id)
      .order("accessed_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[API] History error:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
