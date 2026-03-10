import type { AnalystRating, PriceTargetSummary } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface AnalystConsensusProps {
  analystRating: AnalystRating | null;
  priceTargetSummary: PriceTargetSummary | null;
  currentPrice: number;
}

function RatingBadge({ rating }: { rating: string }) {
  const normalized = rating.toUpperCase();
  if (normalized.includes("STRONG BUY")) return <Badge className="bg-green-600 hover:bg-green-600 text-white">Strong Buy</Badge>;
  if (normalized.includes("BUY")) return <Badge className="bg-green-500 hover:bg-green-500 text-white">Buy</Badge>;
  if (normalized.includes("SELL")) return <Badge className="bg-red-500 hover:bg-red-500 text-white">Sell</Badge>;
  if (normalized.includes("HOLD") || normalized.includes("NEUTRAL")) return <Badge variant="secondary">Hold</Badge>;
  return <Badge variant="outline">{rating}</Badge>;
}

export function AnalystConsensus({ analystRating, priceTargetSummary, currentPrice }: AnalystConsensusProps) {
  const hasData = analystRating || priceTargetSummary;

  const consensus = priceTargetSummary?.targetConsensus;
  const upside = consensus && currentPrice > 0
    ? ((consensus - currentPrice) / currentPrice) * 100
    : null;

  return (
    <Card>
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
          <div className="space-y-4">
            {/* Rating */}
            {analystRating?.ratingRecommendation && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Consensus Rating</span>
                <RatingBadge rating={analystRating.ratingRecommendation} />
              </div>
            )}

            {/* Price Target */}
            {priceTargetSummary && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price Target</span>
                    <div className="text-right">
                      <span className="font-semibold">
                        ${priceTargetSummary.targetConsensus?.toFixed(2) ?? "N/A"}
                      </span>
                      {upside !== null && (
                        <span className={`ml-2 text-xs font-medium ${upside >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target range */}
                  {priceTargetSummary.targetLow > 0 && priceTargetSummary.targetHigh > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low: ${priceTargetSummary.targetLow.toFixed(2)}</span>
                        <span>High: ${priceTargetSummary.targetHigh.toFixed(2)}</span>
                      </div>
                      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                        {priceTargetSummary.targetLow < priceTargetSummary.targetHigh && (
                          <>
                            {/* Current price marker */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
                              style={{
                                left: `${Math.max(0, Math.min(100, ((currentPrice - priceTargetSummary.targetLow) / (priceTargetSummary.targetHigh - priceTargetSummary.targetLow)) * 100))}%`,
                              }}
                            />
                            {/* Consensus marker */}
                            {priceTargetSummary.targetConsensus && (
                              <div
                                className="absolute top-0 bottom-0 w-1 bg-primary rounded-full z-20"
                                style={{
                                  left: `${Math.max(0, Math.min(100, ((priceTargetSummary.targetConsensus - priceTargetSummary.targetLow) / (priceTargetSummary.targetHigh - priceTargetSummary.targetLow)) * 100))}%`,
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-center text-xs text-muted-foreground">
                        Target range (consensus marked in blue, current price in dark)
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* FMP Sub-scores */}
            {analystRating && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t">
                {[
                  { label: "DCF", score: analystRating.ratingDetailsDCFScore, rec: analystRating.ratingDetailsDCFRecommendation },
                  { label: "ROE", score: analystRating.ratingDetailsROEScore, rec: analystRating.ratingDetailsROERecommendation },
                  { label: "ROA", score: analystRating.ratingDetailsROAScore, rec: analystRating.ratingDetailsROARecommendation },
                  { label: "P/E", score: analystRating.ratingDetailsPEScore, rec: analystRating.ratingDetailsPERecommendation },
                ].map(({ label, score, rec }) => (
                  <div key={label} className="text-xs">
                    <span className="text-muted-foreground">{label}:</span>{" "}
                    <span className="font-medium">{rec || score || "N/A"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
