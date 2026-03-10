import type { KeyMetricsTTM, FinancialRatios, CompanyProfile } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { formatRatio, formatRawPercent, formatLargeNumber } from "@/lib/utils/formatting";

interface KeyMetricsCardProps {
  keyMetrics: KeyMetricsTTM;
  ratios: FinancialRatios | null;
  profile: CompanyProfile;
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: "green" | "red" | "neutral" }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${
        highlight === "green" ? "text-green-600 dark:text-green-400" :
        highlight === "red" ? "text-red-600 dark:text-red-400" : ""
      }`}>
        {value}
      </p>
    </div>
  );
}

export function KeyMetricsCard({ keyMetrics, ratios, profile }: KeyMetricsCardProps) {
  const pe = keyMetrics.peRatioTTM ?? ratios?.peRatio;
  const evEbitda = keyMetrics.enterpriseValueOverEBITDATTM ?? keyMetrics.evToEbitdaTTM;
  const pb = keyMetrics.pbRatioTTM ?? ratios?.priceToBookRatio;
  const ps = keyMetrics.priceToSalesRatioTTM ?? ratios?.priceToSalesRatio;
  const grossMargin = ratios?.grossProfitMargin;
  const opMargin = ratios?.operatingProfitMargin;
  const netMargin = ratios?.netProfitMargin;
  const roe = keyMetrics.roeTTM ?? keyMetrics.returnOnEquityTTM ?? ratios?.returnOnEquity;
  const debtEquity = keyMetrics.debtToEquityTTM ?? ratios?.debtEquityRatio;
  const currentRatio = keyMetrics.currentRatioTTM ?? ratios?.currentRatio;
  const divYield = keyMetrics.dividendYieldTTM;
  const fcfYield = keyMetrics.freeCashFlowYieldTTM;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          Key Metrics (TTM)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Valuation */}
          <Metric label="P/E Ratio" value={pe != null ? formatRatio(pe) : "N/A"} />
          <Metric label="EV/EBITDA" value={evEbitda != null ? formatRatio(evEbitda) : "N/A"} />
          <Metric label="P/B Ratio" value={pb != null ? formatRatio(pb) : "N/A"} />
          <Metric label="P/S Ratio" value={ps != null ? formatRatio(ps) : "N/A"} />

          {/* Profitability */}
          <Metric
            label="Gross Margin"
            value={grossMargin != null ? formatRawPercent(grossMargin) : "N/A"}
            highlight={grossMargin != null ? (grossMargin > 0.3 ? "green" : "neutral") : undefined}
          />
          <Metric
            label="Operating Margin"
            value={opMargin != null ? formatRawPercent(opMargin) : "N/A"}
            highlight={opMargin != null ? (opMargin > 0.1 ? "green" : opMargin < 0 ? "red" : "neutral") : undefined}
          />
          <Metric
            label="Net Margin"
            value={netMargin != null ? formatRawPercent(netMargin) : "N/A"}
            highlight={netMargin != null ? (netMargin > 0.08 ? "green" : netMargin < 0 ? "red" : "neutral") : undefined}
          />
          <Metric
            label="ROE"
            value={roe != null ? formatRawPercent(roe) : "N/A"}
            highlight={roe != null ? (roe > 0.15 ? "green" : roe < 0 ? "red" : "neutral") : undefined}
          />

          {/* Health */}
          <Metric label="Debt/Equity" value={debtEquity != null ? formatRatio(debtEquity) : "N/A"} />
          <Metric label="Current Ratio" value={currentRatio != null ? `${currentRatio.toFixed(2)}x` : "N/A"} />

          {/* Yield */}
          <Metric label="Div. Yield" value={divYield != null ? `${(divYield * 100).toFixed(2)}%` : "—"} />
          <Metric label="FCF Yield" value={fcfYield != null ? `${(fcfYield * 100).toFixed(2)}%` : "N/A"} />
        </div>
      </CardContent>
    </Card>
  );
}
