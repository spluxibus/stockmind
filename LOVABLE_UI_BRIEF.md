# StockMind AI — UI Design Brief for Lovable

## Project Overview

**StockMind AI** is an AI-powered stock analysis web platform. It acts as an automated equity analyst — generating professional-grade stock research reports on demand in seconds.

**Target users:** Private investors, semi-professional traders, family offices.

**Tone:** Professional and trustworthy. This is a financial tool — users rely on it for serious investment research. The design should instil confidence and make complex financial data feel approachable.

**Tech stack (do not change):** Next.js 14 (App Router), TailwindCSS, shadcn/ui. All existing API routes and business logic stay unchanged. Only the visual/UI layer should be redesigned.

---

## Design Decisions (Pre-Defined)

- **Color mode:** Light mode default
- **Score visualisation:** Radar chart (5 dimensions: Valuation, Profitability, Growth, Financial Health, Momentum)
- **PDF export button:** Placed in the report header/action bar
- **Report section order (fixed):** Company Header → Key Metrics → Price Chart → AI Commentary → Analyst Consensus → Score Card → News
- **Mobile:** All screens including Deep Dive must be fully responsive
- **Branding:** Lovable should propose a brand identity (logo concept, color palette, typeface) that suits a professional fintech tool

---

## Screens & Functional Requirements

---

### Screen 0: Public Landing Page (`/`)

This is a **conversion-focused marketing page** for visitors who are not yet signed up. The goal is to explain the product and convert visitors into registered users.

**Must include:**
- A "Sign in" / "Log in" button prominently accessible at the top (navigates to `/login`)
- A clear primary CTA to create a free account (navigates to `/register`)
- A concise explanation of what StockMind AI does and who it is for
- Trust-building elements using established behavioural design patterns:
  - Social proof (e.g. number of reports generated, beta user quotes)
  - Credibility signals (data sources, AI model quality, financial grade output)
  - Loss aversion / urgency framing (e.g. "free during beta")
  - Visual preview of the actual product (report screenshot or mockup)
- Feature highlights for the three core products: Stock Snapshot, Deep Dive Report, Watchlist
- Footer with disclaimer: "Not investment advice. All content is for informational purposes only."

Logged-in users visiting `/` should be redirected to `/dashboard`.

---

### Screen 1: Login Page (`/login`)

**Purpose:** Sign in for returning users.

**Must include:**
- StockMind AI logo and tagline
- Email + password form fields
- Inline error message on failed login
- Loading state on the submit button while signing in
- Link to registration page (`/register`)
- Disclaimer footer

---

### Screen 2: Register Page (`/register`)

**Purpose:** Account creation for new users.

**Must include:**
- StockMind AI logo and tagline
- Email, password, and confirm password fields
- Password validation (min 6 characters, passwords must match) with inline error messages
- Loading state on submit
- Link back to login (`/login`)
- Disclaimer footer

**Success state** (after form submission):
- Replace form with a confirmation screen telling the user to check their email for a confirmation link
- Link back to login

---

### Global Layout (All Authenticated Pages)

All authenticated pages (`/dashboard`, `/watchlist`, `/stock/*`) share a common shell.

**Header (persistent, top of every authenticated page):**
- StockMind AI logo (left) — links to `/dashboard`
- Global stock search bar (center) — text input with autosuggest dropdown that shows matching tickers, company names, and sectors. Selecting a result or pressing Enter navigates to `/stock/[ticker]`
- User menu (right) — shows user avatar/initials, clicking opens a dropdown with the user's email and a "Sign out" option

**Sidebar (persistent, visible on desktop):**
- Navigation to: Dashboard (`/dashboard`) and Watchlist (`/watchlist`)
- Active state for the current page
- Beta notice at the bottom (free access during beta period)

---

### Screen 3: Dashboard (`/dashboard`)

**Purpose:** Home screen after login. Orients the user to the platform and provides quick access to recent activity.

**Must include:**
- Personalised greeting using the user's email prefix, with a time-of-day variant (Good morning / afternoon / evening)
- Three feature introduction tiles explaining the platform's core capabilities: Stock Snapshot (~15s), Deep Dive Report (~90s), Watchlist — these are informational, not navigation buttons
- Recent Reports list: shows the user's last 10 reports with ticker, report type (Snapshot or Deep Dive), and date. Each row is clickable and navigates to that report
- Watchlist preview: shows up to 8 watchlisted stocks (ticker + company name), each clickable. Includes a link to the full Watchlist page
- Both lists have empty states with guidance on how to get started
- Disclaimer footer

---

### Screen 4: Stock Snapshot (`/stock/[ticker]`)

**Purpose:** Quick 1-page stock overview. Generates in approximately 15 seconds.

**Must include:**

**Page header / action bar:**
- Breadcrumb: Dashboard → [TICKER] → Snapshot
- Button to navigate to the Deep Dive report for the same ticker
- "Add to Watchlist" button — toggles state to "In Watchlist" once added (persisted)
- PDF export button

**Loading state:**
- Skeleton/shimmer placeholders that mirror the layout of the loaded report
- Should feel like content is loading, not that the page is broken

**Error state:**
- Clear error message
- Retry button that re-triggers the report generation

**Report content (in this order):**

1. **Company Profile Header** — company name, ticker, exchange, sector, current price, price change (%), overall AI recommendation label (e.g. Strong Buy / Buy / Hold / Sell)

2. **Key Metrics** — financial ratios including: P/E, EV/EBITDA, P/B, Dividend Yield, Gross Margin, EBIT Margin, ROE, Revenue Growth, Net Debt/EBITDA, Current Ratio, Beta, Market Cap. Values should be formatted appropriately (%, ×, $B)

3. **Price Chart** — 1-year historical price chart with date on X axis, price on Y axis, hover tooltip, and 52-week high/low indicated

4. **AI Commentary** — Bull case arguments, Bear case arguments, and an executive summary paragraph. All AI-generated text

5. **Analyst Consensus** — Wall Street analyst rating distribution (Buy / Hold / Sell counts), total analyst count, consensus price target, target range (low / consensus / high), implied upside or downside vs current price

6. **Score Card** — Radar chart showing AI scores across 5 dimensions (Valuation, Profitability, Growth, Financial Health, Momentum), each scored 1–10. Overall score prominently shown

7. **Recent News** — 5–8 news items, each with headline (links to source), publisher, date, and a sentiment label (Positive / Neutral / Negative)

8. **Disclaimer** — Generation timestamp and investment advice disclaimer

---

### Screen 5: Deep Dive Report (`/stock/[ticker]/deep-dive`)

**Purpose:** Full analyst-style research report. Takes approximately 60–90 seconds to generate.

**Must include:**

**Page header / action bar:**
- Breadcrumb: Dashboard → [TICKER] → Deep Dive
- "Add to Watchlist" button
- PDF export button

**Loading state (critical — up to 90 seconds):**
- The user must feel that the AI is actively working throughout the wait
- Should show elapsed time and estimated total duration
- Should show dynamic status messages that change as time progresses, corresponding to the real pipeline steps:
  - Fetching financial data (0–15s)
  - Running financial analysis & DCF model (15–30s)
  - Building peer comparison (30–50s)
  - Generating AI report narrative (50s+)
- Progress indicator that advances smoothly over the full duration

**Error state:**
- Error message + Retry button

**Report content:**

Includes all sections from the Snapshot (Company Header, Key Metrics, Price Chart, AI Commentary, Analyst Consensus, Score Card, News, Disclaimer) plus:

8. **DCF Valuation Model** — model assumptions (Revenue Growth Rate, WACC, Terminal Growth Rate, Projection Period), calculated intrinsic value per share vs current price, upside/downside %, and a valuation verdict (Undervalued / Fairly Valued / Overvalued)

9. **Peer Comparison** — table of 4–6 competitor companies with columns: Company, P/E, EV/EBITDA, Revenue Growth, Gross Margin, Market Cap. The analysed company is highlighted. Cells are color-coded relative to peers

10. **Risk Matrix** — list of identified risk factors, each with a name, severity (High / Medium / Low), and a short description

11. **Full AI Narrative** — extended written analysis with the following sections: Business Overview, Competitive Position, Financial Health Summary, Investment Thesis, Key Catalysts, Conclusion & Recommendation

---

### Screen 6: Watchlist (`/watchlist`)

**Purpose:** Manage the user's tracked stocks.

**Must include:**

**Page header:**
- Title and description
- "Add Stock" button that opens a modal dialog

**Empty state:**
- Illustration or icon with messaging encouraging the user to add their first stock
- Button to open the add stock modal

**Stock grid (when populated):**
- Responsive grid layout (more columns on wider screens)
- Each stock shows: ticker, company name, date added, notes (if any)
- Delete action per stock (with confirmation or undo mechanism)
- Two navigation actions per stock: go to Snapshot or go to Deep Dive

**Add Stock modal:**
- Input for ticker symbol (auto-uppercased, max 10 characters, submittable via Enter)
- Inline error if the stock can't be added
- Cancel and confirm actions

---

## Technical Constraints (Do Not Change)

The following must remain untouched:

- All files under `src/lib/` and `src/app/api/`
- API route paths: `/api/reports/snapshot`, `/api/reports/deep-dive`, `/api/watchlist`, `/api/watchlist/[id]`, `/api/pdf`, `/api/stock/[ticker]`, `/api/stock/search`
- All TypeScript data interfaces and Zod schemas
- Authentication flow (Supabase Auth)
- URL structure: `/dashboard`, `/stock/[ticker]`, `/stock/[ticker]/deep-dive`, `/watchlist`, `/login`, `/register`, `/auth/callback`
