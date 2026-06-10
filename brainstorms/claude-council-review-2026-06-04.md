# Claude Council Review — The Michael Chekhov Toolkit

**Date:** 2026-06-04
**Mode:** Read-only inspection. No edits, no installs, no deploy.

---

## Sources Inspected

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
- `client/src/lib/toolData.ts` (first 80 lines + structure)
- `shared/schema.ts`
- `server/routes.ts`, `server/db.ts`, `server/storage.ts`, `server/index.ts`
- `package.json`
- `git status` + `git diff --stat`

Verification observations (read-only — no commands beyond `git status`/`git diff --stat`):
- Working tree has 4 modified files: the three `client/src/components/examples/*.tsx` files (CLAUDE.md's lint targets) plus `server/index.ts`. `server/index.ts` now has env-driven host binding (`HOST` env, `127.0.0.1` for dev, `0.0.0.0` for production/`REPL_ID`, no `reusePort`). That matches Task A of the tandem plan — the macOS bind blocker appears resolved.
- `CategoryWheel.tsx` (production) no longer references the phantom `psychological-gesture` / `characterization` IDs flagged in CLAUDE.md. CLAUDE.md's audit notes are stale relative to current code; the wheel now uses real IDs (`three-sisters`, `four-brothers`, `movable-centers`, `tempo-rhythm`) at compass points and a separate PsychoPhysical sub-grid for the three psycho-physical categories. **CLAUDE.md should be refreshed** to reflect this.

---

## Executive Verdict

The prototype is structurally honest and pedagogically aware: SQLite is live, the POA structured/journal toggle exists, the wheel respects the real Chart of Inspired Action taxonomy, and the local dev/bind blocker is already patched in the dirty diff. What is **not yet safe to hand off** is the qualitative layer Lisa Dalton will actually judge: NMCA attribution is invisible, mobile chrome/typography has not been verified on a real iPhone, POA history is orphaned from the main history panel, and the emerald "Begin POA" button breaks the theatrical reveal aesthetic. The single highest-leverage next move is to run the Grill Me session against the explicit ambiguity around **POA temporal model** (one entry per day per tool? per tool ever? rolling?) and **Lisa's demo path** (what is the 60-second flow she will physically perform on her phone), and only then hand bounded fixes to Claude Code, with Codex as the typecheck/build/API smoke verifier.

---

## Council Findings

### 1. Broadway/West End Director (rehearsal usefulness)

- **Doing well:** Randomized prompts with category + parent + child line up with how a director would call a quick adjustment ("Try this scene with a *Reach → Yearn* impulse"). The Flyback affordance respects post-take reflection.
- **Could be better:** No way to draw *within a chosen energy flow* ("give me only *why* gestures right now"). `energyFlow` field exists in schema but is not surfaced as a filter.
- **Blind spot:** No notion of rehearsal session vs single draw — a director wants to apply one tool across a scene, not chain reveals.
- **Risk:** Without explicit duration/scene context, a draw card feels like a tarot pull, not a director's working note.
- **Highest leverage:** Add a "Rehearsal" toggle on the reveal that pins a tool for N minutes and suppresses Draw Again until the timer ends.

### 2. Michael Chekhov Master Teacher (technique fidelity)

- **Doing well:** Three-level hierarchy (category → parent → child) is faithful. The "Unveiled 1–10" scale is implemented as a separate signal, not conflated with the tool. Family + energyFlow metadata in schema is the right scaffolding.
- **Could be better:** Reveal card surfaces *only the name*. There is no contextual prompt that points at how the tool is meant to be entered (an image, a sensation, a quality to embody). The taxonomy is rich but the UX flattens it.
- **Blind spot:** Children are presented as ornamental italics under the parent ("Welcoming"). In Chekhov practice the child is often *the entry point*, not a footnote.
- **Risk:** Without bodied prompts, the app drifts into oracle-deck shallowness — exactly the failure mode CLAUDE.md warns against.
- **Highest leverage:** Add a single embodied prompt line per category (one sentence, NMCA-sanctioned wording) so the reveal becomes "do this with your body" rather than "here is a noun."

### 3. Middle/High School Theatre Teacher (classroom safety, novice scaffolding)

- **Doing well:** Hierarchy-level toggle (Cards/Tools/Examples) lets a teacher dial down complexity for first-year students.
- **Could be better:** No glossary or hover/tap explainers. A student seeing "Three Sister Sensations of Equilibrium" cold has nothing to ground them.
- **Blind spot:** No time-boxing or group-projection mode. Classroom use requires a "draw for the whole room, big text, no journal nag" mode.
- **Risk:** Pedagogically inaccessible without a teacher present — defeats use as homework.
- **Highest leverage:** Add a "Presentation" view that hides journal CTAs and enlarges the tool name to projector size.

### 4. Professional Actor (low-friction practice habit)

- **Doing well:** Single tap from launch to drawn tool. POA structure matches actual daily-practice cadence (morning/midday/evening).
- **Could be better:** POA Journal is buried behind the Begin POA button on the reveal modal. Coming back at midday to log Observe means re-drawing the same tool? Unclear. The history panel shows a `Journal` badge from the old Flyback only — POA entries are invisible in history.
- **Blind spot:** Mobile keyboards plus seven textareas in one modal = abandonment. No streak/timer/micro-prompt model.
- **Risk:** App optimizes for *drawing* tools, not *practicing* with them. Once novelty wears off, drawing fatigue sets in.
- **Highest leverage:** Open POA Journal directly from history (not just from a fresh reveal), and route POA entries into the history badge.

### 5. Undergraduate/Graduate Student (learnability, overwhelm)

- **Doing well:** Visual radial wheel makes the taxonomy navigable.
- **Could be better:** 14 categories × ~80 parents × hundreds of children is overwhelming at first contact. Onboarding gives no "start here" recommendation.
- **Blind spot:** Reflection fatigue — seven textareas per day with no minimum-viable mode. The Journal-mode toggle helps, but defaulting to Structured invites abandonment.
- **Risk:** Students will use it once for a paper and never return.
- **Highest leverage:** Add a "Today's One Tool" affordance — fixed daily draw, single-textarea reflection, no choice paralysis.

### 6. Theatre Professor/Researcher (source integrity, IP, outcomes)

- **Doing well:** Taxonomy data is centralized in `toolData.ts` as a single source of truth. NMCA permission is acknowledged in CLAUDE.md.
- **Could be better:** **The app itself shows no NMCA attribution, no © Chart of Inspired Action notice, and no Lisa Dalton credit anywhere in the UI.** For an officially commissioned NMCA artifact this is a meaningful omission.
- **Blind spot:** No data-export. A researcher running a small study cannot pull a CSV of journal entries.
- **Risk:** Without attribution and export, the app cannot serve any pedagogical-evidence purpose — and NMCA may rightly object to the missing credit line.
- **Highest leverage:** Add a persistent footer/about credit ("Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. App in partnership with Lisa Dalton, NMCA President.") and a JSON/CSV export endpoint.

### 7. Product/UX/Accessibility Lead (mobile-first, WCAG, IA)

- **Doing well:** Tailwind responsive breakpoints exist on every component. Dark/light theme is integrated. Test IDs are pervasive.
- **Could be better:** Multiple ARIA gaps — the wheel checkbox buttons are bare `<button>` with no `aria-pressed` / `aria-label`; reveal modal lacks `role="dialog"` + focus trap (built ad-hoc rather than via Radix Dialog); the toggle pills in Draw Settings are `<button>` without `aria-pressed`. Touch targets are mostly fine (≥40px) but the small wheel checkboxes at `w-5 h-5` on mobile fall under the 44px minimum.
- **Blind spot:** The history drawer is fixed `top-[160px] right-0` on desktop and stacks below on mobile — but the Select All / Clear All cluster on desktop is `fixed top-24 right-4 z-50` which overlays the drawer toggle on mid-width viewports.
- **Risk:** Lisa opens it on her iPhone, the reveal modal works, but the wheel toggles are awkward to hit one-handed and contrast in dark mode on the accent-yellow selected state is below WCAG AA on body text.
- **Highest leverage:** Run one focused mobile pass on a real iPhone (Lisa's model if known) and capture screenshots; raise checkbox tap targets to ≥44px; replace ad-hoc reveal overlay with shadcn `Dialog`.

### 8. Engineering Lead (architecture, handoff sequencing)

- **Doing well:** Clean separation: `shared/schema.ts` as Drizzle+Zod source of truth, `IStorage` interface, route layer thin. `better-sqlite3` is the right choice for a single-tenant local prototype. The tandem plan's Task A (env-driven host) is implemented correctly in the dirty diff. POA tables auto-create on startup — no migration step needed for Lisa.
- **Could be better:** No tests at all (`npm run check` is the only quality gate). `getJournalEntryByDate` matches on `date` only, so two different drawn tools sharing the same calendar day collide. `POAJournal` loads `entries[0]` — implicit assumption of "one entry per drawn tool" not enforced anywhere. `useEffect([entries])` will reset form whenever the query refetches, even mid-edit.
- **Blind spot:** **Vue/Nuxt rebuild is not justified yet.** The current React app is small (~10 components), already mobile-responsive, uses Radix primitives that have no Vue parity story you'd want to rewrite from scratch. A rewrite costs weeks; the actual UX issues identified by the council are all fixable in-place in days. If the eventual goal is Capacitor-wrapped native mobile, React is the better path, not worse.
- **Risk:** Premature rewrite delays Lisa's Phase 1 ship by an order of magnitude with no proven gain.
- **Highest leverage:** Defer Vue/Nuxt to Phase 3 (post-Lisa-acceptance). Use the next 24 hours to fix POA temporal model + attribution + mobile pass on React.

---

## Cross-Council Synthesis

**Consensus strengths**
- Taxonomy fidelity to the Chart of Inspired Action is real, not cosmetic.
- POA structured/journal toggle is the correct architectural choice.
- Local stack is small, sane, deployable, and the bind blocker is patched.

**Consensus risks**
- Oracle-card shallowness: reveals show names without embodied prompts.
- Mobile UX is unverified on a real device, not just unverified at iPhone width in DevTools.
- NMCA attribution is invisible — unacceptable for an officially commissioned app.
- POA entries are decoupled from history — practice loop is broken.
- No tests, no export, no streak/return mechanic.

**Sharp disagreements**
- **Director vs Student:** director wants more filters and pinning; student wants less choice. Resolved by adding modes (Quick Practice vs Director View) rather than piling features.
- **Engineering vs Product:** engineer says ship React Phase 1; product says fix accessibility first. Both are right — accessibility fixes are React-local, not rewrite-blocking.
- **Master Teacher vs Engineer:** master teacher wants per-tool embodied prompts (taxonomy expansion); engineer warns CLAUDE.md prohibits taxonomy edits without Lisa/NMCA approval. Resolved: prompts are a *new field* on existing tools, not a taxonomy change — must be NMCA-sourced text.

**Questions Dawson must answer in Grill Me**
1. What is the POA temporal model — one entry per drawn tool ever, one per day per tool, or one per day total?
2. What is the 60-second Lisa demo path on her phone?
3. Does NMCA have a sanctioned single-sentence embodied prompt per category we can show on the reveal?
4. Phase 2 platform decision: Vue/Nuxt rewrite, React + Capacitor, or React + PWA?
5. What counts as Phase 1 "done" for Lisa — works locally on her phone via tunnel, hosted at a URL, or installable?

---

## 24-Hour Deliverable Recommendation

**Keep React. Do not start Vue/Nuxt now.**

Smallest shippable/useful deliverable for the next 24 hours:
1. Commit the existing dirty diff (server bind + example fixes) after Codex verifies `npm run check && npm run build`.
2. Add NMCA + Lisa Dalton attribution footer/about (5-line change, no NMCA sign-off needed — credit-only).
3. Decide POA temporal model in Grill Me, then fix `getJournalEntryByDate` + `POAJournal entries[0]` assumption.
4. Run a real-device mobile pass on Dawson's iPhone with Lisa-likely flow: open → select all → draw → POA → save → reload → confirm. Capture screenshots, log issues, do not fix mid-pass.
5. Ship a tunneled URL (ngrok/cloudflared) to Lisa for one round of "does this feel right" — *not* a public deploy.

Vue/Nuxt is a **Phase 3** conversation, after Lisa accepts Phase 1.

---

## Claude Code Handoff Seeds

After Grill Me concludes:

1. **POA temporal model fix** — files: `server/storage.ts`, `server/routes.ts`, `client/src/components/POAJournal.tsx`, `shared/schema.ts`. Acceptance: round-tripping a POA entry on the same day for two different drawn tools does not collide; reloading mid-edit does not blow away in-flight form state.
2. **NMCA attribution surface** — files: `client/src/pages/Home.tsx` (footer) + new `client/src/components/AboutDialog.tsx`. Acceptance: credit string visible on every page; About dialog reachable from header.
3. **POA → history integration** — files: `server/routes.ts` (add aggregate endpoint), `client/src/components/HistoryPanel.tsx`. Acceptance: a drawn tool with a POA entry shows a distinct badge; tapping it opens POA Journal pre-loaded.
4. **Mobile checkbox tap-target pass** — files: `client/src/components/CategoryWheel.tsx`. Acceptance: every interactive element ≥44×44 CSS pixels on mobile breakpoint.
5. **Accessible reveal modal** — refactor `ToolRevealCard` to use `shadcn/ui Dialog`. Acceptance: focus trap, ESC closes, `aria-labelledby` set, no body scroll while open.

Each task: single PR, ≤200 LOC, no taxonomy edits, no dep additions, no deploy.

---

## Codex Handoff Seeds

Run after Claude Code lands each Claude Code task:

```bash
cd /Users/dawson/Documents/Claude/Projects/Michael\ Chekhov\ App
codex exec --full-auto 'Verify branch. Run npm run check and npm run build. Start server with HOST=127.0.0.1 npm run dev in background, then curl GET /api/drawn-tools, POST a sample drawn-tool, GET again to confirm persistence, POST a sample journal entry, GET /api/journal/<id>. Report pass/fail per step. Do not modify source.'
```

Independent reviewer prompts (one per Claude Code PR):
- A11y audit: confirm focus trap, `aria-pressed` on toggles, contrast ratio on dark mode accent.
- Schema audit: confirm `insertJournalEntrySchema` accepts the new payload shape from the fixed POA Journal.
- Diff size guard: refuse if PR >200 LOC or touches `toolData.ts`.

---

## Grill Me Question Queue

Prioritized. One question at a time. Recommended default in brackets.

1. **POA temporal model.** Should each drawn tool get one POA journal entry total, or one per calendar day per tool, or one global entry per day across all tools? *[Default: one POA entry per (drawnToolId, date) pair — supports multi-day practice on the same tool.]*
2. **Lisa demo path.** What is the 60-second flow Lisa will perform on her iPhone? *[Default: open → Select All → Draw → see reveal → tap Begin POA → write one Practice note → Save → reload to confirm persistence.]*
3. **Attribution wording.** What exact credit line does NMCA require? *[Default: "Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. App developed in partnership with Lisa Dalton, NMCA President & Master Teacher." pending Lisa confirmation.]*
4. **Phase 2 platform.** Vue/Nuxt rebuild, React + Capacitor wrap, or React + PWA install? *[Default: React + PWA for Phase 2, revisit Capacitor only if Lisa requests App Store presence.]*
5. **Phase 1 ship target.** Tunneled URL to Lisa only, hosted preview (Vercel/Render), or local-only on Dawson's machine? *[Default: cloudflared/ngrok tunnel to Lisa's phone for one feedback round before any hosting.]*
6. **Embodied prompts.** Should each category gain a one-sentence "enter the tool" prompt? *[Default: yes, but only with NMCA-sourced text — defer until Lisa provides or approves the strings.]*
7. **Today's One Tool / Quick mode.** Should the homepage offer a single daily prompt that bypasses the wheel? *[Default: yes, add as a small "Today" button — opt-in, does not replace the wheel.]*
8. **Rehearsal pin/timer.** Should a director be able to pin a drawn tool for N minutes? *[Default: defer to Phase 2.]*
9. **Data export.** Should journal entries be exportable as JSON/CSV? *[Default: yes, JSON export from About dialog — single GET route + download.]*
10. **Presentation/classroom mode.** Big-text projector view? *[Default: defer to Phase 2.]*

---

## Red Flags Before Build

- **NMCA attribution missing in UI.** Block any external link/share to Lisa until credit line is in the footer.
- **POA temporal model ambiguity.** Do not write more POA code until Q1 is answered — current `entries[0]` + `getJournalEntryByDate` are incompatible with whatever the real model is.
- **CLAUDE.md is stale.** The "known issues" lint table no longer matches production `CategoryWheel.tsx`. Update CLAUDE.md before handing it to another agent or it will chase ghosts.
- **No tests.** Any non-trivial POA refactor without at least one round-trip integration test is a regression waiting to happen.
- **Mobile unverified on physical device.** Do not call Phase 1 done on DevTools alone.

---

## Confidence

- **Readiness to begin Grill Me session:** **0.88.** Council has surfaced enough sharp ambiguity (POA temporal model, attribution, demo path, Phase 2 platform) that a one-question-at-a-time grill will produce a clean handoff doc within ~45 minutes.
- **Readiness to start implementation without Grill Me:** **0.45.** Engineering could ship attribution + mobile pass blind, but POA temporal model is undefined enough that coding now risks throwaway work. Grill Me first.
