"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    icon: Star,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col border-r bg-background pt-4 pb-8">
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <TrendingUp className="h-3 w-3" />
            Beta Access
          </div>
          <p>Free during beta. Report quality feedback welcome!</p>
        </div>
      </div>
    </aside>
  );
}
