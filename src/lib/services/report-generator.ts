import { getFMPService } from "./fmp";
import { getGeminiService } from "./gemini";
import { getCacheService } from "./cache";
import {
  calculateScore,
  calculateDCF,
  calculateGrowthRates,
  buildPeerDataFromMetrics,
  computeMedians,
} from "./financial-modeler";
import { buildSnapshotPrompt } from "@/lib/prompts/snapshot";
import { buildDeepDivePrompt } from "@/lib/prompts/deep-dive";
import { AISnapshotSchema, AIDeepDiveSchema } from "@/lib/schemas/report";
import type { SnapshotReport, DeepDiveReport, PeerComparison } from "@/lib/schemas/report";

export class ReportGenerator {
  private fmp = getFMPService();
  private gemini = getGeminiService();
  private cache = getCacheService();

  // ─── Stock Snapshot ────────────────────────────────────────────────────────

  async generateSnapshot(ticker: string, userId: string): Promise<SnapshotReport> {
    const t0 = Date.now();

    // 1. Check cache
    const cached = await this.cache.getReport(ticker, "snapshot");
    if (cached) {
      await this.cache.logReportAccess(userId, ticker, "snapshot", cached.id);
      return cached as SnapshotReport;
    }

    // 2. Fetch data in parallel
    const [profile, quote, keyMetrics, ratiosArr, analystRating, priceTarget, news, historicalPrices, incomeArr] =
      await Promise.allSettled([
        this.fmp.getCompanyProfile(ticker),
        this.fmp.getStockQuote(ticker),
        this.fmp.getKeyMetricsTTM(ticker),
        this.fmp.getFinancialRatios(ticker, "annual", 1),
        this.fmp.getAnalystRating(ticker),
        this.fmp.getPriceTargetSummary(ticker),
        this.fmp.getStockNews(ticker, 8),
        this.fmp.getHistoricalPrices(ticker),
        this.fmp.getIncomeStatements(ticker, "annual", 3),
      ]);

    const resolvedProfile = profile.status === "fulfilled" ? profile.value : null;
    const resolvedQuote = quote.status === "fulfilled" ? quote.value : null;

    if (!resolvedProfile || !resolvedQuote) {
      throw new Error(`Unable to fetch data for ${ticker}`);
    }

    const resolvedKeyMetrics = keyMetrics.status === "fulfilled" ? keyMetrics.value : {};
    const resolvedRatios = ratiosArr.status === "fulfilled" ? (ratiosArr.value[0] ?? null) : null;
    const resolvedAnalystRating = analystRating.status === "fulfilled" ? analystRating.value : null;
    const resolvedPriceTarget = priceTarget.status === "fulfilled" ? priceTarget.value : null;
    const resolvedNews = news.status === "fulfilled" ? news.value : [];
    const resolvedPrices = historicalPrices.status === "fulfilled" ? historicalPrices.value : [];
    const resolvedIncome = incomeArr.status === "fulfilled" ? incomeArr.value : [];

    // 3. Calculate scoring
    const score = calculateScore(
      resolvedKeyMetrics as import("@/lib/schemas/financial-data").KeyMetricsTTM,
      resolvedRatios,
      resolvedProfile
    );

    // 4. Calculate growth rates
    const { revenueCAGR } = calculateGrowthRates(resolvedIncome);

    // 5. Generate AI narrative
    const { systemInstruction, userPrompt } = buildSnapshotPrompt({
      profile: resolvedProfile,
      quote: resolvedQuote,
      keyMetrics: resolvedKeyMetrics as import("@/lib/schemas/financial-data").KeyMetricsTTM,
      ratios: resolvedRatios,
      analystRating: resolvedAnalystRating,
      priceTargetSummary: resolvedPriceTarget,
      score,
      recentNews: resolvedNews,
      revenueCAGR,
    });

    const aiAnalysis = await this.gemini.generateStructured({
      systemInstruction,
      userPrompt,
      schema: AISnapshotSchema,
      temperature: 0.3,
      maxOutputTokens: 2000,
    });

    // 6. Assemble report
    const report: SnapshotReport = {
      ticker: ticker.toUpperCase(),
      companyName: resolvedProfile.companyName,
      generatedAt: new Date().toISOString(),
      profile: resolvedProfile,
      quote: resolvedQuote,
      keyMetrics: resolvedKeyMetrics as import("@/lib/schemas/financial-data").KeyMetricsTTM,
      ratios: resolvedRatios,
      score,
      historicalPrices: resolvedPrices,
      analystRating: resolvedAnalystRating,
      priceTargetSummary: resolvedPriceTarget,
      recentNews: resolvedNews,
      aiAnalysis,
    };

    // 7. Save to cache
    const reportId = await this.cache.saveReport(report, userId, "snapshot");
    if (reportId) report.id = reportId;
    await this.cache.logReportAccess(userId, ticker, "snapshot", reportId ?? undefined);

    console.log(`[ReportGenerator] Snapshot for ${ticker} generated in ${Date.now() - t0}ms`);
    return report;
  }

  // ─── Deep Dive Report ──────────────────────────────────────────────────────

  async generateDeepDive(ticker: string, userId: string): Promise<DeepDiveReport> {
    const t0 = Date.now();

    // 1. Check cache (4h TTL)
    const cached = await this.cache.getReport(ticker, "deep_dive");
    if (cached) {
      await this.cache.logReportAccess(userId, ticker, "deep_dive", cached.id);
      return cached as DeepDiveReport;
    }

    // 2. Fetch all data in parallel (more data than snapshot)
    const [
      profileResult,
      quoteResult,
      keyMetricsResult,
      ratiosResult,
      incomeResult,
      balanceResult,
      cashResult,
      estimatesResult,
      analystRatingResult,
      priceTargetResult,
      newsResult,
      pricesResult,
      peersResult,
      dcfResult,
    ] = await Promise.allSettled([
      this.fmp.getCompanyProfile(ticker),
      this.fmp.getStockQuote(ticker),
      this.fmp.getKeyMetricsTTM(ticker),
      this.fmp.getFinancialRatios(ticker, "annual", 1),
      this.fmp.getIncomeStatements(ticker, "annual", 5),
      this.fmp.getBalanceSheets(ticker, "annual", 3),
      this.fmp.getCashFlows(ticker, "annual", 5),
      this.fmp.getAnalystEstimates(ticker, "annual", 3),
      this.fmp.getAnalystRating(ticker),
      this.fmp.getPriceTargetSummary(ticker),
      this.fmp.getStockNews(ticker, 10),
      this.fmp.getHistoricalPrices(ticker),
      this.fmp.getStockPeers(ticker),
      this.fmp.getDCF(ticker),
    ]);

    const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
    const quote = quoteResult.status === "fulfilled" ? quoteResult.value : null;

    if (!profile || !quote) {
      throw new Error(`Unable to fetch data for ${ticker}`);
    }

    const keyMetrics = keyMetricsResult.status === "fulfilled"
      ? keyMetricsResult.value
      : {} as import("@/lib/schemas/financial-data").KeyMetricsTTM;
    const ratios = ratiosResult.status === "fulfilled" ? (ratiosResult.value[0] ?? null) : null;
    const incomeStatements = incomeResult.status === "fulfilled" ? incomeResult.value : [];
    const balanceSheets = balanceResult.status === "fulfilled" ? balanceResult.value : [];
    const cashFlows = cashResult.status === "fulfilled" ? cashResult.value : [];
    const analystEstimates = estimatesResult.status === "fulfilled" ? estimatesResult.value : [];
    const analystRating = analystRatingResult.status === "fulfilled" ? analystRatingResult.value : null;
    const priceTargetSummary = priceTargetResult.status === "fulfilled" ? priceTargetResult.value : null;
    const recentNews = newsResult.status === "fulfilled" ? newsResult.value : [];
    const historicalPrices = pricesResult.status === "fulfilled" ? pricesResult.value : [];
    const peerTickers = peersResult.status === "fulfilled" ? peersResult.value : [];

    // 3. Fetch peer data (best effort, up to 5 peers)
    const peerDataResults = await Promise.allSettled(
      peerTickers.slice(0, 5).map(async (peerTicker) => {
        const [peerProfile, peerQuote, peerKeyMetrics, peerRatios] = await Promise.allSettled([
          this.fmp.getCompanyProfile(peerTicker),
          this.fmp.getStockQuote(peerTicker),
          this.fmp.getKeyMetricsTTM(peerTicker),
          this.fmp.getFinancialRatios(peerTicker, "annual", 1),
        ]);
        if (peerProfile.status !== "fulfilled" || peerQuote.status !== "fulfilled") return null;
        return buildPeerDataFromMetrics(
          peerTicker,
          peerProfile.value.companyName,
          peerProfile.value,
          peerKeyMetrics.status === "fulfilled" ? peerKeyMetrics.value : {} as import("@/lib/schemas/financial-data").KeyMetricsTTM,
          peerRatios.status === "fulfilled" ? (peerRatios.value[0] ?? null) : null,
          { price: peerQuote.value.price }
        );
      })
    );

    const peers = peerDataResults
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<import("@/lib/schemas/report").PeerData>).value);

    const targetPeerData = buildPeerDataFromMetrics(
      ticker,
      profile.companyName,
      profile,
      keyMetrics,
      ratios,
      { price: quote.price }
    );

    const peerComparison: PeerComparison = {
      target: targetPeerData,
      peers,
      medians: computeMedians(peers),
    };

    // 4. Calculate score and financial metrics
    const score = calculateScore(keyMetrics, ratios, profile);
    const { revenueCAGR, revenueYoY, epsCAGR } = calculateGrowthRates(incomeStatements);

    // 5. Calculate DCF model
    const dcfModel = calculateDCF({
      cashFlows,
      incomeStatements,
      balanceSheet: balanceSheets[0] ?? null,
      sector: profile.sector,
      currentPrice: quote.price,
      sharesOutstanding: quote.sharesOutstanding ?? 0,
    });

    // 6. Generate AI narrative
    const { systemInstruction, userPrompt } = buildDeepDivePrompt({
      profile,
      quote,
      keyMetrics,
      ratios,
      incomeStatements,
      balanceSheets,
      cashFlows,
      analystEstimates,
      analystRating,
      priceTargetSummary,
      recentNews,
      score,
      dcfModel,
      peerComparison,
      revenueCAGR,
      revenueYoY,
      epsCAGR,
    });

    const aiAnalysis = await this.gemini.generateStructured({
      systemInstruction,
      userPrompt,
      schema: AIDeepDiveSchema,
      temperature: 0.3,
      maxOutputTokens: 8192,
    });

    // 7. Assemble report
    const report: DeepDiveReport = {
      ticker: ticker.toUpperCase(),
      companyName: profile.companyName,
      generatedAt: new Date().toISOString(),
      profile,
      quote,
      keyMetrics,
      ratios,
      incomeStatements,
      balanceSheets,
      cashFlows,
      analystEstimates,
      analystRating,
      priceTargetSummary,
      historicalPrices,
      recentNews,
      score,
      dcfModel,
      peerComparison,
      aiAnalysis,
    };

    // 8. Save to cache
    const reportId = await this.cache.saveReport(report, userId, "deep_dive");
    if (reportId) report.id = reportId;
    await this.cache.logReportAccess(userId, ticker, "deep_dive", reportId ?? undefined);

    console.log(`[ReportGenerator] Deep Dive for ${ticker} generated in ${Date.now() - t0}ms`);
    return report;
  }
}

let generatorInstance: ReportGenerator | null = null;

export function getReportGenerator(): ReportGenerator {
  if (!generatorInstance) {
    generatorInstance = new ReportGenerator();
  }
  return generatorInstance;
}
