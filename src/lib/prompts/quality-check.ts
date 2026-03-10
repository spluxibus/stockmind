export function buildQualityCheckPrompt(reportJson: string, ticker: string): string {
  return `You are reviewing a stock research report for ${ticker} to check for factual consistency and regulatory compliance.

Review the following JSON report and answer these questions briefly:
1. Does the narrative contain any obvious numerical inconsistencies? (e.g., claiming revenue growth when data shows decline)
2. Does the report use appropriate disclaimers and avoid direct investment advice?
3. Are there any statements that seem fabricated or inconsistent with the quantitative data?
4. Rate the overall quality: PASS / FLAG / FAIL

Return your review as JSON: { "passes": boolean, "issues": string[], "quality": "PASS" | "FLAG" | "FAIL" }

REPORT TO REVIEW:
${reportJson.substring(0, 4000)}`;
}
