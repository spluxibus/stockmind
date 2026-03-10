import type { CompanyProfile, StockQuote, KeyMetricsTTM, FinancialRatios, AnalystRating, PriceTargetSummary, StockNews } from "@/lib/schemas/financial-data";
import type { StockScore } from "@/lib/schemas/report";
import { formatLargeNumber, formatRatio, formatRawPercent } from "@/lib/utils/formatting";

export function buildSnapshotPrompt(data: {
  profile: CompanyProfile;
  quote: StockQuote;
  keyMetrics: KeyMetricsTTM;
  ratios: FinancialRatios | null;
  analystRating: AnalystRating | null;
  priceTargetSummary: PriceTargetSummary | null;
  score: StockScore;
  recentNews: StockNews[];
  revenueCAGR: number | null;
}): { systemInstruction: string; userPrompt: string } {
  const { profile, quote, keyMetrics, ratios, analystRating, priceTargetSummary, score, recentNews, revenueCAGR } = data;
  const pe = keyMetrics.peRatioTTM ?? ratios?.peRatio;
  const evEbitda = keyMetrics.enterpriseValueOverEBITDATTM ?? keyMetrics.evToEbitdaTTM;
  const grossMargin = ratios?.grossProfitMargin;
  const opMargin = ratios?.operatingProfitMargin;
  const roe = keyMetrics.roeTTM ?? keyMetrics.returnOnEquityTTM ?? ratios?.returnOnEquity;
  const debtEquity = keyMetrics.debtToEquityTTM ?? ratios?.debtEquityRatio;
  const currentRatio = keyMetrics.currentRatioTTM ?? ratios?.currentRatio;

  const newsContext = recentNews
    .slice(0, 5)
    .map((n) => `- ${n.publishedDate.split("T")[0]}: ${n.title} (${n.site})`)
    .join("\n");

  const systemInstruction = `You are a senior equity research analyst writing a concise stock snapshot for retail investors.

Your analysis must be:
- Factual and data-driven (reference specific numbers from the data provided)
- Balanced (acknowledge both strengths and key risks)
- Written in clear, professional English accessible to non-experts
- Structured exactly according to the JSON schema provided
- Concise: each commentary field should be 2-3 sentences maximum

REGULATORY DISCLAIMER: You are providing INFORMATION ONLY, not investment advice.
- Never use phrases like "you should buy/sell" or "I recommend buying"
- Use objective language: "analyst consensus suggests...", "metrics indicate...", "the company demonstrates..."
- The "recommendation" field reflects analyst consensus, not your personal advice

All financial data provided is real and current. Do not fabricate any numbers.`;

  const userPrompt = `Generate a stock snapshot analysis for ${profile.symbol} (${profile.companyName}).

COMPANY OVERVIEW:
- Sector: ${profile.sector} | Industry: ${profile.industry}
- Market Cap: ${formatLargeNumber(profile.mktCap)}
- CEO: ${profile.ceo}
- Exchange: ${profile.exchange}

CURRENT PRICE DATA:
- Price: $${quote.price.toFixed(2)} (${quote.changesPercentage >= 0 ? "+" : ""}${quote.changesPercentage.toFixed(2)}% today)
- 52-Week Range: ${profile.range || `$${quote.yearLow} - $${quote.yearHigh}`}
- Beta: ${profile.beta?.toFixed(2) ?? "N/A"}
- Avg Volume: ${quote.avgVolume?.toLocaleString() ?? "N/A"}

VALUATION METRICS (TTM):
- P/E Ratio: ${pe?.toFixed(1) ?? "N/A"}x
- EV/EBITDA: ${evEbitda?.toFixed(1) ?? "N/A"}x
- P/S Ratio: ${keyMetrics.priceToSalesRatioTTM?.toFixed(1) ?? "N/A"}x
- P/B Ratio: ${keyMetrics.pbRatioTTM?.toFixed(1) ?? "N/A"}x
- Dividend Yield: ${keyMetrics.dividendYieldTTM != null ? (keyMetrics.dividendYieldTTM * 100).toFixed(2) + "%" : "N/A"}

PROFITABILITY (TTM):
- Gross Margin: ${grossMargin != null ? (grossMargin * 100).toFixed(1) + "%" : "N/A"}
- Operating Margin: ${opMargin != null ? (opMargin * 100).toFixed(1) + "%" : "N/A"}
- Net Margin: ${ratios?.netProfitMargin != null ? (ratios.netProfitMargin * 100).toFixed(1) + "%" : "N/A"}
- ROE: ${roe != null ? (roe * 100).toFixed(1) + "%" : "N/A"}
- Revenue Growth (CAGR): ${revenueCAGR != null ? revenueCAGR.toFixed(1) + "%" : "N/A"}

BALANCE SHEET HEALTH:
- Debt/Equity: ${debtEquity?.toFixed(2) ?? "N/A"}x
- Current Ratio: ${currentRatio?.toFixed(2) ?? "N/A"}
- Net Debt/EBITDA: ${keyMetrics.netDebtToEBITDATTM?.toFixed(2) ?? "N/A"}x
- Interest Coverage: ${keyMetrics.interestCoverageTTM?.toFixed(1) ?? "N/A"}x
- FCF Yield: ${keyMetrics.freeCashFlowYieldTTM != null ? (keyMetrics.freeCashFlowYieldTTM * 100).toFixed(1) + "%" : "N/A"}

ANALYST CONSENSUS:
- FMP Rating: ${analystRating?.ratingRecommendation ?? "N/A"}
- Price Target (consensus): $${priceTargetSummary?.targetConsensus?.toFixed(2) ?? "N/A"}
- Price Target Range: $${priceTargetSummary?.targetLow?.toFixed(2) ?? "N/A"} - $${priceTargetSummary?.targetHigh?.toFixed(2) ?? "N/A"}
- Implied Upside: ${priceTargetSummary?.targetConsensus ? (((priceTargetSummary.targetConsensus - quote.price) / quote.price) * 100).toFixed(1) + "%" : "N/A"}

STOCKMIND SCORE: ${score.overall}/100 (${score.overallLabel})
- Valuation: ${score.categories.valuation.score}/100 (${score.categories.valuation.label})
- Profitability: ${score.categories.profitability.score}/100 (${score.categories.profitability.label})
- Financial Health: ${score.categories.financialHealth.score}/100 (${score.categories.financialHealth.label})
- Momentum: ${score.categories.momentum.score}/100 (${score.categories.momentum.label})

RECENT NEWS (last 5 headlines):
${newsContext || "No recent news available"}

COMPANY DESCRIPTION:
${profile.description?.substring(0, 500) ?? ""}

Generate the stock snapshot JSON following the provided schema. Make the commentary insightful and data-specific.`;

  return { systemInstruction, userPrompt };
}
