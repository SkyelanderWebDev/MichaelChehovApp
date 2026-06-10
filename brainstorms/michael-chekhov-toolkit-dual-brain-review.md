# Dual-Brain Review + Claude Code/Codex Handoff Seeds — The Michael Chekhov Toolkit

## Purpose
Prepare the Michael Chekhov app for a `/grill-me` requirements session and a bounded Claude Code/Codex build handoff. This document integrates:
- Hermes/GPT audit and browser/API verification.
- Claude Code council review from `brainstorms/claude-council-review-2026-06-04.md`.
- Dawson's explicit decisions: app name is **The Michael Chekhov Toolkit**, create both Hermes skill and Claude command, preserve existing WIP, and use council output to build the handoff plan.

## Sources and Verification

### Files inspected by Hermes
- `CLAUDE.md`
- `design_guidelines.md`
- `.claude/plans/2026-05-27-agent-tandem-hour-plan.md`
- `.claude/commands/grill-me.md`
- `brainstorms/grill-me-method-notes.md`
- `client/src/pages/Home.tsx`
- `client/src/components/CategoryWheel.tsx`
- `client/src/components/ToolRevealCard.tsx`
- `client/src/components/POAJournal.tsx`
- `client/src/components/HistoryPanel.tsx`
- `client/src/components/CategoryDetailModal.tsx`
- `client/src/lib/toolData.ts`
- `shared/schema.ts`
- `server/routes.ts`
- `server/db.ts`
- `server/storage.ts`
- `server/index.ts`
- `package.json`
- Current git status and dirty diff.

### Commands / checks run
- `npm run check && npm run build`: passed.
- `npm run dev`: full-stack server started successfully under current dirty `server/index.ts` host-bind patch.
- `GET http://127.0.0.1:5000/api/drawn-tools`: 200 JSON.
- Browser smoke: select all → draw → Begin POA → save Practice note → reload → history persisted.
- SQLite verification: smoke `drawn_tools` + `journal_entries` rows existed; rows were cleaned afterward.

### Current working tree note
Existing WIP preserved:
- `client/src/components/examples/CategoryWheel.tsx`
- `client/src/components/examples/HistoryPanel.tsx`
- `client/src/components/examples/ToolRevealCard.tsx`
- `server/index.ts`
- `.claude/plans/2026-05-27-agent-tandem-hour-plan.md`

New workflow/review artifacts created:
- `.claude/commands/grill-me.md`
- `brainstorms/grill-me-method-notes.md`
- `brainstorms/claude-council-prompt.md`
- `brainstorms/claude-council-review.raw.md`
- `brainstorms/claude-council-review-2026-06-04.md`
- `brainstorms/michael-chekhov-toolkit-grill-me.md`
- `brainstorms/michael-chekhov-toolkit-dual-brain-review.md`

## Executive Verdict
The prototype is much further along than a greenfield app. It is type-clean, build-clean, full-stack runnable locally, and able to persist a draw and a structured POA note to SQLite. The high-leverage risk is not core functionality; it is product/pedagogy fit. If the next 24 hours are spent on a framework rewrite, we risk losing the real deliverable: a Lisa-testable official NMCA prototype that helps actors practice.

Recommendation: run the Grill Me session first, then keep the next coding push React-local unless Dawson explicitly decides otherwise. The council's strongest consensus is that the app must become a practice loop: draw → embody → observe/apply → return later → see continuity. It must not merely reveal names from a taxonomy.

## What the App Is Doing Well
- Real taxonomy is centralized in `toolData.ts` with category → parent → child hierarchy.
- The app already supports category selection, detailed category drilling, random draw, hierarchy level selection, Flyback, history, POA journal modes, and local persistence.
- The existing dirty WIP appears to have resolved earlier typecheck and macOS bind blockers.
- The radial wheel gives the Chart of Inspired Action a memorable visual identity.
- The POA structured/journal toggle is directionally right: it encodes Practice/Observe/Apply without forcing only freeform notes.
- Test IDs are present throughout, which makes later browser tests easier.

## What Could Be Better
- Current UI title still says "Actor's Toolkit", not "The Michael Chekhov Toolkit".
- NMCA/Lisa/Chart attribution is present in docs but invisible in the app UI.
- Reveal cards show tool names but not embodied instructions; this makes the experience drift toward oracle-card novelty.
- POA journal is reachable only from the reveal card, not directly from history/return practice.
- POA temporal model is ambiguous: one entry per drawn tool, per tool per date, or global daily entry?
- `getJournalEntryByDate` is date-only and can collide conceptually with multi-tool practice.
- `POAJournal` resets form from `entries[0]` on query changes, which could lose in-progress edits after refetch.
- The wheel checkbox/toggle buttons need accessible labels/pressed states and larger touch targets.
- Reveal overlay should use Dialog/focus trapping rather than an ad-hoc fixed overlay.
- Real-device iPhone verification is still missing.
- No automated test suite beyond TypeScript/build.

## Blind Spots / Risks
- Oracle-card gimmick risk: theatrical reveal is good, but embodied practice prompts are missing.
- Official-source risk: NMCA permission is in docs but not visible in the app; do not share externally before adding credit.
- Rewrite risk: Vue/Nuxt may feel like the mobile-accessibility path, but current findings do not justify a rewrite before Lisa validation.
- Pedagogy risk: novices may be overwhelmed by 14 categories and hundreds of children without a "start here" or teacher framing.
- Classroom risk: no group/presentation mode yet.
- Actor habit risk: app optimizes for drawing, not sustained practice/return.
- Timestamp risk: browser smoke showed history item as "in about 5 hours", likely due SQLite UTC text parsed as local time.
- Handoff risk: `CLAUDE.md` is stale relative to current WIP and can cause Claude/Codex to chase already-fixed issues.

## Council High-Leverage Ideas
Ranked by immediate usefulness:

1. **Clarify POA temporal model before coding.**
   - Default: one POA entry per `(drawnToolId, date)` pair.
   - Why: supports multi-day practice on one tool and avoids global date collisions.
2. **Add visible NMCA/Lisa attribution before any external share.**
   - Footer/About dialog.
   - Credit-only change is small but official-context critical.
3. **Rename app surfaces to The Michael Chekhov Toolkit.**
   - UI title, document title, docs, and handoff prompts.
4. **Make history the return-to-practice surface.**
   - History item should show Flyback/POA status and reopen POA for a previous draw.
5. **Add embodied prompt scaffolding only with approved wording.**
   - Category-level prompt is safer than changing taxonomy.
   - Must be NMCA/Lisa-approved or explicitly draft-labeled.
6. **Run real iPhone mobile pass.**
   - Verify select all → draw → reveal → POA → save → reload.
7. **Fix accessibility of core controls.**
   - `aria-label`, `aria-pressed`, Dialog/focus trap, 44px touch targets.
8. **Defer Vue/Nuxt unless Grill Me establishes a hard requirement.**
   - Current prototype can become a PWA/private demo faster in React.

## 24-Hour Deliverable Recommendation

### Default 24-hour target
A private, Lisa-testable React prototype named **The Michael Chekhov Toolkit** that:
1. Runs full-stack locally and/or behind a private tunnel.
2. Shows NMCA/Lisa attribution.
3. Lets Lisa complete the phone demo path.
4. Persists draw + POA note correctly.
5. Makes history useful as a return-to-practice surface.
6. Has a short known-issues list and does not pretend Phase 2 features are done.

### Keep React or rebuild in Vue/Nuxt?
Default answer for Grill Me: **Keep React for this 24-hour deliverable.**

Reasoning:
- Current app already passes typecheck/build and full-stack smoke.
- React + Radix/shadcn already provides accessible component primitives.
- Most council concerns are product/model/a11y issues, not framework limitations.
- Vue/Nuxt rewrite would consume the 24-hour window before Lisa can test the actual pedagogy.

Possible exception:
- If Dawson defines "mobile app access/web app accessibility" as a non-negotiable Vue/Nuxt client requirement for another deployment ecosystem, then Grill Me should turn that into an explicit Phase 2/3 rewrite plan, not an unplanned immediate rewrite.

## Grill Me Must-Answer Questions
Use one question at a time. Do not ask all at once during the live `/grill-me` session.

1. What is the POA temporal model?
   - Recommended/default: one POA entry per `(drawnToolId, date)` pair.
2. What is Lisa's exact 60-second phone demo path?
   - Recommended/default: open → Select All → Draw → reveal → Begin POA → write one Practice note → Save → reload/history confirms persistence.
3. What exact NMCA/Lisa credit line should appear in the UI?
   - Recommended/default pending confirmation: "Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. App developed in partnership with Lisa Dalton, NMCA President & Master Teacher."
4. Is the next 24-hour deliverable React PWA/private web demo, React+Capacitor, or Vue/Nuxt rebuild plan?
   - Recommended/default: React web/PWA private demo now; platform rewrite later.
5. Should history become the actor's return-to-practice hub?
   - Recommended/default: yes, history should show POA/Flyback status and open previous POA entries.
6. Are embodied prompts allowed, and from what source?
   - Recommended/default: only add NMCA-sourced/approved category-level prompt text now; otherwise draft as future content need.
7. What does "done enough for Lisa" mean?
   - Recommended/default: private phone-accessible link + clean 60-second demo + explicit known issues.
8. Should classroom/presentation mode be in Phase 1?
   - Recommended/default: defer, but record as Phase 2.
9. Should export exist now?
   - Recommended/default: defer unless Lisa/professors require it for review.
10. What must Codex verify before we call it built?
   - Recommended/default: typecheck/build, local server, API draw/journal smoke, browser phone-width smoke, and diff review.

## Claude Code Handoff Plan Seeds
These should become the post-Grill-Me Claude Code plan. Keep tasks ≤200 LOC each, no deploy, no dependency additions unless explicitly approved.

### Task C1 — Refresh project truth docs and naming
- Files: `CLAUDE.md`, maybe `client/src/pages/Home.tsx`, maybe `index.html` if document title is static.
- Acceptance:
  - Docs and UI refer to **The Michael Chekhov Toolkit**.
  - CLAUDE.md no longer lists already-fixed phantom ID issues as blocking.
  - Existing WIP is not overwritten.
- Verify: `npm run check && npm run build`.

### Task C2 — Add official attribution surface
- Files: `client/src/pages/Home.tsx`, optional new `client/src/components/AboutDialog.tsx`.
- Acceptance:
  - Credit line visible/reachable on app UI.
  - Footer/About works at phone width.
  - No taxonomy/content changes beyond credit text.
- Verify: browser snapshot confirms credit visible/reachable.

### Task C3 — POA temporal model fix
- Files: `shared/schema.ts`, `server/routes.ts`, `server/storage.ts`, `client/src/components/POAJournal.tsx`.
- Acceptance:
  - Model matches Grill Me decision.
  - Two different drawn tools on same date do not collide.
  - Reopening a previous draw loads the correct POA entry.
  - Query refetch does not overwrite in-progress edits unnecessarily.
- Verify: API smoke with two drawn tools + two journal entries; browser reload.

### Task C4 — History as return-to-practice hub
- Files: `client/src/components/HistoryPanel.tsx`, maybe `Home.tsx`, maybe route aggregation.
- Acceptance:
  - History item shows Flyback and/or POA status.
  - Tapping previous draw can reopen reveal or POA for that draw.
  - Phone layout remains usable.
- Verify: browser smoke after reload.

### Task C5 — Accessibility/mobile pass on core interaction
- Files: `CategoryWheel.tsx`, `ToolRevealCard.tsx`, maybe `POAJournal.tsx`.
- Acceptance:
  - Wheel toggles have `aria-label` and pressed/selected state.
  - Touch targets >=44px on mobile.
  - Reveal uses accessible Dialog/focus trap or equivalent.
  - ESC/Close works; focus returns sensibly.
- Verify: keyboard tab path + browser console no errors + phone-width screenshot.

## Codex Handoff / Review Seeds
Use Codex as bounded verifier/reviewer after Claude Code changes. Do not let Codex rewrite broadly.

### Codex verification contract
```bash
cd /Users/dawson/Documents/Claude/Projects/Michael\ Chekhov\ App
codex exec --full-auto 'Review the current diff for The Michael Chekhov Toolkit. Do not modify source. Run npm run check and npm run build. Start HOST=127.0.0.1 npm run dev in a background process if possible, then verify GET /api/drawn-tools, POST a sample drawn tool, POST a sample POA journal entry, GET it back, and report exact pass/fail. Also inspect whether app naming, NMCA attribution, POA temporal model, and accessibility acceptance criteria match the plan. Final report: commands run, results, changed files, risks, and whether to accept or request changes.'
```

### Codex diff review guardrails
- Reject broad framework rewrite unless Grill Me explicitly approved it.
- Flag any changes to `toolData.ts` taxonomy unless explicitly authorized.
- Flag if PR/diff exceeds ~200 LOC for a single task.
- Flag if `npm run check` or `npm run build` fails.
- Flag if source docs and UI naming disagree.
- Flag if POA model allows same-day collisions.
- Flag if smoke writes test rows and does not clean them or isolate them.

## Implementation Boundaries

### Always do
- Preserve existing WIP unless user approves changing it.
- Run `npm run check && npm run build` after code changes.
- Keep product name as The Michael Chekhov Toolkit.
- Keep official/NMCA context visible.
- Keep mobile-first flow central.

### Ask first
- Deploy/share externally.
- Add dependencies.
- Change taxonomy/source content.
- Rewrite in Vue/Nuxt.
- Add auth/accounts/cloud DB.
- Send Lisa or NMCA a link/message.

### Never do without explicit approval
- Reset/clean dirty repo work.
- Claim implementation is done when only a doc/audit exists.
- Mark external/Lisa validation as complete without actual validation.
- Invent NMCA-approved prompt text or attribution wording as final.

## Ready State
- Hermes skill created: `grill-me`.
- Claude command created: `.claude/commands/grill-me.md`.
- Claude council review complete.
- Hermes audit + smoke verification complete.
- Next action: Dawson triggers `/grill-me`; first question should be POA temporal model.
