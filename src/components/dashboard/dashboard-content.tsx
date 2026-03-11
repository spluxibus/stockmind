"use client";

import Link from "next/link";
import { Clock, Star, Zap, BarChart3, Eye, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils/formatting";

interface HistoryItem { id: string; ticker: string; report_type: string; accessed_at: string; }
interface WatchlistItem { id: string; ticker: string; company_name: string; added_at: string; }
interface DashboardContentProps { history: HistoryItem[]; watchlist: WatchlistItem[]; firstName: string; }

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const featureTiles = [
  { icon: Zap, title: "Stock Snapshot", description: "Quick 1-page overview with key metrics, AI commentary, and score card.", time: "~15 seconds" },
  { icon: BarChart3, title: "Deep Dive Report", description: "Full analyst-style report with DCF, peer comparison, and risk matrix.", time: "~90 seconds" },
  { icon: Eye, title: "Watchlist", description: "Track your favorite stocks and access reports with one click.", time: "Always updated" },
];

export function DashboardContent({ history, watchlist, firstName }: DashboardContentProps) {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{getGreeting()}, {firstName}</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s your research overview for today.</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureTiles.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
            <Card className="border-border/60 bg-card transition-shadow hover:shadow-card">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"><f.icon className="h-5 w-5" /></div>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                <div className="mt-3 text-xs font-medium text-accent">{f.time}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {history.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">
                  <p className="text-sm">No reports yet</p>
                  <p className="text-xs mt-1">Search for a stock to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {history.map((item) => (
                    <Link key={item.id} href={item.report_type === "snapshot" ? `/stock/${item.ticker}` : `/stock/${item.ticker}/deep-dive`} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-display text-xs font-bold text-primary">{item.ticker.slice(0, 2)}</div>
                        <span className="font-mono font-semibold text-sm text-foreground">{item.ticker}</span>
                        <Badge variant="secondary" className={item.report_type === "deep_dive" ? "bg-info/10 text-info" : "bg-accent/10 text-accent"}>
                          {item.report_type === "deep_dive" ? "Deep Dive" : "Snapshot"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{formatDate(item.accessed_at)}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" />Watchlist</CardTitle>
                <Link href="/watchlist" className="text-xs font-medium text-accent hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {watchlist.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">
                  <p className="text-sm">Watchlist is empty</p>
                  <p className="text-xs mt-1">Add stocks from any stock page</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {watchlist.map((item) => (
                    <Link key={item.id} href={`/stock/${item.ticker}`} className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted font-display text-xs font-bold text-foreground">{item.ticker.slice(0, 2)}</div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{item.ticker}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[120px]">{item.company_name}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t border-border p-4">
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <Link href="/watchlist"><Plus className="h-3.5 w-3.5" /> Add Stock</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground/60">Not investment advice. All content is for informational purposes only.</p>
    </>
  );
}
