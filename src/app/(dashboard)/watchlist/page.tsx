"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, Trash2, TrendingUp, TrendingDown, ExternalLink, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WatchlistItem {
  id: string;
  ticker: string;
  company_name: string;
  notes: string | null;
  added_at: string;
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addTicker, setAddTicker] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data.watchlist ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  async function removeItem(id: string) {
    setRemovingId(id);
    try {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setRemovingId(null);
    }
  }

  async function addStock() {
    const ticker = addTicker.trim().toUpperCase();
    if (!ticker) return;
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, companyName: ticker }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed to add stock");
        return;
      }
      setAddOpen(false);
      setAddTicker("");
      await fetchWatchlist();
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Watchlist
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track stocks you want to monitor and analyze.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading watchlist...
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-semibold text-lg mb-1">Your watchlist is empty</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add stocks to track them here, or visit a stock page and click &quot;Add to Watchlist&quot;.
            </p>
            <Button onClick={() => setAddOpen(true)} variant="outline">
              <Plus className="mr-1.5 h-4 w-4" />
              Add your first stock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-lg text-primary">{item.ticker}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.company_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={removingId === item.id}
                  >
                    {removingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 mb-3">
                    {item.notes}
                  </p>
                )}

                <p className="text-[10px] text-muted-foreground mb-3">
                  Added {new Date(item.added_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Button asChild variant="default" size="sm" className="flex-1 text-xs h-8">
                    <Link href={`/stock/${item.ticker}`}>
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Snapshot
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 text-xs h-8">
                    <Link href={`/stock/${item.ticker}/deep-dive`}>
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Deep Dive
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Stock Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setAddTicker(""); setAddError(null); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Stock to Watchlist</DialogTitle>
            <DialogDescription>
              Enter a ticker symbol (e.g. AAPL, MSFT) to add it to your watchlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="ticker" className="text-sm">Ticker Symbol</Label>
              <Input
                id="ticker"
                placeholder="e.g. AAPL"
                value={addTicker}
                onChange={(e) => setAddTicker(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && addStock()}
                className="mt-1.5 font-mono"
                maxLength={10}
                autoFocus
              />
            </div>
            {addError && (
              <p className="text-sm text-destructive">{addError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addLoading}>Cancel</Button>
            <Button onClick={addStock} disabled={!addTicker.trim() || addLoading}>
              {addLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />}
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-muted-foreground border-t pt-4">
        ⚠️ StockMind AI reports are for informational purposes only and do not constitute investment advice.
      </p>
    </div>
  );
}
