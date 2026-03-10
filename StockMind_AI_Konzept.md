# StockMind AI
## Der Agentic AI Aktien-Analyst als Web-Plattform

**Konzeptpapier v1.0 | März 2025 | Vertraulich**

---

## Inhaltsverzeichnis

1. [Executive Summary](#1-executive-summary)
2. [Problemanalyse: Was macht ein Aktien-Analyst?](#2-problemanalyse-was-macht-ein-aktien-analyst)
3. [Produkt-Vision](#3-produkt-vision-stockmind-ai)
4. [Mehrwert nach Zielgruppe](#4-mehrwert-nach-zielgruppe)
5. [Monetarisierungsmodell](./StockMind_AI_Monetarisierung.md)
6. [Technologie-Stack](./StockMind_AI_Techstack.md)
7. [Regulatorik & Roadmap](./StockMind_AI_Roadmap.md)

---

## 1. Executive Summary

StockMind AI ist eine webbasierte Plattform, die die Arbeit eines professionellen Aktien-Analysten durch Agentic AI automatisiert und demokratisiert. Während institutionelle Anleger seit Jahren von Research-Desks profitieren, fehlt Privatanlegern und kleineren Vermögensverwaltern der Zugang zu strukturierten, tiefgehenden Aktienanalysen — auf Knopfdruck und zu einem Bruchteil der bisherigen Kosten.

Die Plattform kombiniert Large Language Models (LLMs), Finanz-APIs und Web-Search-Agenten zu einem vollständig automatisierten Analyse-System, das Berichte in der Qualität eines Junior-Sell-Side-Analysten liefert. Mit einem klaren Freemium-Stufenmodell adressiert StockMind AI drei Zielgruppen:

- **Informierte Privatanleger** — schnelle, verständliche Einschätzungen ohne Research-Abo
- **Semi-professionelle Trader** — tiefgehende Analysen, Alerts, API-Zugang
- **Professionelle Investoren / Family Offices** — White-Label, Bulk-Reports, Custom Templates

---

## 2. Problemanalyse: Was macht ein Aktien-Analyst?

### 2.1 Klassische Aufgaben eines Sell-Side-Analysten

Ein professioneller Aktien-Analyst produziert regelmässig strukturierte Berichte zu börsenkotierten Unternehmen. Diese umfassen:

| Aufgabe | Beschreibung |
|---|---|
| **Fundamentalanalyse** | Bewertung von Geschäftsmodell, Wettbewerbsposition und Management |
| **Finanzmodellierung** | Analyse von GuV, Bilanz, Cashflow sowie DCF-Bewertung und Peer-Multiples |
| **Kurzfristige Einschätzung** | Kurserwartung, Kursziel, Empfehlung (Buy / Hold / Sell) |
| **Sektor-Kontext** | Einordnung in Branchentrends, Regulierung und Makroumfeld |
| **Risikobewertung** | Identifikation spezifischer Risikofaktoren (regulatorisch, operationell, geopolitisch) |
| **Event-Coverage** | Quartalsergebnisse, Kapitalmarkttage, M&A-Events, Guidance-Updates |

### 2.2 Hauptkennzahlen im Fokus

| Kategorie | Kennzahlen |
|---|---|
| **Bewertung** | KGV, EV/EBITDA, KBV, Dividend Yield, PEG-Ratio |
| **Profitabilität** | Gross Margin, EBIT-Marge, EBITDA-Marge, ROE, ROCE |
| **Wachstum** | Umsatzwachstum (YoY/QoQ), EPS-Wachstum, FCF-Wachstum |
| **Bilanzqualität** | Net Debt/EBITDA, Current Ratio, Interest Coverage |
| **Marktdaten** | Kurs, 52W-Range, Beta, Short Interest, Insider Ownership |
| **Analystenkonsens** | Anzahl Ratings, Kursziel-Range, Konsens-EPS-Schätzungen |

### 2.3 Öffentlich verfügbare Datenquellen

Ein wesentlicher Vorteil des Konzepts liegt darin, dass der Grossteil der benötigten Daten öffentlich zugänglich ist:

- **SEC/EDGAR** — 10-K, 10-Q, 8-K Filings (USA)
- **Unternehmenswebsites** — Investor Relations, Geschäftsberichte, Präsentationen
- **Yahoo Finance / Marketwatch / Seeking Alpha** — Kurs- und Kennzahldaten
- **Finviz, Macrotrends, Simply Wall St** — Historische Kennzahlen und Benchmarks
- **Federal Reserve, Eurostat, IMF** — Makrodaten und Zinsprognosen
- **Finanznachrichtenportale** — Reuters, Bloomberg (teils), FT, Handelsblatt

---

## 3. Produkt-Vision: StockMind AI

### 3.1 Kernprodukte der Plattform

Die Plattform liefert vier klar definierte Analyse-Produkte, die auf Knopfdruck generiert werden:

| Produkt | Beschreibung | Lieferzeit (Ziel) |
|---|---|---|
| **Stock Snapshot** | 1-seitige Kurzübersicht: Kennzahlen, Konsens, Kurs-Chart, Kurzkommentar | < 15 Sek. |
| **Deep Dive Report** | 8–12-seitiger Analysebericht inkl. Fundamentalanalyse, DCF, Risiken, Empfehlung | < 90 Sek. |
| **Earnings Brief** | Automatische Analyse nach Quartalsergebnissen: Vergleich mit Konsenserwartungen, Key Takeaways, Guidance | < 30 Sek. |
| **Watchlist Digest** | Wöchentliche/tägliche Zusammenfassung für Portfolio oder Watchlist mit News-Highlights und Alerts | Scheduled |

### 3.2 Technische Architektur: Agentic AI

Die Plattform basiert auf einem Multi-Agenten-System, das verschiedene spezialisierte Tasks orchestriert:

| Agent / Skill | Aufgabe | Umsetzung |
|---|---|---|
| **Data Collector** | Finanzdaten, Kurse, Filings scrapen & strukturieren | Polygon.io API, SEC-Scraper, Web-Fetch-Agent |
| **News Analyst** | Aktuelle Nachrichten kuratieren, Sentiment analysieren | Web-Search MCP, NLP-Sentiment-Model |
| **Financial Modeler** | Kennzahlen berechnen, Multiples vergleichen, DCF erstellen | Python-Tool (Pandas/Numpy) via MCP |
| **Report Writer** | Strukturierten Analysebericht verfassen | Claude / GPT-4 mit Report-Prompt-Template |
| **Quality Checker** | Fakten prüfen, Konsistenz sichern | Separater Critic-Agent |
| **Scheduler** | Automatische Reports bei Events / Zeitplänen | Cron-Jobs, Webhook-Trigger |

> **Architektur-Entscheid:** Einzelner Orchestrator-Agent (Claude) koordiniert alle Subagenten. Skills, die deterministische Berechnungen erfordern (DCF, Kennzahlen), werden als MCP-Tools implementiert. Alles was Judgment erfordert (Risikobewertung, Formulierung), bleibt beim LLM.

### 3.3 Was lässt sich automatisieren — und was nicht?

**Sofort automatisierbar (MVP-Phase):**
- Standardisierte Kennzahlen-Tabellen und Peer-Comparison
- Zusammenfassung von Earnings-Calls (auf Basis Transkripte)
- News-Aggregation mit Sentiment-Tagging
- DCF-Modelle mit parametrisierten Annahmen
- Equity Research Summary im Analyst-Stil

**Schwieriger / mittelfristig:**
- Qualitative Management-Einschätzung ohne persönliche Gespräche
- Proprietäre Modelle und Kanal-Checks institutioneller Analysten
- Realtime-Kursempfehlung mit haftungsrechtlicher Absicherung

---

## 4. Mehrwert nach Zielgruppe

### 4.1 Für den Privatanleger

- Professionelle Analyse ohne Research-Abo für CHF 5'000+/Jahr
- Verständliche Aufbereitung komplexer Finanzkennzahlen
- Zeitersparnis: 2–3h manuelle Recherche → 30 Sekunden
- Alert-System bei relevanten News oder Kursveränderungen
- Plain-Language-Erklärungen inklusive — kein Finanzwissen vorausgesetzt

### 4.2 Für Investment Manager / Family Offices

- Schnell-Screening von Opportunitäten im Deal-Flow
- Standardisierte Erste-Einschätzung als Grundlage für eigene Analyse
- Kosten-Nutzen-Vorteil gegenüber externen Research-Providern (Bloomberg Intelligence, FactSet)
- API-Zugang für Integration in eigene Systeme und Workflows
- White-Label-Option: Reports im eigenen Branding

### 4.3 Vergleich: Markt & Positionierung

| Anbieter | Stärke | Schwäche | StockMind-Vorteil |
|---|---|---|---|
| Seeking Alpha Premium | Community + News | Kein strukturierter Report | Analyst-Stil, automatisiert |
| Simply Wall St | Visualisierung | Flach, keine Tiefe | DCF + Narrativ |
| Bloomberg Terminal | Vollständig | CHF 2'000+/Monat | Erschwinglich |
| Morningstar | Research-Qualität | Langsam, wenig Aktien | On-demand, skalierbar |

---

*Weiter: [Monetarisierung →](./StockMind_AI_Monetarisierung.md)*

