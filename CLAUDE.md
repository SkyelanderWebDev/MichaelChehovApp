# The Michael Chekhov Toolkit — Agent Context

Last refreshed: 2026-07-08 for active secure beta / Build 0.2.1 and hosted Connect activation.

This file is the working source of truth for Claude Code, Omnigent/Polly, Codex, and other repo agents. If this file conflicts with older `replit.md`, `.claude/plans/phase1-prototype.md`, the June demo-parity handoff, or stale April/November notes, prefer this file unless Dawson explicitly says otherwise. For production-lane work, read `.claude/plans/2026-07-03-build-0.2.1-room-admin-email-invites.md`, `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`, and this file first.

## What this project is

The Michael Chekhov Toolkit is an official/private-beta practice app for actors, directors, teachers, and students working with Michael Chekhov technique. It is grounded in the National Michael Chekhov Association's Chart of Inspired Action and Lisa Dalton's sanctioned project direction.

Stakeholder context:
- Lisa Dalton is the primary stakeholder, active secure-beta tester, and phone-testing path. She has the secure-beta link/profile/tester account, but has not yet used the latest chat path because she is traveling; do not treat Lisa phone/chat validation as complete until Dawson records that receipt.
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
6. Do not deploy, publish, or send a new build/update to Lisa/NMCA without Dawson approval; Lisa already has the secure-beta production alias.
7. Do not add paid services, app-store distribution, or new provider commitments without Dawson approval.
8. Secure beta is active and receipt-verified through hosted Build 0.2.1 / Connect activation. Do not claim Lisa-verified chat readiness until Lisa actually accepts/uses the room path on a real phone.

## Current repository state

This repository now contains two important app surfaces:

1. The original React/Vite/Express/SQLite prototype at the repo root / `client/src/`. Treat it as behavior and content reference material, especially `client/src/lib/toolData.ts`, `client/src/pages/Home.tsx`, and `client/src/components/POAJournal.tsx`.
2. The active secure-beta/demo PWA at `apps/chekhov-toolkit-ionic/`, built with Ionic Vue + Vite + Supabase. This is the current target for Fable/demo work unless Dawson explicitly says otherwise.

Current React reference stack:
- Frontend: React 18, Vite, Tailwind, shadcn/Radix primitives, wouter, TanStack Query.
- Backend: Express, Drizzle ORM, better-sqlite3.
- Database: local SQLite at `data/chekhov.db`; `data/` is gitignored.

Current Ionic target stack:
- Frontend: Ionic Vue, Vue Router, Vite, TypeScript.
- Auth/persistence: Supabase Auth/Postgres/RLS for the secure tester beta path.
- Active app directory: `apps/chekhov-toolkit-ionic/`.

Current React prototype behavior:
- Category wheel and detail modal use the Chekhov taxonomy from `client/src/lib/toolData.ts`.
- Random draw chooses category, parent tool, optional child/example, optional Tempo/Rhythm scale, and optional Unveiled value.
- Reveal card offers Draw Again, Flyback, Begin POA, and Change Categories.
- POA Journal supports Structured and Journal modes.
- Structured POA fields: Practice, Observe morning/midday/evening, Apply morning/midday/evening.
- History loads previous draws from SQLite and can reopen a reveal card.
- Server routes exist for drawn tools and journal entries.

> **STATUS UPDATE (2026-07-08): active secure beta — Build 0.2.1 hosted.** Production alias is on `secure-beta-launched` commit `75d77d8` with `secure-beta-0.2.1` live. Hosted Supabase project `ivipmxrejnrtqghotfqf` is ACTIVE_HEALTHY; chat migrations `20260702190000_connect_group_chat` and `20260703170000_connect_chat_invitations` are applied; Dawson and Lisa are seeded as room creators; hosted chat activation receipt from 2026-07-03 shows 11 PASS / 0 leftovers; fresh read-only probes on 2026-07-08 confirmed security headers, routes, manifest, anon-deny behavior, and deployed 0.2.1 chunks. Lisa has a profile/tester account but has not yet used the latest chat path because she is traveling. Current honest label: **hosted secure beta 0.2.1 with Connect chat activation receipt-backed; Lisa real-phone chat smoke pending.** Do not say `Lisa-verified chat ready` until that final human receipt exists. Current audit: `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`.

Historical demo-parity gaps in the Ionic app (resolved before active secure beta):
- Ionic taxonomy data is currently truncated relative to `client/src/lib/toolData.ts`; restore all descriptions, child/example labels, and Imaginary Body scope metadata for the June 12/13 pass.
- Chart needs demo cleanup: no top text above the chart in browse mode, center hub main text `Inspired Action`, and a Chart-tab Quick Draw path.
- Library needs source-safe resource buckets beyond the current taxonomy lists.
- Daily Action / POA UI needs structured + free-response parity; the Supabase/store types already carry the structured fields.
- Mobile/browser verification and real iPhone smoke were required for the original promotion and are now retained as future new-build gates.

## Current strategic direction

The app is in **active secure beta**. The current production-facing app is the Ionic Vue PWA under `apps/chekhov-toolkit-ionic/`, versioned as **Build 0.2.1 / `secure-beta-0.2.1`**.

Current beta state:
- Lisa Dalton has the secure-beta production alias and a profile/tester account.
- Lisa has not yet used/phone-smoked the latest Connect chat path because she is traveling.
- Connect chat hosted activation is complete with receipts; remaining open loop is first Lisa use/phone smoke, not schema/RLS/deploy.
- Existing in-app `Leadership` room has been observed as `kind='community'`; because there are zero messages and Lisa has not joined, agents should not treat that cosmetic mismatch as a blocker unless Dawson wants it corrected before inviting her.
- Treat future work as updates to an active tester build, not pre-share demo preparation.
- Keep the React prototype as behavior/content reference only.

Approved forward architecture for the summer beta:
- Ionic Vue app shell.
- Capacitor-ready mobile path with hosted/installable PWA fallback.
- Supabase Auth + Postgres + Row Level Security for per-tester data.
- Free-first infrastructure where possible.

Still deferred unless Dawson explicitly authorizes:
- Push notifications.
- Real global Daily Tool scheduler/admin CMS.
- App Store/TestFlight/Play distribution.
- Full approved Library content/excerpts or unverified public links.
- AI-generated embodied prompts.
- Broad taxonomy/source edits.

## Source-of-truth docs

Current / high authority:
- `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`
- `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-0.2.1-loop-closed.md`
- `.claude/plans/2026-07-03-build-0.2.1-room-admin-email-invites.md`
- `.claude/plans/2026-07-02-build-0.2.0-connect-chat-mvp.md`
- `.claude/plans/2026-07-02-build-0.1.0-active-secure-beta.md`
- `.claude/plans/2026-07-01-secure-beta-receipts-wrap.md`
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

## Build/version rule

`apps/chekhov-toolkit-ionic` is now Build 0.2.1 / `secure-beta-0.2.1`. Every merge intended for deployment, and every production deploy, must update the build identifier before merge/deploy if app behavior, beta copy, auth/data shape, or tester-visible UX changed. Keep these in sync:

- `apps/chekhov-toolkit-ionic/package.json` `version`
- `apps/chekhov-toolkit-ionic/package-lock.json` root versions
- `apps/chekhov-toolkit-ionic/src/constants/build.ts`
- a `.claude/plans/YYYY-MM-DD-build-...md` or release note with receipts

CI runs `npm run verify:build-version` to catch mismatches and `npm run verify:build-bump` to reject tester-facing Ionic PRs/pushes that omit a build/release-note bump.

## Verification gates

Before calling implementation work ready:
- `npm run check` passes, or the exact new app equivalent passes.
- `npm run build` passes, or the exact new app equivalent passes.
- App opens locally.
- Mobile-width smoke passes.
- Real iPhone smoke is completed before sending Lisa a new build or asking her to validate a tester-visible change.
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
