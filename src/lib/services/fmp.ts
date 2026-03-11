import {
  CompanyProfileSchema,
  StockQuoteSchema,
  IncomeStatementSchema,
  BalanceSheetSchema,
  CashFlowSchema,
  FinancialRatiosSchema,
  KeyMetricsTTMSchema,
  AnalystRatingSchema,
  PriceTargetSummarySchema,
  HistoricalPriceSchema,
  StockNewsSchema,
  TickerSearchResultSchema,
  AnalystEstimateSchema,
  DCFResultSchema,
  type CompanyProfile,
  type StockQuote,
  type IncomeStatement,
  type BalanceSheet,
  type CashFlow,
  type FinancialRatios,
  type KeyMetricsTTM,
  type AnalystRating,
  type PriceTargetSummary,
  type HistoricalPrice,
  type StockNews,
  type TickerSearchResult,
  type AnalystEstimate,
  type DCFResult,
} from "@/lib/schemas/financial-data";
import { FMPError, RateLimitError } from "@/lib/utils/errors";
import { z } from "zod";

// FMP migrated from /api/v3 to /stable in 2025.
const BASE_URL = "https://financialmodelingprep.com/stable";

class FMPService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FMP_API_KEY!;
    if (!this.apiKey) {
      throw new Error("FMP_API_KEY environment variable is not set");
    }
  }

  private async fetchFMP<T>(
    endpoint: string,
    params: Record<string, string> = {},
    schema?: z.ZodType<T>
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set("apikey", this.apiKey);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        next: { revalidate: 0 },
      });
    } catch (err) {
      throw new FMPError(`Network error calling FMP: ${String(err)}`);
    }

    if (response.status === 429) {
      throw new RateLimitError("FMP API daily limit reached");
    }

    if (!response.ok) {
      throw new FMPError(`FMP API error: ${response.status} ${response.statusText}`, response.status);
    }

    const data = await response.json();

    if (data && typeof data === "object" && "Error Message" in data) {
      throw new FMPError(data["Error Message"] as string);
    }

    if (!schema) return data as T;

    try {
      if (Array.isArray(data)) {
        return z.array(schema).parse(data) as T;
      }
      return schema.parse(data) as T;
    } catch (err) {
      console.warn(`FMP schema validation warning for ${endpoint}:`, err);
      return data as T;
    }
  }

  // ─── Company Data ──────────────────────────────────────────────────────────

  async getCompanyProfile(ticker: string): Promise<CompanyProfile> {
    const data = await this.fetchFMP<Record<string, unknown>[]>(`/profile`, {
      symbol: ticker.toUpperCase(),
    });
    const profiles = Array.isArray(data) ? data : [data];
    if (!profiles.length || !profiles[0]) throw new FMPError(`No profile found for ${ticker}`);

    // Map new field names → old schema field names
    const raw = profiles[0] as Record<string, unknown>;
    const mapped = {
      ...raw,
      mktCap: (raw.marketCap ?? raw.mktCap ?? 0) as number,
      lastDiv: (raw.lastDividend ?? raw.lastDiv ?? 0) as number,
      changes: (raw.change ?? raw.changes ?? 0) as number,
      volAvg: (raw.averageVolume ?? raw.volAvg ?? 0) as number,
      exchangeShortName: (raw.exchangeFullName ?? raw.exchangeShortName ?? raw.exchange ?? "") as string,
    };

    return CompanyProfileSchema.parse(mapped);
  }

  async getStockQuote(ticker: string): Promise<StockQuote> {
    const data = await this.fetchFMP<Record<string, unknown>[]>(`/quote`, {
      symbol: ticker.toUpperCase(),
    });
    const quotes = Array.isArray(data) ? data : [data];
    if (!quotes.length || !quotes[0]) throw new FMPError(`No quote found for ${ticker}`);

    // Map changePercentage → changesPercentage (field renamed in stable API)
    const raw = quotes[0] as Record<string, unknown>;
    const mapped = {
      ...raw,
      changesPercentage: (raw.changePercentage ?? raw.changesPercentage ?? 0) as number,
    };

    return StockQuoteSchema.parse(mapped);
  }

  async searchTicker(query: string, limit = 10): Promise<TickerSearchResult[]> {
    try {
      // /stable/search-symbol works for both ticker and name lookups
      const data = await this.fetchFMP<Record<string, unknown>[]>(`/search-symbol`, {
        query,
        limit: String(limit),
      });
      const results = Array.isArray(data) ? data : [];
      return results
        .map((r) => {
          try {
            const mapped = {
              ...r,
              stockExchange: (r.exchangeFullName ?? r.stockExchange ?? "") as string,
              exchangeShortName: (r.exchange ?? r.exchangeShortName ?? "") as string,
            };
            return TickerSearchResultSchema.parse(mapped);
          } catch { return null; }
        })
        .filter(Boolean) as TickerSearchResult[];
    } catch {
      return [];
    }
  }

  // ─── Financial Statements ──────────────────────────────────────────────────

  async getIncomeStatements(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 5
  ): Promise<IncomeStatement[]> {
    const data = await this.fetchFMP<IncomeStatement[]>(
      `/income-statement`,
      { symbol: ticker.toUpperCase(), period, limit: String(limit) }
    );
    const items = Array.isArray(data) ? data : [];
    return items
      .map((item) => {
        try { return IncomeStatementSchema.parse(item); }
        catch { return null; }
      })
      .filter(Boolean) as IncomeStatement[];
  }

  async getBalanceSheets(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 5
  ): Promise<BalanceSheet[]> {
    const data = await this.fetchFMP<BalanceSheet[]>(
      `/balance-sheet-statement`,
      { symbol: ticker.toUpperCase(), period, limit: String(limit) }
    );
    const items = Array.isArray(data) ? data : [];
    return items
      .map((item) => {
        try { return BalanceSheetSchema.parse(item); }
        catch { return null; }
      })
      .filter(Boolean) as BalanceSheet[];
  }

  async getCashFlows(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 5
  ): Promise<CashFlow[]> {
    const data = await this.fetchFMP<CashFlow[]>(
      `/cash-flow-statement`,
      { symbol: ticker.toUpperCase(), period, limit: String(limit) }
    );
    const items = Array.isArray(data) ? data : [];
    return items
      .map((item) => {
        try { return CashFlowSchema.parse(item); }
        catch { return null; }
      })
      .filter(Boolean) as CashFlow[];
  }

  // ─── Ratios & Metrics ──────────────────────────────────────────────────────

  async getFinancialRatios(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 1
  ): Promise<FinancialRatios[]> {
    const data = await this.fetchFMP<FinancialRatios[]>(
      `/ratios`,
      { symbol: ticker.toUpperCase(), period, limit: String(limit) }
    );
    const items = Array.isArray(data) ? data : [];
    return items
      .map((item) => {
        try { return FinancialRatiosSchema.parse(item); }
        catch { return null; }
      })
      .filter(Boolean) as FinancialRatios[];
  }

  async getKeyMetricsTTM(ticker: string): Promise<KeyMetricsTTM> {
    const data = await this.fetchFMP<KeyMetricsTTM[]>(
      `/key-metrics-ttm`,
      { symbol: ticker.toUpperCase() }
    );
    const items = Array.isArray(data) ? data : [data];
    if (!items.length) return {} as KeyMetricsTTM;
    try { return KeyMetricsTTMSchema.parse(items[0]); }
    catch { return items[0] as KeyMetricsTTM; }
  }

  // ─── Valuation ────────────────────────────────────────────────────────────

  async getDCF(ticker: string): Promise<DCFResult> {
    const data = await this.fetchFMP<Record<string, unknown>[]>(
      `/discounted-cash-flow`,
      { symbol: ticker.toUpperCase() }
    );
    // Stable API returns an array; extract first element
    const arr = Array.isArray(data) ? data : [data];
    if (!arr.length || !arr[0]) return { symbol: ticker, date: "", dcf: 0, Stock_Price: 0 } as DCFResult;

    const raw = arr[0] as Record<string, unknown>;
    // "Stock Price" (with space) in response → Stock_Price in schema
    const mapped = {
      ...raw,
      Stock_Price: (raw["Stock Price"] ?? raw.Stock_Price ?? 0) as number,
    };

    try { return DCFResultSchema.parse(mapped); }
    catch { return mapped as DCFResult; }
  }

  // ─── Analyst Data ──────────────────────────────────────────────────────────

  async getAnalystRating(ticker: string): Promise<AnalystRating | null> {
    try {
      const data = await this.fetchFMP<Record<string, unknown>[]>(
        `/ratings-snapshot`,
        { symbol: ticker.toUpperCase() }
      );
      const items = Array.isArray(data) ? data : [data];
      if (!items.length || !items[0]) return null;

      const raw = items[0] as Record<string, unknown>;

      // Map numeric score (1–5) to recommendation label
      const scoreToRec = (score: number): string => {
        if (score >= 5) return "Strong Buy";
        if (score >= 4) return "Buy";
        if (score >= 3) return "Neutral";
        if (score >= 2) return "Sell";
        return "Strong Sell";
      };

      const mapped = {
        symbol: raw.symbol as string,
        date: (raw.date ?? new Date().toISOString()) as string,
        rating: (raw.rating ?? "") as string,
        ratingScore: (raw.overallScore ?? 0) as number,
        ratingRecommendation: scoreToRec((raw.overallScore as number) ?? 0),
        ratingDetailsDCFScore: (raw.discountedCashFlowScore ?? 0) as number,
        ratingDetailsDCFRecommendation: scoreToRec((raw.discountedCashFlowScore as number) ?? 0),
        ratingDetailsROEScore: (raw.returnOnEquityScore ?? 0) as number,
        ratingDetailsROERecommendation: scoreToRec((raw.returnOnEquityScore as number) ?? 0),
        ratingDetailsROAScore: (raw.returnOnAssetsScore ?? 0) as number,
        ratingDetailsROARecommendation: scoreToRec((raw.returnOnAssetsScore as number) ?? 0),
        ratingDetailsDEScore: (raw.debtToEquityScore ?? 0) as number,
        ratingDetailsDERecommendation: scoreToRec((raw.debtToEquityScore as number) ?? 0),
        ratingDetailsPEScore: (raw.priceToEarningsScore ?? 0) as number,
        ratingDetailsPERecommendation: scoreToRec((raw.priceToEarningsScore as number) ?? 0),
        ratingDetailsPBScore: (raw.priceToBookScore ?? 0) as number,
        ratingDetailsPBRecommendation: scoreToRec((raw.priceToBookScore as number) ?? 0),
      };

      return AnalystRatingSchema.parse(mapped);
    } catch {
      return null;
    }
  }

  async getPriceTargetSummary(ticker: string): Promise<PriceTargetSummary | null> {
    try {
      // /stable/price-target-consensus returns targetHigh/Low/Consensus/Median directly
      const data = await this.fetchFMP<PriceTargetSummary[]>(
        `/price-target-consensus`,
        { symbol: ticker.toUpperCase() }
      );
      const items = Array.isArray(data) ? data : [data];
      if (!items.length || !items[0]) return null;
      return PriceTargetSummarySchema.parse(items[0]);
    } catch {
      return null;
    }
  }

  async getAnalystEstimates(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 3
  ): Promise<AnalystEstimate[]> {
    try {
      const data = await this.fetchFMP<Record<string, unknown>[]>(
        `/analyst-estimates`,
        { symbol: ticker.toUpperCase(), period, limit: String(limit) }
      );
      const items = Array.isArray(data) ? data : [];
      return items
        .map((item) => {
          try {
            // Stable API dropped the "estimated" prefix from field names
            const raw = item as Record<string, unknown>;
            const mapped = {
              symbol: raw.symbol,
              date: raw.date,
              estimatedRevenueLow: raw.estimatedRevenueLow ?? raw.revenueLow ?? 0,
              estimatedRevenueHigh: raw.estimatedRevenueHigh ?? raw.revenueHigh ?? 0,
              estimatedRevenueAvg: raw.estimatedRevenueAvg ?? raw.revenueAvg ?? 0,
              estimatedEbitdaLow: raw.estimatedEbitdaLow ?? raw.ebitdaLow ?? 0,
              estimatedEbitdaHigh: raw.estimatedEbitdaHigh ?? raw.ebitdaHigh ?? 0,
              estimatedEbitdaAvg: raw.estimatedEbitdaAvg ?? raw.ebitdaAvg ?? 0,
              estimatedEbitLow: raw.estimatedEbitLow ?? raw.ebitLow ?? 0,
              estimatedEbitHigh: raw.estimatedEbitHigh ?? raw.ebitHigh ?? 0,
              estimatedEbitAvg: raw.estimatedEbitAvg ?? raw.ebitAvg ?? 0,
              estimatedNetIncomeLow: raw.estimatedNetIncomeLow ?? raw.netIncomeLow ?? 0,
              estimatedNetIncomeHigh: raw.estimatedNetIncomeHigh ?? raw.netIncomeHigh ?? 0,
              estimatedNetIncomeAvg: raw.estimatedNetIncomeAvg ?? raw.netIncomeAvg ?? 0,
              estimatedSgaExpenseLow: raw.estimatedSgaExpenseLow ?? raw.sgaExpenseLow ?? 0,
              estimatedSgaExpenseHigh: raw.estimatedSgaExpenseHigh ?? raw.sgaExpenseHigh ?? 0,
              estimatedSgaExpenseAvg: raw.estimatedSgaExpenseAvg ?? raw.sgaExpenseAvg ?? 0,
              estimatedEpsLow: raw.estimatedEpsLow ?? raw.epsLow ?? 0,
              estimatedEpsHigh: raw.estimatedEpsHigh ?? raw.epsHigh ?? 0,
              estimatedEpsAvg: raw.estimatedEpsAvg ?? raw.epsAvg ?? 0,
              numberAnalystEstimatedRevenue: raw.numberAnalystEstimatedRevenue ?? 0,
              numberAnalystsEstimatedEps: raw.numberAnalystsEstimatedEps ?? 0,
            };
            return AnalystEstimateSchema.parse(mapped);
          } catch { return null; }
        })
        .filter(Boolean) as AnalystEstimate[];
    } catch {
      return [];
    }
  }

  // ─── Price Data ────────────────────────────────────────────────────────────

  async getHistoricalPrices(
    ticker: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const toDate = to || new Date().toISOString().split("T")[0];
    const fromDate =
      from ||
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    // Stable API uses flat array endpoint; returns { symbol, date, price, volume }
    const data = await this.fetchFMP<Record<string, unknown>[]>(
      `/historical-price-eod/light`,
      { symbol: ticker.toUpperCase(), from: fromDate, to: toDate }
    );

    const items = Array.isArray(data) ? data : [];
    return items
      .map((item) => {
        try {
          const raw = item as Record<string, unknown>;
          // Map `price` (close equivalent) to `close` for schema compatibility
          const mapped = {
            date: raw.date,
            close: raw.close ?? raw.price ?? 0,
            open: raw.open ?? raw.price ?? 0,
            high: raw.high ?? raw.price ?? 0,
            low: raw.low ?? raw.price ?? 0,
            adjClose: raw.adjClose ?? raw.price ?? 0,
            volume: raw.volume ?? 0,
            unadjustedVolume: raw.unadjustedVolume ?? raw.volume ?? 0,
            change: raw.change ?? 0,
            changePercent: raw.changePercent ?? 0,
          };
          return HistoricalPriceSchema.parse(mapped);
        } catch { return null; }
      })
      .filter(Boolean) as HistoricalPrice[];
  }

  // ─── News ──────────────────────────────────────────────────────────────────

  async getStockNews(_ticker: string, _limit = 10): Promise<StockNews[]> {
    // Stock news requires a higher subscription tier in the stable API.
    // Return empty array gracefully; the report still works without news.
    return [];
  }

  // ─── Peers ────────────────────────────────────────────────────────────────

  async getStockPeers(ticker: string): Promise<string[]> {
    try {
      const data = await this.fetchFMP<Record<string, unknown>[]>(
        `/stock-peers`,
        { symbol: ticker.toUpperCase() }
      );
      if (Array.isArray(data) && data.length > 0) {
        // Stable API returns peer objects directly (not wrapped in peersList)
        return (data as Record<string, unknown>[])
          .map((p) => p.symbol as string)
          .filter(Boolean)
          .slice(0, 5);
      }
      return [];
    } catch {
      return [];
    }
  }
}

// Singleton instance
let fmpInstance: FMPService | null = null;

export function getFMPService(): FMPService {
  if (!fmpInstance) {
    fmpInstance = new FMPService();
  }
  return fmpInstance;
}

export { FMPService };
