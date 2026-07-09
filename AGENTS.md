# AGENTS.md — The Michael Chekhov Toolkit

Last refreshed: 2026-07-08 for active secure beta / Build 0.2.1 and hosted Connect activation.

This file is for Hermes, Claude Code, Codex, and any other coding/review agent working in this repo.

## Read first

1. Read `CLAUDE.md`.
2. Read `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`.
3. Read `.claude/plans/2026-07-03-build-0.2.1-room-admin-email-invites.md`, `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`, and `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-0.2.1-loop-closed.md` before production-lane work.
4. Read `brainstorms/michael-chekhov-toolkit-grill-me.md` and `brainstorms/agent-orchestration-final-plan-2026-06-04.md` before broader planning.
5. Run `git status --short` before editing.
6. Preserve the existing dirty tree unless Dawson explicitly approves a cleanup/commit/reset.

## Project truth

- Product name: **The Michael Chekhov Toolkit**.
- Official context: NMCA / Lisa Dalton sanctioned private-beta practice app. Lisa has the secure-beta link/profile/tester account; she has not yet used the latest Connect chat path because she is traveling.
- Current repo code includes both the React/Vite/Express/SQLite prototype and the active Ionic Vue secure-beta PWA under `apps/chekhov-toolkit-ionic/`.
- For production-lane work, edit the Ionic app under `apps/chekhov-toolkit-ionic/` and use the React prototype only as behavior/content reference where needed.
- React source file `client/src/lib/toolData.ts` remains canonical source territory for intentionally typed taxonomy labels/descriptions/child tools.
- Ionic Vue/Vite/TypeScript/Supabase is a Chekhov-local production choice, not a reusable Dawson-wide frontend default.
- Do not import framework, metaphor, components, ontology, or design tokens from Human Index, Soul Carousel, 3H AIOS, or another project.
- Do not initiate a clean-room Chekhov redesign before Lisa's Build 0.2.1 real-phone/Connect feedback. Preserve the current target and route later taste-critical changes through a Dawson/Lisa visual-interaction gate.

## Non-negotiables

- Do not edit NMCA/Chekhov taxonomy in `client/src/lib/toolData.ts` casually.
- Do not add AI-generated embodied Chekhov practice prompts for the first beta.
- Use only taxonomy labels, POA structure, sourced/cited excerpts, and neutral UI/navigation copy unless Dawson/Lisa/NMCA approves more.
- Make attribution visible before any external share:
  - `Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.`
- Treat Lisa Dalton phone testing as a primary acceptance path.
- Do not deploy or send/share new builds/links without Dawson approval; Lisa already has the secure-beta production alias.
- Secure beta is now active and receipt-verified through hosted Build 0.2.1 / Connect activation; do not claim Lisa-verified chat readiness until Lisa actually uses the room path on a real phone.
- Keep infrastructure free-first unless Dawson approves spend.

## Current active build

**Build 0.2.1 / `secure-beta-0.2.1`** is the current hosted secure-beta build on `secure-beta-launched` commit `75d77d8`. Hosted Connect chat activation completed 2026-07-03 with receipts and was truth-audited 2026-07-08. Lisa has a profile/tester account but has not yet used the chat path because she is traveling; current honest label is **hosted secure beta 0.2.1 with Connect activation receipt-backed; Lisa real-phone chat smoke pending**.

Receipts and release notes:

- `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-readiness-truth-audit.md`
- `/Users/dawson/.hermes/session-wraps/2026-07-08-chekhov-0.2.1-loop-closed.md`
- `.claude/plans/2026-07-03-build-0.2.1-room-admin-email-invites.md`
- `.claude/plans/2026-07-02-build-0.2.0-connect-chat-mvp.md`
- `.claude/plans/2026-07-02-build-0.1.0-active-secure-beta.md`
- `.claude/plans/2026-07-01-secure-beta-receipts-wrap.md`

The old June demo-parity plan is historical. Use it only for provenance unless Dawson explicitly reopens those tasks.

## Build identifier rule

Every merge intended for deploy, and every production deploy, must update the build identifier if tester-visible behavior/copy/auth/data changed. Keep these synchronized:

- `apps/chekhov-toolkit-ionic/package.json` `version`
- `apps/chekhov-toolkit-ionic/package-lock.json` root versions
- `apps/chekhov-toolkit-ionic/src/constants/build.ts`
- a release/receipt note under `.claude/plans/`

CI verifies the code/package pieces with `npm run verify:build-version` and enforces build/release-note bumps for tester-facing Ionic changes with `npm run verify:build-bump`.

## Agent split

Hermes/GPT-5.6 controller:
- scope, reconciliation, implementation, merge/deploy/share decisions, Lisa-readiness gate.

Claude Code / Fable:
- product/taste orchestrator, construction-packet author, and rendered-artifact reviewer; not the default mechanical builder.

GPT-5.6 Terra/Codex:
- primary builder plus deterministic verifier for crisp lanes: build/type/API smoke, schema/RLS review, security/diff review, attribution/content scans.

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

Before sending Lisa a new build or asking her to validate a tester-visible change, produce evidence for:

- build/typecheck status,
- app opens locally,
- mobile-width smoke,
- real iPhone smoke,
- Today’s Practice path,
- POA save/return/reload if implemented,
- attribution visible,
- no AI-generated embodied prompt content,
- no secrets in diff.
