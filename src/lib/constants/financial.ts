/**
 * Default financial modeling constants
 */

// Default WACC by sector (%)
export const SECTOR_WACC: Record<string, number> = {
  Technology: 9.5,
  "Health Care": 8.5,
  Financials: 10.0,
  "Consumer Discretionary": 9.0,
  "Consumer Staples": 7.5,
  Energy: 10.5,
  Industrials: 8.5,
  Materials: 9.0,
  Utilities: 7.0,
  "Real Estate": 8.0,
  "Communication Services": 9.0,
  DEFAULT: 9.0,
};

// Default terminal growth rate (%)
export const DEFAULT_TERMINAL_GROWTH_RATE = 2.5;

// DCF projection years
export const DCF_PROJECTION_YEARS = 5;

// Report cache TTL
export const CACHE_TTL = {
  SNAPSHOT_MINUTES: 15,
  DEEP_DIVE_HOURS: 4,
};

// Scoring weights (must sum to 1.0)
export const DEFAULT_SCORING_WEIGHTS = {
  valuation: 0.25,
  profitability: 0.25,
  growth: 0.20,
  financialHealth: 0.15,
  momentum: 0.15,
};

// Sector average P/E ratios for benchmarking
export const SECTOR_PE_AVERAGES: Record<string, number> = {
  Technology: 28,
  "Health Care": 22,
  Financials: 12,
  "Consumer Discretionary": 25,
  "Consumer Staples": 20,
  Energy: 14,
  Industrials: 20,
  Materials: 16,
  Utilities: 18,
  "Real Estate": 30,
  "Communication Services": 22,
  DEFAULT: 20,
};

// Sector average EV/EBITDA ratios
export const SECTOR_EV_EBITDA_AVERAGES: Record<string, number> = {
  Technology: 20,
  "Health Care": 16,
  Financials: 10,
  "Consumer Discretionary": 14,
  "Consumer Staples": 13,
  Energy: 7,
  Industrials: 13,
  Materials: 10,
  Utilities: 11,
  "Real Estate": 18,
  "Communication Services": 14,
  DEFAULT: 13,
};

// Max peers to fetch for peer comparison
export const MAX_PEERS = 5;

// S&P 500 credit limit warning threshold
export const FMP_DAILY_CALLS_WARNING = 200;
