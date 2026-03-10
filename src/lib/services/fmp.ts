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

const BASE_URL = "https://financialmodelingprep.com/api";

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
        next: { revalidate: 0 }, // No caching at fetch level; we handle this in our cache service
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

    // FMP sometimes returns error objects
    if (data && typeof data === "object" && "Error Message" in data) {
      throw new FMPError(data["Error Message"] as string);
    }

    if (!schema) return data as T;

    // Try to validate; if it fails, return raw data with a warning
    try {
      if (Array.isArray(data)) {
        return z.array(schema).parse(data) as T;
      }
      return schema.parse(data) as T;
    } catch (err) {
      console.warn(`FMP schema validation warning for ${endpoint}:`, err);
      return data as T; // Return raw data if validation fails
    }
  }

  // ─── Company Data ──────────────────────────────────────────────────────────

  async getCompanyProfile(ticker: string): Promise<CompanyProfile> {
    const data = await this.fetchFMP<CompanyProfile[]>(
      `/v3/profile/${ticker.toUpperCase()}`
    );
    const profiles = Array.isArray(data) ? data : [data];
    if (!profiles.length) throw new FMPError(`No profile found for ${ticker}`);
    return CompanyProfileSchema.parse(profiles[0]);
  }

  async getStockQuote(ticker: string): Promise<StockQuote> {
    const data = await this.fetchFMP<StockQuote[]>(
      `/v3/quote/${ticker.toUpperCase()}`
    );
    const quotes = Array.isArray(data) ? data : [data];
    if (!quotes.length) throw new FMPError(`No quote found for ${ticker}`);
    return StockQuoteSchema.parse(quotes[0]);
  }

  async searchTicker(query: string, limit = 10): Promise<TickerSearchResult[]> {
    const data = await this.fetchFMP<TickerSearchResult[]>(
      `/v3/search`,
      { query, limit: String(limit), exchange: "NASDAQ,NYSE" }
    );
    const results = Array.isArray(data) ? data : [];
    return results
      .map((r) => {
        try { return TickerSearchResultSchema.parse(r); }
        catch { return null; }
      })
      .filter(Boolean) as TickerSearchResult[];
  }

  // ─── Financial Statements ──────────────────────────────────────────────────

  async getIncomeStatements(
    ticker: string,
    period: "annual" | "quarter" = "annual",
    limit = 5
  ): Promise<IncomeStatement[]> {
    const data = await this.fetchFMP<IncomeStatement[]>(
      `/v3/income-statement/${ticker.toUpperCase()}`,
      { period, limit: String(limit) }
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
      `/v3/balance-sheet-statement/${ticker.toUpperCase()}`,
      { period, limit: String(limit) }
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
      `/v3/cash-flow-statement/${ticker.toUpperCase()}`,
      { period, limit: String(limit) }
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
      `/v3/ratios/${ticker.toUpperCase()}`,
      { period, limit: String(limit) }
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
      `/v3/key-metrics-ttm/${ticker.toUpperCase()}`
    );
    const items = Array.isArray(data) ? data : [data];
    if (!items.length) return {} as KeyMetricsTTM;
    try { return KeyMetricsTTMSchema.parse(items[0]); }
    catch { return items[0] as KeyMetricsTTM; }
  }

  // ─── Valuation ────────────────────────────────────────────────────────────

  async getDCF(ticker: string): Promise<DCFResult> {
    const data = await this.fetchFMP<DCFResult>(
      `/v3/discounted-cash-flow/${ticker.toUpperCase()}`
    );
    try { return DCFResultSchema.parse(data); }
    catch { return data as DCFResult; }
  }

  // ─── Analyst Data ──────────────────────────────────────────────────────────

  async getAnalystRating(ticker: string): Promise<AnalystRating | null> {
    try {
      const data = await this.fetchFMP<AnalystRating[]>(
        `/v3/rating/${ticker.toUpperCase()}`
      );
      const items = Array.isArray(data) ? data : [data];
      if (!items.length) return null;
      return AnalystRatingSchema.parse(items[0]);
    } catch {
      return null;
    }
  }

  async getPriceTargetSummary(ticker: string): Promise<PriceTargetSummary | null> {
    try {
      const data = await this.fetchFMP<PriceTargetSummary>(
        `/v4/price-target-summary`,
        { symbol: ticker.toUpperCase() }
      );
      return PriceTargetSummarySchema.parse(data);
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
      const data = await this.fetchFMP<AnalystEstimate[]>(
        `/v3/analyst-estimates/${ticker.toUpperCase()}`,
        { period, limit: String(limit) }
      );
      const items = Array.isArray(data) ? data : [];
      return items
        .map((item) => {
          try { return AnalystEstimateSchema.parse(item); }
          catch { return null; }
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
    // Default: last 1 year
    const toDate = to || new Date().toISOString().split("T")[0];
    const fromDate =
      from ||
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const data = await this.fetchFMP<{ historical: HistoricalPrice[] }>(
      `/v3/historical-price-full/${ticker.toUpperCase()}`,
      { from: fromDate, to: toDate }
    );

    const historical = data?.historical || [];
    return historical
      .map((item) => {
        try { return HistoricalPriceSchema.parse(item); }
        catch { return null; }
      })
      .filter(Boolean) as HistoricalPrice[];
  }

  // ─── News ──────────────────────────────────────────────────────────────────

  async getStockNews(ticker: string, limit = 10): Promise<StockNews[]> {
    try {
      const data = await this.fetchFMP<StockNews[]>(
        `/v3/stock_news`,
        { tickers: ticker.toUpperCase(), limit: String(limit) }
      );
      const items = Array.isArray(data) ? data : [];
      return items
        .map((item) => {
          try { return StockNewsSchema.parse(item); }
          catch { return null; }
        })
        .filter(Boolean) as StockNews[];
    } catch {
      return [];
    }
  }

  // ─── Peers ────────────────────────────────────────────────────────────────

  async getStockPeers(ticker: string): Promise<string[]> {
    try {
      const data = await this.fetchFMP<{ symbol: string; peersList: string[] }[]>(
        `/v4/stock_peers`,
        { symbol: ticker.toUpperCase() }
      );
      if (Array.isArray(data) && data.length > 0) {
        return (data[0].peersList || []).slice(0, 5);
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
