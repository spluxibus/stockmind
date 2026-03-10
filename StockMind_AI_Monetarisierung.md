# StockMind AI — Monetarisierungsmodell

*← [Zurück zum Hauptkonzept](./StockMind_AI_Konzept.md)*

---

## 5. Monetarisierungsmodell

### 5.1 Zahlungsbereitschaft: Was zahlen Nutzer?

Marktanalyse zeigt folgende Zahlungsbereitschafts-Cluster im Finanz-Research-Bereich:

| Segment | Zahlungsbereitschaft | Benchmark |
|---|---|---|
| **Informierte Privatanleger** | CHF 10–30 / Monat | Seeking Alpha Premium ~USD 19/Mt. |
| **Aktive Trader / DCA-Investoren** | CHF 30–80 / Monat | TradingView Pro ~USD 15–60/Mt. |
| **Semi-professionelle Anleger** | CHF 80–200 / Monat | Morningstar Investor ~USD 35/Mt. |
| **Family Offices / Vermögensverwalter** | CHF 200–500 / Monat oder projektbasiert | FactSet Lite ab USD 300/Mt. |

> **Kernbefund:** Der Preisraum von CHF 15–90/Monat ist für digitale Research-Tools weitgehend unbesetzt und gut verteidigbar gegenüber institutionellen Anbietern (zu teuer) und kostenlosen Tools (zu flach).

---

### 5.2 Stufenmodell: Free → Enterprise

| Tier | Preis/Monat | Zielgruppe | Inkludierte Credits | Key Features |
|---|---|---|---|---|
| **Free** | CHF 0 | Neu-User / Lead Gen | 3 Credits | 3 Stock Snapshots, Basiskenndaten, kein Export |
| **Starter** | CHF 14.90 | Privatanleger | 30 Credits | 20 Snapshots + 3 Deep Dives, PDF-Export, Watchlist (10 Titel), E-Mail-Alerts |
| **Pro** | CHF 39.90 | Aktive Anleger | 100 Credits | Unlimitiert Snapshots + 15 Deep Dives, Earnings Briefs, Watchlist-Digest (50 Titel) |
| **Premium** | CHF 89.90 | Semi-professionals | 300 Credits | Alles in Pro + API-Zugang (500 Calls/Mt.), Custom Report Templates, Priority Processing |
| **Enterprise** | ab CHF 299 | Family Offices / VV | Unlimitiert | White-Label, unlimitierte API-Calls, SLA, dedizierter Support, Bulk-Reports, SSO |

#### Credit-Kosten pro Report-Typ

| Report | Credits |
|---|---|
| Stock Snapshot | 1 Credit |
| Earnings Brief | 2 Credits |
| Deep Dive Report | 5 Credits |
| Watchlist Digest (bis 20 Titel) | 3 Credits |
| Custom Report (Enterprise) | vertraglich |

---

### 5.3 Intelligenter Bezahl-Mechanismus

**Empfehlung: Credit-basiertes Hybrid-System**

Das System kombiniert Abo-Sicherheit mit nutzungsbasierter Flexibilität:

#### Funktionsweise
1. **Abo liefert monatliche Credits** — automatisch erneuert, nicht übertragbar auf Folgemonat
2. **Top-up möglich** — Credits können einzeln nachgekauft werden (CHF 1.00 = 1 Credit, Bulk-Rabatte ab 20 Credits: CHF 0.80/Credit)
3. **Verfall nach 30 Tagen** — erzeugt Nutzungs-Urgency, verhindert Credit-Hortung
4. **Annual Billing** — 2 Monate gratis bei Jahresabo (senkt Churn, verbessert Cash-Flow)

#### Psychologische Mechanismen (Behavioral Design)

| Mechanismus | Umsetzung |
|---|---|
| **Freemium-Hook** | Report vollständig anzeigen, aber Export/Details erst nach Login / Bezahlung |
| **Progress Commitment** | Watchlist anlegen ist gratis → Upgrade-Prompt wenn Limit erreicht |
| **Loss Aversion** | "Du hast noch 8 ungenutzte Credits — sie verfallen in 5 Tagen" |
| **Social Proof** | "1'240 Analysten haben diese Aktie diese Woche analysiert" |
| **Anchoring** | Enterprise-Tier zuerst zeigen, macht Pro erschwinglich wirken |

---

### 5.4 Add-On Revenue Streams

Neben dem Abo-Modell bieten sich folgende Erweiterungskanäle an:

#### Pay-per-Report
Einzelne Deep Dive Reports ausserhalb des Kontingents kaufbar à **CHF 4.90**. Tiefere Einstiegsbarriere für Gelegenheitsnutzer ohne Abo-Commitment.

#### Expert Network *(Phase 3)*
Vermittlung von 30-minütigen Analysegesprächen mit verifizierten CFA-Analysten. Provision-Modell: **20% Revenue Share**. Differenzierungsmerkmal gegenüber rein automatisierten Konkurrenten.

#### Data Licensing *(Phase 4)*
Aggregierte, anonymisierte Research-Nutzungsdaten (welche Sektoren werden am meisten analysiert, welche Kennzahlen priorisiert) als Datenprodukt für Asset Manager und Hedge Funds.

#### Affiliate / Broker-Integration *(Phase 2)*
Revenue Share bei Depot-Eröffnungen über Partner-Links (IBKR, Swissquote, Trade Republic). Typische Vergütung: CHF 30–80 CPA.

#### Report Marketplace *(Phase 4)*
Nutzer können eigene quantitative Screens und Templates verkaufen. Revenue Split: **70% Ersteller / 30% Plattform**.

---

### 5.5 Unit Economics (Schätzung)

| Metrik | Starter | Pro | Premium |
|---|---|---|---|
| Monatlicher Umsatz/User | CHF 14.90 | CHF 39.90 | CHF 89.90 |
| Geschätzte API-Kosten/User | CHF 2–4 | CHF 6–12 | CHF 15–25 |
| Geschätzte Gross Margin | ~75% | ~75% | ~75% |
| Break-even (Infrastruktur-Fixkosten ~CHF 800/Mt.) | 54 User | 20 User | 9 User |

> **Anmerkung:** API-Kosten (Claude, Polygon.io) skalieren mit Nutzung. Bei hohem Volumen sind Volumen-Rabatte verhandelbar. Das Credit-System schützt vor unrentablen Heavy-Usern im günstigen Tier.

---

*← [Zurück zum Hauptkonzept](./StockMind_AI_Konzept.md) | [Technologie-Stack →](./StockMind_AI_Techstack.md)*

---
*Erstellt mit Pragmatica AI Research | Vertraulich | März 2025*
