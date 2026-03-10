import type { SnapshotReport } from "@/lib/schemas/report";
import { CompanyProfileHeader } from "@/components/stock/company-profile";
import { KeyMetricsCard } from "@/components/stock/key-metrics-card";
import { PriceChart } from "@/components/stock/price-chart";
import { AnalystConsensus } from "@/components/stock/analyst-consensus";
import { ScoreCard } from "@/components/stock/score-card";
import { AICommentary } from "@/components/report/ai-commentary";
import { RecentNews } from "@/components/report/recent-news";
import { Disclaimer } from "@/components/report/disclaimer";

interface SnapshotViewProps {
  report: SnapshotReport;
}

export function SnapshotView({ report }: SnapshotViewProps) {
  return (
    <div className="space-y-4">
      {/* Company Header */}
      <CompanyProfileHeader profile={report.profile} quote={report.quote} score={report.score} />

      {/* Key Metrics + Price Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KeyMetricsCard keyMetrics={report.keyMetrics} ratios={report.ratios} profile={report.profile} />
        <PriceChart prices={report.historicalPrices} ticker={report.ticker} currentPrice={report.quote.price} />
      </div>

      {/* AI Summary */}
      <AICommentary aiAnalysis={report.aiAnalysis} />

      {/* Analyst Consensus + Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalystConsensus
          analystRating={report.analystRating}
          priceTargetSummary={report.priceTargetSummary}
          currentPrice={report.quote.price}
        />
        <ScoreCard score={report.score} />
      </div>

      {/* Recent News */}
      {report.recentNews.length > 0 && (
        <RecentNews news={report.recentNews} />
      )}

      {/* Disclaimer */}
      <Disclaimer generatedAt={report.generatedAt} />
    </div>
  );
}
