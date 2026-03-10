import type { StockScore } from "@/lib/schemas/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ScoreCardProps {
  score: StockScore;
  compact?: boolean;
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color =
    score >= 70 ? "bg-green-500" :
    score >= 40 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function OverallGauge({ score }: { score: number }) {
  const color =
    score >= 70 ? "text-green-600 dark:text-green-400" :
    score >= 40 ? "text-yellow-600 dark:text-yellow-400" :
    "text-red-600 dark:text-red-400";

  const ringColor =
    score >= 70 ? "stroke-green-500" :
    score >= 40 ? "stroke-yellow-500" :
    "stroke-red-500";

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            fill="none" strokeWidth="8"
            className="stroke-secondary"
          />
          <circle
            cx="50" cy="50" r="40"
            fill="none" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-700 ${ringColor}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
    </div>
  );
}

export function ScoreCard({ score, compact = false }: ScoreCardProps) {
  const categories = [
    { key: "valuation", label: "Valuation" },
    { key: "profitability", label: "Profitability" },
    { key: "growth", label: "Growth" },
    { key: "financialHealth", label: "Financial Health" },
    { key: "momentum", label: "Momentum" },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          StockMind Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 items-start">
          <OverallGauge score={score.overall} />

          <div className="flex-1 space-y-2.5">
            {categories.map(({ key, label }) => (
              <ScoreBar
                key={key}
                label={label}
                score={score.categories[key].score}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
