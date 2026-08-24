# Transformation / Psychological Gesture / PDF / Connect Sprint Plan

> **For Hermes:** Use `subagent-driven-development` only after the Psychological Gesture content interview is complete. Use Fable/Claude Code as the main integrator, Codex/GPT-5.5 as read-only reviewer/verifier, and Hermes/Rudy as controller/gatekeeper.

**Date:** 2026-07-02  
**Target app:** `apps/chekhov-toolkit-ionic/`  
**Current base:** active secure beta Build 0.1.0 / `secure-beta-0.1.0` on branch `secure-beta-launched`  
**Deployment intent:** deploy today only after Dawson approves the final verified diff and release note.  
**Goal:** Add the new Transformation/Psychological Gesture taxonomy lane, harden PDF export for saved/completed POAs, seed the Connect tab for future community surfaces, and implement a safe first group-room chat foundation without drifting from NMCA/Lisa guardrails.

## Non-negotiables

- Do not invent Michael Chekhov embodied practice prompts.
- Do not let Fable/Polly/Codex create Psychological Gesture content from general model knowledge. PG labels/descriptions/children must come from Dawson/Lisa/source-scaffold interview or be explicitly marked as pending.
- Do not deploy or share a new build with Lisa until Dawson approves after gates.
- Preserve active secure-beta auth/RLS guarantees.
- Any tester-visible change requires a build bump across:
  - `apps/chekhov-toolkit-ionic/package.json`
  - `apps/chekhov-toolkit-ionic/package-lock.json`
  - `apps/chekhov-toolkit-ionic/src/constants/build.ts`
  - this or a new release/receipt note under `.claude/plans/`
- Treat chat as student-/class-facing: group rooms only, no DMs, no attachments, no push notifications in this sprint.

## Current preflight receipts

- `git status --short --branch` on 2026-07-02: branch `secure-beta-launched`; only untracked old bakeoff/polish directories were visible.
- Fable smoke succeeded via Claude Code: `claude -p --model fable ...` returned `FABLE_OK`; debug showed `model=claude-fable-5 modelSupported=true`.
- Unit tests currently green: `npm run test:unit` in `apps/chekhov-toolkit-ionic` → 19 files / 104 tests passed.
- PDF share/export already exists and should be hardened, not rebuilt from scratch:
  - `src/utils/poaPdf.ts`
  - `src/views/JournalPage.vue`
  - `tests/unit/poaPdf.spec.ts`

---

## Phase 0 — Fresh audit and PG content interview

**Objective:** Avoid rebuilding shipped work and freeze the content contract for Psychological Gesture.

**Files / evidence to inspect:**
- `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/views/JournalPage.vue`
- `apps/chekhov-toolkit-ionic/src/views/MapPage.vue`
- `apps/chekhov-toolkit-ionic/src/utils/poaPdf.ts`
- `.claude/plans/2026-06-24-react-ionic-parity.md`
- `.claude/plans/2026-06-24-new-features-scope.md`
- `.claude/plans/2026-07-01-secure-beta-receipts-wrap.md`

**Acceptance:**
- Produce a corrected G1–G7 status table against current code before any parity implementation.
- Use Dawson’s approved PG scaffold exactly:
  - category description: `Psychological Gesture = Archetypal Gesture (Pure Will / what) + Feeling (how) + Thinking (why)`
  - parent tools:
    - `Inspiration` — no children
    - `Imagination` — children: `Body`, `Behavior`, `Activity`
    - `Intellect` — children: `Way`, `Win`, `Loss`
  - draw semantics: PG should be eligible for random draw / Journal immediately; use the same general combination model as most tools, not a Movable Centers-style multi-part recipe.
  - no avoided terms were named by Dawson.

---

## Phase 1 — Reorder taxonomy groups and add Psychological Gesture

**Objective:** Make the chart/order match Dawson’s desired family progression and add category 16 under Transformation.

**Desired order:**
1. PsychoPhysical Exercises categories 1–3
2. Characterization categories 4–6
3. Emotional Life categories 7–10
4. Esthetics categories 11–13
5. Transformation categories 14–16

**Files likely touched:**
- `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/data/toolCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue` if family ordering/labels assume old order
- `apps/chekhov-toolkit-ionic/src/components/CategoryDetailSheet.vue` if detail copy needs PG shell handling
- `apps/chekhov-toolkit-ionic/tests/unit/toolCatalog.spec.ts`
- `apps/chekhov-toolkit-ionic/tests/unit/circleChartDirectory.spec.ts`
- `apps/chekhov-toolkit-ionic/tests/unit/circleChartGeometry.spec.ts`
- `apps/chekhov-toolkit-ionic/tests/e2e/specs/test.cy.ts` if chart count/order is asserted

**Implementation details:**
- Reorder `CHART_FAMILIES` to: psycho-physical, characterization, emotional-life, esthetics, transformation.
- Reorder `CHART_CATEGORIES` accordingly.
- Add `psychological-gesture` as the 16th category, family `transformation`.
- Add PG to `WEEKEND_TOOL_CATALOG` with exactly Dawson’s approved scaffold:
  - `Inspiration`, `children: []`
  - `Imagination`, `children: ['Body', 'Behavior', 'Activity']`
  - `Intellect`, `children: ['Way', 'Win', 'Loss']`
- Ensure empty-child parent tools such as `Inspiration` remain drawable at the parent-tool level rather than being silently excluded.
- Treat this as part of the G2/show-level draw granularity parity lane: the draw function should support drawing category, parent, child, or any valid combination without requiring every parent to have children.
- Do not special-case PG as a Movable Centers-style multi-component recipe.
- Update tests to expect 16 categories and new family grouping.

**Acceptance checks:**
- Chart displays 16 categories in the requested order.
- Psychological Gesture appears under Transformation.
- Random draw / Journal draw can select Psychological Gesture immediately, including the no-child `Inspiration` parent tool.
- No generated embodied prompts appear in PG or elsewhere.
- Mobile-width chart has no horizontal overflow.

---

## Phase 2 — PDF export from saved/completed POA history

**Objective:** Meet the teacher-requested homework workflow: a student can export any saved/completed POA as a PDF with name and date.

**Confirmed product decisions:**
- Export any saved/completed POA from history, not only today’s active POA.
- PDF includes student name and date.
- Classes/shows do not appear in the PDF.
- No Canvas/LMS API integration in this sprint; file export/share/download is enough for upload to an edu platform.

**Files likely touched:**
- `apps/chekhov-toolkit-ionic/src/utils/poaPdf.ts`
- `apps/chekhov-toolkit-ionic/src/components/PracticeHistoryList.vue`
- `apps/chekhov-toolkit-ionic/src/views/JournalPage.vue`
- `apps/chekhov-toolkit-ionic/src/stores/dailyPracticeStore.ts`
- `apps/chekhov-toolkit-ionic/src/types/practice.ts`
- `apps/chekhov-toolkit-ionic/tests/unit/poaPdf.spec.ts`
- `apps/chekhov-toolkit-ionic/tests/unit/PracticeHistoryList.spec.ts`

**Implementation details:**
- Extend PDF input to include a `studentName` string sourced from the authenticated tester account:
  1. profile/display name if present;
  2. auth user metadata full name if present;
  3. neutral blank fallback: `Name: __________________`.
- Do not use class/show context in the PDF, and do not expose the account email as the student name unless Dawson explicitly asks later.
- Add export action to saved/completed POA history rows.
- Ensure export uses the specific historical POA/practice snapshot, not always today’s current reactive state.
- Preserve existing Web Share / download / mailto fallback behavior.

**Acceptance checks:**
- Current POA export still works.
- Saved/completed historical POA export works.
- PDF text includes app name, student name, date, selected tool, POA content, and attribution footer.
- Unit tests cover name/date and historical export payload.

---

## Phase 3 — Connect seeded shell + multi-room group chat foundation

**Objective:** Move Connect from pure coming-soon into a seeded community shell and build the first safe group-room chat foundation for teachers/classes/shows.

**Confirmed product decisions:**
- Teachers should be able to create multiple class/show rooms.
- Calendar/map have no real content yet; keep them as seeded shells.
- Chat is group-room only; no one-to-one direct messaging in this sprint.

**Schema / RLS design:**
Create additive Supabase migration only; do not mutate existing practice tables.

Suggested tables:
- `chat_rooms`
  - `id uuid primary key default gen_random_uuid()`
  - `created_by uuid not null references auth.users(id)`
  - `name text not null`
  - `room_type text not null check (room_type in ('class','show'))`
  - `description text`
  - `created_at timestamptz default now()`
- `chat_room_members`
  - `room_id uuid references chat_rooms(id) on delete cascade`
  - `user_id uuid references auth.users(id) on delete cascade`
  - `role text not null check (role in ('teacher','member'))`
  - `created_at timestamptz default now()`
  - primary key `(room_id, user_id)`
- `chat_messages`
  - `id uuid primary key default gen_random_uuid()`
  - `room_id uuid references chat_rooms(id) on delete cascade`
  - `user_id uuid references auth.users(id)`
  - `body text not null check (char_length(body) between 1 and 2000)`
  - `created_at timestamptz default now()`

RLS intent:
- Users can read rooms only when they are members.
- Teachers/creators can manage rooms they created.
- Users can read messages only in rooms they belong to.
- Users can insert messages only as themselves and only in rooms they belong to.
- Deletion/editing is deferred or owner-only if absolutely necessary.

**Files likely touched:**
- `supabase/migrations/<timestamp>_group_chat_rooms.sql`
- `apps/chekhov-toolkit-ionic/src/views/MapPage.vue` or renamed internal component while route remains `/map`
- new `apps/chekhov-toolkit-ionic/src/stores/chatStore.ts`
- new `apps/chekhov-toolkit-ionic/src/types/chat.ts`
- tests under `tests/unit/` and `tests/e2e/specs/`
- RLS verification script if existing Supabase verifier pattern is extensible

**MVP UI:**
- Connect tab sections:
  - Group Rooms
  - Calendar — seeded shell / content pending
  - Map — seeded shell / content pending
- Teacher flow:
  - Create room with name + type class/show.
  - Creator becomes `teacher` member automatically.
- Member flow for this sprint can be limited:
  - Show user’s rooms.
  - Enter room.
  - Send/read text messages.
  - Invite/join flow may be deferred unless Dawson explicitly promotes it.

**Acceptance checks:**
- Authenticated teacher can create more than one room.
- Room creator can send/read messages.
- A user not in the room cannot read messages via API/RLS smoke.
- UI clearly says calendar/map content is pending; no fake events or real-world listings.
- No DMs, attachments, or push notifications.

---

## Phase 4 — Chart key collapse + Quick Draw ritual redesign

**Objective:** Make Quick Draw feel like the central, emotionally compelling app action rather than a merely functional utility, while keeping category controls accessible but not first-viewport dominant.

**Confirmed product decisions:**
- The colored/numbered category key directly under the chart should collapse/expand.
- The Quick Draw button should be visible without scrolling on both desktop and mobile where reasonably possible.
- The draw action should feel centered / Tarot-app-like: the user is drawing a tool/card, not clicking a settings utility.

**Files likely touched:**
- `apps/chekhov-toolkit-ionic/src/views/ChartPage.vue`
- `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue`
- optional new `apps/chekhov-toolkit-ionic/src/components/QuickDrawCard.vue`
- `apps/chekhov-toolkit-ionic/tests/e2e/specs/test.cy.ts`
- unit tests if Quick Draw state is extracted

**Implementation details:**
- Move/shape Quick Draw so it appears immediately with the chart in the first viewport.
- Prefer a centered draw-card module:
  - a tactile card/back visual or studio-paper object;
  - central button label such as `Draw a Tool` or `Draw Card`;
  - result reveals as a card with category/parent/child/components;
  - secondary controls (`Veiling value`, history, filters) should not compete with the central draw action.
- The category key / category directory should default collapsed or compact, with an obvious expand/collapse control.
- Preserve access to Select all / Deselect all / examples toggle and category details; they can live inside the expanded key/directory area.
- Keep no-AI-prompt guardrails: reveal card may show labels/descriptions from existing taxonomy, not invented practice instructions.

**Acceptance checks:**
- At 390px mobile width, chart + central draw action are visible without deep scrolling.
- On desktop, central draw action is visible without scrolling and reads as the primary action.
- Category key/directory can collapse and expand via keyboard-accessible controls.
- Quick Draw still supports draw another, lock behavior, Begin POA, history, and Veiling value if present.
- No horizontal overflow at 320px/390px.

---

## Phase 5 — G1–G7 parity cleanup after fresh audit

**Objective:** Finish only the genuinely remaining parity gaps.

Known stale-old claims must be rechecked:
- G1 History appears implemented per later receipts.
- G3 Flyback exists in current `JournalPage.vue`.
- G5 Journal Unveiled has unit coverage.
- G7 404 route exists.

Likely remaining polish candidates:
- G4 reveal-card polish / description-on-reveal may be absorbed into the Quick Draw ritual redesign.
- G6 draw suspense state / “Drawing…” animation should be integrated into the centered draw-card ritual.
- G2 show-level draw granularity UX clarity if not already clear.

**Acceptance:**
- Corrected G1–G7 table committed or included in release note.
- Only actual missing items are implemented.
- No duplicate/rebuilt versions of already-shipped features.

---

## Phase 6 — Build bump, release note, verification, approval, deploy

**Objective:** Ship only after receipts and Dawson approval.

**Build bump proposal:**
- If group chat lands with schema/RLS smoke green: bump to `0.2.0`, `secure-beta-0.2.0`.
- If group chat does not clear RLS/verification in time: ship taxonomy/PDF/Quick Draw/Connect shell as `0.1.1`, `secure-beta-0.1.1`, and leave chat branch-ready but not deployed.
- Do not include partially verified chat in production.

**Required local gates before approval:**
```bash
cd apps/chekhov-toolkit-ionic
npm run lint
npm run build
npm run test:unit
npm run test:e2e:ci
npm run verify:build-version
```

**If Supabase migration lands:**
- run local/linked dry-run as appropriate;
- run an RLS smoke proving cross-user denial for chat rooms/messages;
- do not apply hosted migration without Dawson approval.

**Pre-deploy approval packet:**
- changed files summary
- exact gates passed/failed
- screenshots or browser smoke notes for Chart, Journal PDF export, Connect/chat
- RLS receipt if chat migration landed
- build identifier
- explicit ask: “Approve deploy?”

**Deploy only after approval.**

---

## Recommended prompts

### Fable / Claude Code main lane

Use after Phase 0 interview is complete:

```md
You are Fable/Claude Code implementing a bounded Chekhov Toolkit secure-beta sprint in `/Users/dawson/Documents/Claude/Projects/Michael Chekhov App`.

Read first: `AGENTS.md`, `CLAUDE.md`, and `.claude/plans/2026-07-02-transformation-pg-pdf-chat-sprint.md`.

Implement only the approved tasks from the plan. Non-negotiables: no AI-generated embodied Michael Chekhov prompts; use Dawson’s exact Psychological Gesture scaffold; preserve NMCA/Lisa terminology; do not deploy; do not push; no secrets. Work in `apps/chekhov-toolkit-ionic/` unless the plan explicitly names Supabase migrations.

Start with a fresh current-code audit of G1–G7 before editing. Then implement taxonomy reorder + approved PG content, PDF export from saved/completed history with name/date, Connect seeded shell, Quick Draw ritual redesign / collapsible chart key, and the approved group-chat MVP only if the schema/RLS scope is accepted. Update tests and build identifiers as required.

Run: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e:ci`, `npm run verify:build-version`. If a Supabase migration lands, include the RLS smoke result.

Return: summary, changed files, commands run, failures/blockers, and deploy-readiness verdict. Do not claim Lisa-ready or deployed.
```

### Codex / GPT-5.5 review lane

```md
Review the current diff for `.claude/plans/2026-07-02-transformation-pg-pdf-chat-sprint.md` compliance. Do not edit files unless explicitly asked.

Check: no invented Chekhov practice prompts; Psychological Gesture content exactly matches Dawson’s scaffold; category order 1–16 matches spec; PDF export uses the selected historical POA and includes name/date; Quick Draw is first-viewport/centered and the chart key collapses/expands accessibly; chat RLS prevents non-member reads/writes; Connect calendar/map are seeded shells only; build/version/release note updated; tests are meaningful.

Return: PASS / REQUEST_CHANGES with exact file:line findings and suggested minimal fixes.
```
