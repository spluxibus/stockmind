"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { TrendingUp, LogOut, User as UserIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StockSearchBar } from "@/components/dashboard/search-bar";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps { user: User; }

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : "??";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-display text-sm font-bold hidden sm:inline">StockMind AI</span>
      </Link>
      <div className="flex-1 max-w-xl mx-auto">
        <StockSearchBar />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
