Council review written. Read-only — no source edits.

**File:** `brainstorms/claude-council-review-2026-06-04.md`

**Key findings**
- Tandem plan Task A (env-driven host bind in `server/index.ts`) and the example-file fixes are already in the dirty diff — CLAUDE.md's "known issues" table is now stale and should be refreshed.
- Production `CategoryWheel.tsx` no longer references the phantom `psychological-gesture`/`characterization` IDs CLAUDE.md flagged.
- POA structured/journal toggle exists and matches spec, but is decoupled from history and built on a brittle temporal assumption (`getJournalEntryByDate` keys on date alone; `POAJournal` loads `entries[0]`).
- NMCA/Lisa Dalton attribution is **not visible anywhere in the UI** — block any external share until fixed.
- No tests; accessibility gaps in wheel checkboxes (<44px) and ad-hoc reveal overlay (no focus trap).
- Vue/Nuxt rewrite not yet justified — fix in React, defer to Phase 3.

**Recommendation:** keep React for next 24h. Run Grill Me first against POA temporal model + Lisa demo path + attribution wording, then hand 5 bounded ≤200-LOC tasks to Claude Code, with Codex as typecheck/build/API-smoke verifier.

**Confidence:** 0.88 ready for Grill Me; 0.45 ready to code blind.
