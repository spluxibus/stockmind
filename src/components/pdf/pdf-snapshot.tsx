import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "1pt solid #e5e7eb",
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  ticker: {
    fontSize: 10,
    color: "#6b7280",
    fontFamily: "Helvetica-Bold",
  },
  price: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 2,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
    marginTop: 13,
  },
  text: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: "#374151",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 3,
  },
  metricBox: {
    width: "31%",
    backgroundColor: "#f9fafb",
    borderRadius: 3,
    padding: 5,
    border: "0.5pt solid #e5e7eb",
  },
  metricLabel: { fontSize: 7, color: "#9ca3af", marginBottom: 2 },
  metricValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  outlookBadge: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  disclaimer: {
    marginTop: 18,
    paddingTop: 7,
    borderTop: "0.5pt solid #e5e7eb",
    fontSize: 7,
    color: "#9ca3af",
    lineHeight: 1.4,
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

function getOutlookStyle(outlook: string) {
  switch (outlook) {
    case "bullish":
      return { backgroundColor: "#dcfce7", color: "#166534" };
    case "bearish":
      return { backgroundColor: "#fee2e2", color: "#991b1b" };
    default:
      return { backgroundColor: "#fef9c3", color: "#92400e" };
  }
}

interface PDFSnapshotProps {
  data: Record<string, unknown>;
}

interface AISummary {
  summary?: string;
  keyHighlights?: Array<{ label?: string; text?: string; sentiment?: string }>;
  commentary?: { valuation?: string; growth?: string; risks?: string };
  analystView?: string;
  outlook?: string;
}

interface ProfileData {
  companyName?: string;
  sector?: string;
  exchange?: string;
  industry?: string;
}

interface QuoteData {
  price?: number;
  changesPercentage?: number;
}

interface MetricsData {
  peRatioTTM?: number | null;
  enterpriseValueOverEBITDATTM?: number | null;
  pbRatioTTM?: number | null;
  roeTTM?: number | null;
  freeCashFlowYieldTTM?: number | null;
}

interface RatiosData {
  netProfitMargin?: number | null;
}

export function PDFSnapshot({ data }: PDFSnapshotProps) {
  const profile = (data.profile ?? {}) as ProfileData;
  const quote = (data.quote ?? {}) as QuoteData;
  const ai = (data.aiAnalysis ?? {}) as AISummary;
  const ratios = (data.ratios ?? {}) as RatiosData;
  const keyMetrics = (data.keyMetrics ?? {}) as MetricsData;
  const commentary = ai.commentary ?? {};
  const outlook = ai.outlook ?? "neutral";
  const highlights = ai.keyHighlights ?? [];
  const outlookStyle = getOutlookStyle(outlook);

  const price =
    typeof quote.price === "number" ? `$${quote.price.toFixed(2)}` : "—";
  const changePct = typeof quote.changesPercentage === "number"
    ? `${quote.changesPercentage >= 0 ? "+" : ""}${quote.changesPercentage.toFixed(2)}%`
    : "—";

  const metrics = [
    {
      label: "P/E Ratio",
      value: keyMetrics.peRatioTTM != null ? keyMetrics.peRatioTTM!.toFixed(1) : "—",
    },
    {
      label: "EV/EBITDA",
      value: keyMetrics.enterpriseValueOverEBITDATTM != null ? keyMetrics.enterpriseValueOverEBITDATTM!.toFixed(1) : "—",
    },
    {
      label: "P/B Ratio",
      value:
        keyMetrics.pbRatioTTM != null
          ? keyMetrics.pbRatioTTM!.toFixed(1)
          : "—",
    },
    {
      label: "ROE",
      value: keyMetrics.roeTTM != null ? `${(keyMetrics.roeTTM! * 100).toFixed(1)}%` : "—",
    },
    {
      label: "Net Margin",
      value: ratios.netProfitMargin != null ? `${(ratios.netProfitMargin! * 100).toFixed(1)}%` : "—",
    },
    {
      label: "FCF Yield",
      value: keyMetrics.freeCashFlowYieldTTM != null ? `${(keyMetrics.freeCashFlowYieldTTM! * 100).toFixed(1)}%` : "—",
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>
              {profile.companyName ?? (data.companyName as string) ?? "Company"}
            </Text>
            <Text style={styles.ticker}>
              {`${(data.ticker as string) ?? ""} · ${profile.sector ?? ""} · ${profile.exchange ?? ""}`}
            </Text>
          </View>
          <View>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.subtitle}>{changePct} today</Text>
            <Text style={styles.subtitle}>StockMind AI · Snapshot</Text>
          </View>
        </View>

        {/* Outlook badge */}
        <View style={[styles.outlookBadge, outlookStyle]}>
          <Text>
            {outlook.charAt(0).toUpperCase() + outlook.slice(1)} Outlook
          </Text>
        </View>

        {/* AI Summary */}
        <Text style={styles.sectionTitle}>AI Summary</Text>
        <Text style={styles.text}>{ai.summary ?? ""}</Text>

        {/* Key Highlights */}
        {highlights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Key Highlights</Text>
            {highlights.slice(0, 4).map((h, i) => (
              <Text key={i} style={[styles.text, { marginBottom: 3 }]}>
                {`[${h.label ?? ""}] ${h.text ?? ""}`}
              </Text>
            ))}
          </>
        )}

        {/* Commentary */}
        {(commentary.valuation || commentary.growth || commentary.risks) && (
          <>
            <Text style={styles.sectionTitle}>Commentary</Text>
            {commentary.valuation && (
              <View style={{ marginBottom: 5 }}>
                <Text style={[styles.text, { fontFamily: "Helvetica-Bold", marginBottom: 1 }]}>
                  Valuation
                </Text>
                <Text style={styles.text}>{commentary.valuation}</Text>
              </View>
            )}
            {commentary.growth && (
              <View style={{ marginBottom: 5 }}>
                <Text style={[styles.text, { fontFamily: "Helvetica-Bold", marginBottom: 1 }]}>
                  Growth
                </Text>
                <Text style={styles.text}>{commentary.growth}</Text>
              </View>
            )}
            {commentary.risks && (
              <View>
                <Text style={[styles.text, { fontFamily: "Helvetica-Bold", marginBottom: 1 }]}>
                  Risks
                </Text>
                <Text style={styles.text}>{commentary.risks}</Text>
              </View>
            )}
          </>
        )}

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricBox}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Analyst View */}
        {ai.analystView && (
          <>
            <Text style={styles.sectionTitle}>Analyst View</Text>
            <Text style={styles.text}>{ai.analystView}</Text>
          </>
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          {`This report is generated by StockMind AI for informational purposes only and does not constitute investment advice. Generated: ${(data.generatedAt as string) ?? new Date().toISOString()}`}
        </Text>

        {/* Page footer */}
        <View style={styles.footer} fixed>
          <Text>StockMind AI · Snapshot Report</Text>
        </View>
      </Page>
    </Document>
  );
}
