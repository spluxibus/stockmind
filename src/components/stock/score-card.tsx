"use client";

import type { StockScore } from "@/lib/schemas/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScoreCardProps {
  score: StockScore;
  compact?: boolean;
}

const ACCENT_COLOR = "hsl(38 92% 50%)";

function ScoreBar({ score, label }: { score: number; label: string }) {
  const colorClass =
    score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-destructive";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{score}/100</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

const categories = [
  { key: "valuation", label: "Valuation" },
  { key: "profitability", label: "Profitability" },
  { key: "growth", label: "Growth" },
  { key: "financialHealth", label: "Fin. Health" },
  { key: "momentum", label: "Momentum" },
] as const;

export function ScoreCard({ score, compact = false }: ScoreCardProps) {
  const radarData = categories.map(({ key, label }) => ({
    subject: label,
    value: score.categories[key].score,
    fullMark: 100,
  }));

  const overallColor =
    score.overall >= 70
      ? "text-success"
      : score.overall >= 40
      ? "text-warning"
      : "text-destructive";

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          StockMind Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Radar chart */}
          <div className="w-full sm:w-52 h-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke={ACCENT_COLOR}
                  fill={ACCENT_COLOR}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score bars + overall */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <span className={`font-display text-4xl font-bold ${overallColor}`}>
                  {score.overall}
                </span>
                <span className="text-muted-foreground text-sm">/100</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {score.overallLabel}
              </div>
            </div>

            <div className="space-y-2.5">
              {categories.map(({ key, label }) => (
                <ScoreBar
                  key={key}
                  label={label}
                  score={score.categories[key].score}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
