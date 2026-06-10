# The Michael Chekhov Toolkit — Agent Context

Last refreshed: 2026-06-05 during Phase 0.

This file is the working source of truth for Claude Code and other repo agents. If this file conflicts with older `replit.md`, `.claude/plans/phase1-prototype.md`, or stale April/November notes, prefer this file unless Dawson explicitly says otherwise.

## What this project is

The Michael Chekhov Toolkit is an official/private-beta practice app for actors, directors, teachers, and students working with Michael Chekhov technique. It is grounded in the National Michael Chekhov Association's Chart of Inspired Action and Lisa Dalton's sanctioned project direction.

Stakeholder context:
- Lisa Dalton is the primary stakeholder and phone-testing path.
- The Chart of Inspired Action is NMCA-validated source territory.
- Dawson's current product name decision is: **The Michael Chekhov Toolkit**.
- Public/beta naming should stay warm, official, and actor-centered. Do not use "Chekhov's Hired Gun" as public branding.

Approved beta attribution wording:

> The Michael Chekhov Toolkit is a private beta practice app inspired by the Chart of Inspired Action from the National Michael Chekhov Association and Lisa Dalton. Built for actor training, rehearsal, and daily Michael Chekhov practice.

Copyright / credit line:

> Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.

Keep attribution text centralized in implementation so Lisa can refine it after weekend feedback.

## Non-negotiable guardrails

1. Do not discard, reset, or overwrite existing dirty work unless Dawson explicitly approves it.
2. Run `git status --short` before editing and understand what is already dirty.
3. Do not casually rename or edit NMCA/Chekhov taxonomy terms in `client/src/lib/toolData.ts`.
4. First beta must not include AI-generated embodied Chekhov practice prompts.
   - Use taxonomy labels, POA structure, sourced/cited excerpts, and neutral navigation copy only.
   - Do not present invented practice language as Michael Chekhov, Lisa Dalton, or NMCA teaching.
5. Treat Lisa Dalton phone testing as a primary acceptance path.
6. Do not deploy, publish, or send a URL to Lisa/NMCA without Dawson approval.
7. Do not add paid services, app-store distribution, or new provider commitments without Dawson approval.
8. Do not claim "secure beta" unless Supabase Auth/Postgres/RLS or equivalent user-owned security is actually implemented and verified.

## Current repository state

This repository currently contains a working React/Vite/Express/SQLite prototype. It is not yet the approved Ionic Vue + Capacitor/PWA + Supabase beta architecture.

Current stack in this repo:
- Frontend: React 18, Vite, Tailwind, shadcn/Radix primitives, wouter, TanStack Query.
- Backend: Express, Drizzle ORM, better-sqlite3.
- Database: local SQLite at `data/chekhov.db`; `data/` is gitignored.
- No Vue/Ionic/Capacitor/Supabase app code exists yet unless a later plan creates it.

Current prototype behavior:
- Category wheel and detail modal use the Chekhov taxonomy from `client/src/lib/toolData.ts`.
- Random draw chooses category, parent tool, optional child/example, optional Tempo/Rhythm scale, and optional Unveiled value.
- Reveal card offers Draw Again, Flyback, Begin POA, and Change Categories.
- POA Journal supports Structured and Journal modes.
- Structured POA fields: Practice, Observe morning/midday/evening, Apply morning/midday/evening.
- History loads previous draws from SQLite and can reopen a reveal card.
- Server routes exist for drawn tools and journal entries.

Known current gaps:
- UI still needs full official naming/attribution pass.
- Mature product should be Today’s Practice-centered, not merely draw-centered.
- POA should ultimately attach to a Daily Practice / tool-day object.
- Mobile and accessibility need direct verification, especially on a real iPhone.
- Automated tests beyond typecheck/build are not yet present.

## Current strategic direction

The existing React prototype is a behavior/reference prototype, not the target production foundation.

Approved forward architecture for summer beta:
- Ionic Vue app shell.
- Capacitor-ready mobile path with hosted/installable PWA fallback.
- Supabase Auth + Postgres + Row Level Security by the June 13 secure tester-beta lane.
- Free-first summer beta infrastructure where possible.

Weekend Lisa pilot target:
- A narrow confidence demo, not a full beta.
- Prove app-like Ionic Vue/PWA direction.
- Show official name and attribution.
- Show Today’s Practice with three entry choices:
  - Pick My Own
  - Draw Random
  - Daily Tool, seeded/static is acceptable for the weekend
- Allow preview/re-roll/change before commitment.
- Lock after `Start Today’s Practice`.
- Preserve POA where Lisa already likes it.
- Save/return/reload if possible.
- Verify at phone width and, before Lisa sees it, on a real iPhone.

Explicit weekend defers:
- Full Supabase Auth/RLS unless trivial after the slice.
- Real push notifications.
- Real global Daily Tool scheduler/admin CMS.
- App Store/TestFlight/Play distribution.
- Broad Library/content system.
- AI-generated embodied prompts.
- Broad taxonomy edits.
- Full React feature parity.

June 13 tester-beta target:
- Hosted installable PWA.
- Supabase Auth/profiles/Postgres/RLS.
- Per-user Daily Practice by local date.
- POA tied to Daily Practice.
- Today return path and basic History.
- Feedback capture.
- Mobile/a11y smoke.
- Pareto-Skeleton Library with source cards/citations and only approved, sourced, or clearly closed-beta-under-review excerpt material.

## Source-of-truth docs

Current / high authority:
- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`
- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-kickoff.md`
- `brainstorms/michael-chekhov-toolkit-grill-me.md`
- `brainstorms/agent-orchestration-final-plan-2026-06-04.md`
- `.claude/commands/grill-me.md`

Useful but partially superseded:
- `brainstorms/michael-chekhov-toolkit-dual-brain-review.md`
- `brainstorms/claude-council-review-2026-06-04.md`
- `.claude/plans/2026-05-27-agent-tandem-hour-plan.md`
- `design_guidelines.md`

Treat as historical/stale unless cross-checked:
- `replit.md`
- `.claude/plans/phase1-prototype.md`
- raw council/orchestration brainstorm files

## Working tree and local dev notes

Expected existing dirty WIP from Phase 0 audit:
- `client/src/components/examples/CategoryWheel.tsx`
- `client/src/components/examples/HistoryPanel.tsx`
- `client/src/components/examples/ToolRevealCard.tsx`
- `server/index.ts`
- `.claude/commands/`
- `.claude/plans/2026-05-27-agent-tandem-hour-plan.md`
- `.[removed-semantic-mcp]/`
- `brainstorms/`

Do not clean these automatically. They were treated as intentional WIP during Phase 0.

Key commands:

```bash
npm run check        # TypeScript check
npm run build        # Production build
npm run dev          # Start local full-stack dev server
npm run db:push      # Push schema to local SQLite database
```

Local macOS/Hermes note:
- Port 5000 may be occupied by macOS ControlCenter.
- Prefer an explicit local host/port for smoke tests when needed:

```bash
PORT=5055 HOST=127.0.0.1 npm run dev
```

## Architecture reference

Important files in the current React prototype:

```text
client/src/pages/Home.tsx              # Main prototype page
client/src/lib/toolData.ts             # NMCA/Chekhov taxonomy source territory
client/src/components/CategoryWheel.tsx
client/src/components/CategoryDetailModal.tsx
client/src/components/ToolRevealCard.tsx
client/src/components/FlybackModal.tsx
client/src/components/POAJournal.tsx
client/src/components/HistoryPanel.tsx
client/src/components/ui/              # shadcn/Radix components
server/index.ts                        # Express server entry
server/routes.ts                       # API endpoints
server/storage.ts                      # Drizzle storage layer
server/db.ts                           # better-sqlite3 database connection
shared/schema.ts                       # Drizzle tables + Zod schemas
```

## Data and domain model

The current taxonomy has 15 category IDs in `client/src/lib/toolData.ts`:

```text
psycho-physical family:   expanding-contracting, qualities-of-movement, archetypal-gestures
emotional-life family:    three-sisters, qualities-sensations, atmosphere, four-brothers
esthetics family:         ensemble, truth, style
characterization family:  movable-centers, imaginary-body, trinity-of-psychology
transformation family:    tempo-rhythm, focal-points
```

POA means Practice / Observe / Apply:
- Practice: physical movement/exploration notes.
- Observe: notice where the quality appears naturally.
- Apply: consciously use the tool while doing a task.

Do not expand POA into invented teaching prompts for the first beta. Keep POA as a structure and use sourced/cited excerpts only when available and permitted for the beta context.

Mature model direction:
- Add or model `DailyPractice` / tool-day as the semantic owner.
- A practice day has local date, selected tool, source (`self-selected`, `random`, `global-daily`), lock/start state, and POA entry.
- Current `drawn_tools` and `journal_entries` routes can be mined as reference but should not force the future shape.

## Agent operating model

Hermes/controller owns:
- Scope cuts.
- Dirty-tree protection.
- Reconciliation between Claude/Opus and Codex/GPT-5.5.
- Merge/deploy/share decisions.
- Lisa-readiness gate.

Claude Code / Opus is preferred for:
- Product architecture and coherent vertical slice implementation.
- Mobile-first UX and demo narrative.
- Preserving stakeholder/domain coherence.

Codex / GPT-5.5 is preferred for:
- Read-only or bounded verification.
- Type/build/API smoke.
- Schema/RLS/security review.
- Diff review against the spec.
- Attribution/no-AI-prompt content scans.

Do not let multiple agents freely edit the same files concurrently. If parallel work is needed, use isolated worktrees and explicit file ownership.

## Verification gates

Before calling implementation work ready:
- `npm run check` passes, or the exact new app equivalent passes.
- `npm run build` passes, or the exact new app equivalent passes.
- App opens locally.
- Mobile-width smoke passes.
- Real iPhone smoke is completed before Lisa review.
- Today’s Practice path works for the weekend slice.
- `Start Today’s Practice` lock behavior is verified if implemented.
- POA save/return/reload is verified if implemented.
- Attribution is visible before external sharing.
- Content scan confirms no AI-generated embodied prompts.
- No secrets are present in diffs or committed files.

## Ask Dawson before

- Deploying or sharing externally.
- Adding paid services or app-store accounts.
- Changing taxonomy/source content.
- Adding AI-generated prompt/content layers.
- Replacing the current repo structure in a way that risks the React prototype WIP.
- Committing broad WIP that mixes old dirty-tree fixes with new implementation unless the commit plan is explicit.
