import type { DeepDiveReport } from "@/lib/schemas/report";
import { CompanyProfileHeader } from "@/components/stock/company-profile";
import { KeyMetricsCard } from "@/components/stock/key-metrics-card";
import { PriceChart } from "@/components/stock/price-chart";
import { ScoreCard } from "@/components/stock/score-card";
import { AnalystConsensus } from "@/components/stock/analyst-consensus";
import { RecentNews } from "@/components/report/recent-news";
import { Disclaimer } from "@/components/report/disclaimer";
import { FinancialTable } from "@/components/stock/financial-table";
import { DCFSection } from "@/components/report/dcf-section";
import { PeerComparisonTable } from "@/components/report/peer-comparison";
import { RiskMatrix } from "@/components/report/risk-matrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, TrendingUp, DollarSign, Users, ShieldAlert,
  Lightbulb, Target, FileText
} from "lucide-react";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function Section({ icon, title, badge, children }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-muted-foreground">{icon}</div>
          <CardTitle className="text-base">{title}</CardTitle>
          {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface DeepDiveViewProps {
  report: DeepDiveReport;
}

export function DeepDiveView({ report }: DeepDiveViewProps) {
  const { aiAnalysis: ai } = report;

  // Rating badge color
  const ratingColors: Record<string, string> = {
    "Strong Buy": "bg-green-600 text-white",
    "Buy": "bg-green-500 text-white",
    "Hold": "bg-yellow-500 text-white",
    "Sell": "bg-red-500 text-white",
    "Strong Sell": "bg-red-700 text-white",
  };
  const ratingClass = ratingColors[ai.recommendation.rating] ?? "bg-secondary text-foreground";

  return (
    <div className="space-y-4">
      {/* Company Header */}
      <CompanyProfileHeader profile={report.profile} quote={report.quote} score={report.score} />

      {/* Metrics + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KeyMetricsCard keyMetrics={report.keyMetrics} ratios={report.ratios} profile={report.profile} />
        <PriceChart prices={report.historicalPrices} ticker={report.ticker} currentPrice={report.quote.price} />
      </div>

      {/* 1. Executive Summary */}
      <Section icon={<FileText className="h-4 w-4" />} title="Executive Summary">
        <p className="text-sm leading-relaxed">{ai.executiveSummary}</p>
      </Section>

      {/* 2. Business Overview */}
      <Section icon={<BookOpen className="h-4 w-4" />} title="Business Overview">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{ai.businessOverview.description}</p>

          {ai.businessOverview.keyProducts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Products & Services</p>
              <div className="flex flex-wrap gap-2">
                {ai.businessOverview.keyProducts.map((p, i) => (
                  <Badge key={i} variant="secondary">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Competitive Position</p>
              <p className="text-sm leading-relaxed">{ai.businessOverview.competitivePosition}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Economic Moat</p>
              <p className="text-sm leading-relaxed">{ai.businessOverview.moat}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Financial Analysis */}
      <Section icon={<TrendingUp className="h-4 w-4" />} title="Financial Analysis">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Revenue</p>
              <p className="text-sm leading-relaxed">{ai.financialAnalysis.revenueAnalysis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Profitability</p>
              <p className="text-sm leading-relaxed">{ai.financialAnalysis.profitabilityAnalysis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Balance Sheet</p>
              <p className="text-sm leading-relaxed">{ai.financialAnalysis.balanceSheetAnalysis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cash Flow</p>
              <p className="text-sm leading-relaxed">{ai.financialAnalysis.cashFlowAnalysis}</p>
            </div>
          </div>

          <FinancialTable
            incomeStatements={report.incomeStatements}
            balanceSheets={report.balanceSheets}
            cashFlows={report.cashFlows}
          />
        </div>
      </Section>

      {/* 4. Valuation */}
      <Section icon={<DollarSign className="h-4 w-4" />} title="Valuation">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">DCF Analysis</p>
              <p className="text-sm leading-relaxed">{ai.valuation.dcfAnalysis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Multiples</p>
              <p className="text-sm leading-relaxed">{ai.valuation.multiplesAnalysis}</p>
            </div>
          </div>
          <DCFSection dcf={report.dcfModel} />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Fair Value Assessment</p>
            <p className="text-sm leading-relaxed">{ai.valuation.fairValueAssessment}</p>
          </div>
        </div>
      </Section>

      {/* 5. Peer Comparison */}
      <Section icon={<Users className="h-4 w-4" />} title="Peer Comparison">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{ai.peerComparison}</p>
          <PeerComparisonTable peerComparison={report.peerComparison} />
        </div>
      </Section>

      {/* 6. Risk Factors */}
      <Section icon={<ShieldAlert className="h-4 w-4" />} title="Risk Factors">
        <RiskMatrix risks={ai.riskFactors} />
      </Section>

      {/* 7. Investment Thesis */}
      <Section icon={<Lightbulb className="h-4 w-4" />} title="Investment Thesis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-4">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-2">🐂 Bull Case</p>
            <p className="text-sm leading-relaxed">{ai.investmentThesis.bullCase}</p>
          </div>
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-2">📊 Base Case</p>
            <p className="text-sm leading-relaxed">{ai.investmentThesis.baseCase}</p>
          </div>
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 p-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-2">🐻 Bear Case</p>
            <p className="text-sm leading-relaxed">{ai.investmentThesis.bearCase}</p>
          </div>
        </div>
      </Section>

      {/* 8. Recommendation */}
      <Section icon={<Target className="h-4 w-4" />} title="Recommendation" badge="Not Investment Advice">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <div className={`px-6 py-3 rounded-lg font-bold text-lg ${ratingClass}`}>
              {ai.recommendation.rating}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xl font-bold">${ai.recommendation.targetPrice.toFixed(2)}</span>
                <span className={`font-medium ${ai.recommendation.upside >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {ai.recommendation.upside >= 0 ? "+" : ""}{ai.recommendation.upside.toFixed(1)}% implied upside
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Target price · {ai.recommendation.timeHorizon}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{ai.recommendation.rationale}</p>
        </div>
      </Section>

      {/* Score + Analyst */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreCard score={report.score} />
        <AnalystConsensus
          analystRating={report.analystRating}
          priceTargetSummary={report.priceTargetSummary}
          currentPrice={report.quote.price}
        />
      </div>

      {/* News */}
      {report.recentNews.length > 0 && <RecentNews news={report.recentNews} />}

      <Disclaimer generatedAt={report.generatedAt} />
    </div>
  );
}
