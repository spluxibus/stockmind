"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { TrendingUp, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StockSearchBar } from "@/components/dashboard/search-bar";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">StockMind AI</span>
        </Link>

        {/* Search bar — center */}
        <div className="flex-1 max-w-xl mx-auto">
          <StockSearchBar />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-8 w-8 cursor-pointer rounded-full outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
