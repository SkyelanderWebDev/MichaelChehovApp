> **Historical handoff — superseded.** As of 2026-07-08, the Ionic PWA is hosted active secure beta Build 0.2.1 / `secure-beta-0.2.1` with Connect chat activation receipt-backed. Lisa has the secure-beta link/profile/tester account but has not yet used the latest Connect chat path because she is traveling; Lisa real-phone chat smoke remains pending. Current source-of-truth files are `CLAUDE.md`, `AGENTS.md`, `.claude/plans/2026-07-03-build-0.2.1-room-admin-email-invites.md`, `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`, and `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-0.2.1-loop-closed.md`.

# Michael Chekhov Toolkit — Implementation Handoff

Last updated: 2026-06-05 16:20 CDT.

## Goal

Move from Phase 0 audit/planning into the weekend Lisa pilot implementation for **The Michael Chekhov Toolkit**.

The immediate product goal is a narrow, mobile-first confidence demo centered on Today’s Practice, not a full secure beta.

## Current progress

Phase 0 is complete.

Verified source-of-truth artifacts:

- `CLAUDE.md`
- `AGENTS.md`
- `.claude/plans/2026-06-05-weekend-lisa-pilot.md`
- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`
- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-closeout-wrap.md`

Fresh baseline verification before this handoff:

- `npm run check` passed.
- `npm run build` passed.
- Existing warnings only: stale Browserslist/caniuse-lite data and a PostCSS `from` warning.

Dirty tree was protected again before handoff/circle-chart work:

- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-handoff-circlechart-dirty-tree`

## Non-negotiables

- Do not discard, reset, or overwrite existing dirty WIP without Dawson approval.
- Do not casually edit NMCA/Chekhov taxonomy in `client/src/lib/toolData.ts`.
- Do not add AI-generated embodied Michael Chekhov practice prompts for first beta.
- Use taxonomy labels, POA structure, sourced/cited excerpts, and neutral navigation copy only.
- Product name: **The Michael Chekhov Toolkit**.
- Visible attribution before any external share:
  - `Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.`
- Treat Lisa Dalton phone/iPhone testing as a primary acceptance path.
- Do not deploy/share externally without Dawson approval.
- Do not claim secure beta until auth/RLS/user-owned access is implemented and verified.

## What worked

- Phase 0 audit produced a current-state map, stale/current docs map, and smallest Lisa-ready slice recommendation.
- `CLAUDE.md` and `AGENTS.md` now encode the current product constraints and agent split.
- `.claude/plans/2026-06-05-weekend-lisa-pilot.md` gives a task-by-task implementation plan.
- Existing React/Vite/Express/SQLite prototype remains type/build clean.
- Current React prototype already contains useful reference behavior:
  - `client/src/components/CategoryWheel.tsx`
  - `client/src/pages/Home.tsx`
  - `client/src/components/ToolRevealCard.tsx`
  - `client/src/components/POAJournal.tsx`
  - `client/src/lib/toolData.ts`

## What did not work / blocker

Live Claude Code handoff was attempted from this repo with a tiny non-interactive smoke prompt, but local Claude CLI authentication currently fails with API 401 invalid credentials. Do not assume Claude/Opus is runnable from this shell until auth is repaired.

Because of that, the immediate fallback lane is Hermes/Codex-controlled implementation using the same spec and verification gates.

## Immediate next steps

1. Keep using `.claude/plans/2026-06-05-weekend-lisa-pilot.md` as the main weekend pilot implementation spec.
2. If Claude Code auth is repaired, hand the plan to Claude/Opus as coherent vertical-slice builder.
3. Use Codex/GPT-5.5 or Hermes as verifier/reviewer and bounded worker.
4. Begin the circle chart lane as an additive, isolated plan/build slice:
   - preserve NMCA taxonomy names,
   - avoid generated practice prompts,
   - support mobile readability,
   - keep attribution visible/reachable,
   - do not block Today’s Practice on perfect full-chart fidelity.

## Suggested Claude/Opus prompt after auth is repaired

```text
Start the Michael Chekhov Toolkit weekend Lisa pilot implementation.

Work in:
/Users/dawson/Documents/Claude/Projects/Michael Chekhov App

Read first:
- CLAUDE.md
- AGENTS.md
- HANDOFF.md
- /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-closeout-wrap.md
- /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md
- .claude/plans/2026-06-05-weekend-lisa-pilot.md

Then:
1. Run git status --short and preserve the dirty tree.
2. Re-run npm run check and npm run build before editing.
3. Use .claude/plans/2026-06-05-weekend-lisa-pilot.md as the implementation spec.
4. Build the isolated Ionic Vue/PWA pilot under apps/chekhov-toolkit-ionic/ if generator/network setup works.
5. If generator/network setup blocks, report the blocker honestly and do not fake a scaffold.
6. Keep the current React prototype as reference only unless explicitly instructed.
7. Do not add AI-generated embodied Chekhov prompts.
8. Preserve NMCA terminology from client/src/lib/toolData.ts.
9. Include visible NMCA/Lisa/Chart attribution.
10. Verify check/build, local open, mobile-width smoke, attribution, no prompt-content drift, and no secrets in diff.
```

## Current status for Dawson

Handoff package is ready. Live Claude CLI auth is the only handoff execution blocker discovered. Work can continue locally under Hermes/Codex control while Claude auth is fixed.
