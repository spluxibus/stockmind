import type { AISnapshot } from "@/lib/schemas/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface AICommentaryProps {
  aiAnalysis: AISnapshot;
}

const OUTLOOK_CONFIG = {
  bullish: { color: "bg-success/10 text-success border-success/20", label: "Bullish Outlook" },
  neutral: { color: "bg-warning/10 text-warning border-warning/20", label: "Neutral Outlook" },
  bearish: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Bearish Outlook" },
};

const SENTIMENT_CONFIG = {
  positive: {
    borderColor: "border-l-success",
    bg: "bg-success/5",
    dotColor: "bg-success",
    icon: ArrowUpRight,
    textColor: "text-success",
    badgeClass: "bg-success/10 text-success",
  },
  neutral: {
    borderColor: "border-l-warning",
    bg: "bg-warning/5",
    dotColor: "bg-warning",
    icon: Minus,
    textColor: "text-warning",
    badgeClass: "bg-warning/10 text-warning",
  },
  negative: {
    borderColor: "border-l-destructive",
    bg: "bg-destructive/5",
    dotColor: "bg-destructive",
    icon: ArrowDownRight,
    textColor: "text-destructive",
    badgeClass: "bg-destructive/10 text-destructive",
  },
};

export function AICommentary({ aiAnalysis }: AICommentaryProps) {
  const outlookConfig = OUTLOOK_CONFIG[aiAnalysis.outlook];

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Analysis
          </CardTitle>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${outlookConfig.color}`}
          >
            {outlookConfig.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Executive Summary */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{aiAnalysis.summary}</p>
        </div>

        {/* Bull Case */}
        {aiAnalysis.keyHighlights.some((h) => h.sentiment === "positive") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-success" />
              <p className="text-xs font-semibold uppercase tracking-wide text-success">Bull Case</p>
            </div>
            <ul className="space-y-2">
              {aiAnalysis.keyHighlights
                .filter((h) => h.sentiment === "positive")
                .map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    <div>
                      <span className="text-xs font-medium text-success mr-1.5">{highlight.label}</span>
                      <span className="text-sm text-foreground">{highlight.text}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Bear Case */}
        {aiAnalysis.keyHighlights.some((h) => h.sentiment === "negative") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-destructive" />
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Bear Case</p>
            </div>
            <ul className="space-y-2">
              {aiAnalysis.keyHighlights
                .filter((h) => h.sentiment === "negative")
                .map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    <div>
                      <span className="text-xs font-medium text-destructive mr-1.5">{highlight.label}</span>
                      <span className="text-sm text-foreground">{highlight.text}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Neutral highlights */}
        {aiAnalysis.keyHighlights.some((h) => h.sentiment === "neutral") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Observations</p>
            </div>
            <ul className="space-y-2">
              {aiAnalysis.keyHighlights
                .filter((h) => h.sentiment === "neutral")
                .map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <div>
                      <span className="text-xs font-medium text-muted-foreground mr-1.5">{highlight.label}</span>
                      <span className="text-sm text-foreground">{highlight.text}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Commentary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Valuation</p>
            <p className="text-sm leading-relaxed text-foreground/80">{aiAnalysis.commentary.valuation}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Growth</p>
            <p className="text-sm leading-relaxed text-foreground/80">{aiAnalysis.commentary.growth}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risks</p>
            <p className="text-sm leading-relaxed text-foreground/80">{aiAnalysis.commentary.risks}</p>
          </div>
        </div>

        {/* Analyst View */}
        {aiAnalysis.analystView && (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Analyst View</p>
            <p className="text-sm text-foreground/80">{aiAnalysis.analystView}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
