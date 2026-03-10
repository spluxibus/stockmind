import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const AddSchema = z.object({
  ticker: z.string().min(1).max(10),
  companyName: z.string().min(1).max(255),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { ticker, companyName, notes } = AddSchema.parse(body);

    const { data, error } = await supabase
      .from("watchlists")
      .insert({
        user_id: user.id,
        ticker: ticker.toUpperCase(),
        company_name: companyName,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: `${ticker} is already in your watchlist` }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}
