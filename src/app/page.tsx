"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Brain,
  LineChart,
  FileText,
} from "lucide-react";

const stats = [
  { value: "15s", label: "Snapshot generation" },
  { value: "90s", label: "Deep dive report" },
  { value: "10K+", label: "Stocks covered" },
  { value: "Free", label: "During beta" },
];

const features = [
  {
    icon: Zap,
    title: "Stock Snapshot",
    description:
      "Get an instant 1-page AI-powered overview of any stock. Key metrics, valuation score, and AI commentary in under 15 seconds.",
    badge: "~15 seconds",
    badgeColor: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    title: "Deep Dive Report",
    description:
      "Full analyst-style research report with DCF valuation, peer comparison, risk matrix, and investment thesis. Powered by Gemini AI Analysis.",
    badge: "~90 seconds",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: Star,
    title: "Smart Watchlist",
    description:
      "Track your favorite stocks and get one-click access to fresh reports. Stay on top of your portfolio with AI-powered insights.",
    badge: "Always updated",
    badgeColor: "bg-success/10 text-success",
  },
];

const highlights = [
  { icon: Brain, text: "Gemini AI Analysis" },
  { icon: LineChart, text: "Real-time financial data" },
  { icon: FileText, text: "Professional-grade reports" },
  { icon: Shield, text: "No investment bias" },
];

const testimonials = [
  {
    quote:
      "StockMind AI saves me hours of research every week. The deep dive reports are incredibly thorough.",
    name: "Marcus T.",
    role: "Private Investor",
  },
  {
    quote:
      "Finally an AI tool that gives me the same quality analysis I used to pay thousands for from brokers.",
    name: "Sarah K.",
    role: "Semi-Pro Trader",
  },
  {
    quote:
      "The DCF analysis and peer comparison features are exactly what I needed for my family office research.",
    name: "David R.",
    role: "Family Office",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              StockMind <span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Beta — Free access for early users
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            AI-Powered Stock Analysis
            <br />
            <span className="text-primary">In Seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            StockMind AI automates the work of an equity analyst. Get
            professional-grade stock reports — snapshots in 15 seconds, deep
            dives in 90 seconds. Powered by Gemini AI Analysis.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/register">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign in to your account</Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card p-4 text-center"
            >
              <div className="font-display text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to research stocks
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              From quick snapshots to deep-dive analysis, StockMind AI covers
              every stage of your investment research workflow.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border/60 bg-card">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                    <div
                      className={`mt-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Trust */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Built for serious investors
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We combine institutional-grade financial data with the latest AI to
              give you an edge in your investment research.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.text}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-5 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <h.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {h.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/50 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              What users are saying
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border/60 bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                        {t.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Start your research today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of investors using StockMind AI to make faster, more
              informed investment decisions. Free during beta.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/register">
                  Create free account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              {["No credit card required", "Free during beta", "Cancel anytime"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    {item}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <TrendingUp className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground">
                StockMind AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Not investment advice. All content is for informational purposes
              only. &copy; {new Date().getFullYear()} StockMind AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
