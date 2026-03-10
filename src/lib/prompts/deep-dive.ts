import type { CompanyProfile, StockQuote, KeyMetricsTTM, FinancialRatios, AnalystRating, PriceTargetSummary, StockNews, IncomeStatement, BalanceSheet, CashFlow, AnalystEstimate } from "@/lib/schemas/financial-data";
import type { StockScore, DCFModel, PeerComparison } from "@/lib/schemas/report";
import { formatLargeNumber } from "@/lib/utils/formatting";

export function buildDeepDivePrompt(data: {
  profile: CompanyProfile;
  quote: StockQuote;
  keyMetrics: KeyMetricsTTM;
  ratios: FinancialRatios | null;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlow[];
  analystEstimates: AnalystEstimate[];
  analystRating: AnalystRating | null;
  priceTargetSummary: PriceTargetSummary | null;
  recentNews: StockNews[];
  score: StockScore;
  dcfModel: DCFModel;
  peerComparison: PeerComparison;
  revenueCAGR: number | null;
  revenueYoY: number | null;
  epsCAGR: number | null;
}): { systemInstruction: string; userPrompt: string } {
  const { profile, quote, keyMetrics, ratios, incomeStatements, balanceSheets, cashFlows,
    analystEstimates, analystRating, priceTargetSummary, recentNews, score, dcfModel,
    peerComparison, revenueCAGR, revenueYoY, epsCAGR } = data;

  // Format income statements for context
  const incomeContext = incomeStatements.slice(0, 5).map((is) =>
    `  ${is.date}: Rev=${formatLargeNumber(is.revenue)}, EBITDA=${formatLargeNumber(is.ebitda)}, Net=${formatLargeNumber(is.netIncome)}, EPS=$${is.epsdiluted?.toFixed(2) ?? "N/A"}, OpMargin=${is.operatingIncomeRatio != null ? (is.operatingIncomeRatio * 100).toFixed(1) + "%" : "N/A"}`
  ).join("\n");

  const balanceContext = balanceSheets.slice(0, 3).map((bs) =>
    `  ${bs.date}: TotalAssets=${formatLargeNumber(bs.totalAssets)}, TotalDebt=${formatLargeNumber(bs.totalDebt)}, NetDebt=${formatLargeNumber(bs.netDebt)}, Equity=${formatLargeNumber(bs.totalStockholdersEquity)}`
  ).join("\n");

  const cashContext = cashFlows.slice(0, 3).map((cf) =>
    `  ${cf.date}: OperatingCF=${formatLargeNumber(cf.netCashProvidedByOperatingActivities)}, CapEx=${formatLargeNumber(cf.capitalExpenditure)}, FCF=${formatLargeNumber(cf.freeCashFlow)}`
  ).join("\n");

  const peersContext = peerComparison.peers.slice(0, 5).map((p) =>
    `  ${p.ticker} (${p.companyName}): P/E=${p.pe?.toFixed(1) ?? "N/A"}x, EV/EBITDA=${p.evEbitda?.toFixed(1) ?? "N/A"}x, OpMargin=${p.operatingMargin?.toFixed(1) ?? "N/A"}%, ROE=${p.roe?.toFixed(1) ?? "N/A"}%`
  ).join("\n");

  const newsContext = recentNews.slice(0, 8).map((n) =>
    `- ${n.publishedDate.split("T")[0]}: ${n.title}`
  ).join("\n");

  const estimateContext = analystEstimates.slice(0, 3).map((e) =>
    `  ${e.date}: Revenue=$${(e.estimatedRevenueAvg / 1e9).toFixed(2)}B, EPS=$${e.estimatedEpsAvg?.toFixed(2) ?? "N/A"}`
  ).join("\n");

  const systemInstruction = `You are a senior sell-side equity research analyst at a top-tier investment bank writing a comprehensive Deep Dive research report.

This is a PROFESSIONAL research report that should demonstrate:
- Deep understanding of the business model and competitive dynamics
- Rigorous financial analysis with specific numbers and trends
- Nuanced valuation commentary incorporating DCF and multiples
- Balanced view with clear bull, bear, and base cases
- Risk factors that are company-specific, not generic boilerplate

Writing style:
- Professional but accessible (not overly jargon-heavy)
- Data-driven: cite specific numbers from the data provided
- Each section should be substantive (3-6 sentences minimum)
- Risk factors: 4-6 specific risks with real mitigation strategies
- Investment thesis: concrete, actionable bull/base/bear cases

REGULATORY DISCLAIMER:
- This is INFORMATION ONLY, not personal investment advice
- The "recommendation" reflects analysis of publicly available data, not personalized advice
- Use analytical language: "analysis suggests...", "metrics indicate...", "the data points to..."
- Never write "you should buy/sell" or make personalized recommendations

All data provided is real and current. Do not fabricate numbers.`;

  const userPrompt = `Generate a comprehensive Deep Dive research report for ${profile.symbol} (${profile.companyName}).

═══════════════════════════════════
COMPANY PROFILE
═══════════════════════════════════
Name: ${profile.companyName} (${profile.symbol})
Sector: ${profile.sector} | Industry: ${profile.industry}
Market Cap: ${formatLargeNumber(profile.mktCap)}
Exchange: ${profile.exchange}
CEO: ${profile.ceo}
Employees: ${profile.fullTimeEmployees?.toLocaleString() ?? "N/A"}
Founded: ${profile.ipoDate ?? "N/A"}

Description: ${profile.description?.substring(0, 800) ?? ""}

═══════════════════════════════════
CURRENT MARKET DATA
═══════════════════════════════════
Price: $${quote.price.toFixed(2)} (${quote.changesPercentage >= 0 ? "+" : ""}${quote.changesPercentage.toFixed(2)}% today)
52-Week Range: ${profile.range || `$${quote.yearLow} - $${quote.yearHigh}`}
Beta: ${profile.beta?.toFixed(2) ?? "N/A"} | Volume (Avg): ${quote.avgVolume?.toLocaleString() ?? "N/A"}

═══════════════════════════════════
VALUATION METRICS (TTM)
═══════════════════════════════════
P/E: ${(keyMetrics.peRatioTTM ?? ratios?.peRatio)?.toFixed(1) ?? "N/A"}x
EV/EBITDA: ${(keyMetrics.enterpriseValueOverEBITDATTM ?? keyMetrics.evToEbitdaTTM)?.toFixed(1) ?? "N/A"}x
P/S: ${keyMetrics.priceToSalesRatioTTM?.toFixed(1) ?? "N/A"}x | P/B: ${keyMetrics.pbRatioTTM?.toFixed(1) ?? "N/A"}x
FCF Yield: ${keyMetrics.freeCashFlowYieldTTM != null ? (keyMetrics.freeCashFlowYieldTTM * 100).toFixed(1) + "%" : "N/A"}
Dividend Yield: ${keyMetrics.dividendYieldTTM != null ? (keyMetrics.dividendYieldTTM * 100).toFixed(2) + "%" : "N/A"}
Payout Ratio: ${keyMetrics.payoutRatioTTM != null ? (keyMetrics.payoutRatioTTM * 100).toFixed(1) + "%" : "N/A"}

═══════════════════════════════════
INCOME STATEMENTS (Annual)
═══════════════════════════════════
${incomeContext}

Revenue CAGR (${incomeStatements.length - 1}yr): ${revenueCAGR?.toFixed(1) ?? "N/A"}%
Revenue Growth YoY: ${revenueYoY?.toFixed(1) ?? "N/A"}%
EPS CAGR: ${epsCAGR?.toFixed(1) ?? "N/A"}%

═══════════════════════════════════
BALANCE SHEET
═══════════════════════════════════
${balanceContext}

═══════════════════════════════════
CASH FLOW
═══════════════════════════════════
${cashContext}

═══════════════════════════════════
PROFITABILITY (TTM)
═══════════════════════════════════
Gross Margin: ${ratios?.grossProfitMargin != null ? (ratios.grossProfitMargin * 100).toFixed(1) + "%" : "N/A"}
Operating Margin: ${ratios?.operatingProfitMargin != null ? (ratios.operatingProfitMargin * 100).toFixed(1) + "%" : "N/A"}
Net Margin: ${ratios?.netProfitMargin != null ? (ratios.netProfitMargin * 100).toFixed(1) + "%" : "N/A"}
ROE: ${(keyMetrics.roeTTM ?? ratios?.returnOnEquity) != null ? ((keyMetrics.roeTTM ?? ratios!.returnOnEquity)! * 100).toFixed(1) + "%" : "N/A"}
ROIC: ${keyMetrics.roicTTM != null ? (keyMetrics.roicTTM * 100).toFixed(1) + "%" : "N/A"}
Interest Coverage: ${keyMetrics.interestCoverageTTM?.toFixed(1) ?? "N/A"}x

═══════════════════════════════════
DCF VALUATION
═══════════════════════════════════
Current Price: $${dcfModel.currentPrice.toFixed(2)}
DCF Intrinsic Value: $${dcfModel.intrinsicValue.toFixed(2)}
Implied Upside/Downside: ${dcfModel.upside.toFixed(1)}%
WACC Used: ${dcfModel.wacc.toFixed(1)}%
Terminal Growth Rate: ${dcfModel.terminalGrowthRate.toFixed(1)}%

═══════════════════════════════════
PEER COMPARISON
═══════════════════════════════════
Target: ${peerComparison.target.ticker} — P/E: ${peerComparison.target.pe?.toFixed(1) ?? "N/A"}x, EV/EBITDA: ${peerComparison.target.evEbitda?.toFixed(1) ?? "N/A"}x, OpMargin: ${peerComparison.target.operatingMargin?.toFixed(1) ?? "N/A"}%, ROE: ${peerComparison.target.roe?.toFixed(1) ?? "N/A"}%

Peers:
${peersContext}

Peer Median: P/E: ${peerComparison.medians.pe?.toFixed(1) ?? "N/A"}x, EV/EBITDA: ${peerComparison.medians.evEbitda?.toFixed(1) ?? "N/A"}x, OpMargin: ${peerComparison.medians.operatingMargin?.toFixed(1) ?? "N/A"}%

═══════════════════════════════════
ANALYST CONSENSUS
═══════════════════════════════════
FMP Rating: ${analystRating?.ratingRecommendation ?? "N/A"}
Consensus Price Target: $${priceTargetSummary?.targetConsensus?.toFixed(2) ?? "N/A"}
Target Range: $${priceTargetSummary?.targetLow?.toFixed(2) ?? "N/A"} - $${priceTargetSummary?.targetHigh?.toFixed(2) ?? "N/A"}

Forward Estimates:
${estimateContext || "N/A"}

═══════════════════════════════════
STOCKMIND SCORE: ${score.overall}/100
═══════════════════════════════════
Valuation: ${score.categories.valuation.score}/100 (${score.categories.valuation.label})
Profitability: ${score.categories.profitability.score}/100 (${score.categories.profitability.label})
Growth: ${score.categories.growth.score}/100 (${score.categories.growth.label})
Financial Health: ${score.categories.financialHealth.score}/100 (${score.categories.financialHealth.label})
Momentum: ${score.categories.momentum.score}/100 (${score.categories.momentum.label})

═══════════════════════════════════
RECENT NEWS
═══════════════════════════════════
${newsContext || "No recent news available"}

Generate a comprehensive 8-section Deep Dive research report following the provided JSON schema. Be specific, data-driven, and analytically rigorous.`;

  return { systemInstruction, userPrompt };
}
