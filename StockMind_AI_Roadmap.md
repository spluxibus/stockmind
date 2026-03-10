# StockMind AI — Regulatorik & Roadmap

*← [Zurück zum Hauptkonzept](./StockMind_AI_Konzept.md)*

---

## 7. Regulatorische Hinweise

### 7.1 Positionierung als Information-Tool

Die klare regulatorische Positionierung ist entscheidend für einen risikofreien Launch. StockMind AI positioniert sich ausschliesslich als **Informations- und Analyse-Tool**, nicht als Anlageberatung.

| Aspekt | Vorgehen |
|---|---|
| **Disclaimer** | Jeder Report trägt dauerhaft sichtbaren Hinweis: *"Keine Anlageberatung. Alle Inhalte dienen ausschliesslich Informationszwecken."* |
| **Keine Personalisierung** | Reports beziehen sich auf Titel, nicht auf die individuelle Vermögenssituation des Nutzers |
| **Keine Handlungsaufforderung** | "Buy / Sell"-Empfehlungen werden als "Analyst-Konsens" kommuniziert, nicht als eigene Empfehlung der Plattform |
| **Risiko-Transparenz** | Explizite Risikofaktor-Sektion in jedem Deep Dive — schützt vor Haftungsansprüchen |

### 7.2 Relevante Regulierung (CH/EU)

| Regulierung | Relevanz | Massnahme |
|---|---|---|
| **FIDLEG (CH)** | Anlageberatung und -empfehlung sind reguliert | Positionierung als reines Info-Tool umgeht Bewilligungspflicht |
| **MiFID II (EU)** | Research-Klassifizierung für institutionelle Kunden | Enterprise-Tier: Prüfung ob "Investment Research" gem. MiFID II greift |
| **DSGVO / DSG (CH)** | Nutzerdaten, Watchlists, Analyseverhalten | Privacy Policy, Data Processing Agreement, Server in EU/CH |
| **Urheberrecht** | Nutzung öffentlicher Finanzdaten | SEC EDGAR: Public Domain; Yahoo Finance TOS beachten; eigene Datenquellen bevorzugen |

### 7.3 Empfehlung für Rollout

```
Phase 1–2:  Reines Information-Tool, kein regulierter Akteur
            → Kein FINMA-Kontakt nötig
            
Phase 3:    Enterprise / Family Office Dienste
            → Rechtsgutachten empfohlen (1x CHF 2'000–5'000)
            
Phase 4:    Advisory-Dienste (personalisierte Empfehlungen)
            → Kooperation mit reguliertem Finanzintermediär
               oder eigene FINMA-Bewilligung (Aufwand: hoch)
```

---

## 8. Entwicklungs-Roadmap

### 8.1 Phasenübersicht

```
2025 Q2          2025 Q3          2025 Q4          2026 Q1+
   │                │                │                │
[Phase 1]       [Phase 2]        [Phase 3]        [Phase 4]
  MVP             Launch           Scale            Expand
```

---

### Phase 1: MVP (Monate 0–3)

**Ziel:** Funktionierender Proof-of-Concept mit 50 Beta-Usern und validiertem Report-Format

| Deliverable | Details |
|---|---|
| Stock Snapshot | US-Aktien (S&P 500), manuell getriggert via Web-UI |
| Deep Dive Report | Fundamentalanalyse + DCF + Risiken, PDF-Export |
| Tech-Setup | Next.js + Supabase + Claude API + Polygon.io |
| Auth | E-Mail-Registrierung, Supabase Auth |
| Kein Bezahlsystem | Beta-User erhalten kostenlosen Zugang gegen Feedback |

**Erfolgskriterien:**
- ≥ 50 aktive Beta-User
- Durchschnittliche Report-Qualitätsbewertung ≥ 4.0/5.0
- Report-Generierungszeit < 90 Sekunden (Deep Dive)
- NPS ≥ 30

---

### Phase 2: Launch (Monate 3–6)

**Ziel:** Öffentlicher Launch mit Monetarisierung, erste zahlende Kunden

| Deliverable | Details |
|---|---|
| Earnings Brief | Automatisch nach Quartalsergebnissen via Webhook |
| Watchlist-Digest | Wöchentlicher E-Mail-Report für Watchlist |
| PDF-Export | Branded Reports mit Disclaimer |
| Stripe-Integration | Starter & Pro Tier, Credit-System |
| Broker Affiliate Links | IBKR, Swissquote als erste Partner |
| EU/CH-Aktien | DAX, SMI, STOXX 50 erweitern das Universum |

**Erfolgskriterien:**
- ≥ 200 zahlende User (davon ≥ 30 Pro)
- MRR ≥ CHF 4'000
- Churn < 8% / Monat

---

### Phase 3: Scale (Monate 6–12)

**Ziel:** Skalierung auf 1'000+ User, API-Öffnung, institutionelle Features

| Deliverable | Details |
|---|---|
| REST API | Öffentlicher API-Zugang (Premium+), OpenAPI-Doku |
| Alert-System | Push/E-Mail bei Kurszielen, News-Events, Earnings |
| Scheduler | Automatische Deep Dives bei jedem Earnings-Release |
| Premium + Enterprise Tier | White-Label-Option, SLA, SSO |
| Expert Network (Beta) | Vermittlung CFA-Analysten für 1:1 Calls |
| Mobile PWA | Progressive Web App für Mobile-Nutzung |

**Erfolgskriterien:**
- ≥ 1'000 zahlende User
- MRR ≥ CHF 25'000
- ≥ 3 Enterprise-Verträge

---

### Phase 4: Expand (12+ Monate)

**Ziel:** Plattform-Geschäft, neue Revenue Streams, internationale Expansion

| Deliverable | Details |
|---|---|
| Report Marketplace | User können Screens/Templates verkaufen (70/30 Split) |
| Nischenmärkte | Crypto, REITs, ETF-Analyse als neue Verticals |
| Data Licensing | Aggregierte Nutzungsdaten als B2B-Datenprodukt |
| Native Mobile App | React Native iOS/Android App |
| Partnerprogramm | Referral-System für Influencer / Finanz-Blogger |
| KI-Modell-Fine-Tuning | Eigenes Fine-Tuned Model auf Analyst-Reports |

---

### 8.2 Ressourcen & Budget (Schätzung)

| Phase | Personalbedarf | Monatliche Infrastrukturkosten | Hauptinvestition |
|---|---|---|---|
| Phase 1 | 1 Developer (80%) | CHF 200–400 | Entwicklungszeit |
| Phase 2 | 1–2 Developer | CHF 500–1'000 | Marketing / Kundenakquise |
| Phase 3 | 2–3 Personen + Support | CHF 1'500–3'000 | API-Kosten skalieren mit Volumen |
| Phase 4 | 4–6 Personen | CHF 4'000–8'000 | Mobile App, Partnerships |

---

## 9. Fazit & Empfehlung

StockMind AI adressiert einen klar definierten Pain Point: professionelles Aktien-Research ist teuer, zeitintensiv und institutionell geprägt. Agentic AI erlaubt es erstmals, diesen Prozess weitgehend zu automatisieren — mit einer Qualität, die für Privatanleger und semi-professionelle Investoren echter Mehrwert darstellt.

**Die drei entscheidenden Erfolgsfaktoren:**

1. **Report-Qualität** — Vertrauen ist der einzige Moat im Research-Geschäft. Lieber weniger Aktien-Universum, dafür exzellente Qualität in der Beta-Phase.

2. **Regulatorische Klarheit** — Klare Positionierung als Information-Tool von Tag 1. Kein Abwarten auf rechtliche Klärung — proaktiv kommunizieren.

3. **Community vor Scale** — Eine kleine, engagierte Beta-Community von 50 echten Nutzern gibt mehr Aufschluss als jede Marktanalyse. Feedback-Loop vor Full-Launch zwingend.

**Empfohlener nächster Schritt:** Proof-of-Concept für einen einzelnen Report-Agenten (Stock Snapshot für 5 Beispielaktien) als technische Validierung, bevor in Infrastruktur investiert wird.

---

*← [Technologie-Stack](./StockMind_AI_Techstack.md) | [Zurück zum Hauptkonzept](./StockMind_AI_Konzept.md)*

---
*Erstellt mit Pragmatica AI Research | Vertraulich | März 2025*
