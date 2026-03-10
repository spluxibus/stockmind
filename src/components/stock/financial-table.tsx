"use client";

import { useState } from "react";
import type { IncomeStatement, BalanceSheet, CashFlow } from "@/lib/schemas/financial-data";
import { formatLargeNumber, formatPercent } from "@/lib/utils/formatting";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialTableProps {
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlow[];
}

function yr(date: string) {
  return date?.slice(0, 4) ?? "—";
}

function N(v: number | null | undefined, pct = false): string {
  if (v == null || !isFinite(v)) return "—";
  if (pct) return formatPercent(v);
  return formatLargeNumber(v);
}

function HeaderRow({ years }: { years: string[] }) {
  return (
    <TableRow>
      <TableHead className="w-48 text-xs font-semibold">Metric</TableHead>
      {years.map((y) => (
        <TableHead key={y} className="text-right text-xs font-semibold">{y}</TableHead>
      ))}
    </TableRow>
  );
}

interface DataRowProps {
  label: string;
  values: (string | number | null | undefined)[];
  isPercent?: boolean;
  highlight?: boolean;
}

function DataRow({ label, values, isPercent = false, highlight = false }: DataRowProps) {
  return (
    <TableRow className={highlight ? "bg-muted/30 font-medium" : ""}>
      <TableCell className="text-xs py-2 text-muted-foreground">{label}</TableCell>
      {values.map((v, i) => (
        <TableCell key={i} className="text-right text-xs py-2 tabular-nums">
          {typeof v === "number" ? N(v, isPercent) : v ?? "—"}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function FinancialTable({ incomeStatements, balanceSheets, cashFlows }: FinancialTableProps) {
  const incomeYears = incomeStatements.slice(0, 5).map((s) => yr(s.date));
  const balanceYears = balanceSheets.slice(0, 5).map((s) => yr(s.date));
  const cashYears = cashFlows.slice(0, 5).map((s) => yr(s.date));

  const inc = incomeStatements.slice(0, 5);
  const bal = balanceSheets.slice(0, 5);
  const cf = cashFlows.slice(0, 5);

  return (
    <Tabs defaultValue="income">
      <TabsList className="mb-3">
        <TabsTrigger value="income" className="text-xs">Income Statement</TabsTrigger>
        <TabsTrigger value="balance" className="text-xs">Balance Sheet</TabsTrigger>
        <TabsTrigger value="cashflow" className="text-xs">Cash Flow</TabsTrigger>
      </TabsList>

      {/* ── Income Statement ── */}
      <TabsContent value="income">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <HeaderRow years={incomeYears} />
            </TableHeader>
            <TableBody>
              <DataRow label="Revenue" values={inc.map((s) => s.revenue)} highlight />
              <DataRow label="Gross Profit" values={inc.map((s) => s.grossProfit)} />
              <DataRow label="Gross Margin" values={inc.map((s) => s.grossProfitRatio)} isPercent />
              <DataRow label="Operating Income" values={inc.map((s) => s.operatingIncome)} />
              <DataRow label="Operating Margin" values={inc.map((s) => s.operatingIncomeRatio)} isPercent />
              <DataRow label="EBITDA" values={inc.map((s) => s.ebitda)} />
              <DataRow label="EBITDA Margin" values={inc.map((s) => s.ebitdaratio)} isPercent />
              <DataRow label="Net Income" values={inc.map((s) => s.netIncome)} highlight />
              <DataRow label="Net Margin" values={inc.map((s) => s.netIncomeRatio)} isPercent />
              <DataRow label="EPS (Diluted)" values={inc.map((s) => s.epsdiluted?.toFixed(2) ?? "—")} />
              <DataRow label="R&D Expenses" values={inc.map((s) => s.researchAndDevelopmentExpenses)} />
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* ── Balance Sheet ── */}
      <TabsContent value="balance">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <HeaderRow years={balanceYears} />
            </TableHeader>
            <TableBody>
              <DataRow label="Cash & Equivalents" values={bal.map((s) => s.cashAndCashEquivalents)} highlight />
              <DataRow label="Total Current Assets" values={bal.map((s) => s.totalCurrentAssets)} />
              <DataRow label="Total Assets" values={bal.map((s) => s.totalAssets)} highlight />
              <DataRow label="Total Current Liabilities" values={bal.map((s) => s.totalCurrentLiabilities)} />
              <DataRow label="Short-Term Debt" values={bal.map((s) => s.shortTermDebt)} />
              <DataRow label="Long-Term Debt" values={bal.map((s) => s.longTermDebt)} />
              <DataRow label="Total Debt" values={bal.map((s) => s.totalDebt)} />
              <DataRow label="Net Debt" values={bal.map((s) => s.netDebt)} />
              <DataRow label="Total Liabilities" values={bal.map((s) => s.totalLiabilities)} />
              <DataRow label="Shareholders' Equity" values={bal.map((s) => s.totalStockholdersEquity)} highlight />
              <DataRow label="Retained Earnings" values={bal.map((s) => s.retainedEarnings)} />
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* ── Cash Flow ── */}
      <TabsContent value="cashflow">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <HeaderRow years={cashYears} />
            </TableHeader>
            <TableBody>
              <DataRow label="Operating Cash Flow" values={cf.map((s) => s.netCashProvidedByOperatingActivities)} highlight />
              <DataRow label="Capital Expenditures" values={cf.map((s) => s.capitalExpenditure)} />
              <DataRow label="Free Cash Flow" values={cf.map((s) => s.freeCashFlow)} highlight />
              <DataRow label="Dividends Paid" values={cf.map((s) => s.dividendsPaid)} />
              <DataRow label="Stock Buybacks" values={cf.map((s) => s.commonStockRepurchased)} />
              <DataRow label="Net Change in Cash" values={cf.map((s) => s.netChangeInCash)} />
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
