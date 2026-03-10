import { z } from "zod";

// ─── Score System ─────────────────────────────────────────────────────────────

export const ScoreFactorSchema = z.object({
  name: z.string(),
  value: z.number().nullable(),
  benchmark: z.number().nullable(),
  score: z.number().min(0).max(100),
  signal: z.enum(["positive", "neutral", "negative"]),
  description: z.string().optional(),
});

export const ScoreCategorySchema = z.object({
  score: z.number().min(0).max(100),
  label: z.string(),
  factors: z.array(ScoreFactorSchema),
});

export const StockScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  overallLabel: z.string(),
  categories: z.object({
    valuation: ScoreCategorySchema,
    profitability: ScoreCategorySchema,
    growth: ScoreCategorySchema,
    financialHealth: ScoreCategorySchema,
    momentum: ScoreCategorySchema,
  }),
  weights: z.object({
    valuation: z.number(),
    profitability: z.number(),
    growth: z.number(),
    financialHealth: z.number(),
    momentum: z.number(),
  }),
});

export type StockScore = z.infer<typeof StockScoreSchema>;

// ─── Peer Comparison ──────────────────────────────────────────────────────────

export const PeerDataSchema = z.object({
  ticker: z.string(),
  companyName: z.string(),
  marketCap: z.number().nullable(),
  pe: z.number().nullable(),
  evEbitda: z.number().nullable(),
  revenueGrowth: z.number().nullable(),
  grossMargin: z.number().nullable(),
  operatingMargin: z.number().nullable(),
  netMargin: z.number().nullable(),
  roe: z.number().nullable(),
  debtToEbitda: z.number().nullable(),
  price: z.number().nullable(),
});

export type PeerData = z.infer<typeof PeerDataSchema>;

export const PeerComparisonSchema = z.object({
  target: PeerDataSchema,
  peers: z.array(PeerDataSchema),
  medians: PeerDataSchema.partial(),
});

export type PeerComparison = z.infer<typeof PeerComparisonSchema>;

// ─── DCF Model ────────────────────────────────────────────────────────────────

export const DCFModelSchema = z.object({
  currentPrice: z.number(),
  intrinsicValue: z.number(),
  upside: z.number(),
  wacc: z.number(),
  terminalGrowthRate: z.number(),
  projectedFCFs: z.array(
    z.object({
      year: z.number(),
      fcf: z.number(),
    })
  ),
  terminalValue: z.number(),
  enterpriseValue: z.number(),
  equityValue: z.number(),
  sharesOutstanding: z.number(),
  netDebt: z.number(),
  sensitivityMatrix: z.array(
    z.object({
      wacc: z.number(),
      terminalGrowth: z.number(),
      value: z.number(),
    })
  ),
});

export type DCFModel = z.infer<typeof DCFModelSchema>;

// ─── AI Snapshot Report ───────────────────────────────────────────────────────

export const AISnapshotSchema = z.object({
  summary: z.string(),
  keyHighlights: z.array(
    z.object({
      label: z.string(),
      text: z.string(),
      sentiment: z.enum(["positive", "neutral", "negative"]),
    })
  ),
  commentary: z.object({
    valuation: z.string(),
    growth: z.string(),
    risks: z.string(),
  }),
  analystView: z.string(),
  outlook: z.enum(["bullish", "neutral", "bearish"]),
});

export type AISnapshot = z.infer<typeof AISnapshotSchema>;

// ─── AI Deep Dive Report ──────────────────────────────────────────────────────

export const AIDeepDiveSchema = z.object({
  executiveSummary: z.string(),
  businessOverview: z.object({
    description: z.string(),
    competitivePosition: z.string(),
    keyProducts: z.array(z.string()),
    moat: z.string(),
  }),
  financialAnalysis: z.object({
    revenueAnalysis: z.string(),
    profitabilityAnalysis: z.string(),
    balanceSheetAnalysis: z.string(),
    cashFlowAnalysis: z.string(),
  }),
  valuation: z.object({
    dcfAnalysis: z.string(),
    multiplesAnalysis: z.string(),
    historicalValuation: z.string(),
    fairValueAssessment: z.string(),
  }),
  peerComparison: z.string(),
  riskFactors: z.array(
    z.object({
      category: z.string(),
      risk: z.string(),
      severity: z.enum(["high", "medium", "low"]),
      mitigation: z.string(),
    })
  ),
  investmentThesis: z.object({
    bullCase: z.string(),
    bearCase: z.string(),
    baseCase: z.string(),
  }),
  recommendation: z.object({
    rating: z.enum(["Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"]),
    targetPrice: z.number(),
    upside: z.number(),
    timeHorizon: z.string(),
    rationale: z.string(),
  }),
});

export type AIDeepDive = z.infer<typeof AIDeepDiveSchema>;

// ─── Full Report Types ────────────────────────────────────────────────────────

export interface SnapshotReport {
  id?: string;
  ticker: string;
  companyName: string;
  generatedAt: string;
  profile: import("./financial-data").CompanyProfile;
  quote: import("./financial-data").StockQuote;
  keyMetrics: import("./financial-data").KeyMetricsTTM;
  ratios: import("./financial-data").FinancialRatios | null;
  score: StockScore;
  historicalPrices: import("./financial-data").HistoricalPrice[];
  analystRating: import("./financial-data").AnalystRating | null;
  priceTargetSummary: import("./financial-data").PriceTargetSummary | null;
  recentNews: import("./financial-data").StockNews[];
  aiAnalysis: AISnapshot;
}

export interface DeepDiveReport {
  id?: string;
  ticker: string;
  companyName: string;
  generatedAt: string;
  profile: import("./financial-data").CompanyProfile;
  quote: import("./financial-data").StockQuote;
  keyMetrics: import("./financial-data").KeyMetricsTTM;
  ratios: import("./financial-data").FinancialRatios | null;
  incomeStatements: import("./financial-data").IncomeStatement[];
  balanceSheets: import("./financial-data").BalanceSheet[];
  cashFlows: import("./financial-data").CashFlow[];
  analystEstimates: import("./financial-data").AnalystEstimate[];
  analystRating: import("./financial-data").AnalystRating | null;
  priceTargetSummary: import("./financial-data").PriceTargetSummary | null;
  historicalPrices: import("./financial-data").HistoricalPrice[];
  recentNews: import("./financial-data").StockNews[];
  score: StockScore;
  dcfModel: DCFModel;
  peerComparison: PeerComparison;
  aiAnalysis: AIDeepDive;
}
