import { createAdminClient } from "@/lib/supabase/admin";
import type { SnapshotReport, DeepDiveReport } from "@/lib/schemas/report";
import { CACHE_TTL } from "@/lib/constants/financial";

type ReportType = "snapshot" | "deep_dive";
type AnyReport = SnapshotReport | DeepDiveReport;

export class CacheService {
  /**
   * Look up a cached report. Returns null if not found or expired.
   */
  async getReport(
    ticker: string,
    type: ReportType,
    maxAgeMinutes?: number
  ): Promise<AnyReport | null> {
    try {
      const supabase = createAdminClient();
      const ttlMinutes =
        maxAgeMinutes ??
        (type === "snapshot"
          ? CACHE_TTL.SNAPSHOT_MINUTES
          : CACHE_TTL.DEEP_DIVE_HOURS * 60);

      const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("reports")
        .select("id, report_data")
        .eq("ticker", ticker.toUpperCase())
        .eq("report_type", type)
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      const report = data.report_data as AnyReport;
      report.id = data.id;
      return report;
    } catch {
      return null;
    }
  }

  /**
   * Save a generated report to the cache.
   */
  async saveReport(
    report: AnyReport,
    userId: string,
    type: ReportType
  ): Promise<string | null> {
    try {
      const supabase = createAdminClient();

      const ttlMs =
        type === "snapshot"
          ? CACHE_TTL.SNAPSHOT_MINUTES * 60 * 1000
          : CACHE_TTL.DEEP_DIVE_HOURS * 60 * 60 * 1000;

      const expiresAt = new Date(Date.now() + ttlMs).toISOString();

      const { data, error } = await supabase
        .from("reports")
        .insert({
          user_id: userId,
          ticker: report.ticker.toUpperCase(),
          report_type: type,
          company_name: report.companyName,
          report_data: report as unknown as Record<string, unknown>,
          expires_at: expiresAt,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Cache save error:", error);
        return null;
      }

      return data?.id ?? null;
    } catch (err) {
      console.error("Cache save exception:", err);
      return null;
    }
  }

  /**
   * Log access to report history.
   */
  async logReportAccess(
    userId: string,
    ticker: string,
    type: ReportType,
    reportId?: string
  ): Promise<void> {
    try {
      const supabase = createAdminClient();
      await supabase.from("report_history").insert({
        user_id: userId,
        report_id: reportId ?? null,
        ticker: ticker.toUpperCase(),
        report_type: type,
      });
    } catch {
      // Non-critical; don't throw
    }
  }
}

let cacheInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheInstance) {
    cacheInstance = new CacheService();
  }
  return cacheInstance;
}
