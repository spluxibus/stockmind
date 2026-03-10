import type { CompanyProfile, StockQuote } from "@/lib/schemas/financial-data";
import type { StockScore } from "@/lib/schemas/report";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatLargeNumber, formatChange } from "@/lib/utils/formatting";

interface CompanyProfileHeaderProps {
  profile: CompanyProfile;
  quote: StockQuote;
  score: StockScore;
}

function ScorePill({ score, label }: { score: number; label: string }) {
  const color =
    score >= 70 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
    score >= 40 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}/100 · {label}
    </span>
  );
}

export function CompanyProfileHeader({ profile, quote, score }: CompanyProfileHeaderProps) {
  const change = formatChange(quote.changesPercentage);
  const isPositive = change.isPositive && !change.isNeutral;

  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Logo + Company Info */}
          <div className="flex items-start gap-3 flex-1">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.companyName}
                className="w-12 h-12 rounded-lg object-contain border bg-white p-1"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                {profile.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{profile.companyName}</h1>
                <span className="font-mono text-base text-muted-foreground">
                  {profile.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">{profile.exchange}</span>
                {profile.sector && (
                  <Badge variant="outline" className="text-xs h-5">
                    {profile.sector}
                  </Badge>
                )}
                {profile.industry && (
                  <Badge variant="outline" className="text-xs h-5 hidden sm:inline-flex">
                    {profile.industry}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price + Score */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${quote.price.toFixed(2)}</span>
              <div className={`flex items-center gap-0.5 text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {change.text}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Mkt Cap: <strong className="text-foreground">{formatLargeNumber(profile.mktCap)}</strong></span>
              <span>Beta: <strong className="text-foreground">{profile.beta?.toFixed(2) ?? "N/A"}</strong></span>
            </div>

            <ScorePill score={score.overall} label={score.overallLabel} />
          </div>
        </div>

        {/* 52W Range Bar */}
        {quote.yearLow > 0 && quote.yearHigh > 0 && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>52W Low: ${quote.yearLow.toFixed(2)}</span>
              <span>52W High: ${quote.yearHigh.toFixed(2)}</span>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-primary rounded-full"
                style={{
                  left: 0,
                  width: `${((quote.price - quote.yearLow) / (quote.yearHigh - quote.yearLow)) * 100}%`,
                }}
              />
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Current: ${quote.price.toFixed(2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
