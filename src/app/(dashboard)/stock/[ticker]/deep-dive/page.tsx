"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeepDiveView } from "@/components/report/deep-dive-view";
import type { DeepDiveReport } from "@/lib/schemas/report";

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export default function DeepDivePage({ params }: PageProps) {
  const { ticker } = use(params);
  const upperTicker = ticker.toUpperCase();

  const [report, setReport] = useState<DeepDiveReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function fetchReport() {
    setLoading(true);
    setError(null);
    setElapsed(0);

    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);

    try {
      const res = await fetch("/api/reports/deep-dive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: upperTicker }),
      });

      clearInterval(timer);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to generate report (${res.status})`);
      }

      const data: DeepDiveReport = await res.json();
      setReport(data);
    } catch (err) {
      clearInterval(timer);
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
          <Link href={`/stock/${upperTicker}`} className="hover:text-foreground transition-colors font-mono font-semibold text-foreground">
            {upperTicker}
          </Link>
          <span>/</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Deep Dive</span>
        </div>

        {report && (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticker: upperTicker, companyName: report.companyName }),
              });
            }}
          >
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Add to Watchlist
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-lg border bg-card p-8 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <div className="space-y-1">
            <p className="font-semibold">Generating Deep Dive for {upperTicker}</p>
            <p className="text-sm text-muted-foreground">
              Collecting financial data, running analysis, writing report...
            </p>
          </div>
          <div className="max-w-xs mx-auto space-y-1">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(95, (elapsed / 90) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{elapsed}s elapsed · ~60-90s total</p>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            {elapsed < 15 && <p>📊 Fetching financial data...</p>}
            {elapsed >= 15 && elapsed < 30 && <p>🔬 Running financial analysis & DCF model...</p>}
            {elapsed >= 30 && elapsed < 50 && <p>👥 Building peer comparison...</p>}
            {elapsed >= 50 && <p>✍️ Generating AI report narrative...</p>}
          </div>
        </div>
      )}

      {/* Error state */}
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

      {/* Report */}
      {report && !loading && <DeepDiveView report={report} />}
    </div>
  );
}
