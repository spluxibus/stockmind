import type { DCFModel } from "@/lib/schemas/report";
import { formatCurrency, formatLargeNumber, formatPercent } from "@/lib/utils/formatting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DCFSectionProps {
  dcf: DCFModel;
}

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function getUpsideColor(upside: number) {
  if (upside >= 20) return "text-green-600 dark:text-green-400";
  if (upside <= -20) return "text-red-600 dark:text-red-400";
  return "text-yellow-600 dark:text-yellow-400";
}

function getSensitivityColor(value: number, intrinsic: number) {
  const diff = ((value - intrinsic) / intrinsic) * 100;
  if (diff >= 15) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (diff >= -15) return "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
  return "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300";
}

export function DCFSection({ dcf }: DCFSectionProps) {
  const upside = dcf.upside;

  // Build the sensitivity matrix into a grid
  // Group by unique WACC rows and terminalGrowth columns
  const waccValues = [...new Set(dcf.sensitivityMatrix.map((r) => r.wacc))].sort((a, b) => a - b);
  const tgValues = [...new Set(dcf.sensitivityMatrix.map((r) => r.terminalGrowth))].sort((a, b) => a - b);

  const matrixMap = new Map<string, number>();
  dcf.sensitivityMatrix.forEach((r) => {
    matrixMap.set(`${r.wacc}-${r.terminalGrowth}`, r.value);
  });

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
          <p className="font-bold text-base">{formatCurrency(dcf.currentPrice)}</p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Intrinsic Value</p>
          <p className="font-bold text-base">{formatCurrency(dcf.intrinsicValue)}</p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Implied Upside</p>
          <p className={`font-bold text-base ${getUpsideColor(upside)}`}>
            {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Enterprise Value</p>
          <p className="font-bold text-base">{formatLargeNumber(dcf.enterpriseValue)}</p>
        </div>
      </div>

      {/* DCF Assumptions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-muted-foreground">WACC</p>
          <p className="font-semibold mt-0.5">{pct(dcf.wacc)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-muted-foreground">Terminal Growth</p>
          <p className="font-semibold mt-0.5">{pct(dcf.terminalGrowthRate)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-muted-foreground">Terminal Value</p>
          <p className="font-semibold mt-0.5">{formatLargeNumber(dcf.terminalValue)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-muted-foreground">Net Debt</p>
          <p className="font-semibold mt-0.5">{formatLargeNumber(dcf.netDebt)}</p>
        </div>
      </div>

      {/* Projected FCFs */}
      {dcf.projectedFCFs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            5-Year Free Cash Flow Projection
          </p>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {dcf.projectedFCFs.map((p) => (
                    <TableHead key={p.year} className="text-center text-xs font-semibold">
                      Year {p.year}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {dcf.projectedFCFs.map((p) => (
                    <TableCell key={p.year} className="text-center text-xs tabular-nums">
                      {formatLargeNumber(p.fcf)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Sensitivity Matrix */}
      {dcf.sensitivityMatrix.length > 0 && waccValues.length > 0 && tgValues.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Sensitivity Analysis — Intrinsic Value (WACC vs Terminal Growth)
          </p>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-center">WACC \ TGR</TableHead>
                  {tgValues.map((tg) => (
                    <TableHead key={tg} className="text-center text-xs font-semibold">
                      {pct(tg)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {waccValues.map((wacc) => (
                  <TableRow key={wacc}>
                    <TableCell className="text-center text-xs font-semibold">{pct(wacc)}</TableCell>
                    {tgValues.map((tg) => {
                      const val = matrixMap.get(`${wacc}-${tg}`) ?? 0;
                      const colorClass = getSensitivityColor(val, dcf.intrinsicValue);
                      return (
                        <TableCell
                          key={tg}
                          className={`text-center text-xs tabular-nums font-medium rounded ${colorClass}`}
                        >
                          {formatCurrency(val)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Green = &gt;15% above base intrinsic value · Yellow = within ±15% · Red = &gt;15% below
          </p>
        </div>
      )}
    </div>
  );
}
