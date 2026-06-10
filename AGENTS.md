# AGENTS.md — The Michael Chekhov Toolkit

Last refreshed: 2026-06-05.

This file is for Hermes, Claude Code, Codex, and any other coding/review agent working in this repo.

## Read first

1. Read `CLAUDE.md`.
2. Read `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`.
3. Read `brainstorms/michael-chekhov-toolkit-grill-me.md` and `brainstorms/agent-orchestration-final-plan-2026-06-04.md` before planning implementation.
4. Run `git status --short` before editing.
5. Preserve the existing dirty tree unless Dawson explicitly approves a cleanup/commit/reset.

## Project truth

- Product name: **The Michael Chekhov Toolkit**.
- Official context: NMCA / Lisa Dalton sanctioned private-beta practice app.
- Current repo code: React/Vite/Express/SQLite prototype.
- Forward beta target: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- React prototype is behavior/reference material, not necessarily the production foundation.

## Non-negotiables

- Do not edit NMCA/Chekhov taxonomy in `client/src/lib/toolData.ts` casually.
- Do not add AI-generated embodied Chekhov practice prompts for the first beta.
- Use only taxonomy labels, POA structure, sourced/cited excerpts, and neutral UI/navigation copy unless Dawson/Lisa/NMCA approves more.
- Make attribution visible before any external share:
  - `Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.`
- Treat Lisa Dalton phone testing as a primary acceptance path.
- Do not deploy or send/share links without Dawson approval.
- Do not claim secure beta unless auth/RLS/user-owned access has been implemented and verified.
- Keep infrastructure free-first unless Dawson approves spend.

## Current Phase 0 next artifact

The immediate implementation spec is expected at:

`.claude/plans/2026-06-05-weekend-lisa-pilot.md`

Use that plan for the next build pass unless Dawson replaces it.

## Weekend slice target

Build a narrow Lisa confidence demo, not a full June 13 beta:

- Ionic Vue/PWA shell or equivalent app-like pilot.
- Official app name and attribution.
- Today’s Practice entry screen.
- Three choices: Pick My Own, Draw Random, Daily Tool seed/static placeholder.
- Preview/re-roll/change before commitment.
- `Start Today’s Practice` locks the local-day choice.
- POA remains prominent and supports save/return/reload if possible.
- Mobile-width smoke and real iPhone smoke before Lisa sees it.

Defer:

- Full auth/RLS unless it is cheap and does not endanger the slice.
- Push notifications.
- Real global scheduler/admin CMS.
- Native store/TestFlight/Play distribution.
- Broad Library.
- AI-generated embodied prompts.
- Full React feature parity.

## Agent split

Hermes/controller:
- scope, reconciliation, merge/deploy/share decisions, Lisa-readiness gate.

Claude Code / Opus:
- primary product/build integrator for coherent vertical slices.

Codex / GPT-5.5:
- independent reviewer/verifier and bounded worker for crisp lanes: build/type/API smoke, schema/RLS review, security/diff review, attribution/content scans.

Do not let two agents freely edit the same files in the same worktree. Use isolated worktrees and explicit file ownership for parallel work.

## Verification

For current React prototype work, run:

```bash
npm run check
npm run build
```

For local full-stack smoke on macOS/Hermes when port 5000 is occupied:

```bash
PORT=5055 HOST=127.0.0.1 npm run dev
```

Before any Lisa/external review, produce evidence for:

- build/typecheck status,
- app opens locally,
- mobile-width smoke,
- real iPhone smoke,
- Today’s Practice path,
- POA save/return/reload if implemented,
- attribution visible,
- no AI-generated embodied prompt content,
- no secrets in diff.
