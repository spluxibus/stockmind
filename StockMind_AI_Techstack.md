# StockMind AI — Technologie-Stack

*← [Zurück zum Hauptkonzept](./StockMind_AI_Konzept.md)*

---

## 6. Empfohlener Technologie-Stack

### 6.1 Überblick

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│          Next.js 14 + TailwindCSS + shadcn/ui               │
│               Deployed on Vercel                            │
└───────────────────────┬─────────────────────────────────────┘
                        │ REST / tRPC
┌───────────────────────▼─────────────────────────────────────┐
│                      BACKEND API                            │
│              FastAPI (Python) auf AWS Lambda                │
│           Auth via Supabase Auth / JWT                      │
└───────┬──────────────┬──────────────┬───────────────────────┘
        │              │              │
┌───────▼───┐   ┌──────▼──────┐  ┌───▼──────────────┐
│  Supabase │   │  AI Engine  │  │   Payment Layer  │
│ PostgreSQL│   │ (Agenten)   │  │     Stripe       │
│  + Auth   │   │             │  └──────────────────┘
└───────────┘   └──────┬──────┘
                       │ orchestriert
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼───┐  ┌───────▼────┐  ┌─────▼──────────┐
│  Data     │  │  LLM API   │  │  Financial     │
│ Collector │  │  (Claude)  │  │  Modeler (MCP) │
│  Agents   │  └────────────┘  └────────────────┘
└───────────┘
```

---

### 6.2 Stack-Komponenten im Detail

#### Frontend

| Technologie | Begründung |
|---|---|
| **Next.js 14 (App Router)** | SSR für SEO (Report-Seiten als shareable Links), schnelle Ladezeiten |
| **TailwindCSS + shadcn/ui** | Professionelles UI ohne Design-System von Grund auf |
| **Recharts / TradingView Lightweight Charts** | Kurs-Charts, Kennzahl-Visualisierungen |
| **React PDF** | Client-seitiger PDF-Export aus Report-Komponenten |
| **Vercel** | Zero-Config Deployment, Edge Functions für Auth-Middleware |

#### Backend / API

| Technologie | Begründung |
|---|---|
| **FastAPI (Python)** | Schnelle REST-API, nativ kompatibel mit AI/Data-Libraries |
| **AWS Lambda + API Gateway** | Serverless — skaliert automatisch bei Report-Spikes (z.B. Earnings Season) |
| **Celery + Redis** | Async Task Queue für längere Report-Generierungen (Deep Dive) |
| **Pydantic** | Daten-Validierung für Report-Output-Schemas |

#### Datenbank & Auth

| Technologie | Begründung |
|---|---|
| **Supabase (PostgreSQL)** | Bereits bekannt aus Adventure Realms — User-Mgmt., Reports-Cache, Watchlists |
| **Supabase Auth** | JWT + OAuth (Google/LinkedIn Login) out-of-the-box |
| **Supabase Storage** | Generierte PDFs speichern (1 Woche TTL für Free Tier) |
| **Redis (Upstash)** | Rate-Limiting, Report-Caching (gleiche Aktie innerhalb 15 Min.) |

#### AI-Agenten-Layer

| Komponente | Technologie | Aufgabe |
|---|---|---|
| **Orchestrator** | Claude Sonnet (Anthropic API) | Koordiniert Subagenten, schreibt Narrativ |
| **Data Collector** | Python + requests + BeautifulSoup | Scraping SEC, Yahoo Finance |
| **Financial Modeler** | Python MCP Tool (Pandas/Numpy) | DCF, Peer Multiples, Ratios |
| **News Analyst** | Web Search MCP + Claude | Sentiment, News-Aggregation |
| **Quality Checker** | Claude (Critic-Prompt) | Fakten-Check, Konsistenz |

#### Finanz-Daten APIs

| Anbieter | Use Case | Kosten (ca.) |
|---|---|---|
| **Polygon.io** | Realtime & historische Kursdaten, Tickers | ab USD 29/Mt. |
| **Financial Modeling Prep** | Fundamentaldaten, Filings, Ratios | ab USD 19/Mt. |
| **SEC EDGAR (gratis)** | 10-K, 10-Q, 8-K Volltext-Filings | kostenlos |
| **Alpha Vantage** | Fallback für Kennzahlen | kostenlos / USD 50/Mt. |
| **Earnings Whispers API** | Earnings-Kalender, Konsens-Schätzungen | USD 20/Mt. |

#### Payments & Subscriptions

| Technologie | Begründung |
|---|---|
| **Stripe** | Abo-Verwaltung, Credit-Käufe, Invoicing — Industriestandard |
| **Stripe Customer Portal** | Self-Service Abo-Management (Upgrade/Downgrade/Cancel) |
| **Stripe Webhooks** | Echtzeit-Synchronisation Zahlungsstatus → Supabase |

---

### 6.3 Report-Generierungs-Pipeline

```
User-Request (Ticker: AAPL)
        │
        ▼
[1] Cache-Check (Redis)
   → Hit: Sofort zurückgeben (< 1 Sek.)
   → Miss: Weiter zu [2]
        │
        ▼
[2] Data Collector Agent
   → Polygon.io: Kursdaten, 52W-Range, Beta
   → FMP: KGV, EV/EBITDA, Margins, EPS-History
   → SEC EDGAR: Letztes 10-K Filing-Datum
   → News API: Letzte 10 Meldungen + Sentiment
        │
        ▼
[3] Financial Modeler (MCP Tool)
   → Peer Comparison berechnen
   → DCF mit Standardannahmen (WACC, Terminal Growth)
   → Scoring: Ampel-System Grün/Gelb/Rot pro Kategorie
        │
        ▼
[4] Report Writer (Claude)
   → System Prompt: "Du bist Senior Equity Analyst..."
   → Strukturierter Output nach Report-Template
   → Plain-Language-Erklärungen für Retail-Tier
        │
        ▼
[5] Quality Checker (Claude Critic)
   → Zahlen-Konsistenzcheck
   → Disclaimer einfügen
   → Sprach-Qualität sichern
        │
        ▼
[6] Output
   → JSON → Frontend (Web-Rendering)
   → JSON → PDF-Generator (Puppeteer)
   → Speichern in Supabase + Redis-Cache (15 Min.)
```

---

### 6.4 Skalierungs-Überlegungen

**Report-Caching ist der wichtigste Hebel für Cost Control:**
- Gleiche Aktie innerhalb 15 Min.: aus Cache (CHF 0 Kosten)
- Gleiche Aktie innerhalb 24h (Snapshot): aus Cache mit Freshness-Warning
- Deep Dive: 4h Cache, danach automatischer Rerun bei neuen Daten

**API-Kosten pro Report (Schätzung bei Claude Sonnet):**

| Report-Typ | Input-Tokens | Output-Tokens | Kosten ca. |
|---|---|---|---|
| Stock Snapshot | ~3'000 | ~800 | ~USD 0.02 |
| Deep Dive Report | ~8'000 | ~3'000 | ~USD 0.07 |
| Earnings Brief | ~4'000 | ~1'200 | ~USD 0.03 |

> Bei 1'000 aktiven Pro-Usern mit je 15 Deep Dives/Mt. = ~15'000 Runs/Mt. = ~USD 1'050 AI-Kosten. Gut im Rahmen der Gross-Margin-Ziele.

---

*← [Monetarisierung](./StockMind_AI_Monetarisierung.md) | [Regulatorik & Roadmap →](./StockMind_AI_Roadmap.md)*

---
*Erstellt mit Pragmatica AI Research | Vertraulich | März 2025*
