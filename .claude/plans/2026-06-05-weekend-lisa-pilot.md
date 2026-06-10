# Weekend Lisa Pilot Implementation Plan

> For Hermes: Use `subagent-driven-development` or an equivalent two-stage review process if implementation is delegated. Claude/Opus should own the coherent vertical slice; Codex/GPT-5.5 should review/verify against this plan.

**Goal:** Build the smallest Lisa-ready mobile confidence demo for The Michael Chekhov Toolkit.

**Architecture:** Create an isolated Ionic Vue/PWA pilot without disturbing the current React/Vite/Express/SQLite prototype. Mine the React prototype for taxonomy, POA behavior, and UX reference, but do not require full React feature parity. For the weekend, local-first persistence is acceptable; Supabase Auth/Postgres/RLS is the June 13 secure-beta lane unless it is trivial after the vertical slice is working.

**Tech Stack:** Ionic Vue, TypeScript, Vite, Capacitor-ready PWA, localStorage/IndexedDB-style local persistence for the weekend slice, Supabase planned for June 13.

---

## Source-of-truth context

Read these before implementation:

- `CLAUDE.md`
- `AGENTS.md`
- `/Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-phase0-current-state-audit.md`
- `brainstorms/michael-chekhov-toolkit-grill-me.md`
- `brainstorms/agent-orchestration-final-plan-2026-06-04.md`

Current React prototype reference files:

- `client/src/lib/toolData.ts`
- `client/src/pages/Home.tsx`
- `client/src/components/ToolRevealCard.tsx`
- `client/src/components/POAJournal.tsx`
- `client/src/components/HistoryPanel.tsx`
- `shared/schema.ts`
- `server/routes.ts`
- `server/storage.ts`

## Non-negotiables

- App name: **The Michael Chekhov Toolkit**.
- Visible attribution before any external share:
  - `Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.`
- First beta: no AI-generated embodied Chekhov practice prompts.
- Use taxonomy labels, POA structure, sourced/cited excerpts, and neutral navigation copy only.
- Preserve NMCA-validated terminology from `client/src/lib/toolData.ts`.
- Do not edit `client/src/lib/toolData.ts` unless Dawson explicitly authorizes taxonomy changes.
- Treat Lisa Dalton iPhone testing as a primary acceptance path.
- Free-first. No paid services or app-store distribution unless Dawson approves.
- Do not deploy/share externally without Dawson approval.
- Preserve the existing dirty tree.

## Weekend definition of done

The weekend pilot is done when a tester can:

1. Open an app-like Ionic Vue/PWA surface locally or through an approved private URL.
2. See `The Michael Chekhov Toolkit` name.
3. See or easily reach NMCA/Lisa/Chart attribution.
4. Enter a Today’s Practice screen.
5. Choose one of three paths:
   - Pick My Own
   - Draw Random
   - Daily Tool, seeded/static placeholder is fine
6. Preview the tool and change/re-roll before commitment.
7. Press `Start Today’s Practice` to lock the chosen local-day practice.
8. Open POA in the familiar position/relationship to the reveal/practice screen.
9. Save at least one POA note.
10. Reload or return and see the locked practice and POA note again, if feasible.
11. Use the main path at mobile width with tappable controls.
12. Pass a content scan for no AI-generated embodied prompts.

If save/return/reload cannot be finished without threatening the whole slice, keep Today’s Practice + lock + POA visible and document persistence as the first follow-up. Do not cut attribution or no-AI-prompt gates.

## Explicit weekend defers

- Full Supabase Auth/Postgres/RLS.
- Real push notifications.
- Real global Daily Tool scheduler/admin CMS.
- TestFlight/App Store/Play distribution.
- Broad Library implementation.
- Paid/content access tiers.
- Formal public rights audit.
- AI-generated embodied prompts.
- Broad taxonomy edits.
- Full React prototype parity.
- Classroom/projector mode, exports, streaks, calendar, timers.

## Recommended file layout

Create the pilot in an isolated subdirectory so existing React WIP remains intact:

```text
apps/chekhov-toolkit-ionic/
├── package.json
├── index.html
├── capacitor.config.ts
├── vite.config.ts
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/index.ts
│   ├── theme/variables.css
│   ├── constants/attribution.ts
│   ├── data/toolCatalog.ts
│   ├── stores/dailyPracticeStore.ts
│   ├── types/practice.ts
│   ├── views/TodayPracticePage.vue
│   └── components/
│       ├── AppAttribution.vue
│       ├── TodayPracticeChooser.vue
│       ├── ToolPreviewCard.vue
│       ├── PickMyOwnSheet.vue
│       ├── POAPanel.vue
│       └── DemoStatusCard.vue
└── docs/
    └── lisa-demo-script.md
```

Notes:
- If the Ionic generator chooses slightly different paths, preserve the intent and update this plan’s file references in the implementation report.
- Keep the root React app untouched unless a specific reference extraction requires a read-only copy.
- `toolCatalog.ts` should be a Vue-safe data copy or small curated subset from `client/src/lib/toolData.ts` without React icon imports. Preserve names exactly.

---

## Task 0: Protect the tree and confirm baseline

**Objective:** Start from a known state and protect the existing WIP.

**Files:** none expected.

**Steps:**

1. Run:

```bash
git status --short
```

2. If not already done in this session, save dirty tree backup:

```bash
mkdir -p /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree
git status --short > /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/status.txt
git diff > /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/worktree.diff
git diff --staged > /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/staged.diff
git ls-files --others --exclude-standard > /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/untracked-files.txt
if [ -s /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/untracked-files.txt ]; then
  tar -czf /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/untracked-files.tar.gz -T /Users/dawson/.hermes/session-wraps/2026-06-05-chekhov-weekend-pilot-dirty-tree/untracked-files.txt
fi
```

3. Run existing prototype baseline if implementation will touch shared/root files:

```bash
npm run check
npm run build
```

**Expected:** Existing prototype remains type/build clean. If the root build fails, stop and investigate before creating the pilot.

**Commit:** Do not commit yet unless Dawson approves separating Phase 0 docs from existing WIP.

---

## Task 1: Scaffold the isolated Ionic Vue pilot

**Objective:** Create the app-like Vue/PWA shell without touching existing React source.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/`

**Steps:**

1. Create the parent directory:

```bash
mkdir -p apps
```

2. Verify the Ionic generator command before running it:

```bash
npm create ionic@latest -- --help
```

3. Scaffold a blank Ionic Vue app under `apps/chekhov-toolkit-ionic`. Use the non-interactive command form supported by the current generator. Preferred shape if supported:

```bash
npm create ionic@latest apps/chekhov-toolkit-ionic -- --type=vue --template=blank --capacitor
```

4. If the generator does not support that exact syntax, use the interactive generator, choose:

```text
Framework: Vue
Template: blank
Capacitor: yes
App directory: apps/chekhov-toolkit-ionic
```

5. Do not initialize a nested git repository. If the generator creates one, remove only the nested `.git` inside `apps/chekhov-toolkit-ionic/`:

```bash
rm -rf apps/chekhov-toolkit-ionic/.git
```

6. Inspect generated package scripts:

```bash
cd apps/chekhov-toolkit-ionic
npm run
```

7. Run the generated build:

```bash
npm run build
```

**Expected:** Blank Ionic Vue app builds.

**Fallback:** If generator/network install blocks, create a blocker note and do not fake a scaffold. The fallback is a minimal Vite Vue PWA shell, but only after Dawson/Hermes accepts the fallback.

---

## Task 2: Add product constants and attribution surface

**Objective:** Make official identity visible and centralized.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/src/constants/attribution.ts`
- Create: `apps/chekhov-toolkit-ionic/src/components/AppAttribution.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/App.vue` or `src/views/TodayPracticePage.vue`

**Implementation shape:**

```ts
export const APP_NAME = 'The Michael Chekhov Toolkit';

export const BETA_DESCRIPTION =
  'The Michael Chekhov Toolkit is a private beta practice app inspired by the Chart of Inspired Action from the National Michael Chekhov Association and Lisa Dalton. Built for actor training, rehearsal, and daily Michael Chekhov practice.';

export const CHART_ATTRIBUTION =
  'Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.';
```

`AppAttribution.vue` should display the attribution in a footer, about panel, or always-visible status area. For the weekend, visible footer text is acceptable if it does not crowd the main mobile flow.

**Verification:**
- Build passes.
- Browser/mobile-width view shows app name.
- Attribution is visible or reachable without hunting.

---

## Task 3: Create a Vue-safe tool catalog

**Objective:** Provide enough NMCA-validated tool data for the weekend flow without importing React-only code.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/src/types/practice.ts`
- Create: `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`

**Rules:**
- Preserve names from `client/src/lib/toolData.ts` exactly.
- Do not change taxonomy language.
- Do not import `lucide-react` or `@shared/schema` into the Vue pilot.
- A curated subset is acceptable for the weekend if it supports Pick My Own, Draw Random, and Daily Tool seed.
- If using a subset, label it internally as weekend seed data, not as the complete Chart.

**Minimum viable data:**
- At least 5 categories, including one psycho-physical category and one Tempo/Rhythm-style category if easy.
- At least 2 parent tools per category where available.
- At least one child/example per selected parent where available.
- One deterministic Daily Tool seed.

**Preferred:** copy the full taxonomy into Vue-safe plain objects if it can be done safely and quickly.

**Verification:**
- TypeScript build passes.
- Content scan finds no invented prompt paragraphs.
- Random draw cannot produce empty category/tool values.

---

## Task 4: Implement local daily practice state

**Objective:** Model the weekend version of the mature Daily Practice object.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/src/stores/dailyPracticeStore.ts`
- Modify/Create: `apps/chekhov-toolkit-ionic/src/types/practice.ts`

**Data shape:**

```ts
export type PracticeSource = 'self-selected' | 'random' | 'global-daily';

export interface PracticeToolSelection {
  categoryId: string;
  categoryName: string;
  parentToolName: string;
  childToolName?: string | null;
  scaleValue?: number | null;
  unveiledValue?: number | null;
}

export interface DailyPractice {
  id: string;
  localDate: string;
  source: PracticeSource;
  status: 'preview' | 'started';
  selectedTool: PracticeToolSelection;
  startedAt?: string;
  updatedAt: string;
}

export interface POAEntry {
  dailyPracticeId: string;
  mode: 'structured' | 'journal';
  practiceNotes: string;
  observeMorning: string;
  observeMidday: string;
  observeEvening: string;
  applyMorning: string;
  applyMidday: string;
  applyEvening: string;
  journalText: string;
  updatedAt: string;
}
```

**Store behavior:**
- `getTodayPractice()` loads by local date.
- `setPreview(selection, source)` stores candidate state.
- `startTodayPractice()` changes status to `started` and locks the selected tool.
- Once started, no re-roll/change unless the implementation provides an explicit reset path hidden behind developer/demo controls. Do not make slot-machine behavior the normal path.
- `savePOA(entry)` persists notes.
- `getPOA(dailyPracticeId)` reloads notes.

**Storage:**
- Use `localStorage` for weekend unless IndexedDB is already available in the Ionic template and equally simple.
- Prefix keys with `mct-weekend-beta:`.

**Verification:**
- Start practice, reload, chosen tool remains locked.
- Save a Practice note, reload, note returns.

---

## Task 5: Build Today’s Practice page

**Objective:** Deliver the main Lisa demo flow.

**Files:**
- Create/Modify: `apps/chekhov-toolkit-ionic/src/views/TodayPracticePage.vue`
- Create: `apps/chekhov-toolkit-ionic/src/components/TodayPracticeChooser.vue`
- Create: `apps/chekhov-toolkit-ionic/src/components/ToolPreviewCard.vue`
- Create: `apps/chekhov-toolkit-ionic/src/components/PickMyOwnSheet.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/router/index.ts`

**UI requirements:**
- Mobile-first layout.
- Header: The Michael Chekhov Toolkit.
- Small line: Today’s Practice.
- Three clear entry cards/buttons:
  - Pick My Own
  - Draw Random
  - Daily Tool
- Preview card appears after choice.
- Before start, user can change/re-roll.
- Primary CTA: `Start Today’s Practice`.
- After start, display locked practice state and POA action.

**Copy rules:**
- Neutral/navigation copy is fine.
- Do not write embodied instructions like “move as if...” unless directly sourced and cited.
- Good neutral examples:
  - “Choose how you want to begin today.”
  - “Preview today’s tool before starting.”
  - “Once started, this tool stays attached to today’s POA.”

**Verification:**
- User can complete all three choice paths.
- Draw Random produces a valid tool.
- Daily Tool uses deterministic seeded/static valid tool.
- Started state locks after CTA.

---

## Task 6: Build POA panel

**Objective:** Preserve the POA path Lisa already likes and prove save/return.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/src/components/POAPanel.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/views/TodayPracticePage.vue`
- Modify: `apps/chekhov-toolkit-ionic/src/stores/dailyPracticeStore.ts`

**POA fields:**
- Mode toggle: Structured / Journal.
- Structured:
  - Practice
  - Observe — Morning, Midday, Evening
  - Apply — Morning, Midday, Evening
- Journal:
  - One freeform journal text area.

**UI requirements:**
- Large mobile-friendly text areas.
- Sticky or clearly visible Save button.
- Clear saved status after save.
- Reopening the page shows the saved POA content.

**Copy rules:**
- Keep prompts neutral and structural.
- Avoid invented embodied coaching language.

**Verification:**
- Start Today’s Practice.
- Open POA.
- Enter one Practice note.
- Save.
- Reload.
- Locked practice and Practice note are still visible.

---

## Task 7: Add demo status and known limits

**Objective:** Make the weekend artifact honest for Dawson/Lisa.

**Files:**
- Create: `apps/chekhov-toolkit-ionic/src/components/DemoStatusCard.vue`
- Create: `apps/chekhov-toolkit-ionic/docs/lisa-demo-script.md`
- Optionally modify: `apps/chekhov-toolkit-ionic/src/views/TodayPracticePage.vue`

**Demo status should include:**
- Private beta / weekend pilot language.
- “What changed since April” bullets.
- What remains June 13 work.
- Feedback prompt or placeholder.

**Demo script minimum:**

```text
What changed since April:
1. The app is now framed as The Michael Chekhov Toolkit.
2. The NMCA/Lisa/Chart attribution is visible.
3. The flow is organized around Today’s Practice, not only random drawing.
4. The actor chooses Pick My Own, Draw Random, or Daily Tool.
5. Starting practice locks one tool to today’s POA.
6. POA notes can be saved and returned to in the pilot.

What is still June 13 work:
- Login/profiles/security via Supabase.
- Hosted installable PWA for testers.
- Basic History and feedback capture.
- Library skeleton with sourced/cited material.
```

**Verification:**
- Script exists.
- Demo status does not overclaim secure beta or public launch readiness.

---

## Task 8: Verification gate before Lisa

**Objective:** Produce receipts and fix guardrail blockers before any external share.

**Commands:**

From root:

```bash
git status --short
git diff --stat
```

From Ionic pilot directory:

```bash
cd apps/chekhov-toolkit-ionic
npm run build
```

Start local dev server using whatever script the generated Ionic package provides. Common Vite shape:

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

Then verify:
- browser opens locally,
- mobile-width screenshot/smoke at 390px or narrower,
- app name visible,
- attribution visible/reachable,
- Pick My Own works,
- Draw Random works,
- Daily Tool works,
- Start Today’s Practice locks,
- POA save/return/reload works if implemented,
- no browser console errors.

**Content scan:**

Search new pilot source for risky invented prompt language. At minimum inspect all copy-bearing files under:

```text
apps/chekhov-toolkit-ionic/src/
apps/chekhov-toolkit-ionic/docs/
```

Reject/blocker if copy presents invented Chekhov/Lisa/NMCA embodied teaching. Neutral UI microcopy is allowed.

**Secrets scan:**

```bash
git diff | grep -Ei 'password|secret|api[_-]?key|token|supabase|service_role' || true
```

If Supabase is not implemented, that is acceptable for weekend. Report it as a June 13 lane, not a hidden failure.

---

## Codex verification contract

After Claude/Opus or another builder finishes the slice, Codex should run read-only/bounded verification:

```text
Review the Weekend Lisa Pilot against .claude/plans/2026-06-05-weekend-lisa-pilot.md. Do not broaden scope. Run the available build/typecheck commands for apps/chekhov-toolkit-ionic and the root prototype if root files changed. Verify app name, attribution visibility, Today’s Practice three choices, Start Today’s Practice lock, POA save/return/reload if implemented, mobile-width usability, no AI-generated embodied prompts, no secrets, and honest Supabase/RLS posture. Return exact commands, pass/fail evidence, changed files, blockers, and recommended accept/request-changes verdict.
```

## Lisa-readiness SHOW gate

Do not show externally unless all of these are true or Dawson explicitly accepts a named limitation:

- App opens on target demo environment.
- App name is correct.
- Attribution is visible.
- Today’s Practice path works.
- At least one choice path reaches Start Today’s Practice.
- POA is accessible from the started practice.
- No AI-generated embodied prompt content is present.
- Build status is known.
- Real iPhone smoke has happened or Dawson knowingly accepts only emulator/browser smoke for the moment.
- Known limitations are written plainly.

## Recommended next handoff prompt

```text
You are building the weekend Lisa pilot for The Michael Chekhov Toolkit.

Read CLAUDE.md, AGENTS.md, and .claude/plans/2026-06-05-weekend-lisa-pilot.md first.

Goal: build the narrow Ionic Vue/PWA Today’s Practice pilot only. Do not broaden into the June 13 beta.

Non-negotiables:
- App name: The Michael Chekhov Toolkit.
- Attribution visible: Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.
- No AI-generated embodied prompts in first beta.
- Preserve NMCA taxonomy language from client/src/lib/toolData.ts.
- Preserve existing dirty React prototype WIP.
- Do not deploy/share externally.

Deliver one vertical path:
1. Open app locally/mobile-width.
2. Today’s Practice screen.
3. Pick My Own / Draw Random / Daily Tool seed.
4. Preview/change before start.
5. Start Today’s Practice locks choice.
6. POA opens, saves, and returns/reloads if feasible.
7. Attribution is visible.
8. Build/typecheck/mobile/content-scan evidence is reported.

Before editing, run git status --short and produce a concise implementation plan with exact files. Keep the slice small. If blocked, shrink the feature, not the guardrails.
```
