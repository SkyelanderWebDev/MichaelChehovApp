# Opus / Claude Code analysis — Michael Chekhov Toolkit orchestration

Command: claude -p <brief> --model claude-opus-4-8 --effort xhigh --permission-mode plan --tools "" --no-session-persistence --disable-slash-commands --setting-sources local

I can't write files in this context (no `Write` or `ExitPlanMode` tool is actually enabled — only MCP servers are), and there's no local codebase to explore. That's fine: the request was to *produce the analysis and return the sections*, which is a text deliverable. Here it is in full.

---

# Opus / Claude-brain analysis — Michael Chekhov Toolkit agent orchestration

**Date:** 2026-06-04 · Read-only planning pass. Compare against the Codex/GPT-5.5 brain output, then reconcile into one weekend execution spec before any code is written.

## Context (why this exists)

You have a ~24-hour build window to produce a **confidence demo** for Lisa this weekend, then a **secure tester beta** by June 13, with public/app-store readiness deferred to August behind a formal rights audit. The goal of this doc is an orchestration model that lets Opus 4.8 and Codex/GPT-5.5 work together without colliding, overbuilding, or violating the two guardrails (attribution string; **no AI-generated embodied prompts** — sourced excerpts + POA structure only; neutral UI copy ok).

## 1. Executive recommendation

**Claude Code/Opus 4.8 is the single primary architect-integrator for the weekend vertical slice. Codex/GPT-5.5 is an independent read-only challenger plus a bounded implementer only inside lanes with crisp acceptance tests (Supabase schema/RLS, type/build cleanup, deterministic fixes, verification scripts). Hermes (you) is the only merge/deploy/share authority.**

- **One-shot both brains first**, same sourced prompt, both read-only/plan mode, then reconcile to ONE spec. ~20 min cost; catches scope creep and guardrail blind spots before they're in a diff.
- **Never let both edit the same files concurrently.** Single integration branch owned by Opus for the weekend; Codex read-only or in an isolated worktree on test-backed lanes only.
- **Every handoff carries an executable check.** Anthropic is explicit: without a verification signal, "looks done" is the only stop condition — unacceptable in front of the rights-holder, but "full beta" is over-scope. The gates below thread that needle.
- **Weekend deliverable = confidence vertical slice, not a beta.** The dominant failure mode is Opus overbuilding because the demo is emotionally high-stakes. The plan front-loads a written cut line and treats everything past it as June 13 work.

## 2. Pros / cons for THIS scenario

| Dimension | Claude Code / Opus 4.8 | Codex / GPT-5.5 |
|---|---|---|
| Ambiguous product/UX/domain judgment (pedagogy, Lisa/NMCA trust, what to defer) | **Strong** — best primary architect | Weaker; checklist-optimizes unless outcome + evidence rules are explicit |
| Long-horizon multi-file build from a plan | **Strong** w/ plan + checks | Good for bounded lanes; weaker on sprawling integration |
| Independent adversarial review of plan/diff | Good, but biased toward its own diff | **Strong** as fresh-context challenger that didn't write the code |
| Crisp-contract impl (RLS, schema, types, deterministic fixes) | Strong | **Strong** — sandbox + approval model fits bounded write lanes |
| "What did the diff actually change vs spec?" audit | Good | **Strong** — review pane scopes branch/turn/staged/unstaged |
| Holding content/attribution guardrail under demo pressure | **Strong** if guardrail in `CLAUDE.md` + gate | Strong if in `AGENTS.md` + acceptance test |
| Risk: overbuild past cut line | **Higher** — high-autonomy model, emotional demo | Lower, but can under-build / miss coherence |
| Risk: "looks done" w/o evidence | Real if checks not in prompt | Real if evidence rules not in prompt |
| Source/network defaults | Reads supplied files; broad tool surface | **Network off by default**, sandboxed to workspace — hand it sources or approve network |
| Persistent context file | `CLAUDE.md` (keep short) | `AGENTS.md` (≤32 KiB, closer files win) |

**Net:** complementary, not redundant. Opus owns coherence/integration; Codex owns independent verification + bounded mechanical work. Their risk surfaces are *opposite* — which is the whole reason to pair them.

## 3. Collaboration model by phase

- **Phase 0 — Frame (Hermes, ~15 min):** put the cut line + both guardrails at the top of `CLAUDE.md` and `AGENTS.md`. Non-negotiable; must survive both agents.
- **Phase 1 — Dual one-shot plan (both, read-only, parallel, ~20 min):** same prompt → two plans, neither touches the repo.
- **Phase 2 — Reconcile (Hermes + Opus, ~20 min):** Opus merges into ONE spec; Codex's plan is a challenge list — each divergence adopted or explicitly rejected with a reason.
- **Phase 3 — Build the slice (Opus primary, single branch):** Codex read-only unless a cleanly separable lane (e.g., RLS + SQL/RLS test) → Codex worktree.
- **Phase 4 — Fresh-context review (Codex primary):** reviews Opus's diff vs spec + gates, no loyalty to the code. This is the step that catches guardrail/attribution drift.
- **Phase 5 — Demo-readiness (Opus + Hermes):** Opus does narrative/taste; Hermes runs gates and owns the decision to show.

Throughout, **Hermes is the only one who merges, deploys, or shares externally.**

## 4. One-shot both? Yes — with a comparison rubric

| Criterion | "Good" looks like | Weight |
|---|---|---|
| Respects the cut line | Defers non-slice work to June 13; names what it is NOT building | High |
| Guardrail safety | No AI-generated embodied prompts; attribution before any share path | High (veto) |
| Verification built in | Names concrete checks: install, typecheck, build, browser/mobile smoke, persistence, attribution scan, content scan | High |
| Vertical-slice coherence | One end-to-end path, not horizontal half-features | High |
| Data-model correctness | Models Global Daily Tool + POA now; seeded/manual daily tool ok | Medium |
| Free-first infra | No paid tiers introduced | Medium |
| Risk honesty | Calls its own blind spots | Medium |

**Reconciliation rule:** any plan violating a High-veto criterion loses on that point regardless of polish. Where both pass, prefer the **narrower** slice. Output is one spec, not two.

## 5. Weekend plan — timeboxes + gates (≈24h budget). *Gate = don't proceed until evidence exists.*

- **B0 Frame & guardrails (0:15).** **G0:** both context files contain the attribution string + the no-AI-embodied-prompts rule.
- **B1 Dual one-shot plans (0:30).** **G1:** two plans exist; neither edited the repo.
- **B2 Reconcile to one spec (0:30).** **G2:** signed-off spec names the single user path, file list, data model, gate checklist, and the explicitly-deferred list.
- **B3 Project skeleton (1:30).** Opus scaffolds Ionic Vue + Capacitor/PWA + Supabase client; React proto = UX reference only. **G3:** install clean, typecheck clean, dev server boots, shell renders.
- **B4 Supabase auth + schema + RLS (2:00).** Bounded lane → strong Codex candidate. Model POA + Global Daily Tool; seeded daily tool. **G4:** migrations apply; RLS denies cross-user reads in a smoke test; auth round-trip works; security advisor clean for new tables.
- **B5 Vertical slice UI (4:00).** Opus builds ONE path (e.g., sign in → seeded Daily Tool → POA structure → record a state → persists). Sourced excerpts only. **G5:** path works in browser + persists across reload; content scan finds zero AI-generated embodied prompts; attribution visible on any Chart/NMCA screen.
- **B6 Fresh-context review (1:30).** Codex reviews diff vs spec + gates. **G6:** findings triaged; guardrail/attribution items fixed, not deferred.
- **B7 Demo-readiness + dry run (1:30).** Opus taste pass; Hermes runs full gate suite + rehearses path once. **G7 (SHOW gate):** install + typecheck + build pass; path works on the actual demo device; persistence holds; attribution present; content scan clean. Only then show Lisa.
- **Buffer (~20%).** If a block overruns, **cut scope from the slice — never cut a gate.**

## 6. June 13 extension plan (secure tester beta, 1-hr group call)

1. **Harden auth + RLS** for real testers — Codex-led lane with an explicit RLS test matrix; Opus integrates; run security advisors before invites.
2. **Broaden content** via sourced excerpts + POA only; attribution on every surface; track per-item provenance (seeds the August rights audit).
3. **Global Daily Tool stays seeded/manual** — model stays in data; **no push scheduler or admin CMS needed by June 13.**
4. **PWA installability + mobile smoke** — installable, offline shell loads, core path works on a real phone (Lighthouse/PWA check + on-device run).
5. **Secure tester onboarding** — invite/allowlist by default; a non-owner account can do the path and cannot see others' data.
6. **Pre-call dry run** of the exact 1-hour path with the full gate suite green.

**Deferred to August:** real push scheduler, admin CMS, any AI-generated embodied content, public/app-store submission, and the formal source/rights audit (audit gates *public* release, not the closed beta).

## 7. Red flags / blockers

- **Overbuild under demo pressure (highest).** Mitigate: written cut line in `CLAUDE.md`; G2 names deferrals; "shrink feature before cutting a gate."
- **Guardrail erosion** (agent "helpfully" generates an embodied prompt or drops attribution). Mitigate: veto criteria + content-scan gate + Codex review specifically checking this.
- **Self-review bias.** Mitigate: Codex (didn't write the code) does the fresh-context review.
- **Parallel write collisions.** Mitigate: single Opus-owned branch; Codex read-only or isolated worktree; no concurrent edits to the same files.
- **"Looks done" w/o evidence.** Mitigate: every gate needs an executable signal.
- **Codex source/network defaults** (off, sandboxed). Mitigate: hand it the excerpts/spec; don't assume it fetches anything.
- **RLS false confidence.** Mitigate: G4 tests denial + run security advisors.
- **Free-tier limits mid-demo.** Mitigate: verify quotas before the call; keep seed data small.
- **Weekend-vs-June-13 scope confusion.** Mitigate: G2 spec is the contract; not-in-spec = June 13.

## 8. Final recommended prompt shapes

**Claude Code / Opus 4.8 — primary architect-integrator (plan-then-build):**
- Role: primary architect + integrator for the weekend vertical slice.
- Hard constraints up top: cut line, attribution string, no-AI-embodied-prompts rule, free-first.
- Deliver: ONE named end-to-end path + file list + data model.
- Verification contract: the exact checks to run and show (install, typecheck, build, browser/mobile smoke, persistence, attribution scan, content scan).
- Stop condition: "Done = all gates green for the named path. No features beyond the path. If blocked, shrink the path, never cut a gate."
- Mode: plan first (read-only); wait for reconciliation; then build on the single integration branch.

**Codex / GPT-5.5 — independent challenger + bounded implementer (outcome-first):**
- Role: independent read-only reviewer/challenger; bounded implementer ONLY for test-backed lanes (RLS/schema, types/build, deterministic fixes).
- State outcome + success criteria + allowed side effects explicitly (e.g., "edit only files X/Y in worktree Z; no merges; no deploys").
- Evidence rules: "report what the diff changed vs spec; cite file/line; don't claim a gate passed without showing command/output."
- Guardrail check: explicitly verify no AI-generated embodied prompts and attribution present.
- Mode: read-only for review; workspace-write in an isolated worktree only for an assigned lane; network only if explicitly approved.

---

**Next step for you (Hermes):** run the Codex/GPT-5.5 brain against the same prompt, then reconcile the two using the §4 rubric — adopt or explicitly reject each divergence before a single line of code is written. If you'd like, I can also draft the short `CLAUDE.md` / `AGENTS.md` guardrail headers (Phase 0) so both brains start from identical constraints.
