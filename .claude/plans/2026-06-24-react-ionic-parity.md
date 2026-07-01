# React Prototype → Ionic Parity Check
**Date:** 2026-06-24 · **Reference:** root `client/` (React/Vite/Express/SQLite) · **Target:** `apps/chekhov-toolkit-ionic/` (shipped beta)

Two independent lenses ran (codex full bidirectional matrix; claude_code inverse/verification lens). They **agree**. codex confirmed counts directly: both sides = **15 categories, 84 parent tools, 1144 child/example labels**, matching scopes, matching `hasScale`/Tempo-Rhythm.

> Note: codex could not call sub-agents in its session and did the source pass directly; coverage was still complete.

---

## Headline
**Ionic is at or AHEAD of the React prototype on almost everything.** The old "truncated taxonomy" worry in CLAUDE.md is **stale/false** — taxonomy, both POA modes, Unveiled/Veiling value, Tempo scale, category include/exclude, select-all/clear, Pick-My-Own, Draw Random, re-roll, Begin POA are all PRESENT. Ionic additionally has **Library, Supabase auth/RLS, official attribution, and system/light/dark theme** that React lacks.

So this is **not** a big porting job. Only a short, mostly-low-priority gap list — plus **one content question that actually matters.**

---

## The one that matters

### G0 — Category name + description discrepancy *(CONTENT / terminology — needs Lisa/source decision, NOT a code rename)*
codex found an exact-copy mismatch:
- React: **"Core PsychoPhysical movement"** vs Ionic: **"Core PsychoPhysical Exercises"** (`client/src/lib/toolData.ts` vs `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts:33`).
- One category description also differs at `circleChartCatalog.ts:33`.

This is the **only** taxonomy divergence between the two. Per the NMCA guardrail, **do not auto-rename either way** — confirm which wording is NMCA-canonical (Lisa/source) before changing. Could be the React copy that's wrong. Surfacing because shipping the wrong canonical term in front of testers is the kind of thing that's expensive to walk back.

---

## Genuine React-only gaps (everything else)

| ID | Feature | React evidence | Ionic status | Beta priority |
|----|---------|----------------|--------------|---------------|
| G1 | **Multi-draw History + re-open** — list past draws (category/scale/unveiled/journal badges), tap to reopen | `client/src/components/HistoryPanel.tsx`; `drawn_tools` table `shared/schema.ts:25-35`; `GET /api/drawn-tools` | **ABSENT** — Ionic is one-practice-per-day, no past-day UI (`dailyPracticeStore.ts` `getTodayPractice` only). Schema *could* hold many rows. | **P1** (this is the June-13 "basic History" item; partly architectural) |
| G2 | **Show-level draw granularity** (cards / tools / examples depth) | `Home.tsx:40`, `ToolRevealCard.tsx:28-32` | ABSENT — Quick Draw always full depth | P2 |
| G3 | **Flyback quick-reflection** — lightweight note distinct from full POA | `FlybackModal.tsx:47`, `ToolRevealCard.tsx:144` | ABSENT | P2 |
| G4 | **Reveal-card polish** — overlay + description-on-reveal | `ToolRevealCard.tsx:34` | PARTIAL — core labels/components present, no reveal overlay/description | P2 |
| G5 | **Unveiled/Veiling value on Journal Draw Random** | `Home.tsx:431` | PARTIAL — Ionic has it on Chart Quick Draw only, not Journal Draw Random | P2 |
| G6 | **Draw suspense state** ("Drawing…") | `DrawButton.tsx:23` | PARTIAL — buttons exist, no loading animation | P2 |
| G7 | **404 catch-all route** | `client/src/pages/not-found.tsx` | ABSENT | P2 |

---

## Do NOT port (intentional / forbidden)
- **Per-draw persistence model** (React `drawn_tools` + per-draw `journal_entries`). Ionic deliberately collapses to one DailyPractice + one POA per day — model change, not a bug (P3, flag only).
- **"Deferred Creative Questions" notes** (`toolData.ts:241`) — explicitly deferred for first beta.
- **Old "Actor's Toolkit" title** — Ionic uses the official app name; correct as-is.
- Any AI-generated embodied/somatic prompts — none exist; keep it that way.

## Claims confirmed FALSE (already present in Ionic — don't let anyone "fix" these)
Taxonomy truncation · missing children/descriptions/scope · missing Unveiled value · missing Tempo scale · missing structured-vs-free POA · missing Library · missing random draw. All present with file:line in the audits.

---

## Recommendation for Friday
- **Decide G0 first** (terminology — needs you/Lisa, blocks nothing technically but matters for content correctness).
- **Decide G1** (History): is "see/re-open past practices" in-scope for closed beta, or does the one-practice-per-day model stand for v1? This is the only P1 and it's an architecture/product call, not a quick port.
- **G2–G7 are all P2** — safe to defer past Friday; fold into post-beta polish.

Net: parity is **strong**. No P0 porting work. The real decisions are content (G0) and product-scope (G1), not engineering volume.
