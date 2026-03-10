import { z } from "zod";

// ─── Company Profile ─────────────────────────────────────────────────────────

export const CompanyProfileSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  currency: z.string().optional().default("USD"),
  exchange: z.string().optional().default(""),
  exchangeShortName: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  sector: z.string().optional().default(""),
  description: z.string().optional().default(""),
  ceo: z.string().optional().default(""),
  fullTimeEmployees: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  mktCap: z.number().optional().default(0),
  price: z.number().optional().default(0),
  beta: z.number().optional().default(1),
  volAvg: z.number().optional().default(0),
  lastDiv: z.number().optional().default(0),
  range: z.string().optional().default(""),
  changes: z.number().optional().default(0),
  image: z.string().optional().default(""),
  ipoDate: z.string().optional().default(""),
  website: z.string().optional().default(""),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

// ─── Stock Quote ─────────────────────────────────────────────────────────────

export const StockQuoteSchema = z.object({
  symbol: z.string(),
  name: z.string().optional().default(""),
  price: z.number(),
  changesPercentage: z.number().optional().default(0),
  change: z.number().optional().default(0),
  dayLow: z.number().optional().default(0),
  dayHigh: z.number().optional().default(0),
  yearHigh: z.number().optional().default(0),
  yearLow: z.number().optional().default(0),
  marketCap: z.number().optional().default(0),
  priceAvg50: z.number().optional().default(0),
  priceAvg200: z.number().optional().default(0),
  exchange: z.string().optional().default(""),
  volume: z.number().optional().default(0),
  avgVolume: z.number().optional().default(0),
  open: z.number().optional().default(0),
  previousClose: z.number().optional().default(0),
  eps: z.number().optional().nullable().default(null),
  pe: z.number().optional().nullable().default(null),
  earningsAnnouncement: z.string().optional().nullable().default(null),
  sharesOutstanding: z.number().optional().default(0),
  timestamp: z.number().optional().default(0),
});

export type StockQuote = z.infer<typeof StockQuoteSchema>;

// ─── Income Statement ─────────────────────────────────────────────────────────

export const IncomeStatementSchema = z.object({
  date: z.string(),
  symbol: z.string(),
  reportedCurrency: z.string().optional().default("USD"),
  period: z.string().optional().default("FY"),
  revenue: z.number().optional().default(0),
  costOfRevenue: z.number().optional().default(0),
  grossProfit: z.number().optional().default(0),
  grossProfitRatio: z.number().optional().default(0),
  researchAndDevelopmentExpenses: z.number().optional().default(0),
  operatingExpenses: z.number().optional().default(0),
  operatingIncome: z.number().optional().default(0),
  operatingIncomeRatio: z.number().optional().default(0),
  ebitda: z.number().optional().default(0),
  ebitdaratio: z.number().optional().default(0),
  netIncome: z.number().optional().default(0),
  netIncomeRatio: z.number().optional().default(0),
  eps: z.number().optional().default(0),
  epsdiluted: z.number().optional().default(0),
  weightedAverageShsOut: z.number().optional().default(0),
  weightedAverageShsOutDil: z.number().optional().default(0),
});

export type IncomeStatement = z.infer<typeof IncomeStatementSchema>;

// ─── Balance Sheet ────────────────────────────────────────────────────────────

export const BalanceSheetSchema = z.object({
  date: z.string(),
  symbol: z.string(),
  period: z.string().optional().default("FY"),
  cashAndCashEquivalents: z.number().optional().default(0),
  totalCurrentAssets: z.number().optional().default(0),
  totalAssets: z.number().optional().default(0),
  totalCurrentLiabilities: z.number().optional().default(0),
  totalDebt: z.number().optional().default(0),
  netDebt: z.number().optional().default(0),
  totalLiabilities: z.number().optional().default(0),
  totalStockholdersEquity: z.number().optional().default(0),
  longTermDebt: z.number().optional().default(0),
  shortTermDebt: z.number().optional().default(0),
  retainedEarnings: z.number().optional().default(0),
});

export type BalanceSheet = z.infer<typeof BalanceSheetSchema>;

// ─── Cash Flow Statement ──────────────────────────────────────────────────────

export const CashFlowSchema = z.object({
  date: z.string(),
  symbol: z.string(),
  period: z.string().optional().default("FY"),
  netCashProvidedByOperatingActivities: z.number().optional().default(0),
  capitalExpenditure: z.number().optional().default(0),
  freeCashFlow: z.number().optional().default(0),
  dividendsPaid: z.number().optional().default(0),
  commonStockRepurchased: z.number().optional().default(0),
  netChangeInCash: z.number().optional().default(0),
});

export type CashFlow = z.infer<typeof CashFlowSchema>;

// ─── Financial Ratios ─────────────────────────────────────────────────────────

export const FinancialRatiosSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  period: z.string().optional().default("FY"),
  peRatio: z.number().optional().nullable().default(null),
  priceToSalesRatio: z.number().optional().nullable().default(null),
  priceToBookRatio: z.number().optional().nullable().default(null),
  priceEarningsToGrowthRatio: z.number().optional().nullable().default(null),
  dividendYield: z.number().optional().nullable().default(null),
  grossProfitMargin: z.number().optional().nullable().default(null),
  operatingProfitMargin: z.number().optional().nullable().default(null),
  netProfitMargin: z.number().optional().nullable().default(null),
  returnOnEquity: z.number().optional().nullable().default(null),
  returnOnAssets: z.number().optional().nullable().default(null),
  debtRatio: z.number().optional().nullable().default(null),
  debtEquityRatio: z.number().optional().nullable().default(null),
  currentRatio: z.number().optional().nullable().default(null),
  quickRatio: z.number().optional().nullable().default(null),
  interestCoverage: z.number().optional().nullable().default(null),
  freeCashFlowPerShare: z.number().optional().nullable().default(null),
});

export type FinancialRatios = z.infer<typeof FinancialRatiosSchema>;

// ─── Key Metrics TTM ──────────────────────────────────────────────────────────

export const KeyMetricsTTMSchema = z.object({
  revenuePerShareTTM: z.number().optional().nullable().default(null),
  netIncomePerShareTTM: z.number().optional().nullable().default(null),
  operatingCashFlowPerShareTTM: z.number().optional().nullable().default(null),
  freeCashFlowPerShareTTM: z.number().optional().nullable().default(null),
  cashPerShareTTM: z.number().optional().nullable().default(null),
  bookValuePerShareTTM: z.number().optional().nullable().default(null),
  tangibleBookValuePerShareTTM: z.number().optional().nullable().default(null),
  shareholdersEquityPerShareTTM: z.number().optional().nullable().default(null),
  interestDebtPerShareTTM: z.number().optional().nullable().default(null),
  marketCapTTM: z.number().optional().nullable().default(null),
  enterpriseValueTTM: z.number().optional().nullable().default(null),
  peRatioTTM: z.number().optional().nullable().default(null),
  priceToSalesRatioTTM: z.number().optional().nullable().default(null),
  pocfratioTTM: z.number().optional().nullable().default(null),
  pfcfRatioTTM: z.number().optional().nullable().default(null),
  pbRatioTTM: z.number().optional().nullable().default(null),
  ptbRatioTTM: z.number().optional().nullable().default(null),
  evToSalesTTM: z.number().optional().nullable().default(null),
  enterpriseValueOverEBITDATTM: z.number().optional().nullable().default(null),
  evToEbitdaTTM: z.number().optional().nullable().default(null),
  evToOperatingCashFlowTTM: z.number().optional().nullable().default(null),
  evToFreeCashFlowTTM: z.number().optional().nullable().default(null),
  earningsYieldTTM: z.number().optional().nullable().default(null),
  freeCashFlowYieldTTM: z.number().optional().nullable().default(null),
  debtToEquityTTM: z.number().optional().nullable().default(null),
  debtToAssetsTTM: z.number().optional().nullable().default(null),
  netDebtToEBITDATTM: z.number().optional().nullable().default(null),
  currentRatioTTM: z.number().optional().nullable().default(null),
  interestCoverageTTM: z.number().optional().nullable().default(null),
  incomeQualityTTM: z.number().optional().nullable().default(null),
  dividendYieldTTM: z.number().optional().nullable().default(null),
  payoutRatioTTM: z.number().optional().nullable().default(null),
  roe: z.number().optional().nullable().default(null),
  roeTTM: z.number().optional().nullable().default(null),
  returnOnTangibleAssetsTTM: z.number().optional().nullable().default(null),
  grahamNumberTTM: z.number().optional().nullable().default(null),
  grahamNetNetTTM: z.number().optional().nullable().default(null),
  workingCapitalTTM: z.number().optional().nullable().default(null),
  tangibleAssetValueTTM: z.number().optional().nullable().default(null),
  netCurrentAssetValueTTM: z.number().optional().nullable().default(null),
  investedCapitalTTM: z.number().optional().nullable().default(null),
  capexToOperatingCashFlowTTM: z.number().optional().nullable().default(null),
  capexToRevenueTTM: z.number().optional().nullable().default(null),
  capexToDepreciationTTM: z.number().optional().nullable().default(null),
  stockBasedCompensationToRevenueTTM: z.number().optional().nullable().default(null),
  intangiblesToTotalAssetsTTM: z.number().optional().nullable().default(null),
  averageReceivablesTTM: z.number().optional().nullable().default(null),
  averagePayablesTTM: z.number().optional().nullable().default(null),
  averageInventoryTTM: z.number().optional().nullable().default(null),
  daysPayablesOutstandingTTM: z.number().optional().nullable().default(null),
  daysSalesOutstandingTTM: z.number().optional().nullable().default(null),
  roicTTM: z.number().optional().nullable().default(null),
  returnOnEquityTTM: z.number().optional().nullable().default(null),
  capexPerShareTTM: z.number().optional().nullable().default(null),
});

export type KeyMetricsTTM = z.infer<typeof KeyMetricsTTMSchema>;

// ─── Analyst Rating ───────────────────────────────────────────────────────────

export const AnalystRatingSchema = z.object({
  symbol: z.string(),
  date: z.string().optional().default(""),
  rating: z.string().optional().default(""),
  ratingScore: z.number().optional().default(0),
  ratingRecommendation: z.string().optional().default(""),
  ratingDetailsDCFScore: z.number().optional().default(0),
  ratingDetailsDCFRecommendation: z.string().optional().default(""),
  ratingDetailsROEScore: z.number().optional().default(0),
  ratingDetailsROERecommendation: z.string().optional().default(""),
  ratingDetailsROAScore: z.number().optional().default(0),
  ratingDetailsROARecommendation: z.string().optional().default(""),
  ratingDetailsDEScore: z.number().optional().default(0),
  ratingDetailsDERecommendation: z.string().optional().default(""),
  ratingDetailsPEScore: z.number().optional().default(0),
  ratingDetailsPERecommendation: z.string().optional().default(""),
  ratingDetailsPBScore: z.number().optional().default(0),
  ratingDetailsPBRecommendation: z.string().optional().default(""),
});

export type AnalystRating = z.infer<typeof AnalystRatingSchema>;

// ─── Price Target ─────────────────────────────────────────────────────────────

export const PriceTargetSchema = z.object({
  symbol: z.string(),
  lastMonth: z.number().optional().default(0),
  lastMonthAvgPriceTarget: z.number().optional().default(0),
  lastQuarter: z.number().optional().default(0),
  lastQuarterAvgPriceTarget: z.number().optional().default(0),
  lastYear: z.number().optional().default(0),
  allTime: z.number().optional().default(0),
  publishers: z.array(z.string()).optional().default([]),
});

export type PriceTarget = z.infer<typeof PriceTargetSchema>;

// ─── Price Target Summary ─────────────────────────────────────────────────────

export const PriceTargetSummarySchema = z.object({
  symbol: z.string(),
  targetHigh: z.number().optional().default(0),
  targetLow: z.number().optional().default(0),
  targetConsensus: z.number().optional().default(0),
  targetMedian: z.number().optional().default(0),
});

export type PriceTargetSummary = z.infer<typeof PriceTargetSummarySchema>;

// ─── Historical Price ─────────────────────────────────────────────────────────

export const HistoricalPriceSchema = z.object({
  date: z.string(),
  open: z.number().optional().default(0),
  high: z.number().optional().default(0),
  low: z.number().optional().default(0),
  close: z.number(),
  adjClose: z.number().optional().default(0),
  volume: z.number().optional().default(0),
  unadjustedVolume: z.number().optional().default(0),
  change: z.number().optional().default(0),
  changePercent: z.number().optional().default(0),
});

export type HistoricalPrice = z.infer<typeof HistoricalPriceSchema>;

// ─── Stock News ───────────────────────────────────────────────────────────────

export const StockNewsSchema = z.object({
  symbol: z.string().optional().default(""),
  publishedDate: z.string(),
  title: z.string(),
  image: z.string().optional().default(""),
  site: z.string().optional().default(""),
  text: z.string().optional().default(""),
  url: z.string().optional().default(""),
});

export type StockNews = z.infer<typeof StockNewsSchema>;

// ─── Ticker Search Result ─────────────────────────────────────────────────────

export const TickerSearchResultSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  currency: z.string().optional().default("USD"),
  stockExchange: z.string().optional().default(""),
  exchangeShortName: z.string().optional().default(""),
});

export type TickerSearchResult = z.infer<typeof TickerSearchResultSchema>;

// ─── Analyst Estimate ─────────────────────────────────────────────────────────

export const AnalystEstimateSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  estimatedRevenueLow: z.number().optional().default(0),
  estimatedRevenueHigh: z.number().optional().default(0),
  estimatedRevenueAvg: z.number().optional().default(0),
  estimatedEbitdaLow: z.number().optional().default(0),
  estimatedEbitdaHigh: z.number().optional().default(0),
  estimatedEbitdaAvg: z.number().optional().default(0),
  estimatedEbitLow: z.number().optional().default(0),
  estimatedEbitHigh: z.number().optional().default(0),
  estimatedEbitAvg: z.number().optional().default(0),
  estimatedNetIncomeLow: z.number().optional().default(0),
  estimatedNetIncomeHigh: z.number().optional().default(0),
  estimatedNetIncomeAvg: z.number().optional().default(0),
  estimatedSgaExpenseLow: z.number().optional().default(0),
  estimatedSgaExpenseHigh: z.number().optional().default(0),
  estimatedSgaExpenseAvg: z.number().optional().default(0),
  estimatedEpsLow: z.number().optional().default(0),
  estimatedEpsHigh: z.number().optional().default(0),
  estimatedEpsAvg: z.number().optional().default(0),
  numberAnalystEstimatedRevenue: z.number().optional().default(0),
  numberAnalystsEstimatedEps: z.number().optional().default(0),
});

export type AnalystEstimate = z.infer<typeof AnalystEstimateSchema>;

// ─── DCF Valuation ────────────────────────────────────────────────────────────

export const DCFResultSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  dcf: z.number().optional().default(0),
  Stock_Price: z.number().optional().default(0),
});

export type DCFResult = z.infer<typeof DCFResultSchema>;
