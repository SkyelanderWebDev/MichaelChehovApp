# AGENTS.md — The Michael Chekhov Toolkit

Last refreshed: 2026-06-12.

This file is for Hermes, Claude Code, Codex, and any other coding/review agent working in this repo.

## Read first

1. Read `CLAUDE.md`.
2. Read `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`.
3. For the June 12/13 demo-parity pass, read `.claude/plans/2026-06-12-demo-parity-fable-handoff.md` before implementation.
4. Read `brainstorms/michael-chekhov-toolkit-grill-me.md` and `brainstorms/agent-orchestration-final-plan-2026-06-04.md` before broader planning.
5. Run `git status --short` before editing.
6. Preserve the existing dirty tree unless Dawson explicitly approves a cleanup/commit/reset.

## Project truth

- Product name: **The Michael Chekhov Toolkit**.
- Official context: NMCA / Lisa Dalton sanctioned private-beta practice app.
- Current repo code includes both the React/Vite/Express/SQLite prototype and the active Ionic Vue secure-beta PWA under `apps/chekhov-toolkit-ionic/`.
- For the June 12/13 demo-parity pass, edit the Ionic app under `apps/chekhov-toolkit-ionic/` and use the React prototype as behavior/content reference.
- React source file `client/src/lib/toolData.ts` is the canonical source for intentionally typed taxonomy labels/descriptions/child tools during this parity pass.

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

## Current demo-parity artifact

The immediate implementation spec is:

`.claude/plans/2026-06-12-demo-parity-fable-handoff.md`

Use that plan for the next build pass unless Dawson replaces it.

## Current demo slice target

For the June 12/13 morning demo, build React-functionality parity where it matters while preserving the new clean Ionic/Fable design:

- Ionic Vue/PWA shell or equivalent app-like pilot.
- Official app name and attribution.
- Today’s Practice entry screen.
- Three choices: Pick My Own, Draw Random, Daily Tool seed/static placeholder.
- Preview/re-roll/change before commitment.
- `Start Today’s Practice` locks the local-day choice.
- Chart Quick Draw exists on the Chart page, with the chart hub reading `Inspired Action` and no top text above the chart.
- React taxonomy copy from `client/src/lib/toolData.ts` is restored in Ionic: descriptions, parent tools, child/example labels, and Imaginary Body scope metadata.
- Library becomes a source-safe skeleton for deeper tool/resource buckets, not merely a flat list.
- POA remains prominent and supports structured + free-response save/return/reload if possible.
- Mobile-width smoke and real iPhone smoke before Lisa sees it.

Defer:

- Full auth/RLS unless it is cheap and does not endanger the slice.
- Push notifications.
- Real global scheduler/admin CMS.
- Native store/TestFlight/Play distribution.
- Full approved Library content/excerpts or unverified public links.
- AI-generated embodied prompts.
- Full history/Flyback/Unveiled parity unless all must-land demo gates are already green.

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
