import type { KeyMetricsTTM, FinancialRatios, CompanyProfile, CashFlow, IncomeStatement, BalanceSheet } from "@/lib/schemas/financial-data";
import type { StockScore, DCFModel, PeerData, PeerComparison } from "@/lib/schemas/report";
import {
  DEFAULT_SCORING_WEIGHTS,
  SECTOR_WACC,
  DEFAULT_TERMINAL_GROWTH_RATE,
  DCF_PROJECTION_YEARS,
  SECTOR_PE_AVERAGES,
  SECTOR_EV_EBITDA_AVERAGES,
} from "@/lib/constants/financial";

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

function scoreFromRatio(value: number | null, low: number, high: number, invert = false): number {
  if (value == null || !isFinite(value)) return 50;
  const normalized = (value - low) / (high - low);
  const score = invert ? 1 - normalized : normalized;
  return clamp(score * 100);
}

export function calculateScore(
  keyMetrics: KeyMetricsTTM,
  ratios: FinancialRatios | null,
  profile: CompanyProfile,
  weights = DEFAULT_SCORING_WEIGHTS
): StockScore {
  const sector = profile.sector || "DEFAULT";

  // ── Valuation Score ────────────────────────────────────────────────────────
  const sectorPE = SECTOR_PE_AVERAGES[sector] ?? SECTOR_PE_AVERAGES.DEFAULT;
  const sectorEVEBITDA = SECTOR_EV_EBITDA_AVERAGES[sector] ?? SECTOR_EV_EBITDA_AVERAGES.DEFAULT;
  const peRatio = keyMetrics.peRatioTTM ?? ratios?.peRatio ?? null;
  const evEbitda = keyMetrics.enterpriseValueOverEBITDATTM ?? keyMetrics.evToEbitdaTTM ?? null;
  const pbRatio = keyMetrics.pbRatioTTM ?? ratios?.priceToBookRatio ?? null;

  const peScore = scoreFromRatio(peRatio, sectorPE * 0.5, sectorPE * 2.5, true);
  const evScore = scoreFromRatio(evEbitda, sectorEVEBITDA * 0.5, sectorEVEBITDA * 2.5, true);
  const pbScore = scoreFromRatio(pbRatio, 0.5, 8, true);

  const valuationScore = clamp((peScore * 0.4 + evScore * 0.4 + pbScore * 0.2));
  const valuationLabel =
    valuationScore >= 70 ? "Undervalued" : valuationScore >= 40 ? "Fair Value" : "Overvalued";

  // ── Profitability Score ────────────────────────────────────────────────────
  const grossMargin = ratios?.grossProfitMargin ?? null;
  const opMargin = ratios?.operatingProfitMargin ?? null;
  const netMargin = ratios?.netProfitMargin ?? null;
  const roe = keyMetrics.roeTTM ?? keyMetrics.returnOnEquityTTM ?? ratios?.returnOnEquity ?? null;

  const grossScore = scoreFromRatio(grossMargin != null ? grossMargin * 100 : null, 10, 80);
  const opScore = scoreFromRatio(opMargin != null ? opMargin * 100 : null, 0, 40);
  const netScore = scoreFromRatio(netMargin != null ? netMargin * 100 : null, 0, 30);
  const roeScore = scoreFromRatio(roe != null ? roe * 100 : null, 5, 35);

  const profitabilityScore = clamp((grossScore * 0.25 + opScore * 0.3 + netScore * 0.25 + roeScore * 0.2));
  const profitabilityLabel =
    profitabilityScore >= 70 ? "Strong" : profitabilityScore >= 40 ? "Moderate" : "Weak";

  // ── Growth Score ──────────────────────────────────────────────────────────
  const revenueGrowth = null; // Would need historical data; set neutral
  const fcfGrowth = null;
  const growthScore = 50; // Neutral default without historical comparison
  const growthLabel = "Moderate";

  // ── Financial Health Score ────────────────────────────────────────────────
  const currentRatio = keyMetrics.currentRatioTTM ?? ratios?.currentRatio ?? null;
  const debtEquity = keyMetrics.debtToEquityTTM ?? ratios?.debtEquityRatio ?? null;
  const netDebtEbitda = keyMetrics.netDebtToEBITDATTM ?? null;
  const interestCoverage = keyMetrics.interestCoverageTTM ?? ratios?.interestCoverage ?? null;

  const currentScore = scoreFromRatio(currentRatio, 0.5, 3.5);
  const debtScore = scoreFromRatio(debtEquity, 0, 3, true);
  const ndEbitdaScore = scoreFromRatio(netDebtEbitda, -1, 6, true);
  const intCovScore = scoreFromRatio(interestCoverage, 1, 20);

  const healthScore = clamp((currentScore * 0.25 + debtScore * 0.35 + ndEbitdaScore * 0.25 + intCovScore * 0.15));
  const healthLabel = healthScore >= 70 ? "Strong" : healthScore >= 40 ? "Moderate" : "Weak";

  // ── Momentum Score ────────────────────────────────────────────────────────
  const dividendYield = keyMetrics.dividendYieldTTM ?? null;
  const fcfYield = keyMetrics.freeCashFlowYieldTTM ?? null;

  const dyScore = scoreFromRatio(dividendYield != null ? dividendYield * 100 : null, 0, 5);
  const fcfYieldScore = scoreFromRatio(fcfYield != null ? fcfYield * 100 : null, 0, 8);
  const momentumScore = clamp((dyScore * 0.3 + fcfYieldScore * 0.3 + 50 * 0.4)); // 40% is neutral (no price momentum data here)
  const momentumLabel = momentumScore >= 70 ? "Strong" : momentumScore >= 40 ? "Moderate" : "Weak";

  // ── Overall Score ──────────────────────────────────────────────────────────
  const overall = clamp(
    valuationScore * weights.valuation +
      profitabilityScore * weights.profitability +
      growthScore * weights.growth +
      healthScore * weights.financialHealth +
      momentumScore * weights.momentum
  );
  const overallLabel = overall >= 70 ? "Strong" : overall >= 55 ? "Good" : overall >= 40 ? "Moderate" : "Weak";

  return {
    overall: Math.round(overall),
    overallLabel,
    categories: {
      valuation: {
        score: Math.round(valuationScore),
        label: valuationLabel,
        factors: [
          {
            name: "P/E Ratio",
            value: peRatio,
            benchmark: sectorPE,
            score: Math.round(peScore),
            signal: peScore >= 60 ? "positive" : peScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "EV/EBITDA",
            value: evEbitda,
            benchmark: sectorEVEBITDA,
            score: Math.round(evScore),
            signal: evScore >= 60 ? "positive" : evScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Price/Book",
            value: pbRatio,
            benchmark: 3,
            score: Math.round(pbScore),
            signal: pbScore >= 60 ? "positive" : pbScore >= 35 ? "neutral" : "negative",
          },
        ],
      },
      profitability: {
        score: Math.round(profitabilityScore),
        label: profitabilityLabel,
        factors: [
          {
            name: "Gross Margin",
            value: grossMargin != null ? grossMargin * 100 : null,
            benchmark: 40,
            score: Math.round(grossScore),
            signal: grossScore >= 60 ? "positive" : grossScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Operating Margin",
            value: opMargin != null ? opMargin * 100 : null,
            benchmark: 15,
            score: Math.round(opScore),
            signal: opScore >= 60 ? "positive" : opScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Net Margin",
            value: netMargin != null ? netMargin * 100 : null,
            benchmark: 10,
            score: Math.round(netScore),
            signal: netScore >= 60 ? "positive" : netScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Return on Equity",
            value: roe != null ? roe * 100 : null,
            benchmark: 15,
            score: Math.round(roeScore),
            signal: roeScore >= 60 ? "positive" : roeScore >= 35 ? "neutral" : "negative",
          },
        ],
      },
      growth: {
        score: Math.round(growthScore),
        label: growthLabel,
        factors: [],
      },
      financialHealth: {
        score: Math.round(healthScore),
        label: healthLabel,
        factors: [
          {
            name: "Current Ratio",
            value: currentRatio,
            benchmark: 1.5,
            score: Math.round(currentScore),
            signal: currentScore >= 60 ? "positive" : currentScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Debt/Equity",
            value: debtEquity,
            benchmark: 1.5,
            score: Math.round(debtScore),
            signal: debtScore >= 60 ? "positive" : debtScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "Net Debt/EBITDA",
            value: netDebtEbitda,
            benchmark: 2,
            score: Math.round(ndEbitdaScore),
            signal: ndEbitdaScore >= 60 ? "positive" : ndEbitdaScore >= 35 ? "neutral" : "negative",
          },
        ],
      },
      momentum: {
        score: Math.round(momentumScore),
        label: momentumLabel,
        factors: [
          {
            name: "Dividend Yield",
            value: dividendYield != null ? dividendYield * 100 : null,
            benchmark: 2,
            score: Math.round(dyScore),
            signal: dyScore >= 60 ? "positive" : dyScore >= 35 ? "neutral" : "negative",
          },
          {
            name: "FCF Yield",
            value: fcfYield != null ? fcfYield * 100 : null,
            benchmark: 4,
            score: Math.round(fcfYieldScore),
            signal: fcfYieldScore >= 60 ? "positive" : fcfYieldScore >= 35 ? "neutral" : "negative",
          },
        ],
      },
    },
    weights,
  };
}

// ─── DCF Calculator ───────────────────────────────────────────────────────────

export function calculateDCF(params: {
  cashFlows: CashFlow[];
  incomeStatements: IncomeStatement[];
  balanceSheet: BalanceSheet | null;
  sector: string;
  currentPrice: number;
  sharesOutstanding: number;
}): DCFModel {
  const { cashFlows, incomeStatements, balanceSheet, sector, currentPrice, sharesOutstanding } = params;

  const wacc = (SECTOR_WACC[sector] ?? SECTOR_WACC.DEFAULT) / 100;
  const terminalGrowthRate = DEFAULT_TERMINAL_GROWTH_RATE / 100;

  // Get historical FCFs (last 3-5 years)
  const historicalFCFs = cashFlows
    .slice(0, 5)
    .map((cf) => cf.freeCashFlow)
    .filter((v) => v !== 0 && isFinite(v));

  if (historicalFCFs.length === 0) {
    // Fallback: estimate FCF from net income
    const netIncomes = incomeStatements
      .slice(0, 3)
      .map((is) => is.netIncome)
      .filter((v) => v !== 0 && isFinite(v));
    if (netIncomes.length > 0) {
      historicalFCFs.push(...netIncomes.map((ni) => ni * 0.85));
    }
  }

  if (historicalFCFs.length === 0) {
    // Cannot calculate DCF without FCF data
    return {
      currentPrice,
      intrinsicValue: 0,
      upside: 0,
      wacc: wacc * 100,
      terminalGrowthRate: terminalGrowthRate * 100,
      projectedFCFs: [],
      terminalValue: 0,
      enterpriseValue: 0,
      equityValue: 0,
      sharesOutstanding,
      netDebt: 0,
      sensitivityMatrix: [],
    };
  }

  // Average FCF growth rate
  let fcfGrowthRate = 0.08; // Default 8%
  if (historicalFCFs.length >= 2) {
    const growth =
      (historicalFCFs[0] / historicalFCFs[historicalFCFs.length - 1]) **
        (1 / (historicalFCFs.length - 1)) - 1;
    fcfGrowthRate = isFinite(growth) && growth > -0.5 && growth < 0.5 ? growth : 0.08;
  }

  // Use most recent FCF as base
  const baseFCF = historicalFCFs[0];

  // Project FCFs for 5 years
  const projectedFCFs: { year: number; fcf: number }[] = [];
  for (let i = 1; i <= DCF_PROJECTION_YEARS; i++) {
    const fcf = baseFCF * Math.pow(1 + fcfGrowthRate, i);
    projectedFCFs.push({ year: new Date().getFullYear() + i, fcf });
  }

  // Calculate terminal value
  const lastFCF = projectedFCFs[projectedFCFs.length - 1].fcf;
  const terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);

  // Discount all cash flows to present value
  const pvFCFs = projectedFCFs.reduce((sum, { fcf }, i) => {
    return sum + fcf / Math.pow(1 + wacc, i + 1);
  }, 0);
  const pvTerminal = terminalValue / Math.pow(1 + wacc, DCF_PROJECTION_YEARS);

  const enterpriseValue = pvFCFs + pvTerminal;
  const netDebt = balanceSheet?.netDebt ?? 0;
  const equityValue = Math.max(0, enterpriseValue - netDebt);
  const intrinsicValue = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;
  const upside = currentPrice > 0 ? ((intrinsicValue - currentPrice) / currentPrice) * 100 : 0;

  // Sensitivity matrix: WACC ± 1%, terminal growth ± 0.5%
  const sensitivityMatrix = [];
  for (const waccDelta of [-0.01, 0, 0.01]) {
    for (const tgDelta of [-0.005, 0, 0.005]) {
      const w = wacc + waccDelta;
      const tg = terminalGrowthRate + tgDelta;
      if (w <= tg) continue;
      const tv = (lastFCF * (1 + tg)) / (w - tg);
      const pvT = tv / Math.pow(1 + w, DCF_PROJECTION_YEARS);
      const pvF = projectedFCFs.reduce((s, { fcf }, i) => s + fcf / Math.pow(1 + w, i + 1), 0);
      const ev = pvF + pvT;
      const eq = Math.max(0, ev - netDebt);
      const iv = sharesOutstanding > 0 ? eq / sharesOutstanding : 0;
      sensitivityMatrix.push({
        wacc: Math.round((w + Number.EPSILON) * 1000) / 10,
        terminalGrowth: Math.round((tg + Number.EPSILON) * 1000) / 10,
        value: Math.round(iv * 100) / 100,
      });
    }
  }

  return {
    currentPrice,
    intrinsicValue: Math.round(intrinsicValue * 100) / 100,
    upside: Math.round(upside * 10) / 10,
    wacc: Math.round(wacc * 1000) / 10,
    terminalGrowthRate: Math.round(terminalGrowthRate * 1000) / 10,
    projectedFCFs,
    terminalValue,
    enterpriseValue,
    equityValue,
    sharesOutstanding,
    netDebt,
    sensitivityMatrix,
  };
}

// ─── Growth Rate Calculator ───────────────────────────────────────────────────

export function calculateGrowthRates(statements: IncomeStatement[]): {
  revenueCAGR: number | null;
  epsCAGR: number | null;
  revenueYoY: number | null;
} {
  if (statements.length < 2) return { revenueCAGR: null, epsCAGR: null, revenueYoY: null };

  const latest = statements[0];
  const prior = statements[1];
  const oldest = statements[statements.length - 1];
  const years = statements.length - 1;

  const revenueYoY =
    prior.revenue > 0 ? ((latest.revenue - prior.revenue) / prior.revenue) * 100 : null;

  const revenueCAGR =
    oldest.revenue > 0 && years > 0
      ? ((Math.pow(latest.revenue / oldest.revenue, 1 / years) - 1) * 100)
      : null;

  const epsCAGR =
    oldest.epsdiluted !== 0 && latest.epsdiluted !== 0 && years > 0
      ? ((Math.pow(latest.epsdiluted / oldest.epsdiluted, 1 / years) - 1) * 100)
      : null;

  return {
    revenueCAGR: revenueCAGR !== null ? Math.round(revenueCAGR * 10) / 10 : null,
    epsCAGR: epsCAGR !== null ? Math.round(epsCAGR * 10) / 10 : null,
    revenueYoY: revenueYoY !== null ? Math.round(revenueYoY * 10) / 10 : null,
  };
}

// ─── Build Peer Comparison Data ───────────────────────────────────────────────

export function buildPeerDataFromMetrics(
  ticker: string,
  companyName: string,
  profile: CompanyProfile,
  keyMetrics: KeyMetricsTTM,
  ratios: FinancialRatios | null,
  quote: { price: number }
): PeerData {
  return {
    ticker,
    companyName,
    marketCap: profile.mktCap ?? null,
    pe: keyMetrics.peRatioTTM ?? ratios?.peRatio ?? null,
    evEbitda: keyMetrics.enterpriseValueOverEBITDATTM ?? keyMetrics.evToEbitdaTTM ?? null,
    revenueGrowth: null, // Requires historical comparison
    grossMargin: ratios?.grossProfitMargin != null ? ratios.grossProfitMargin * 100 : null,
    operatingMargin: ratios?.operatingProfitMargin != null ? ratios.operatingProfitMargin * 100 : null,
    netMargin: ratios?.netProfitMargin != null ? ratios.netProfitMargin * 100 : null,
    roe: keyMetrics.roeTTM != null ? keyMetrics.roeTTM * 100 : (ratios?.returnOnEquity != null ? ratios.returnOnEquity * 100 : null),
    debtToEbitda: keyMetrics.netDebtToEBITDATTM ?? null,
    price: quote.price,
  };
}

export function computeMedians(peers: PeerData[]): Partial<PeerData> {
  function median(values: (number | null)[]): number | null {
    const valid = values.filter((v): v is number => v !== null && isFinite(v));
    if (!valid.length) return null;
    valid.sort((a, b) => a - b);
    const mid = Math.floor(valid.length / 2);
    return valid.length % 2 === 0 ? (valid[mid - 1] + valid[mid]) / 2 : valid[mid];
  }

  return {
    ticker: "Median",
    companyName: "Peer Median",
    marketCap: median(peers.map((p) => p.marketCap)),
    pe: median(peers.map((p) => p.pe)),
    evEbitda: median(peers.map((p) => p.evEbitda)),
    grossMargin: median(peers.map((p) => p.grossMargin)),
    operatingMargin: median(peers.map((p) => p.operatingMargin)),
    netMargin: median(peers.map((p) => p.netMargin)),
    roe: median(peers.map((p) => p.roe)),
    debtToEbitda: median(peers.map((p) => p.debtToEbitda)),
    price: null,
    revenueGrowth: null,
  };
}
