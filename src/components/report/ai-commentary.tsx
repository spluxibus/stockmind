import type { AISnapshot } from "@/lib/schemas/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AICommentaryProps {
  aiAnalysis: AISnapshot;
}

const SENTIMENT_CONFIG = {
  positive: {
    border: "border-l-green-500",
    bg: "bg-green-50 dark:bg-green-950/20",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: TrendingUp,
  },
  neutral: {
    border: "border-l-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Minus,
  },
  negative: {
    border: "border-l-red-500",
    bg: "bg-red-50 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: TrendingDown,
  },
};

const OUTLOOK_CONFIG = {
  bullish: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Bullish Outlook" },
  neutral: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Neutral Outlook" },
  bearish: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Bearish Outlook" },
};

export function AICommentary({ aiAnalysis }: AICommentaryProps) {
  const outlookConfig = OUTLOOK_CONFIG[aiAnalysis.outlook];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Analysis
          </CardTitle>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${outlookConfig.color}`}>
            {outlookConfig.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Executive Summary */}
        <p className="text-sm leading-relaxed text-muted-foreground">{aiAnalysis.summary}</p>

        {/* Key Highlights */}
        {aiAnalysis.keyHighlights.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Highlights</p>
            <div className="space-y-2">
              {aiAnalysis.keyHighlights.map((highlight, i) => {
                const config = SENTIMENT_CONFIG[highlight.sentiment];
                const Icon = config.icon;
                return (
                  <div key={i} className={`flex gap-3 rounded-md p-3 border-l-2 ${config.border} ${config.bg}`}>
                    <Icon className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />
                    <div>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${config.badge} mr-2`}>
                        {highlight.label}
                      </span>
                      <span className="text-sm">{highlight.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Commentary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Valuation</p>
            <p className="text-sm leading-relaxed">{aiAnalysis.commentary.valuation}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Growth</p>
            <p className="text-sm leading-relaxed">{aiAnalysis.commentary.growth}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risks</p>
            <p className="text-sm leading-relaxed">{aiAnalysis.commentary.risks}</p>
          </div>
        </div>

        {/* Analyst View */}
        {aiAnalysis.analystView && (
          <div className="bg-secondary/50 rounded-md px-3 py-2.5">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Analyst View</p>
            <p className="text-sm">{aiAnalysis.analystView}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
