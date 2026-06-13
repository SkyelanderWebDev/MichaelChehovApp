# Demo-Morning React-Parity Codex/GPT-5.5 Handoff

> Codex/GPT-5.5 is the main coding lane for this pass. Hermes/controller owns scope, verification, readiness label, and any deploy/share decision. Opus 4.8 has read-only approved Codex as the main lane for this scope.

## Goal

Implement the June 12/13 demo-parity pass in `apps/chekhov-toolkit-ionic/`: recover the intentional React app functionality/copy while preserving the current clean Ionic/Fable design.

This is not a rewrite, not a deploy, and not a public-share pass.

## Read first

1. `AGENTS.md`
2. `CLAUDE.md`
3. `.claude/plans/2026-06-12-demo-parity-fable-handoff.md`
4. This file
5. React source/reference:
   - `client/src/lib/toolData.ts`
   - `client/src/components/POAJournal.tsx`
   - `client/src/pages/Home.tsx`
   - `client/src/components/ToolRevealCard.tsx`
   - `client/src/components/CategoryDetailModal.tsx`

## Codex-specific guardrails

1. `client/src/lib/toolData.ts` is read-only reference. Do not edit, reformat, or “fix” it.
2. Copy taxonomy labels/descriptions/children/scope verbatim into Ionic. Do not normalize casing, reorder, de-duplicate, paraphrase, or improve labels.
3. No AI-generated embodied Chekhov practice prompts anywhere.
4. No fabricated Library content: no invented URLs, excerpts, quotations, video links, purchase links, or archive references. Use source-safe placeholders such as `Link slot reserved for approved beta resource.`
5. Do not deploy, push, share URLs, edit aliases, run `git reset`, run `git clean`, or add paid/external services.
6. Keep changes inside `apps/chekhov-toolkit-ionic/` unless a test/config in that app must be updated. Existing `AGENTS.md`, `CLAUDE.md`, and plan docs are controller-owned context.
7. Do not scope-creep into Unveiled toggle, Flyback, full history parity, real excerpt ingestion, schema/backend changes, or public resource linking unless all must-land gates are already green and the change is trivial.
8. DailyActionCard emit/API migration must be atomic: if emit changes from `journalText: string` to a structured payload, update `JournalPage.vue` in the same pass.

## Must-land tasks, in order

### 1. Structured + free-response POA

Files:
- `apps/chekhov-toolkit-ionic/src/components/DailyActionCard.vue`
- `apps/chekhov-toolkit-ionic/src/views/JournalPage.vue`

Requirements:
- Add Structured / Free response mode UI.
- Structured mode has 7 textareas:
  - Practice
  - Observe Morning
  - Observe Midday
  - Observe Evening
  - Apply Morning
  - Apply Midday
  - Apply Evening
- Free response mode has one large journal textarea.
- Hydrate all fields from `props.entry`.
- Save all fields through existing `savePOA()`; no schema migration should be required.
- Preserve current clean/studio visual design.

### 2. Full taxonomy parity

Files:
- `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/components/CategoryDetailSheet.vue`
- tests if needed

Requirements:
- Restore every child/example label from React `TOOL_CATEGORIES`.
- Add `scope?: 'full-body' | 'parts' | 'both'` to Ionic tool type and copy Imaginary Body scope metadata.
- Add `description?: string` to `ChartCategory` and copy every category description verbatim.
- Render descriptions in `CategoryDetailSheet.vue`.
- Run and report the parity script from the Fable handoff plan. Gate is computed equality: `ionicChildren === reactChildren` and `failures === 0`; do not hardcode `1144` as the only truth.

### 3. Chart cleanup + Quick Draw

Files:
- `apps/chekhov-toolkit-ionic/src/views/ChartPage.vue`
- `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue`
- optional new component under `apps/chekhov-toolkit-ionic/src/components/`

Requirements:
- Remove the `ChartPage.vue` intro text block above the chart.
- In `CircleChart.vue` browse mode, hide the component’s own top text (`Chart of Inspired Action`, `Circle chart map`, subtitle). Dawson said no top text.
- The chart center hub main text must be exactly `Inspired Action`.
- Add Chart-tab Quick Draw using existing pure helpers. It must not depend on auth.
- Quick Draw result shows category, parent tool, child/example when present, and scale when present.
- Include Draw again and Dismiss/Clear. Optional Begin POA in Journal may route to Journal, but do not make Quick Draw save/auth brittle.
- No generated practice instructions.

### 4. Library skeleton, source-safe only

Files:
- `apps/chekhov-toolkit-ionic/src/views/LibraryPage.vue`
- optional data helper under `apps/chekhov-toolkit-ionic/src/data/`

Requirements:
- Keep taxonomy accordion under `Dive Deeper into the Tools`.
- Add source-safe buckets:
  - Videos & Demonstrations
  - Chekhov Lectures & Writings
  - Lisa Dalton / NMCA Books & Excerpts
  - Michael Chekhov Archives
  - Lisa’s YouTube
- Use placeholders only unless a source/link is already verified in repo context.
- Do not invent links, excerpts, quotes, purchase URLs, or teaching content.

### 5. Verification/test updates

Files:
- existing unit/e2e tests as needed under `apps/chekhov-toolkit-ionic/tests/`

Requirements:
- Update tests for the changed surfaces where practical.
- Do not fake auth or stub Supabase just to force a green POA persistence e2e.
- Static/demo assertions should include:
  - Chart has `Inspired Action` and no `Circle chart map` in browse view.
  - Quick Draw reveals a result.
  - Library has `Dive Deeper into the Tools` and the resource buckets.
  - Atmosphere full label such as `Cemetery` is visible or covered by a unit/parity test.

## Commands to run before final report

From `apps/chekhov-toolkit-ionic/`:

```bash
npm run build
npm run test:unit -- --run
npm run test:e2e
```

From repo root, run the taxonomy parity check from `.claude/plans/2026-06-12-demo-parity-fable-handoff.md` and include raw output.

If e2e fails because of environment/auth brittleness, report exact failure. Do not fake success.

## Final report contract

Return:
- changed files;
- what landed;
- what was explicitly deferred;
- raw command results for build/unit/e2e/parity check;
- any warnings/blockers;
- guardrail confirmation: no generated embodied prompts, no fabricated links/excerpts, no deploy/share, no edits to `client/src/lib/toolData.ts`.

Readiness label after Codex is only provisional. Hermes/controller will re-run verification independently.
