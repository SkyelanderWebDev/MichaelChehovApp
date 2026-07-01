# New Features Scope — History, PDF Share, Actor-Struggles + Quiz

> **STATUS CORRECTION (2026-07-01):** Several "NOT yet built" claims below are stale. As of 2026-07-01: A2 security headers are live in production; A3 iOS meta/zoom and A4 POA autosave guard exist in code; A5 signed-in persistence e2e exists and now PASSES against hosted Supabase; A1 hosted RLS verify PASSES (locally and in CI job "Supabase RLS receipt"). G1 History (Journals + Quick Draw History) is implemented. See `.claude/plans/2026-07-01-secure-beta-receipts-wrap.md` for receipts.

Date: 2026-06-24 · Target: closed beta Friday · Author: polly (orchestrator)
Source: 3 read-only scout reports (codex sandbox-blocked on external path; claude_code ×2 delivered).

Status of confirmed decisions from Dawson this session:
- G0: canonical wording = **"PsychoPhysical Exercises"** (rename approved).
- G1 History: **in scope** for closed beta.
- G2–G7 parity items: **all in scope**.
- **F3 CLEARED by Lisa** — her "OR" material may be surfaced in-app WITH attribution.
- F3 interaction: **browsable list and/or multiple-choice** for v1 (see open gate: MC needs answer key).
- F1 draw history: **log EVERY roll** (every Draw Random / re-roll writes a history row, committed or not).
- F1 POA history: **POA locks when the day is done** → core POA becomes read-only/browsable; user may append a note/comment after lock (separate append-only notes table). Day's core POA itself is immutable once locked.
- Timeline: full wave over **~36 hours**, with proper plan → implement → cross-review → verify.

---

## Feature 1 — Draw history + POA/Journal history

### Ground truth (evidence)
- Schema `supabase/migrations/20260610192000_secure_beta_core.sql`.
- `daily_practices` UNIQUE `(user_id, local_date)` (L70) → **upsert; each draw overwrites**.
- `poa_entries` UNIQUE `(user_id, daily_practice_id)` (L100) → **upsert; each POA save overwrites**.
- Store `src/stores/dailyPracticeStore.ts`: `setPreview()` L52–88, `savePOA()` L162–189 — both upsert. No `/history` route, no `HistoryPage`. **History genuinely missing.**
- RLS per-user isolation solid (L150–202); pattern is copyable for new tables.

### Recommended approach (lowest blast radius)
- **Append-only snapshot tables**, do NOT relax existing unique constraints.
  - `draw_history(user_id, local_date, selected_tool jsonb, source, drawn_at)`
  - `poa_history(user_id, daily_practice_id, snapshot jsonb, saved_at)` (or per-day browsable POA list).
- Store: add `insert` + `listHistory()` fetchers. New `HistoryPage.vue` + route + tab in `TabsShell.vue`. Types in `practice.ts`.
- New RLS policies mirror existing user-scoped pattern (low risk if copied).
- Size: draw history **M**, POA history **S–M**.
- **Top risk:** touching the upsert/unique model in `dailyPracticeStore.ts`. Avoid by ADDING tables, not relaxing constraints.

### Open design decisions (need Dawson)
- D1: Draw history granularity — log **every draw incl re-rolls**, or only the **started/committed** practice per day?
- D2: POA history — full **edit-log snapshots** (every save), or **one browsable entry per day** (latest)? (Edit-log = more rows, more value, slightly more UI.)
- D3: History UI — its own bottom tab, or nested under Journal?

---

## Feature 2 — Export/share PDF of the POA (Canvas / text / email)

### Ground truth (evidence)
- Deps (`apps/chekhov-toolkit-ionic/package.json`): Capacitor core/app/haptics/keyboard/status-bar present.
  **Missing: `@capacitor/share`, `@capacitor/filesystem`, and any PDF lib (no jspdf/pdfmake/html2canvas).**
- `capacitor.config.ts`: **no `ios/` or `android/` folders → PWA-only today**, no native build.
- `vite-plugin-pwa` present → PWA-first deploy (Vercel).
- POA data shape ready: `POAEntry` + `PracticeToolSelection` in `src/types/practice.ts`; renders in `DailyActionCard.vue`, saved by `JournalPage.vue`.
- No existing share/export/print code anywhere. Net-new.

### Recommended approach
- **PWA path = no native build needed now:** generate PDF Blob (jspdf or html2pdf from DOM) → `navigator.share({files})` Web Share API → **mailto:/download fallback** where file-share unsupported (desktop spotty; iOS Safari + Android Chrome OK).
- **Canvas LMS is NOT an integration target** — reached via OS share sheet / email / file upload. No Canvas API work. (Confirm with Dawson.)
- Native `@capacitor/share` path = **L** (requires full ios/android Capacitor build + signing) → **defer** until an app-store lane opens.
- Size: PWA PDF + share **S–M**.

### Open design decisions (need Dawson)
- D4: Confirm **PWA share is enough for beta** (no native iOS build by Friday).
- D5: PDF content — structured POA mode + free journal mode both; include **NMCA/Lisa attribution footer**? (recommend yes.)
- D6: Is a clean **print-to-PDF / download** acceptable as the v1 if Web Share file support is flaky on a given tester device?

---

## Feature 3 — "Common actor struggles" bucket + quiz  ⚠️ CLEARANCE-GATED

### Ground truth (evidence) — source: 43 PDFs at
`/Users/dawson/Documents/Theatre/Lisa Dalton - Acting the Michael Chekhov Way OR`
- **Quiz file = `OR 20.2 Quiz 1 Test 2.pdf`** (7pp). Contains TWO quizzes:
  - Quiz 1 ("Test 2"): 16 open-response Qs.
  - **Quiz 2 "Problems in Acting: A Chekhov Path to Solving Them" = 39 open-response problems + 1 extra credit.** This is the "so you think you know it" self-test.
- **Format: open-ended short-answer. NO multiple choice, NO scoring rubric. Answer key NOT in file** — header: answers in the book; faculty request via info@chekhov.net.
- **Quiz 2 IS the struggle catalog** — 39 problem→tool pairs already structured. Remedy prose also in `OR 20.1 Technique Review`, `OR 7.2 Spheres of Emo`, `OR 8.1 Chek4AffectiveMem`, `OR 16 Objective`.
- **Born-digital, selectable text, no OCR** (42/43). Easy to mine.
- **Copyright:** all NMCA / Dalton-Kilroy-Bowles. e.g. `OR 5.1` "© 2007 LISA DALTON"; `OR 19.3` "© Lisa Dalton & Charlie Bowles 2013". Footer every page: Info@Chekhov.Net.

### Hard constraints (NMCA guardrail #1, #2)
- **All 43 PDFs copyrighted. None public domain.**
- **Answer keys deliberately withheld** — do NOT reconstruct or host them.
- Mirroring even the *39-problem taxonomy* is derivative of her work → **needs Lisa's explicit OK + agreed attribution.**
- No AI-generated embodied prompts (guardrail #1) — quiz "answers"/remedies must be source-backed, not invented.

### Why this likely CANNOT ship Friday
- **Blocked on Lisa clearance + attribution sign-off.** Eng is small; the gate is legal/content, not code.
- Source files live OUTSIDE the repo and are copyrighted → need a **cleared content JSON checked into repo** before any implementer can build against it. Can't build the real feature until that file exists and is approved.

### Open decisions (need Dawson + Lisa)
- D7: **Has Lisa cleared** surfacing struggle text / quiz questions in-app? If no → feature 3 = post-Friday.
- D8: Interaction model — **open-response self-reflection** (no grading, matches source) vs build **multiple-choice** (requires authoring distractors = new content + answer key = MORE clearance). Recommend open-response/no-grade for v1.
- D9: Attribution string format (skill notes Dawson previously approved transparent attribution; need exact wording Lisa accepts).
- D10: Scope v1 — full 39 problems, or a curated subset?

---

## Cross-cutting: Friday reality check
Already queued from prior audits + parity, NOT yet built:
- Hardening A2 (security headers), A3 (index.html meta/zoom), A4 (POA autosave/data-loss).
- Receipts A1 (run RLS test), A5 (authed POA persistence e2e).
- Parity G1 History (= Feature 1 draw history), G2–G7.
- G0 rename "PsychoPhysical Exercises".

**This is a large batch for one Friday.** Recommend triage:
- **Friday-critical:** A2/A3/A4 hardening, A1/A5 receipts, G0 rename, Feature 1 history (G1), PDF share (Feature 3 PWA) IF wanted.
- **Fast-follow (post-Friday):** G2–G7 polish, Feature 3 struggles/quiz (clearance-gated regardless).

## Roster note
- pi unavailable this run (no API key for its model). Cross-review will run **claude_code ↔ codex**.
- codex worktree sandbox CANNOT read paths outside the repo; claude_code CAN. Route any external-file work to claude_code, or stage a cleared content file inside the repo first.
