import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Risk {
  category: string;
  risk: string;
  severity: "high" | "medium" | "low";
  mitigation: string;
}

interface RiskMatrixProps {
  risks: Risk[];
}

const SEVERITY_CONFIG = {
  high: {
    border: "border-red-500",
    bg: "bg-red-50 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: ShieldAlert,
    iconColor: "text-red-500",
    label: "High",
    order: 0,
  },
  medium: {
    border: "border-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Shield,
    iconColor: "text-yellow-500",
    label: "Medium",
    order: 1,
  },
  low: {
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: ShieldCheck,
    iconColor: "text-blue-400",
    label: "Low",
    order: 2,
  },
};

export function RiskMatrix({ risks }: RiskMatrixProps) {
  if (!risks || risks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">No risk factors identified.</p>
    );
  }

  const sorted = [...risks].sort(
    (a, b) => SEVERITY_CONFIG[a.severity].order - SEVERITY_CONFIG[b.severity].order
  );

  const high = sorted.filter((r) => r.severity === "high");
  const medium = sorted.filter((r) => r.severity === "medium");
  const low = sorted.filter((r) => r.severity === "low");

  const RiskCard = ({ risk }: { risk: Risk }) => {
    const cfg = SEVERITY_CONFIG[risk.severity];
    const Icon = cfg.icon;
    return (
      <div className={`rounded-lg border-l-4 ${cfg.border} ${cfg.bg} p-4 space-y-2`}>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 shrink-0 ${cfg.iconColor}`} />
            <span className="text-sm font-semibold leading-tight">{risk.risk}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              {risk.category}
            </span>
          </div>
        </div>
        {risk.mitigation && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              Mitigation
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{risk.mitigation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary counts */}
      <div className="flex gap-3 flex-wrap">
        {high.length > 0 && (
          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full font-medium">
            {high.length} High
          </span>
        )}
        {medium.length > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full font-medium">
            {medium.length} Medium
          </span>
        )}
        {low.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
            {low.length} Low
          </span>
        )}
      </div>

      {/* High risks */}
      {high.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">High Severity</p>
          <div className="space-y-2">
            {high.map((r, i) => <RiskCard key={i} risk={r} />)}
          </div>
        </div>
      )}

      {/* Medium risks */}
      {medium.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medium Severity</p>
          <div className="space-y-2">
            {medium.map((r, i) => <RiskCard key={i} risk={r} />)}
          </div>
        </div>
      )}

      {/* Low risks */}
      {low.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Low Severity</p>
          <div className="space-y-2">
            {low.map((r, i) => <RiskCard key={i} risk={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
