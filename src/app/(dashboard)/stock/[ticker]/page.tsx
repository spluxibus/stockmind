"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { FileText, Star, Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SnapshotView } from "@/components/report/snapshot-view";
import { SnapshotSkeleton } from "@/components/report/snapshot-skeleton";
import type { SnapshotReport } from "@/lib/schemas/report";

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export default function StockSnapshotPage({ params }: PageProps) {
  const { ticker } = use(params);
  const upperTicker = ticker.toUpperCase();

  const [report, setReport] = useState<SnapshotReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  async function fetchReport() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: upperTicker }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to generate report (${res.status})`);
      }

      const data: SnapshotReport = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
  }, [upperTicker]);

  return (
    <div className="max-w-5xl space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-mono font-semibold text-foreground">{upperTicker}</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded">Snapshot</span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/stock/${upperTicker}/deep-dive`}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Deep Dive
            </Link>
          </Button>
          {report && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const res = await fetch("/api/watchlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ticker: upperTicker,
                    companyName: report.companyName,
                  }),
                });
                if (res.ok || res.status === 409) setInWatchlist(true);
              }}
              disabled={inWatchlist}
            >
              <Star className={`mr-1.5 h-3.5 w-3.5 ${inWatchlist ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading && <SnapshotSkeleton ticker={upperTicker} />}

      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchReport}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {report && !loading && <SnapshotView report={report} />}
    </div>
  );
}
