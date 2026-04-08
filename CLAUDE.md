# The Chekhov Toolkit — Actor's Toolbox

## What This Is

An NMCA-commissioned (National Michael Chekhov Association) web app for actors, directors, and acting teachers to practice the Michael Chekhov acting technique. Commissioned by Lisa Dalton, NMCA President & Master Teacher.

**Working Name:** "The Chekhov Toolkit" / "Actor's Toolkit"

## Current State

This is a **working prototype** built in Replit (~80% of core feature complete). We are in **Phase 1: Ship the React prototype by Friday April 10, 2026.** A Phase 2 Vue/Nuxt rebuild will follow later.

### What Already Works
- Tool Wheel: circular category selector with 14 categories from the Chart of Inspired Action
- Draw Tool: random selection with hierarchy filtering (Cards/Tools/Examples)
- Tool Reveal Card: full-screen display with category badge, tool name, child example, scale value, unveiled value
- Flyback Journal: freeform text reflection per draw
- Session History: scrollable past draws with timestamps
- Category Detail Modal: drill into categories to select/deselect parent tools
- Dark/Light theme toggle

### What Needs to Be Built (Phase 1 — Friday Prototype)
1. **Swap Neon PostgreSQL → SQLite** (remove cloud DB dependency)
2. **POA Journal** (Practice/Observe/Apply structured fields — see spec)
3. **Mobile polish** (Lisa will open this on her phone)
4. **Deploy** to a shareable URL

### What's Deferred to Phase 2
- Calendar/daily practice view
- Library section (YouTube links, books)
- Directory/Atlas (certified teacher map)
- Settings page
- Push notifications
- Mobile app builds (Capacitor)
- Vue/Nuxt rewrite

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui (Radix primitives)
- **Backend:** Express.js + Drizzle ORM
- **Database:** Currently Neon PostgreSQL → **migrating to SQLite (better-sqlite3)**
- **Routing:** wouter (client), Express (server)
- **State:** React Query (@tanstack/react-query)
- **Animations:** framer-motion
- **Icons:** lucide-react

## Architecture

```
client/src/
├── pages/Home.tsx              # Main page — tool wheel + draw + reveal
├── lib/toolData.ts             # Full Chekhov technique taxonomy (14 categories)
├── lib/queryClient.ts          # React Query setup
├── components/
│   ├── CategoryWheel.tsx       # Circular radial category selector
│   ├── DrawButton.tsx          # "Draw Tool" action button
│   ├── ToolRevealCard.tsx      # Full-screen drawn tool display
│   ├── FlybackModal.tsx        # Journal reflection modal
│   ├── HistoryPanel.tsx        # Session history sidebar
│   ├── CategoryDetailModal.tsx # Category drill-down for parent tool selection
│   ├── CategorySelector.tsx    # Alternative grid selector
│   ├── ThemeProvider.tsx       # Dark/light theme
│   ├── ThemeToggle.tsx         # Theme switch button
│   └── ui/                     # shadcn/ui component library
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
└── App.tsx, main.tsx, index.css

server/
├── index.ts                    # Express server entry
├── routes.ts                   # API endpoints (GET/POST drawn-tools, PATCH journal)
├── storage.ts                  # Drizzle ORM storage layer (IStorage interface)
├── db.ts                       # Database connection (NEEDS MIGRATION TO SQLITE)
└── vite.ts                     # Vite dev server integration

shared/
└── schema.ts                   # Zod validation + Drizzle table definitions
```

## Data Model: Chart of Inspired Action

The tool taxonomy in `toolData.ts` follows a 3-level hierarchy:

```
Category (e.g., "Psychological Gesture")
├── Parent Tool (e.g., "Opening")
│   └── Children/Examples (e.g., "Welcoming", "Receiving", "Embracing")
```

14 categories, 80+ parent tools, hundreds of children. This data comes from the NMCA's Chart of Inspired Action (©2004) and is used with official permission.

## POA Framework (Practice / Observe / Apply)

This is the daily practice framework for working with a drawn tool:

- **Practice:** 5 minutes of physical movements with the tool's images/qualities
- **Observe:** 1 minute × 3 times daily (morning, midday, evening) — notice where the tool appears naturally in yourself, others, or the world, WITHOUT conscious intent
- **Apply:** 1 minute × 3 times daily — CONSCIOUSLY do the tool while performing a task

The journal should support TWO MODES with a toggle/switch:
1. **Structured mode:** Individual input boxes for Practice, 3× Observe, 3× Apply
2. **Journal mode:** Single open-ended free-text area

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run check        # TypeScript check
npm run db:push      # Push schema to database
```

## ID Consistency — IMPORTANT (pre-build audit)

**Directive: Every category ID in `toolData.ts` MUST get its own card on the wheel.**

There are exactly **15 category IDs** in `client/src/lib/toolData.ts` (the single source of truth):

```
psycho-physical family:   expanding-contracting, qualities-of-movement, archetypal-gestures
emotional-life family:    three-sisters, qualities-sensations, atmosphere, four-brothers
esthetics family:         ensemble, truth, style
characterization family:  movable-centers, imaginary-body, trinity-of-psychology
transformation family:    tempo-rhythm, focal-points
```

### Known issues to fix during build

**Production files (blocking):**

1. **`CategoryWheel.tsx` lines 24-28** — `fixedPositionIndices` references two phantom IDs:
   - `"psychological-gesture"` — does not exist (Phase 2 deferred category)
   - `"characterization"` — not a category ID; it's a *family* name. The three characterization categories are `movable-centers`, `imaginary-body`, `trinity-of-psychology`.
   - Fix: remove phantom entries or replace with real category IDs. Ensure all 15 IDs render cards.

2. **`CategoryCard.tsx` line 12** — fallback icon uses `CATEGORY_ICONS["psychophysical"]` which doesn't exist. Should be `"expanding-contracting"` (matches the fallback used in `CategoryWheel.tsx`).

**Example files (non-blocking but will fail `tsc`):**

3. **`examples/CategorySelector.tsx`** — references `"psychophysical"` and `"tpt"`, neither of which exist as category IDs.
4. **`examples/HistoryPanel.tsx`** — uses `toolName` instead of `parentToolName` (schema mismatch), and references phantom IDs `"psychophysical"` and `"characterization"`.
5. **`examples/CategoryWheel.tsx`** — missing the required `onOpenDetail` prop.

### What's already clean
- `shared/schema.ts` types are flexible (no hardcoded ID enums)
- `Home.tsx`, `CategoryDetailModal.tsx`, `ToolRevealCard.tsx`, `HistoryPanel.tsx` (main) — all use dynamic lookups against `TOOL_CATEGORIES`
- `CATEGORY_ICONS` map in `toolData.ts` — all 15 IDs have entries, no orphans
- Server `routes.ts` — no ID references, just passthrough

## Code Conventions

- TypeScript strict mode
- Tailwind for all styling (no inline styles except dynamic values)
- shadcn/ui components from `@/components/ui/`
- Shared types/schemas in `shared/schema.ts` using Zod
- API routes in `server/routes.ts` using Express
- Storage interface pattern in `server/storage.ts`
- Test IDs on interactive elements: `data-testid="descriptive-name"`
- Mobile-first responsive design (base → sm → md → lg breakpoints)

## Design Philosophy

- Theatrical reveal experience (tarot/oracle card inspiration)
- Clean utility structure (Linear/Notion inspiration) for selection
- The reveal should feel ceremonial and inspiring
- See `design_guidelines.md` for full visual spec

## Important Context

- Lisa Dalton (the stakeholder) will test this on her phone — mobile UX is critical
- This is an OFFICIAL NMCA project, not a personal project
- The tool taxonomy is the real deal — validated by Chekhov practitioners
- "Flyback" is the existing journal term used in the codebase
- "Unveiled" is a 1-10 scale representing how veiled/unveiled a quality is
