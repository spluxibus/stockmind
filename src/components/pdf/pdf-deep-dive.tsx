import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  coverSub: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 3,
  },
  coverBadge: {
    backgroundColor: "#f3f4f6",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginTop: 14,
  },
  coverBadgeText: {
    fontSize: 10,
    color: "#374151",
    fontFamily: "Helvetica-Bold",
  },
  coverMeta: {
    marginTop: 36,
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 7,
    marginTop: 0,
    paddingBottom: 4,
    borderBottom: "0.5pt solid #e5e7eb",
  },
  subLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 3,
    marginTop: 9,
  },
  text: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: "#374151",
  },
  twoCol: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  ratingBox: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  caseBox: {
    flex: 1,
    padding: 7,
    borderRadius: 5,
    borderLeft: "3pt solid",
  },
  caseLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  riskCard: {
    borderRadius: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 5,
    borderLeft: "3pt solid",
  },
  riskTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  riskMit: { fontSize: 7.5, color: "#6b7280", lineHeight: 1.4 },
  badge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 7.5,
    color: "#374151",
    marginRight: 3,
    marginBottom: 3,
  },
  disclaimer: {
    fontSize: 7,
    color: "#9ca3af",
    lineHeight: 1.4,
    marginTop: 14,
    paddingTop: 7,
    borderTop: "0.5pt solid #e5e7eb",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#9ca3af",
  },
});

function ratingBg(rating: string) {
  switch (rating) {
    case "Strong Buy": return "#16a34a";
    case "Buy": return "#22c55e";
    case "Hold": return "#ca8a04";
    case "Sell": return "#ef4444";
    case "Strong Sell": return "#dc2626";
    default: return "#6b7280";
  }
}

function riskStyle(severity: string) {
  switch (severity) {
    case "high": return { borderColor: "#ef4444", backgroundColor: "#fef2f2" };
    case "medium": return { borderColor: "#eab308", backgroundColor: "#fefce8" };
    default: return { borderColor: "#60a5fa", backgroundColor: "#eff6ff" };
  }
}

interface PDFDeepDiveProps {
  data: Record<string, unknown>;
}

const PageFooter = ({ ticker }: { ticker: string }) => (
  <View style={S.footer} fixed>
    <Text>StockMind AI · Deep Dive · {ticker}</Text>
    <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

export function PDFDeepDive({ data }: PDFDeepDiveProps) {
  const profile = (data.profile ?? {}) as Record<string, unknown>;
  const quote = (data.quote ?? {}) as Record<string, unknown>;
  const ai = (data.aiAnalysis ?? {}) as Record<string, unknown>;
  const bo = (ai.businessOverview ?? {}) as Record<string, unknown>;
  const fa = (ai.financialAnalysis ?? {}) as Record<string, unknown>;
  const val = (ai.valuation ?? {}) as Record<string, unknown>;
  const thesis = (ai.investmentThesis ?? {}) as Record<string, unknown>;
  const rec = (ai.recommendation ?? {}) as Record<string, unknown>;
  const risks = (ai.riskFactors as Array<Record<string, unknown>>) ?? [];
  const keyProducts = (bo.keyProducts as string[]) ?? [];
  const dcf = (data.dcfModel ?? {}) as Record<string, unknown>;

  const ticker = (data.ticker as string) ?? "";
  const price = typeof quote.price === "number" ? `$${(quote.price as number).toFixed(2)}` : "—";
  const targetPrice = typeof rec.targetPrice === "number" ? `$${(rec.targetPrice as number).toFixed(2)}` : "—";
  const upside = typeof rec.upside === "number"
    ? `${(rec.upside as number) >= 0 ? "+" : ""}${(rec.upside as number).toFixed(1)}%`
    : "—";
  const dcfIntrinsic = typeof dcf.intrinsicValue === "number" ? `$${(dcf.intrinsicValue as number).toFixed(2)}` : null;
  const dcfUpside = typeof dcf.upside === "number"
    ? `${(dcf.upside as number) >= 0 ? "+" : ""}${(dcf.upside as number).toFixed(1)}%`
    : null;
  const rating = (rec.rating as string) ?? "Hold";

  return (
    <Document>
      {/* ── Cover ──────────────────────────────────────────────── */}
      <Page size="A4" style={S.page}>
        <View style={S.coverPage}>
          <Text style={S.coverTitle}>
            {(profile.companyName as string) ?? ticker}
          </Text>
          <Text style={S.coverSub}>
            {ticker} · {(profile.sector as string) ?? ""} · {(profile.exchange as string) ?? ""}
          </Text>
          <Text style={S.coverSub}>{(profile.industry as string) ?? ""}</Text>
          <View style={S.coverBadge}>
            <Text style={S.coverBadgeText}>StockMind AI — Deep Dive Report</Text>
          </View>
          <Text style={S.coverMeta}>
            {`Current Price: ${price}\nGenerated: ${(data.generatedAt as string) ?? new Date().toISOString()}\n\nFor informational purposes only — not investment advice.`}
          </Text>
        </View>
        <PageFooter ticker={ticker} />
      </Page>

      {/* ── Executive Summary + Business Overview ──────────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>1. Executive Summary</Text>
        <Text style={S.text}>{(ai.executiveSummary as string) ?? ""}</Text>

        <Text style={[S.sectionTitle, { marginTop: 16 }]}>2. Business Overview</Text>
        <Text style={S.text}>{(bo.description as string) ?? ""}</Text>

        {keyProducts.length > 0 && (
          <>
            <Text style={S.subLabel}>Key Products &amp; Services</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {keyProducts.map((p, i) => (
                <View key={i} style={S.badge}><Text>{p}</Text></View>
              ))}
            </View>
          </>
        )}

        <View style={[S.twoCol, { marginTop: 8 }]}>
          <View style={S.col}>
            <Text style={S.subLabel}>Competitive Position</Text>
            <Text style={S.text}>{(bo.competitivePosition as string) ?? ""}</Text>
          </View>
          <View style={S.col}>
            <Text style={S.subLabel}>Economic Moat</Text>
            <Text style={S.text}>{(bo.moat as string) ?? ""}</Text>
          </View>
        </View>
        <PageFooter ticker={ticker} />
      </Page>

      {/* ── Financial Analysis + Valuation ─────────────────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>3. Financial Analysis</Text>
        <View style={S.twoCol}>
          <View style={S.col}>
            <Text style={S.subLabel}>Revenue</Text>
            <Text style={S.text}>{(fa.revenueAnalysis as string) ?? ""}</Text>
          </View>
          <View style={S.col}>
            <Text style={S.subLabel}>Profitability</Text>
            <Text style={S.text}>{(fa.profitabilityAnalysis as string) ?? ""}</Text>
          </View>
        </View>
        <View style={[S.twoCol, { marginTop: 8 }]}>
          <View style={S.col}>
            <Text style={S.subLabel}>Balance Sheet</Text>
            <Text style={S.text}>{(fa.balanceSheetAnalysis as string) ?? ""}</Text>
          </View>
          <View style={S.col}>
            <Text style={S.subLabel}>Cash Flow</Text>
            <Text style={S.text}>{(fa.cashFlowAnalysis as string) ?? ""}</Text>
          </View>
        </View>

        <Text style={[S.sectionTitle, { marginTop: 16 }]}>4. Valuation</Text>
        <View style={S.twoCol}>
          <View style={S.col}>
            <Text style={S.subLabel}>DCF Analysis</Text>
            <Text style={S.text}>{(val.dcfAnalysis as string) ?? ""}</Text>
            {dcfIntrinsic && (
              <Text style={[S.text, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
                {`DCF Intrinsic Value: ${dcfIntrinsic} (${dcfUpside} vs. current price)`}
              </Text>
            )}
          </View>
          <View style={S.col}>
            <Text style={S.subLabel}>Multiples Analysis</Text>
            <Text style={S.text}>{(val.multiplesAnalysis as string) ?? ""}</Text>
          </View>
        </View>
        <Text style={S.subLabel}>Fair Value Assessment</Text>
        <Text style={S.text}>{(val.fairValueAssessment as string) ?? ""}</Text>

        <Text style={[S.sectionTitle, { marginTop: 16 }]}>5. Peer Comparison</Text>
        <Text style={S.text}>{(ai.peerComparison as string) ?? ""}</Text>

        <PageFooter ticker={ticker} />
      </Page>

      {/* ── Risks + Investment Thesis + Recommendation ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>6. Risk Factors</Text>
        {risks.slice(0, 6).map((risk, i) => {
          const rs = riskStyle((risk.severity as string) ?? "low");
          return (
            <View key={i} style={[S.riskCard, rs]}>
              <Text style={S.riskTitle}>
                {`[${((risk.severity as string) ?? "low").toUpperCase()}] ${(risk.risk as string) ?? ""} — ${(risk.category as string) ?? ""}`}
              </Text>
              {risk.mitigation ? (
                <Text style={S.riskMit}>
                  Mitigation: {risk.mitigation as string}
                </Text>
              ) : null}
            </View>
          );
        })}

        <Text style={[S.sectionTitle, { marginTop: 14 }]}>7. Investment Thesis</Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={[S.caseBox, { borderColor: "#22c55e", backgroundColor: "#f0fdf4" }]}>
            <Text style={[S.caseLabel, { color: "#166534" }]}>Bull Case</Text>
            <Text style={[S.text, { fontSize: 8 }]}>{(thesis.bullCase as string) ?? ""}</Text>
          </View>
          <View style={[S.caseBox, { borderColor: "#60a5fa", backgroundColor: "#eff6ff" }]}>
            <Text style={[S.caseLabel, { color: "#1d4ed8" }]}>Base Case</Text>
            <Text style={[S.text, { fontSize: 8 }]}>{(thesis.baseCase as string) ?? ""}</Text>
          </View>
          <View style={[S.caseBox, { borderColor: "#ef4444", backgroundColor: "#fef2f2" }]}>
            <Text style={[S.caseLabel, { color: "#991b1b" }]}>Bear Case</Text>
            <Text style={[S.text, { fontSize: 8 }]}>{(thesis.bearCase as string) ?? ""}</Text>
          </View>
        </View>

        <Text style={[S.sectionTitle, { marginTop: 14 }]}>8. Recommendation</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 7 }}>
          <View style={[S.ratingBox, { backgroundColor: ratingBg(rating) }]}>
            <Text style={S.ratingText}>{rating}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", color: "#111827" }}>
              {`${targetPrice}  `}
              <Text style={{ fontSize: 9, color: "#6b7280", fontFamily: "Helvetica" }}>
                target · {upside} upside
              </Text>
            </Text>
            <Text style={[S.text, { color: "#6b7280" }]}>{(rec.timeHorizon as string) ?? ""}</Text>
          </View>
        </View>
        <Text style={S.text}>{(rec.rationale as string) ?? ""}</Text>

        <Text style={S.disclaimer}>
          This report is generated by StockMind AI for informational purposes only and does not constitute
          investment advice. Financial projections are based on historical data and AI modeling. Past performance
          is not indicative of future results. Always conduct your own research and consult a qualified financial
          advisor before making any investment decisions.
        </Text>

        <PageFooter ticker={ticker} />
      </Page>
    </Document>
  );
}
