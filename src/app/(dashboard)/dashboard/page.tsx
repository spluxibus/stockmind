import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Clock, Star, TrendingUp, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatting";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch recent history and watchlist in parallel
  const [historyResult, watchlistResult] = await Promise.allSettled([
    supabase
      .from("report_history")
      .select("id, ticker, report_type, accessed_at")
      .eq("user_id", user!.id)
      .order("accessed_at", { ascending: false })
      .limit(10),
    supabase
      .from("watchlists")
      .select("id, ticker, company_name, added_at")
      .eq("user_id", user!.id)
      .order("added_at", { ascending: false })
      .limit(8),
  ]);

  const history = historyResult.status === "fulfilled" ? (historyResult.value.data ?? []) : [];
  const watchlist = watchlistResult.status === "fulfilled" ? (watchlistResult.value.data ?? []) : [];

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Search for a stock to generate an AI-powered analysis report.
        </p>
      </div>

      {/* Quick access tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Stock Snapshot</p>
                <p className="text-xs text-muted-foreground mt-0.5">Instant overview in ~15s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Deep Dive Report</p>
                <p className="text-xs text-muted-foreground mt-0.5">Full analysis in ~90s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Watchlist</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {watchlist.length} stock{watchlist.length !== 1 ? "s" : ""} tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Reports
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reports yet</p>
                <p className="text-xs mt-1">Search for a stock to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.report_type === "snapshot"
                        ? `/stock/${item.ticker}`
                        : `/stock/${item.ticker}/deep-dive`
                    }
                    className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-primary w-12">
                        {item.ticker}
                      </span>
                      <Badge variant={item.report_type === "deep_dive" ? "default" : "secondary"} className="text-xs">
                        {item.report_type === "deep_dive" ? "Deep Dive" : "Snapshot"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.accessed_at)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Watchlist Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                Watchlist
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                <Link href="/watchlist">
                  Manage <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {watchlist.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Watchlist is empty</p>
                <p className="text-xs mt-1">Add stocks from the stock page</p>
              </div>
            ) : (
              <div className="space-y-1">
                {watchlist.map((item) => (
                  <Link
                    key={item.id}
                    href={`/stock/${item.ticker}`}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-primary w-12">
                        {item.ticker}
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[140px]">
                        {item.company_name}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground border-t pt-4">
        ⚠️ StockMind AI reports are for informational purposes only and do not constitute investment advice.
        Always conduct your own research before making investment decisions.
      </p>
    </div>
  );
}
