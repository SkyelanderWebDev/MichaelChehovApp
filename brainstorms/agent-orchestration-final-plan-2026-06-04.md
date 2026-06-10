# Final dual-brain orchestration plan — Michael Chekhov Toolkit

Date: 2026-06-04
Status: Research + Opus + Codex synthesis complete
Related artifacts:
- Source research brief: `brainstorms/agent-orchestration-research-2026-06-04.md`
- Opus/Claude brain output: `brainstorms/agent-orchestration-opus-2026-06-04.md`
- Codex/GPT-5.5 brain output: `brainstorms/agent-orchestration-codex-2026-06-04.md`

## What actually ran

- Verified Claude Code CLI: `/Users/dawson/.local/bin/claude`, version `2.1.126`.
- Verified Codex CLI: `/opt/homebrew/bin/codex`, version `0.125.0`.
- Gathered official/current sources from Anthropic/Claude Code, Anthropic model docs, OpenAI Codex docs, and OpenAI GPT-5.5 docs.
- Sent the same sourced research brief/prompt to:
  - Claude Code using `claude-opus-4-8`, `--effort xhigh`, plan/read-only tools disabled.
  - Codex using `gpt-5.5`, `model_reasoning_effort="high"`, `--sandbox read-only`.
- Reconciled the two independent outputs below.

Note: The first two Claude Code one-shot attempts were contaminated by a non-interactive hook returning only a hook-verdict summary. The successful Opus run used `--setting-sources local --disable-slash-commands --no-session-persistence --tools ""`. I patched the `claude-code-project-handoff` skill with this pitfall.

## Executive decision

Use Claude Code/Opus 4.8 as the primary architect and integrator for the weekend vertical slice.

Use Codex/GPT-5.5 as the independent challenger, reviewer, and bounded worker only for crisp lanes with objective acceptance tests.

Hermes/controller remains the only authority for:
- scope cuts,
- reconciliation,
- merge decisions,
- deploy/share decisions,
- Lisa-readiness gate,
- deciding whether a blocker becomes a fallback or a hard stop.

Do not let both agents freely edit the same repo/files at the same time.

## Why this is the best split

Both brains agreed on the core thesis.

Claude Code/Opus 4.8 is strongest where this app is ambiguous and stakeholder-sensitive:
- Michael Chekhov/NMCA trust posture,
- demo coherence for Lisa,
- mobile-first actor/teacher experience,
- deciding what to defer,
- integrating multiple moving parts into one credible path.

Codex/GPT-5.5 is strongest where this app needs skeptical, evidence-based verification:
- RLS/schema/auth review,
- type/build cleanup,
- diff review against the spec,
- attribution and no-AI-content guardrail scans,
- identifying brittle assumptions before Lisa sees them.

The risk profiles are complementary:
- Opus risk: overbuilds, makes the slice feel bigger than the weekend can sustain, may self-grade its own work too generously.
- Codex risk: can optimize for checklist correctness without the product/stakeholder taste needed for Lisa.

Therefore: Opus builds coherence; Codex keeps it honest.

## One-shot strategy

Yes, one-shot both agents — but with a rule.

Recommended:
1. One-shot both agents read-only/planning first from the same prompt.
2. Reconcile into one weekend spec.
3. Let only one primary agent own the main implementation branch.
4. Allow parallel implementation only in worktrees and only for bounded lanes.

Not recommended:
- two autonomous full-repo builders racing on the same files,
- choosing the prettier plan instead of the narrower/verifiable one,
- merging either output without Hermes reconciliation.

Comparison rubric for one-shot outputs:
- VETO: violates attribution rule.
- VETO: includes AI-generated embodied prompts.
- VETO: cuts verification gates to save time.
- High: protects weekend scope from June 13/public-release creep.
- High: produces one coherent vertical path, not many half-features.
- High: names exact checks/evidence before Lisa.
- Medium: models Supabase/RLS/Global Daily Tool future-proofing without overbuilding.
- Medium: preserves React prototype as reference only.
- Medium: clear fallback if Supabase/auth blocks.

Tie-breaker: prefer the narrower plan with stronger gates.

## Weekend build target

Weekend deliverable is a confidence demo for Lisa, not a secure public beta.

The app should prove:
- This is now The Michael Chekhov Toolkit, not the old Actor’s Toolkit prototype.
- It has an app-like Ionic Vue/PWA direction.
- The Chart/NMCA/Lisa attribution posture is explicit and respectful.
- A user can enter a Today’s Practice path.
- A tool can be selected/drawn/seeded.
- Starting practice locks the choice for the day.
- POA structure is preserved.
- A reflection/note can be saved and returned to if possible.
- No AI-generated embodied prompts appear.
- Sourced excerpt/source-card structure exists if content is included.

Weekend should not attempt:
- full content library,
- admin CMS,
- real push notifications,
- real global scheduler,
- paid/native app-store distribution,
- public rights audit,
- broad feature parity with the React prototype,
- a full June 13 tester beta.

## Weekend operating plan

### Phase 0 — Scope lock and context files

Owner: Hermes/controller
Secondary: none
Timebox: 30–45 minutes

Create/refresh:
- short `CLAUDE.md` for Claude Code,
- short `AGENTS.md` for Codex,
- one weekend execution spec.

Both context files must put these at the top:
- App name: The Michael Chekhov Toolkit.
- Stack: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- React prototype is reference only.
- Attribution line:
  “Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.”
- No AI-generated embodied prompts in first beta; sourced excerpts + POA structure only.
- Weekend is Lisa confidence demo, not June 13 beta.
- Free-first infrastructure.

Gate G0:
- `CLAUDE.md`, `AGENTS.md`, and weekend spec exist.
- Must-ship and must-defer lists are explicit.
- Guardrails are visible before any build begins.

### Phase 1 — Dual one-shot implementation planning

Owner: Hermes/controller
Brains: Claude Code/Opus + Codex/GPT-5.5
Timebox: 30–45 minutes

Run the same build-planning prompt to both in read-only/planning mode.

Expected output from each:
- proposed implementation order,
- files to create/modify,
- risks,
- acceptance gates,
- defers,
- fallback path.

Gate G1:
- two read-only plans exist,
- neither edited files,
- Hermes has reconciled them into one spec.

Reconciliation rule:
- Adopt points where both agree.
- For disagreements, prefer the narrower, more verifiable slice.
- Record rejected divergences with reasons.

### Phase 2 — Main weekend build

Owner: Claude Code/Opus 4.8
Controller: Hermes
Codex mode: read-only reviewer unless assigned a narrow worktree lane
Timebox: 6–10 focused hours plus buffer

Claude builds one vertical path:
- Ionic Vue shell / routes,
- mobile-first UI,
- app name and attribution,
- Today’s Practice entry,
- Pick My Own / Draw Random / Daily Tool seeded option,
- Start Today’s Practice lock,
- POA structure,
- save/return/reload if possible,
- source card / sourced excerpt surface if content exists,
- no AI prompt language.

Gate G2:
- app opens locally,
- install command succeeds or blocker documented,
- typecheck/build command identified,
- one demo path works in browser.

### Phase 3 — Supabase/auth/RLS lane

Owner: Claude for integration; Codex can own a bounded worktree lane if assigned
Timebox: 2–4 hours weekend; harden by June 13

Weekend stance:
- Supabase-ready schema is valuable.
- Full auth/RLS is ideal but not allowed to destroy the weekend demo.
- If Supabase setup blocks, use local/seeded fallback for Lisa and document June 13 path honestly.

Codex bounded lane candidate:
- SQL migrations/schema draft,
- RLS policy review,
- user-owned `daily_practices` and POA records,
- cross-user denial smoke test plan.

Gate G3:
- if Supabase is active: user-owned rows and no public writes except intentional feedback flow.
- if Supabase is not active: explicit fallback statement; do not call the weekend artifact a secure beta.

### Phase 4 — Fresh-context verification

Owner: Codex/GPT-5.5
Controller: Hermes
Timebox: 60–90 minutes

Codex reviews the diff/spec evidence for:
- install/build/typecheck result,
- app opens locally,
- mobile-width smoke,
- Today’s Practice path,
- Start lock behavior,
- POA save/return/reload,
- attribution visible,
- no AI-generated embodied prompts,
- no broad React-production drift,
- no secrets/env leakage,
- Supabase/RLS posture or honest fallback.

Gate G4:
- findings triaged,
- guardrail/attribution findings fixed, not deferred,
- known non-blocking gaps documented.

### Phase 5 — Lisa demo-readiness

Owner: Hermes + Claude Code/Opus
Reviewer: Codex final read-only pass
Timebox: final 1–2 hours

Claude prepares:
- short “what changed since April” script,
- exact demo path,
- fallback path if auth/network fails,
- honest “what is still June 13” list.

Hermes runs SHOW gate:
- app opens on target demo device/browser,
- main path works end-to-end,
- attribution is visible,
- no AI-generated embodied prompts,
- save/return works or limitation is explicitly named,
- build/typecheck status is known,
- no unresolved blocker would embarrass the project in front of Lisa.

If a gate fails:
- cut feature scope,
- keep the gate,
- do not show anything externally without attribution/content guardrails.

## June 13 extension plan

By June 13, the target becomes secure tester-ready beta.

Claude/Opus owns:
- product flow expansion,
- teacher/student/actor UX,
- onboarding/tester instructions,
- History return path,
- feedback flow,
- mobile polish,
- demo/tester narrative.

Codex/GPT-5.5 owns or reviews:
- Supabase migrations,
- RLS policy matrix,
- auth edge cases,
- type/build/test cleanup,
- deployment/PWA checks,
- security/diff review before tester release.

June 13 gates:
- tester can create/login to account,
- per-user Daily Practice by local date,
- POA tied to Daily Practice,
- History/return path works,
- seeded/manual Global Daily Tool works,
- user A cannot read/write user B private data,
- Library Pareto-Skeleton has source cards/citations,
- no AI-generated embodied prompts,
- attribution visible,
- feedback capture works,
- installable hosted PWA works on mobile,
- known limitations documented.

Still defer to August/public:
- formal rights/source audit,
- public rights claims,
- native app-store submission unless explicitly chosen,
- real push notification scheduler,
- admin CMS unless it becomes cheap/easy,
- AI-generated embodied practice prompts.

## Recommended same-prompt shape for future implementation one-shot

```text
You are planning/building The Michael Chekhov Toolkit weekend Lisa pilot.

Goal: 24-hour confidence demo, not full beta.
Stack: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
Existing React prototype is behavior/UX reference only, not production target.

Non-negotiables:
- App name: The Michael Chekhov Toolkit.
- Include attribution before any external sharing:
  Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.
- No AI-generated embodied prompts in first beta. Use sourced excerpts/citations plus POA structure only.
- Model Global Daily Tool in data/flow, but seeded/manual is enough for now.
- Free-first infrastructure.
- Defer CMS, push scheduler, app-store work, public rights audit, and broad Library expansion.

Deliver one vertical slice:
1. Open app locally/mobile-width.
2. Enter Today’s Practice.
3. Choose Pick My Own / Draw Random / Daily Tool seed.
4. Start Today’s Practice and lock the choice.
5. Open POA structure.
6. Save/return/reload if possible.
7. Show attribution/source information.
8. Produce verification evidence.

Before editing, produce a concise implementation plan with exact files and checks.
Done means all gates are green; if blocked, shrink the feature slice before cutting a gate.
```

## Final verdict

Proceed with this model.

The strongest weekend strategy is not “Claude vs Codex” and not “two agents race.” It is:

1. Hermes locks scope and guardrails.
2. Both brains one-shot read-only plans.
3. Hermes reconciles to one spec.
4. Claude/Opus builds the coherent vertical slice.
5. Codex/GPT-5.5 reviews/challenges and handles bounded security/build lanes.
6. Hermes gates the artifact before Lisa sees it.

Confidence: 95% for the orchestration plan, assuming the next step is a strict Phase 0 context/spec prep before any implementation run.
