import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toApiError } from "@/lib/utils/errors";
import { z } from "zod";

const RequestSchema = z.object({
  reportType: z.enum(["snapshot", "deep_dive"]),
  reportData: z.record(z.string(), z.unknown()),
});

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reportType, reportData } = RequestSchema.parse(body);

    // Dynamically import react-pdf to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToBuffer } = await import("@react-pdf/renderer");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = await import("react");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let PdfComponent: React.ComponentType<any>;

    if (reportType === "snapshot") {
      const mod = await import("@/components/pdf/pdf-snapshot");
      PdfComponent = mod.PDFSnapshot;
    } else {
      const mod = await import("@/components/pdf/pdf-deep-dive");
      PdfComponent = mod.PDFDeepDive;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(PdfComponent, { data: reportData }) as any;
    const buffer = await renderToBuffer(element);

    const ticker = (reportData.ticker as string) ?? "report";
    const suffix = reportType === "deep_dive" ? "deep-dive" : "snapshot";
    const filename = `stockmind-${ticker.toLowerCase()}-${suffix}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[API] PDF error:", err);
    const { error, code } = toApiError(err);
    const status = code === "AUTH_ERROR" ? 401 : code === "VALIDATION_ERROR" ? 400 : 500;
    return NextResponse.json({ error, code }, { status });
  }
}
