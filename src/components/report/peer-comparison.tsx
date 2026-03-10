import type { PeerComparison, PeerData } from "@/lib/schemas/report";
import { formatLargeNumber, formatPercent, formatRatio } from "@/lib/utils/formatting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PeerComparisonTableProps {
  peerComparison: PeerComparison;
}

function N(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  return v.toFixed(1);
}

function Pct(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  return formatPercent(v);
}

function Cap(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  return formatLargeNumber(v);
}

function cellColor(
  value: number | null | undefined,
  median: number | null | undefined,
  higherIsBetter: boolean
): string {
  if (value == null || median == null || !isFinite(value) || !isFinite(median) || median === 0) return "";
  const diff = (value - median) / Math.abs(median);
  const isGood = higherIsBetter ? diff >= 0.1 : diff <= -0.1;
  const isBad = higherIsBetter ? diff <= -0.1 : diff >= 0.1;
  if (isGood) return "text-green-600 dark:text-green-400 font-semibold";
  if (isBad) return "text-red-600 dark:text-red-400 font-semibold";
  return "";
}

interface ColDef {
  key: keyof PeerData;
  label: string;
  format: (v: number | null | undefined) => string;
  higherIsBetter: boolean;
}

const COLUMNS: ColDef[] = [
  { key: "marketCap", label: "Market Cap", format: Cap, higherIsBetter: true },
  { key: "pe", label: "P/E", format: N, higherIsBetter: false },
  { key: "evEbitda", label: "EV/EBITDA", format: N, higherIsBetter: false },
  { key: "revenueGrowth", label: "Rev Growth", format: Pct, higherIsBetter: true },
  { key: "grossMargin", label: "Gross Margin", format: Pct, higherIsBetter: true },
  { key: "operatingMargin", label: "Op Margin", format: Pct, higherIsBetter: true },
  { key: "netMargin", label: "Net Margin", format: Pct, higherIsBetter: true },
  { key: "roe", label: "ROE", format: Pct, higherIsBetter: true },
  { key: "debtToEbitda", label: "Debt/EBITDA", format: N, higherIsBetter: false },
];

function CompanyRow({
  data,
  medians,
  isTarget,
}: {
  data: PeerData;
  medians: Partial<PeerData>;
  isTarget: boolean;
}) {
  return (
    <TableRow className={isTarget ? "bg-primary/5 border-l-2 border-l-primary" : ""}>
      <TableCell className="text-xs font-mono font-bold whitespace-nowrap">
        {data.ticker}
        {isTarget && (
          <Badge variant="secondary" className="ml-1.5 text-[10px] py-0">You</Badge>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap max-w-[140px] truncate">
        {data.companyName}
      </TableCell>
      {COLUMNS.map((col) => {
        const val = data[col.key] as number | null | undefined;
        const med = medians[col.key] as number | null | undefined;
        const color = isTarget ? cellColor(val, med, col.higherIsBetter) : "";
        return (
          <TableCell key={col.key} className={`text-right text-xs tabular-nums ${color}`}>
            {col.format(val)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function MedianRow({ medians }: { medians: Partial<PeerData> }) {
  return (
    <TableRow className="bg-muted/30 font-medium">
      <TableCell className="text-xs font-semibold text-muted-foreground" colSpan={2}>
        Peer Median
      </TableCell>
      {COLUMNS.map((col) => (
        <TableCell key={col.key} className="text-right text-xs text-muted-foreground tabular-nums">
          {col.format(medians[col.key] as number | null | undefined)}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function PeerComparisonTable({ peerComparison }: PeerComparisonTableProps) {
  const { target, peers, medians } = peerComparison;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-semibold w-20">Ticker</TableHead>
            <TableHead className="text-xs font-semibold min-w-[140px]">Company</TableHead>
            {COLUMNS.map((col) => (
              <TableHead key={col.key} className="text-right text-xs font-semibold whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <CompanyRow data={target} medians={medians} isTarget={true} />
          {peers.map((peer) => (
            <CompanyRow key={peer.ticker} data={peer} medians={medians} isTarget={false} />
          ))}
          <MedianRow medians={medians} />
        </TableBody>
      </Table>
      <p className="text-[10px] text-muted-foreground px-3 py-1.5 border-t">
        Green/Red highlights show target company performance vs. peer median. Lower P/E and EV/EBITDA are highlighted green (cheaper).
      </p>
    </div>
  );
}
