"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoricalPrice } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";

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

function SimpleLineChart({ prices, isPositive }: { prices: HistoricalPrice[]; isPositive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prices.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const pad = 8;

    const values = prices.map((p) => p.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const color = isPositive ? "#22c55e" : "#ef4444";
    const fillColor = isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";

    ctx.clearRect(0, 0, W, H);

    const toX = (i: number) => pad + (i / (prices.length - 1)) * (W - pad * 2);
    const toY = (v: number) => H - pad - ((v - min) / range) * (H - pad * 2);

    // Fill
    ctx.beginPath();
    ctx.moveTo(toX(0), H);
    prices.forEach((p, i) => ctx.lineTo(toX(i), toY(p.close)));
    ctx.lineTo(toX(prices.length - 1), H);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    prices.forEach((p, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(p.close));
      else ctx.lineTo(toX(i), toY(p.close));
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [prices, isPositive]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "160px", display: "block" }} />;
}

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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <LineChart className="h-4 w-4 text-muted-foreground" />
            Price Chart — {ticker}
          </CardTitle>
          <span className={`text-xs font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isPositive ? "+" : ""}{pctChange.toFixed(2)}% ({range})
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <SimpleLineChart prices={displayPrices} isPositive={isPositive} />

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
