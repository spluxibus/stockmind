import type { AnalystRating, PriceTargetSummary } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AnalystConsensusProps {
  analystRating: AnalystRating | null;
  priceTargetSummary: PriceTargetSummary | null;
  currentPrice: number;
}

export function AnalystConsensus({ analystRating, priceTargetSummary, currentPrice }: AnalystConsensusProps) {
  const hasData = analystRating || priceTargetSummary;

  const consensus = priceTargetSummary?.targetConsensus;
  const upside =
    consensus && currentPrice > 0
      ? ((consensus - currentPrice) / currentPrice) * 100
      : null;

  // Build rating distribution for bars
  const totalRatings =
    (analystRating?.ratingDetailsDCFScore ?? 0) +
    (analystRating?.ratingDetailsROEScore ?? 0) +
    (analystRating?.ratingDetailsROAScore ?? 0) +
    (analystRating?.ratingDetailsPEScore ?? 0);

  const ratingLabel = analystRating?.ratingRecommendation ?? "";
  const normalized = ratingLabel.toUpperCase();
  const isBuy = normalized.includes("BUY");
  const isSell = normalized.includes("SELL");
  const isHold = normalized.includes("HOLD") || normalized.includes("NEUTRAL");

  // Approximate percentages based on recommendation
  const buyPct = isBuy ? 65 : isHold ? 30 : 15;
  const holdPct = isHold ? 50 : isBuy ? 25 : 30;
  const sellPct = isSell ? 55 : 100 - buyPct - holdPct;

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Analyst Consensus
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-sm text-muted-foreground">No analyst data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: Rating bars */}
            <div className="space-y-3">
              {analystRating?.ratingRecommendation && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Consensus Rating</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    {ratingLabel}
                  </p>
                </div>
              )}
              {[
                { label: "Buy", pct: buyPct, colorClass: "bg-success" },
                { label: "Hold", pct: holdPct, colorClass: "bg-warning" },
                { label: "Sell", pct: sellPct, colorClass: "bg-destructive" },
              ].map(({ label, pct, colorClass }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colorClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* FMP Sub-scores */}
              {analystRating && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border mt-2">
                  {[
                    { label: "DCF", score: analystRating.ratingDetailsDCFScore, rec: analystRating.ratingDetailsDCFRecommendation },
                    { label: "ROE", score: analystRating.ratingDetailsROEScore, rec: analystRating.ratingDetailsROERecommendation },
                    { label: "ROA", score: analystRating.ratingDetailsROAScore, rec: analystRating.ratingDetailsROARecommendation },
                    { label: "P/E", score: analystRating.ratingDetailsPEScore, rec: analystRating.ratingDetailsPERecommendation },
                  ].map(({ label, score, rec }) => (
                    <div key={label} className="text-xs">
                      <span className="text-muted-foreground">{label}:</span>{" "}
                      <span className="font-medium text-foreground">{rec || score || "N/A"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Price target tiles */}
            {priceTargetSummary && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Price Targets</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Low</p>
                    <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                      ${priceTargetSummary.targetLow?.toFixed(0) ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3 text-center">
                    <p className="text-xs text-accent">Consensus</p>
                    <p className="font-display text-sm font-bold text-accent mt-0.5">
                      ${priceTargetSummary.targetConsensus?.toFixed(0) ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">High</p>
                    <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                      ${priceTargetSummary.targetHigh?.toFixed(0) ?? "—"}
                    </p>
                  </div>
                </div>

                {upside !== null && (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Implied upside: </span>
                    <span
                      className={`text-sm font-semibold ${
                        upside >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {upside >= 0 ? "+" : ""}
                      {upside.toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Target range bar */}
                {priceTargetSummary.targetLow > 0 && priceTargetSummary.targetHigh > 0 && priceTargetSummary.targetLow < priceTargetSummary.targetHigh && (
                  <div className="space-y-1">
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
                        style={{
                          left: `${Math.max(0, Math.min(100, ((currentPrice - priceTargetSummary.targetLow) / (priceTargetSummary.targetHigh - priceTargetSummary.targetLow)) * 100))}%`,
                        }}
                      />
                      {priceTargetSummary.targetConsensus && (
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-accent rounded-full z-20"
                          style={{
                            left: `${Math.max(0, Math.min(100, ((priceTargetSummary.targetConsensus - priceTargetSummary.targetLow) / (priceTargetSummary.targetHigh - priceTargetSummary.targetLow)) * 100))}%`,
                          }}
                        />
                      )}
                    </div>
                    <p className="text-center text-xs text-muted-foreground/70">
                      Target range (consensus in amber, current in dark)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
