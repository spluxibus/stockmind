"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import type { TickerSearchResult } from "@/lib/schemas/financial-data";

export function StockSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    fetch(`/api/stock/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(ticker: string) {
    setQuery("");
    setOpen(false);
    router.push(`/stock/${ticker}`);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search ticker or company (e.g. AAPL, Apple)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSelect(query.trim().toUpperCase());
            }
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map((result) => (
            <button
              key={result.symbol}
              onClick={() => handleSelect(result.symbol)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors"
            >
              <span className="font-mono font-bold text-sm text-primary min-w-[60px]">
                {result.symbol}
              </span>
              <span className="text-sm text-muted-foreground truncate">{result.name}</span>
              <span className="ml-auto text-xs text-muted-foreground shrink-0">
                {result.exchangeShortName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
