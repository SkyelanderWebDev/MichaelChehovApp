# Demo-Morning React-Parity Fable Handoff

> For Fable/Claude Code: implement this plan task-by-task in `apps/chekhov-toolkit-ionic/`. Hermes/controller must verify the final diff and receipts before any demo-readiness claim.

**Goal:** Recover the intentional React-app functionality and source taxonomy inside the new clean Ionic/Fable design for tomorrow morning’s demo.

**Architecture:** Keep the current Ionic Vue + Supabase PWA shell. Treat the React app as the source/reference for taxonomy, draw behavior, and POA UI. Do not rewrite the app or reopen the secure-beta architecture; this is a surgical demo-parity pass.

**Tech Stack:** Ionic Vue, Vue Router, TypeScript, Supabase client, Cypress. React reference lives in `client/src/`.

**Planning provenance:** Hermes/controller audited the repo and ran a Claude Opus fallback planning review after Fable dispatch failed. A direct Fable second-brain attempt failed at dispatch with: `There's an issue with the selected model (claude-fable-5). It may not exist or you may not have access to it.` This file is Fable-ready, but do not claim Fable reviewed it until a real `--model fable` run succeeds.

---

## Read first

1. `AGENTS.md`
2. `CLAUDE.md`
3. This plan: `.claude/plans/2026-06-12-demo-parity-fable-handoff.md`
4. React reference files:
   - `client/src/lib/toolData.ts`
   - `client/src/pages/Home.tsx`
   - `client/src/components/ToolRevealCard.tsx`
   - `client/src/components/POAJournal.tsx`
   - `client/src/components/CategoryDetailModal.tsx`
5. Current Ionic target files:
   - `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`
   - `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
   - `apps/chekhov-toolkit-ionic/src/views/ChartPage.vue`
   - `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue`
   - `apps/chekhov-toolkit-ionic/src/views/LibraryPage.vue`
   - `apps/chekhov-toolkit-ionic/src/views/JournalPage.vue`
   - `apps/chekhov-toolkit-ionic/src/components/DailyActionCard.vue`
   - `apps/chekhov-toolkit-ionic/src/types/practice.ts`
   - `apps/chekhov-toolkit-ionic/src/stores/dailyPracticeStore.ts`

Run before editing:

```bash
git status --short
```

Do not reset, clean, deploy, or share externally.

---

## Dawson’s demo notes translated into implementation requirements

1. Preserve the current clean/professional/inspiring visual direction.
2. Restore all intentional React taxonomy/copy:
   - every category definition/description in `client/src/lib/toolData.ts`;
   - every parent tool;
   - every child/example label, especially Atmosphere;
   - `scope` metadata for Imaginary Body where present.
3. Chart page:
   - remove the text block at the top of the page;
   - chart center’s main text must read exactly `Inspired Action`;
   - add Chart-tab Quick Draw functionality comparable to React draw/reveal, but cleaner and app-native.
4. Library must become the beginning of a real source/content skeleton, not just lists:
   - Dive Deeper into the Tools;
   - videos/demos to be made;
   - Chekhov lectures/writings;
   - Lisa Dalton/NMCA books/excerpts for later approval/purchase integration;
   - Michael Chekhov archives;
   - Lisa YouTube;
   - use source-safe placeholders if exact links/content are not approved.
5. Journal/POA must recover React functionality:
   - structured multi-point POA, or free-response mode;
   - best demo pass: implement both, because the current schema/store already supports it.

---

## Current audit facts

Hermes/controller compared React `TOOL_CATEGORIES` with Ionic `WEEKEND_TOOL_CATALOG`.

```text
React taxonomy: 15 categories, 84 parent tools, 1144 child/example labels.
Ionic taxonomy: 15 categories, 84 parent tools, 334 child/example labels.
Mismatch count: 91 parent/scope/child-count issues.
```

The main data problem is not missing parent tools; it is truncated child arrays and missing descriptions/scope metadata.

Examples:

```text
Expanding: React 13 children vs Ionic 4.
Atmosphere / Overall — Nature / Natural: React 33 children vs Ionic 4.
Imaginary Body tools have React scope metadata that Ionic currently drops.
```

Other current gaps:

- `ChartPage.vue` still has a header block with `Chart` and explanatory copy.
- `CircleChart.vue` also renders its own top kicker/heading/subtitle (`Chart of Inspired Action`, `Circle chart map`, explanatory copy) above the wheel. Hiding only `ChartPage.vue`’s page intro is not enough.
- `CircleChart.vue` browse mode hub strong text currently returns `Chart of Inspired Action`, not `Inspired Action`.
- `ChartPage.vue` has no Quick Draw result/reveal path.
- `LibraryPage.vue` is a taxonomy accordion/list only.
- `DailyActionCard.vue` is free-form only; `types/practice.ts` and `dailyPracticeStore.ts` already support structured POA fields.

Suggested execution order for a single pre-demo lane:

1. Restore structured/free-response POA UI and wiring (lowest schema risk, high demo value).
2. Restore full taxonomy/children/scope/descriptions (mechanical, script-verifiable).
3. Clean Chart top text and set hub to `Inspired Action`.
4. Add client-side Quick Draw reveal on Chart.
5. Add Library resource buckets.
6. Update/run verification gates.

---

## Must-land priority order

### Task 0: Pre-flight and guardrail capture

**Objective:** Protect the tree and avoid stale-context mistakes.

**Files:** none.

**Steps:**

1. Run:
   ```bash
   git status --short
   ```
2. Confirm you are editing only `apps/chekhov-toolkit-ionic/` plus this plan/context doc if needed.
3. Do not edit `client/src/lib/toolData.ts`; it is source/reference territory.
4. Do not add generated embodied Chekhov prompts.
5. Do not deploy, push, or share a URL.

**Verification:** repo status captured in final report.

---

### Task 1: Restore full taxonomy and definitions in Ionic data

**Objective:** Make Ionic contain every category description, parent tool, child/example label, and intentional `scope` metadata from React `client/src/lib/toolData.ts`.

**Files:**
- Modify: `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`
- Modify: `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
- Modify: `apps/chekhov-toolkit-ionic/src/components/CategoryDetailSheet.vue`
- Optional test/script if useful: temporary local Node parity check; do not overbuild.

**Implementation details:**

1. In `toolCatalog.ts`, update types:
   ```ts
   export interface WeekendTool {
     name: string;
     children: readonly string[];
     scope?: 'full-body' | 'parts' | 'both';
   }
   ```
2. Replace every truncated `children` array in `WEEKEND_TOOL_CATALOG` with the full verbatim array from `client/src/lib/toolData.ts`.
3. Preserve parent tool order exactly from React.
4. Add `scope` for Imaginary Body tools where React has it:
   - Body Part, Substances, Simple Forms, Mineral Kingdom, Plant Kingdom, Animal Kingdom: `scope: 'both'`
   - Archetypal Characters: `scope: 'full-body'`
5. Update the comment at the top of `toolCatalog.ts` from weekend seed/truncated language to something like:
   ```ts
   // Full source-label taxonomy copied verbatim from client/src/lib/toolData.ts.
   // Labels only; no generated embodied practice prompts.
   ```
6. In `circleChartCatalog.ts`, add `description?: string` to `ChartCategory`.
7. Populate every `CHART_CATEGORIES` entry with the React category `description` value copied verbatim.
8. In `CategoryDetailSheet.vue`, render the category description below the family/tool count line:
   ```vue
   <p v-if="category.description" class="detail-description">{{ category.description }}</p>
   ```
   Style it as muted, readable, source-label explanation copy. Do not invent new explanations.

**Acceptance checks:**

- `WEEKEND_TOOL_CATALOG` still has 15 categories and 84 parent tools.
- Ionic child/example total should match the React child/example total computed by the parity check. The audit currently reports 1144 React child/example labels, but the gate is `ionicChildren === reactChildren`, not a hardcoded magic number.
- Atmosphere → Overall — Nature / Natural ends with `Cemetery` and has the full React list.
- Category detail sheets show description text copied from React.

**Suggested parity check command:** run from repo root after edits.

```bash
node <<'NODE'
const fs = require('fs');
function extractArray(file, constName) {
  const s = fs.readFileSync(file, 'utf8');
  const marker = `export const ${constName}`;
  const start = s.indexOf(marker);
  if (start < 0) throw new Error('missing '+constName);
  const eq = s.indexOf('=', start);
  const arrStart = s.indexOf('[', eq);
  let depth=0, end=-1, inStr=null, esc=false, lineComment=false, blockComment=false;
  for (let i=arrStart; i<s.length; i++) {
    const c=s[i], n=s[i+1];
    if (lineComment) { if (c==='\n') lineComment=false; continue; }
    if (blockComment) { if (c==='*' && n==='/') { blockComment=false; i++; } continue; }
    if (inStr) { if (esc) esc=false; else if (c==='\\') esc=true; else if (c===inStr) inStr=null; continue; }
    if (c==='/' && n==='/') { lineComment=true; i++; continue; }
    if (c==='/' && n==='*') { blockComment=true; i++; continue; }
    if (c==='"' || c==="'" || c==='`') { inStr=c; continue; }
    if (c==='[') depth++;
    if (c===']') { depth--; if (depth===0) { end=i+1; break; } }
  }
  return Function('return ('+s.slice(arrStart, end)+')')();
}
const react = extractArray('client/src/lib/toolData.ts', 'TOOL_CATEGORIES');
const ionic = extractArray('apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts', 'WEEKEND_TOOL_CATALOG');
const reactMap = new Map(react.map(c=>[c.id,c]));
const ionicMap = new Map(ionic.map(c=>[c.categoryId,c]));
let failures=[];
for (const [id, rc] of reactMap) {
  const ic = ionicMap.get(id);
  if (!ic) { failures.push(`${id}: missing in Ionic`); continue; }
  if (rc.tools.length !== ic.tools.length) failures.push(`${id}: parent count ${ic.tools.length} != ${rc.tools.length}`);
  for (const rt of rc.tools) {
    const it = ic.tools.find(t=>t.name===rt.name);
    if (!it) { failures.push(`${id}: missing parent ${rt.name}`); continue; }
    const rcLen = rt.children?.length || 0;
    const icLen = it.children?.length || 0;
    if (rcLen !== icLen) failures.push(`${id}/${rt.name}: child count ${icLen} != ${rcLen}`);
    if (rt.scope && rt.scope !== it.scope) failures.push(`${id}/${rt.name}: scope ${it.scope || 'missing'} != ${rt.scope}`);
  }
}
const reactChildren = react.flatMap(c=>c.tools).reduce((n,t)=>n+(t.children?.length||0),0);
const ionicChildren = ionic.flatMap(c=>c.tools).reduce((n,t)=>n+(t.children?.length||0),0);
console.log({ reactCategories: react.length, ionicCategories: ionic.length, reactChildren, ionicChildren, failures: failures.length });
if (failures.length) { console.error(failures.slice(0, 30).join('\n')); process.exit(1); }
NODE
```

---

### Task 2: Chart page demo parity — clean top, Inspired Action hub, Quick Draw

**Objective:** Make Chart the signature product object and recover Quick Draw as a central reason for the app.

**Files:**
- Modify: `apps/chekhov-toolkit-ionic/src/views/ChartPage.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue`
- Optional create: `apps/chekhov-toolkit-ionic/src/components/QuickDrawResultCard.vue`

**Implementation details:**

1. In `ChartPage.vue`, remove the entire `<header class="page-intro">` block above `CircleChart`. After `TopStatusBar`, the chart should be the first major element.
2. In `CircleChart.vue`, hide the component’s own top text in browse mode too. The existing template renders:
   - `.section-kicker` text: `Chart of Inspired Action`
   - `.chart-heading-row` heading: `Circle chart map`
   - browse subtitle copy

   In `browse` mode, those should not render. One safe pattern:

   ```vue
   <template v-if="!props.browse">
     <div class="section-kicker">Chart of Inspired Action</div>
     <div class="chart-heading-row">...</div>
   </template>
   ```

   Keep selected-count heading behavior for Journal/non-browse mode.
3. In `CircleChart.vue`, change browse-mode `hubTitle` to return exactly:
   ```ts
   if (props.browse) return 'Inspired Action';
   ```
   The user asked for the center of the chart to say `Inspired Action`. Make that the main strong hub text.
   Low-stakes judgment call: the tiny `.hub-label` above it currently says `The Michael Chekhov Toolkit`. It may stay if it remains visually secondary; the must-have is that the main hub text is `Inspired Action`.
4. Add Quick Draw to `ChartPage.vue`:
   - It should work from all chart areas without requiring Journal setup.
   - It should use the full `toolCatalog.ts` pool after Task 1.
   - Import and use:
     ```ts
     createAllParentToolFilter,
     createRandomSelectionFromCategories
     ```
   - Draw from `CHART_CATEGORIES.map((category) => category.id)` with all parent tools selected.
   - Result card shows category, parent tool, child/example when present, and scale when present.
   - Buttons/actions:
     - `Quick Draw` / `Draw another`
     - `Begin POA in Journal` if cheap and safe: for signed-in users, save preview with `setPreview(selection, 'random')` and route to `/journal`; if auth/misconfigured, route to `/journal` and let the existing warm tester gate handle saving.
     - `Dismiss` or `Clear` result.
5. Keep the existing Journal CTA; Quick Draw result should sit between `CircleChart` and that CTA.
6. Default decision: do not add React’s Unveiled toggle for tomorrow unless the core gates are already green. If added, keep it optional and do not let it delay POA/taxonomy parity.
7. Default decision: do not implement Flyback on Chart for tomorrow. If you surface it, label it as a future Journal/History affordance, not a must-land.

**Acceptance checks:**

- On `/chart`, there is no `Chart` page intro and no `Circle chart map`/kicker text above the chart.
- The chart hub’s main text reads exactly `Inspired Action`.
- Quick Draw button is visible on Chart.
- Tapping Quick Draw shows a clean reveal card with category + parent + child/example and scale when relevant.
- Draw again changes the result.
- The result never displays generated practice instructions.

---

### Task 3: Restore structured POA + free-response Journal mode

**Objective:** Recover React POA functionality inside the current clean Journal/Daily Action card.

**Files:**
- Modify: `apps/chekhov-toolkit-ionic/src/components/DailyActionCard.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/views/JournalPage.vue`
- Existing support: `apps/chekhov-toolkit-ionic/src/types/practice.ts`
- Existing support: `apps/chekhov-toolkit-ionic/src/stores/dailyPracticeStore.ts`

**Implementation details:**

1. In `DailyActionCard.vue`, replace the single-textarea-only state with a draft object:
   ```ts
   interface POADraft {
     mode: 'structured' | 'journal';
     practiceNotes: string;
     observeMorning: string;
     observeMidday: string;
     observeEvening: string;
     applyMorning: string;
     applyMidday: string;
     applyEvening: string;
     journalText: string;
   }
   ```
2. Initialize and watch from `props.entry` so saved entries rehydrate correctly.
3. Add mode control styled in the existing app language:
   - `Structured`
   - `Free response`
4. Structured mode fields, copied from React’s `POAJournal.tsx` structure:
   - Practice: `practiceNotes`
   - Observe: `observeMorning`, `observeMidday`, `observeEvening`
   - Apply: `applyMorning`, `applyMidday`, `applyEvening`
5. Free-response mode field:
   - `journalText`
6. Change the component emit signature from a single string to the full draft payload:
   ```ts
   const emit = defineEmits<{
     (event: 'save', payload: POADraft): void;
   }>();
   ```
7. In `JournalPage.vue`, change `saveDailyAction(journalText: string)` to accept the full payload and pass all fields through to `savePOA()`.
8. Preserve saved structured data on reload. Do not hard-code empty strings for structured fields anymore.

**Acceptance checks:**

- After a practice is started, `DailyActionCard` shows a Structured/Free response switch.
- Structured mode has 7 textareas: Practice, Observe morning/midday/evening, Apply morning/midday/evening.
- Free response mode has one large textarea.
- Saving in either mode persists and rehydrates after reload for the signed-in tester path.
- No schema change should be required; existing Supabase table fields and store mapping already support this.

---

### Task 4: Library source/content skeleton instead of plain lists

**Objective:** Make Library feel like the beginning of a resource hub while staying source-safe.

**Files:**
- Modify: `apps/chekhov-toolkit-ionic/src/views/LibraryPage.vue`
- Optional if useful: add a small local resource array inside the component or `apps/chekhov-toolkit-ionic/src/data/libraryResources.ts`.

**Implementation details:**

1. Keep the taxonomy accordion, but place it under a more purposeful section:
   ```text
   Dive Deeper into the Tools
   ```
2. Show category descriptions and full child labels from Tasks 1–2.
3. Add source-safe bucket cards/sections after the taxonomy accordion:
   - `Videos & Demonstrations`
   - `Chekhov Lectures & Writings`
   - `Lisa Dalton / NMCA Books & Excerpts`
   - `Michael Chekhov Archives`
   - `Lisa’s YouTube`
   - Optional: `Saved / Recent Tools` only if cheap and not fake.
4. If exact URLs are not already verified/approved in the repo, use placeholders and copy like:
   ```text
   Link slot reserved for approved beta resource.
   ```
   Do not fabricate archive URLs, lecture URLs, YouTube URLs, purchase links, excerpts, or quotations.
5. The Library should look like a scaffold for future depth, not a dead list. Use existing studio panels/paper cards/chips.

**Acceptance checks:**

- `/library` has a clear `Dive Deeper into the Tools` section.
- It has named future resource buckets.
- It remains explicit that excerpts/links are pending approval when exact resources are not verified.
- It does not invent teaching content or quote copyrighted material.

---

### Task 5: Active Cypress/demo smoke coverage

**Objective:** Make the default e2e spec cover demo-critical behavior, not old scaffold assumptions.

**Files:**
- Modify: `apps/chekhov-toolkit-ionic/tests/e2e/specs/test.cy.ts`

**Implementation details:**

Extend the existing Cypress spec to cover:

1. `/chart` loads at 390x844 with no horizontal overflow.
2. There is no top `h1 Chart` intro block above the chart.
3. Chart hub contains `Inspired Action`.
4. Quick Draw displays a result card with taxonomy labels.
5. Library has `Dive Deeper into the Tools` and the new resource buckets.
6. Library shows full Atmosphere labels; at minimum assert `Cemetery` appears when Atmosphere is opened.
7. Journal page contains the entry paths; after a started practice path in a test-friendly way if possible, the POA card supports structured/free-response UI. If auth makes this too brittle, use a component-independent smoke or leave a manual receipt requirement instead of faking auth.

**Acceptance checks:**

```bash
cd apps/chekhov-toolkit-ionic
npm run build
npm run test:unit
npm run test:e2e
```

If auth makes POA e2e impossible without configured Supabase, do not claim full e2e for POA persistence; report manual/browser smoke requirement.

---

## Final verification gates

Run from `apps/chekhov-toolkit-ionic` unless noted.

```bash
npm run build
npm run test:unit
npm run test:e2e
```

Manual/browser smoke at 390px:

1. `/chart`
   - No top text block.
   - Hub reads `Inspired Action`.
   - Quick Draw works and redraws.
   - Begin POA/Journal path is warm and non-technical.
2. `/library`
   - Dive Deeper section exists.
   - Resource buckets exist.
   - Atmosphere has full child labels.
   - Category descriptions appear where intended.
3. `/journal`
   - Existing Today’s Practice flow remains intact.
   - Structured POA/free-response mode works after starting a practice.
   - Saved POA rehydrates on reload for signed-in tester path.
4. `/settings`
   - Technical beta/security details remain there, not in the primary Chart/Journey first viewports.
5. Content scan:
   - No generated embodied Chekhov practice prompts.
   - No fabricated resource links/excerpts.
6. `git status --short` and changed-file list included in final report.

Readiness label if all above passes but no real phone smoke has occurred:

```text
browser-demo-ready only
```

Do not claim `phone/Lisa ready` unless Dawson or the controller has exercised the real phone path.

---

## Non-goals / cut line

Defer unless all must-land gates are green:

- Full history panel parity.
- Flyback Journal parity.
- React Unveiled toggle parity.
- Exact React visual parity.
- New public links unless verified/approved.
- Real excerpt ingestion.
- Backend/schema expansion unless current fields prove insufficient.
- Deployment, alias changes, or sharing links.

---

## Suggested Fable dispatch prompt

Use this after Fable model access is confirmed. If `--model fable` still fails, either fix model access first or run the same prompt with a clearly labeled fallback model; do not claim a Fable result from a fallback.

```bash
cd "/Users/dawson/Documents/Claude/Projects/Michael Chekhov App"
claude -p --model fable --tools default --no-session-persistence \
"Read AGENTS.md, CLAUDE.md, and .claude/plans/2026-06-12-demo-parity-fable-handoff.md. Implement the plan exactly inside apps/chekhov-toolkit-ionic. Do not deploy, push, share externally, reset/clean the tree, or edit client/src/lib/toolData.ts except as read-only reference. Preserve the current clean design. Restore React taxonomy/definitions/children, Chart Quick Draw, Library resource skeleton, and structured/free-response POA. Run the stated verification commands. Final report must list changed files, commands run, pass/fail output, and blockers."
```
