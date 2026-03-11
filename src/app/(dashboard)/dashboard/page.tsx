import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [historyResult, watchlistResult] = await Promise.allSettled([
    supabase.from("report_history").select("id, ticker, report_type, accessed_at").eq("user_id", user!.id).order("accessed_at", { ascending: false }).limit(10),
    supabase.from("watchlists").select("id, ticker, company_name, added_at").eq("user_id", user!.id).order("added_at", { ascending: false }).limit(8),
  ]);

  const history = historyResult.status === "fulfilled" ? (historyResult.value.data ?? []) : [];
  const watchlist = watchlistResult.status === "fulfilled" ? (watchlistResult.value.data ?? []) : [];
  const firstName = user?.email?.split("@")[0] ?? "there";

  return <DashboardContent history={history} watchlist={watchlist} firstName={firstName} />;
}
