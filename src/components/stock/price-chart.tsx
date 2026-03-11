"use client";

import { useState } from "react";
import type { HistoricalPrice } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PriceChartProps {
  prices: HistoricalPrice[];
  ticker: string;
  currentPrice: number;
}

type Range = "1M" | "3M" | "6M" | "1Y";

const RANGE_DAYS: Record<Range, number> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

const ACCENT = "hsl(38 92% 50%)";

export function PriceChart({ prices, ticker, currentPrice }: PriceChartProps) {
  const [range, setRange] = useState<Range>("1Y");

  const sorted = [...prices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RANGE_DAYS[range]);
  const filtered = sorted.filter((p) => new Date(p.date) >= cutoff);
  const displayPrices = filtered.length >= 2 ? filtered : sorted.slice(-30);

  const firstPrice = displayPrices[0]?.close ?? currentPrice;
  const isPositive = currentPrice >= firstPrice;
  const pctChange = firstPrice > 0 ? ((currentPrice - firstPrice) / firstPrice) * 100 : 0;

  const yearHigh = displayPrices.length > 0 ? Math.max(...displayPrices.map((p) => p.high ?? p.close)) : currentPrice;
  const yearLow = displayPrices.length > 0 ? Math.min(...displayPrices.map((p) => p.low ?? p.close)) : currentPrice;

  const chartData = displayPrices.map((p) => ({
    date: p.date,
    price: p.close,
  }));

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" />
              Price Chart &mdash; {ticker}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              52W High: ${yearHigh.toFixed(2)} &nbsp;&middot;&nbsp; 52W Low: ${yearLow.toFixed(2)}
            </CardDescription>
          </div>
          <span
            className={`text-xs font-semibold ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {pctChange.toFixed(2)}% ({range})
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tick={false}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label: string) => label}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, fill: ACCENT }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Range selector */}
        <div className="flex gap-1 mt-2 justify-end">
          {(["1M", "3M", "6M", "1Y"] as Range[]).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "ghost"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
