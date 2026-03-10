/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with T/B/M/K suffixes
 * e.g., 2500000000000 → "$2.50T"
 */
export function formatLargeNumber(value: number | null | undefined, prefix = "$"): string {
  if (value == null || isNaN(value)) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e12) return `${sign}${prefix}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${prefix}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${prefix}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${prefix}${(abs / 1e3).toFixed(2)}K`;
  return `${sign}${prefix}${abs.toFixed(2)}`;
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null || isNaN(value)) return "N/A";
  // If value is already in percent form (e.g. 0.25 = 25%), multiply by 100
  // If value is already like 25.3, keep as is
  const pct = Math.abs(value) < 5 && Math.abs(value) > 0 ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Format raw percentage (pass 0.253 → "25.3%")
 */
export function formatRawPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null || isNaN(value)) return "N/A";
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a ratio (e.g. P/E, EV/EBITDA)
 */
export function formatRatio(value: number | null | undefined, decimals = 1): string {
  if (value == null || isNaN(value) || !isFinite(value)) return "N/A";
  return `${value.toFixed(decimals)}x`;
}

/**
 * Format a date string to human-readable
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format price change with sign and color indicator
 */
export function formatChange(value: number | null | undefined): {
  text: string;
  isPositive: boolean;
  isNeutral: boolean;
} {
  if (value == null || isNaN(value)) {
    return { text: "N/A", isPositive: false, isNeutral: true };
  }
  const isPositive = value >= 0;
  const text = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;
  return { text, isPositive, isNeutral: value === 0 };
}

/**
 * Format number with commas
 */
export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Abbreviate company name if too long
 */
export function abbreviateCompanyName(name: string, maxLength = 30): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
}
