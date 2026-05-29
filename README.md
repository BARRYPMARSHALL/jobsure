# 🔧 JobSure — Ghost-Managed Local Trade Lead Generation Network

[![Deployed on Railway](https://img.shields.io/badge/Railway-121212?style=flat-square&logo=railway&logoColor=white)](https://jobsure-production.up.railway.app)

> **Find and vet reliable trade professionals. Guaranteed.**  
> A ghost-managed, fully autonomous platform connecting homeowners with pre-vetted trade partners across HVAC, Plumbing, Roofing, Electrical, Landscaping, and Handyman services.

---

## 📈 Full Business Case

### The Problem

The home services market is broken for everyone involved:

**For Homeowners:**
- Angi/Thumbtack flood you with calls from 3+ contractors who may or may not show up
- No accountability — you pay for the lead, not the result
- Quality is a lottery; reviews can be gamed
- Scheduling takes days of back-and-forth
- No guarantee the job will actually get done

**For Trade Professionals:**
- Paying $25–$70 per unqualified lead that may never convert
- 40%+ of leads are wrong fit (wrong service, wrong area, wrong budget)
- Admin overhead: answering calls, qualifying leads, scheduling, chasing reviews
- No recurring revenue model — every month starts at zero
- Small operators can't afford marketing or SEO

**The Gap:** No platform exists that guarantees outcomes *for both sides* — homeowner gets a completed job, partner gets a confirmed booking. Every incumbent optimises for lead volume, not job completion.

### The Solution

JobSure is a **ghost-managed platform** — meaning it runs itself. Seven autonomous AI agents handle everything between lead capture and job completion:

| Capability | How JobSure Solves It |
|---|---|
| **Lead Qualification** | Intake agent scores leads 0–100 on fit, budget, urgency, location. Only quality leads reach partners. |
| **Auto-Matching** | Best-fit partner is algorithmically assigned based on service, availability, rating, and proximity. No human dispatching needed. |
| **Guaranteed Booking** | Lead converts to booking automatically. No "I'll call you back." |
| **Review Pipeline** | Reviews agent chases every completed job. Ratings feed back into partner scores. Self-reinforcing quality loop. |
| **SEO Content Engine** | Marketing agent generates hyperlocal landing pages (storm damage, seasonal specials, emergency 24/7) on a 12-hour refresh cycle. Zero human content cost. |
| **Market Sensing** | OS Framework monitors competitors, regulations, weather events, and market shifts. Produces trend alerts. |
| **Self-Optimisation** | Learning loop tracks agent outcomes, finds failure patterns, and generates improvement suggestions. The system improves itself. |

**Core promise:** Partners only pay for completed, confirmed appointments. No per-lead charges. If the job doesn't happen, the partner doesn't pay.

### Market Opportunity

| Metric | Value |
|---|---|
| US home services market | **$600B+** (annual) |
| Angi market cap (peak) | ~$2.5B (declining — trust eroded) |
| Thumbtack valuation | ~$3.2B (pay-per-lead model) |
| Average trade pro spend on lead gen | **$3,000–$8,000/year** |
| Lead waste (wrong fit / no-show) | **40–60%** |
| JobSure differentiator | **Pay-per-completed-job** + AI-managed operations |

The incumbent model (pay-per-lead) is ripe for disruption. Trade professionals are tired of paying for calls that don't convert. Homeowners are tired of being sold to instead of served. JobSure flips the incentive: **we only make money when the job gets done.**

### Revenue Model

| Stream | Mechanics | Margin Characteristics |
|---|---|---|
| **Per-Booking Fee** | 15% of every completed job (configurable per partner) | High margin — no COGS beyond infrastructure and LLM API calls |
| **Monthly Retainer** | Optional flat fee per partner for priority matching and premium placement | Pure margin — 100% after setup |
| **Lead Boost** | Partners can pay extra for high-score leads (90+ qualification) | Upsell on existing infrastructure |
| **Enterprise / Multi-City** | Per-city license for franchise operators expanding a partner network | Scalable — same software, new geography |

**Unit Economics (Illustrative):**

| Job Value | JobSure Fee (15%) | LLM Cost | Net Margin |
|---|---|---|---|
| $200 | $30 | ~$0.50 | **~98%** |
| $500 | $75 | ~$0.50 | **~99%** |
| $2,000 (roof/HVAC) | $300 | ~$0.50 | **~99.8%** |

At 10 jobs/day across 20 partners, monthly revenue = **$9,000–$45,000** with negligible marginal cost.

### Competitive Moat

1. **Ghost-Managed Operations** — 7 autonomous agents run the entire business. No customer success team, no dispatchers, no content writers, no operations managers. The platform is the business.
2. **Outcome-Based Pricing** — Partners pay for completed jobs, not leads. This aligns incentives completely and is a credible differentiator against Angi/Thumbtack.
3. **Self-Optimising Flywheel** — The OS Framework (Tacit Knowledge → Sensing → Learning → Governance) means the system gets smarter every cycle. More completed jobs → more review data → better partner scores → better matches → more completed jobs.
4. **Hyperlocal SEO Engine** — The marketing agent generates targeted landing pages for every service × location combination. No human SEO team needed.
5. **Zero Human Overhead** — The entire stack (lead intake → booking → completion → review → content → sensing) runs on cron-driven AI agents. Labour cost is effectively zero.

### Go-to-Market Strategy

**Phase 1 — Single City (Current)**
- Seed with 5–10 vetted trade partners in one metro area
- Drive homeowner leads through SEO-generated landing pages + local referrals
- Prove unit economics: $0.50 LLM cost per transaction at 15% take rate
- Pipeline: see [Roadmap](#-roadmap)

**Phase 2 — Multi-City Expansion**
- Clone the partner network playbook per city
- Marketing agent generates city-specific landing pages automatically
- Sensing agent identifies ideal next markets based on competitor weakness and local demand

**Phase 3 — Franchise / White-Label**
- License the JobSure stack to local operators
- Each franchise gets their own autonomous instance with local partner pool
- Central oversight via OS Framework governance layer

### Why Now

- **LLM costs are collapsing** — running 7 agents costs less than a coffee per day
- **Trust in legacy platforms is declining** — Angi's net promoter score has fallen 40% in 3 years
- **AI-native operations are a first-mover advantage** — no competitor runs a fully autonomous platform
- **Trade professionals are desperate** — 73% say lead quality is their #1 business problem (IBISWorld)
- **Stripe Connect + AI makes pay-per-completion viable** — we can hold funds in escrow and release on job completion automatically

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/BARRYPMARSHALL/jobsure.git
cd jobsure

# 2. Install dependencies
cd backend && npm ci && cd ../frontend && npm ci && cd ..

# 3. Build
cd backend && npx tsc && cd ../frontend && npm run build && cd ..

# 4. Run
cd backend && JWT_SECRET=your-secret node dist/server.js
# → http://localhost:3101
```

### Deploy to Railway

```bash
# Set these environment variables:
JWT_SECRET=<your-secret>
PORT=3101      # Railway sets this automatically
```

The included `Dockerfile` and `railway.json` handle everything — just connect your GitHub repo.

---

## 📊 Live Demo

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | `/` | Public marketing page with service categories |
| **Login** | `/login` | Owner/partner authentication |
| **Dashboard** | `/app` | Real-time business metrics, revenue, agent activity |
| **Partners** | `/app/partners` | Manage trade partner network |
| **Leads** | `/app/leads` | Incoming lead queue with qualification scoring |
| **Bookings** | `/app/bookings` | Scheduled appointments and job pipeline |

---

## 🧠 Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)               │
│ Landing → Login → Dashboard → Partners → Leads → Bookings  │
└─────────────────────────┬──────────────────────────────────┘
                          │ /api/*
┌─────────────────────────▼──────────────────────────────────┐
│                  BACKEND (Express + TypeScript)              │
├────────────────────────────────────────────────────────────┤
│  ROUTES (26 endpoints across 9 resource groups)            │
│  Auth (register/login/me) · Partners (CRUD)                  │
│  Leads (CRUD + qualify) · Bookings (schedule/manage)        │
│  Jobs (complete/pay) · Dashboard (owner metrics)            │
│  Service Categories · Marketing (landing pages)              │
│  OS Framework (tacit/sensing/learning/governance)           │
├────────────────────────────────────────────────────────────┤
│  AGENTS (7 autonomous workers, cron-driven)                 │
├────────────────────────────────────────────────────────────┤
│  DATABASE (better-sqlite3, 15 tables, WAL mode)            │
└────────────────────────────────────────────────────────────┘
```

---

## 🤖 Autonomous Agents

JobSure runs **7 AI agents** that operate on cron schedules — processing leads, chasing reviews, generating content, and monitoring market conditions.

### Flywheel Agents

| Agent | What It Does | Schedule | File |
|-------|-------------|----------|------|
| **Intake** | Captures new leads → scores qualification (0–100) → auto-matches best partner → books appointment | On-demand via API | [`intake.ts`](backend/src/agents/intake.ts) |
| **Reviews** | Finds completed jobs needing reviews → sends review requests → submits ratings → recalculates partner scores | Daily 7 AM | [`reviews.ts`](backend/src/agents/reviews.ts) |
| **Marketing/SEO** | Generates SEO-optimized landing pages (storm damage, seasonal, emergency) → ad copy → auto-refreshes stale content | Every 12 hours | [`marketing.ts`](backend/src/agents/marketing.ts) |

### Organizational Singularity (OS Framework) Agents

| Agent | What It Does | File |
|-------|-------------|------|
| **Sensing** | Monitors external events (competitors, regulations, weather, market shifts) → generates trend reports → sends urgent alerts | [`sensing.ts`](backend/src/agents/sensing.ts) |
| **Tacit Knowledge** | Captures undocumented workflows → interviews domain experts → AI-readiness scoring → structured knowledge repository | [`tacit-knowledge.ts`](backend/src/agents/tacit-knowledge.ts) |
| **Learning Loop** | Tracks agent outcomes → analyzes failure patterns → generates improvement suggestions → self-optimizing system | [`learning.ts`](backend/src/agents/learning.ts) |
| **Governance** | Creates checkpoints before destructive actions → rollback capability → human review queue → approval workflow | [`governance.ts`](backend/src/agents/governance.ts) |

---

## 💰 Business Model

| Revenue Stream | How it Works | Default |
|---------------|--------------|---------|
| **Per-Booking Fee** | Percentage of every completed job | 15% (configurable) |
| **Monthly Retainer** | Optional flat fee per partner | Configurable via `monthly_retainer_cents` |
| **Partner Value Prop** | Only pay for confirmed, completed appointments | Guaranteed leads |

---

## 🗄️ Database Schema (15 tables)

```
organizations  │  users  │  partners  │  service_categories  
leads          │  bookings  │  jobs  │  landing_pages  
agent_activity_log
── OS Framework ──
workflows     │  sensing_events  │  agent_outcomes  
agent_checkpoints  │  human_review_queue
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, React Router 6, Tailwind CSS |
| **Backend** | Express 4, TypeScript, Node 20 |
| **Database** | better-sqlite3 (WAL mode, foreign keys) |
| **Auth** | JWT (bcryptjs, jsonwebtoken) |
| **Payments** | Stripe (ready, not activated) |
| **Scheduling** | node-cron (daily 7AM + every 12h) |
| **Deployment** | Docker multi-stage build, Railway |

---

## 📁 Project Structure

```
jobsure/
├── backend/
│   └── src/
│       ├── agents/           # 7 autonomous AI agents
│       │   ├── intake.ts     # Lead capture, qualification, matching
│       │   ├── reviews.ts    # Review chase + rating system
│       │   ├── marketing.ts  # SEO landing pages + ad copy
│       │   ├── sensing.ts    # External event monitoring
│       │   ├── tacit-knowledge.ts  # Workflow capture
│       │   ├── learning.ts   # Outcome analysis + improvement
│       │   └── governance.ts # Checkpoints + human review
│       ├── middleware/
│       │   └── auth.ts       # JWT auth middleware
│       ├── routes/
│       │   └── api.ts        # 26 endpoints across 9 groups
│       ├── utils/
│       │   └── helpers.ts    # ID generation, utilities
│       ├── database.ts       # Schema + query wrapper
│       └── server.ts         # Express app entry point
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Landing.tsx         # Public marketing page
│       │   ├── Login.tsx           # Auth page
│       │   ├── OwnerDashboard.tsx  # Main metrics view
│       │   ├── PartnersPage.tsx    # Partner CRUD
│       │   ├── LeadsPage.tsx       # Lead queue
│       │   └── BookingsPage.tsx    # Appointment pipeline
│       ├── components/
│       │   └── Layout.tsx          # Sidebar + nav
│       ├── lib/
│       │   └── api.ts              # API client
│       ├── App.tsx                 # Router + auth guard
│       └── main.tsx                # React entry
├── data/                    # SQLite database (auto-created)
├── Dockerfile               # Multi-stage production build
└── railway.json             # Railway deployment config
```

---

## 📋 API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Current user profile |

### Partners
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/partners` | Yes | List all partners |
| GET | `/api/partners/:id` | Yes | Partner details |
| POST | `/api/partners` | Yes | Create partner |
| PUT | `/api/partners/:id` | Yes | Update partner |
| DELETE | `/api/partners/:id` | Yes | Remove partner |

### Leads
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/leads` | Yes | List all leads |
| GET | `/api/leads/:id` | Yes | Lead details |
| POST | `/api/leads` | Yes | Create lead |
| POST | `/api/leads/:id/qualify` | Yes | Score + match |
| POST | `/api/leads/:id/book` | Yes | Convert to booking |

### Bookings
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/bookings` | Yes | List all bookings |
| POST | `/api/bookings` | Yes | Create booking |
| PUT | `/api/bookings/:id` | Yes | Update booking |
| POST | `/api/bookings/:id/complete` | Yes | Complete job, record revenue |

### Dashboard
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dashboard` | Yes | Owner metrics + agent activity |

### OS Framework
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/os/tacit` | Yes | Workflow knowledge base |
| POST | `/api/os/tacit/capture` | Yes | Capture new workflow |
| GET | `/api/os/sensing` | Yes | Sensing events |
| POST | `/api/os/sensing/detect` | Yes | Trigger detection cycle |
| GET | `/api/os/learning` | Yes | Agent outcomes + patterns |
| POST | `/api/os/learning/analyze` | Yes | Run learning analysis |
| GET | `/api/os/governance` | Yes | Review queue |
| POST | `/api/os/governance/approve` | Yes | Approve/reject review item |

### Marketing
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/marketing/landing-pages` | Yes | SEO landing pages |
| POST | `/api/marketing/generate-page` | Yes | Generate new landing page |
| POST | `/api/marketing/refresh-stale` | Yes | Refresh old content |

### Service Categories
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/service-categories` | No | List all service categories |

---

## 🔄 Agent Workflows (Flywheel)

```
                     ┌──────────────────────┐
                     │   Lead Captured via   │
                     │  Web / Phone / Refer  │
                     └──────────┬───────────┘
                                │
                     ┌─────────▼──────────┐
                     │  Intake Agent       │
                     │  • Qualification    │
                     │  • Score (0-100)    │
                     │  • Partner Match    │
                     └─────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Booking Scheduled  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Job Completed      │
                    │  (via API endpoint)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Reviews Agent       │◄── Daily 7 AM cron
                    │  • Chase review      │
                    │  • Update rating     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Marketing Agent     │◄── Every 12h cron
                    │  • SEO landing pages │
                    │  • Content refresh   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Sensing Agent       │◄── Daily 8 AM cron
                    │  • Market monitoring │
                    │  • Alerts            │
                    └──────────────────────┘
```

---

## 🎯 Roadmap

- [ ] **Stripe integration** — Live payment processing and partner payouts
- [ ] **SMS intake** — Automated lead capture via Twilio/SMS
- [ ] **Owner Telegram bot** — Real-time alerts and daily summary
- [ ] **Multi-city expansion** — Per-city landing pages and partner pools
- [ ] **Review syndication** — Push reviews to Google Business / Yelp
- [ ] **Dynamic pricing** — AI-driven job costing based on market data

---

## 🧰 Development

```bash
# Backend dev mode (auto-reload)
cd backend && npm run dev

# Frontend dev mode (with HMR)
cd frontend && npm run dev

# Build everything
cd backend && npx tsc && cd ../frontend && npm run build

# Run backend
cd backend && JWT_SECRET=dev-secret node dist/server.js
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | ✅ | — | Secret key for auth tokens |
| `PORT` | ❌ | `3101` | Server port |
| `DATABASE_PATH` | ❌ | `./data/jobsure.db` | SQLite database location |

---

## 📄 License

MIT — built as an internal business launch kit template by [BARRYPMARSHALL](https://github.com/BARRYPMARSHALL).

---

*Built with Hermes Agent · Deployed on Railway · 7-agent autonomous flywheel*
