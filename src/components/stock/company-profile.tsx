import type { CompanyProfile, StockQuote } from "@/lib/schemas/financial-data";
import type { StockScore } from "@/lib/schemas/report";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatLargeNumber, formatChange } from "@/lib/utils/formatting";

interface CompanyProfileHeaderProps {
  profile: CompanyProfile;
  quote: StockQuote;
  score: StockScore;
}

function RecommendationBadge({ label, score }: { label: string; score: number }) {
  const colorClass =
    score >= 70
      ? "bg-success/10 text-success border-success/20"
      : score >= 40
      ? "bg-warning/10 text-warning border-warning/20"
      : "bg-destructive/10 text-destructive border-destructive/20";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
      {score}/100 &middot; {label}
    </span>
  );
}

export function CompanyProfileHeader({ profile, quote, score }: CompanyProfileHeaderProps) {
  const change = formatChange(quote.changesPercentage);
  const isPositive = change.isPositive && !change.isNeutral;

  return (
    <Card className="border-border/60 bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Logo + Company Info */}
          <div className="flex items-start gap-4 flex-1">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.companyName}
                className="w-14 h-14 rounded-xl object-contain border border-border bg-white p-1 shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-base shrink-0">
                {profile.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                {profile.companyName}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="secondary" className="font-mono text-xs">
                  {profile.symbol}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {profile.exchange}
                </Badge>
                {profile.sector && (
                  <Badge variant="outline" className="text-xs">
                    {profile.sector}
                  </Badge>
                )}
                {profile.industry && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    {profile.industry}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price + Score */}
          <div className="flex flex-col items-start sm:items-end gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-foreground">
                ${quote.price.toFixed(2)}
              </span>
              <div
                className={`flex items-center gap-0.5 text-sm font-semibold ${
                  isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {change.text}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Mkt Cap:{" "}
                <strong className="text-foreground font-semibold">
                  {formatLargeNumber(profile.mktCap)}
                </strong>
              </span>
              <span>
                Beta:{" "}
                <strong className="text-foreground font-semibold">
                  {profile.beta?.toFixed(2) ?? "N/A"}
                </strong>
              </span>
            </div>

            <RecommendationBadge score={score.overall} label={score.overallLabel} />
          </div>
        </div>

        {/* 52W Range Bar */}
        {quote.yearLow > 0 && quote.yearHigh > 0 && (
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>52W Low: ${quote.yearLow.toFixed(2)}</span>
              <span className="text-xs text-foreground font-medium">
                Current: ${quote.price.toFixed(2)}
              </span>
              <span>52W High: ${quote.yearHigh.toFixed(2)}</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-primary rounded-full transition-all"
                style={{
                  left: 0,
                  width: `${Math.max(2, Math.min(100, ((quote.price - quote.yearLow) / (quote.yearHigh - quote.yearLow)) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
