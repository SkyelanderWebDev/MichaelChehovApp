# Codex / GPT-5.5 analysis — Michael Chekhov Toolkit orchestration

Command: codex exec --skip-git-repo-check -m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only -C <project> -

**Executive Recommendation**

Use Claude Code/Opus 4.8 as the primary product architect and weekend integrator, with Codex/GPT-5.5 as the independent challenger, security/build reviewer, and bounded worker for crisp implementation lanes. The research thesis is sound, but I would tighten it: do not let either model “own the project.” Hermes/human remains the controller, scope governor, merge owner, and final judge of Lisa-readiness.

For the 24-hour weekend build, optimize for a credible vertical slice: Ionic Vue shell, Supabase-backed auth/data shape, sourced POA/chart flow, attribution, state persistence, and a demo path Lisa can understand. Avoid full CMS, real push scheduling, AI-generated embodied content, app-store prep, and broad feature parity with the React prototype.

**Pros/Cons Table**

| Role | Claude Code / Opus 4.8 | Codex / GPT-5.5 |
|---|---|---|
| Best use | Ambiguous product flow, domain UX, integrator work, demo coherence | Independent review, security checks, RLS/schema, build/type cleanup, bounded fixes |
| Strength | Better fit for long-horizon product judgment and multi-file implementation | Better as skeptical verifier with explicit evidence rules |
| Risk | Overbuilding, accepting “looks right,” context bloat | Checklist compliance without product taste; needs tight contracts |
| Best mode | Plan → implement → verify, with fresh-context review | Read-only plan/review first; workspace write only for narrow tasks |
| Weekend lane | Primary vertical-slice builder | Challenger and gatekeeper |
| June 13 lane | Product polish + demo readiness | Auth/RLS/testing/security hardening |

**Collaboration Model By Phase**

| Phase | Hermes / Controller | Claude Code / Opus | Codex / GPT-5.5 |
|---|---|---|---|
| 0. Scope lock | Defines weekend cut line and non-negotiables | Produces practical build plan | Produces adversarial plan/review |
| 1. Reconciliation | Chooses final spec | Adjusts plan to final scope | Flags risks, missing gates, security issues |
| 2. Weekend build | Controls branch/worktree | Implements main Ionic Vue vertical slice | Read-only reviewer unless given crisp lane |
| 3. Verification | Requires evidence before demo | Runs build/smoke checks | Audits diff, attribution, content guardrail, auth/RLS |
| 4. Lisa demo prep | Decides what is shown | Polishes demo path and language | Confirms no blocker regressions |
| 5. June 13 | Maintains beta backlog | Expands features and UX | Hardens security, tests, RLS, deployment checks |

**Should Both One-Shot The Same Prompt?**

Yes. Do it once, read-only, before implementation. The goal is not to pick a winner; it is to expose disagreements before code exists.

Comparison rubric:

| Dimension | What To Compare |
|---|---|
| Scope discipline | Does the plan protect the weekend cut line? |
| Stack alignment | Ionic Vue + Capacitor/PWA + Supabase, not React production drift |
| Demo value | Would Lisa see progress and trust the direction? |
| Content safety | No AI-generated embodied prompts; sourced excerpts/POA only |
| Attribution | Lisa/NMCA/chart attribution visible before sharing |
| Security | Supabase Auth/Postgres/RLS modeled early |
| Verification | Concrete commands/checks, not “looks good” |
| Defer list | Explicitly postpones CMS, push scheduler, app store, public release work |
| Merge risk | Avoids concurrent write-heavy overlap |
| Practicality | Can be done in 24 hours by one primary implementer? |

Hermes should reconcile the two plans into one weekend execution spec. If the models disagree, prefer the plan with fewer moving parts, clearer evidence gates, and stronger attribution/content controls.

**Weekend Plan With Timeboxes And Gates**

**Hour 0-1: Scope Lock**

Hermes:
- Freeze weekend goal: Lisa confidence demo, not beta.
- Define one demo path: sign in or demo mode → daily/tool entry → POA/chart-inspired flow → reflection/save → attribution/source view.
- Freeze defer list: admin CMS, real push scheduler, public release, app store, AI embodied prompts.

Claude:
- Produce implementation plan against current repo.
- Identify what can be reused from React prototype as behavior reference only.

Codex:
- Review plan read-only.
- Challenge scope, security assumptions, and verification gaps.

Gate:
- One-page weekend spec exists.
- Explicit “must ship” and “must defer” lists exist.

**Hour 1-3: App Foundation**

Claude:
- Create/confirm Ionic Vue structure.
- Establish routes/views: auth/demo entry, home, daily tool, POA exercise, reflection/history, attribution.
- Keep UI simple, mobile-first, and demo-stable.

Codex:
- Read-only check for stack drift and build risks.

Gate evidence:
- `npm install` or equivalent succeeds.
- Typecheck/build command identified.
- App opens locally.

**Hour 3-6: Data Model And Supabase Shape**

Claude:
- Model users, saved reflections, daily tool seed, source/attribution metadata.
- Add Supabase client/config pattern.
- Use seeded/manual daily tool path.

Codex:
- Review schema/RLS plan.
- If allowed as bounded worker, implement or tighten SQL/RLS only in a separate worktree/lane.

Gate evidence:
- Schema file or migration draft exists.
- RLS intent is explicit.
- No public writable tables.
- Demo can run with seeded/local fallback if Supabase setup blocks.

**Hour 6-10: Core Demo Flow**

Claude:
- Implement the Lisa demo path end to end.
- POA/chart flow uses sourced excerpts/structure only.
- Reflection save works locally or with Supabase depending on readiness.
- Attribution is visible in-app.

Codex:
- Review copy/content for guardrail violations.
- Check that React prototype did not become production dependency.

Gate evidence:
- One complete user journey works.
- Attribution text appears before any external/demo sharing:
  “Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.”
- No AI-generated embodied prompt language appears.

**Hour 10-14: UX Polish For Lisa**

Claude:
- Tighten navigation, empty states, loading/error states.
- Make the demo feel intentional, not like a scaffold.
- Ensure app name is consistently “The Michael Chekhov Toolkit.”

Codex:
- Diff review for regressions and missing states.

Gate evidence:
- Mobile viewport smoke test.
- Refresh/persistence smoke test.
- No broken route in demo path.

**Hour 14-18: Verification Pass**

Hermes:
- Require hard evidence, not verbal confidence.

Claude:
- Run build/typecheck/lint where available.
- Fix blocking issues.

Codex:
- Independent review of:
  - uncommitted diff
  - build output
  - attribution text
  - content guardrail
  - Supabase/RLS posture
  - free-first infra assumptions

Gate evidence:
- Install/build/typecheck results recorded.
- Browser/mobile smoke completed.
- Content scan completed.
- Attribution scan completed.
- Known issues list created.

**Hour 18-22: Demo Prep**

Claude:
- Create a short demo script and fallback path.
- Prepare “what this proves” and “what is deliberately deferred.”

Codex:
- Adversarial review: “What could embarrass us in front of Lisa?”

Gate evidence:
- Demo script exists.
- Fallback route exists if auth/Supabase fails.
- No unresolved blocker on the main demo path.

**Hour 22-24: Freeze**

Hermes:
- Stop feature work.
- Decide show/no-show.
- Preserve branch/worktree state.

Claude:
- Final polish only.

Codex:
- Final read-only gate review.

Gate to show Lisa:
- App opens.
- Main demo path works.
- Attribution visible.
- No AI embodied prompts.
- Build/typecheck status known.
- Known gaps are acceptable for “proof of progress.”

**June 13 Extension Plan**

Primary goal: secure tester-ready beta for a 1-hour group demo/testing call.

Priorities:
1. Supabase Auth fully wired.
2. Postgres schema and RLS verified.
3. Tester accounts/invites ready.
4. Seeded/manual Global Daily Tool works.
5. Reflection/history flow persists per user.
6. Attribution/source metadata visible and consistent.
7. Basic error/loading/offline states.
8. PWA deployment on free-first hosting.
9. Smoke test checklist for mobile browsers.
10. Short tester instructions and feedback capture.

Claude owns:
- Product flow refinement.
- Teacher/student/actor-friendly UX.
- Demo/tester onboarding.
- Navigation and polish.
- Stakeholder-facing language.

Codex owns:
- RLS audit.
- Migration review.
- Auth edge cases.
- Type/build/test cleanup.
- Deployment smoke checks.
- Diff review before tester release.

June 13 gates:
- Auth works for tester accounts.
- Users cannot read/write others’ private reflections.
- Build succeeds from clean checkout.
- PWA loads on mobile.
- Seeded daily tool works without admin scheduler.
- Attribution is present.
- Content guardrail scan passes.
- Known limitations are documented.

**Red Flags / Blockers**

- Both agents editing the same files concurrently.
- Treating the React prototype as production foundation.
- Spending weekend time on CMS, push notifications, app-store work, or broad content libraries.
- Using AI-generated embodied prompts in beta content.
- Shipping anything externally without Lisa/NMCA/chart attribution.
- Supabase tables without RLS.
- A demo path that depends on fragile auth setup with no fallback.
- No executable verification before showing Lisa.
- Letting “June 13 beta” scope leak into the weekend pilot.

**Final Recommended Prompt Shape For Claude Code**

```text
You are the primary product architect and integrator for The Michael Chekhov Toolkit.

Mode: implement only after first producing a concise plan. Protect the weekend Lisa pilot cut line.

Goal: build a 24-hour proof-of-progress vertical slice, not the full beta.

Non-negotiables:
- Production target stack is Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- Existing React prototype is behavior/UX reference only.
- App name: The Michael Chekhov Toolkit.
- Include attribution before external sharing:
  Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.
- Do not generate embodied acting prompts. Use sourced excerpts plus POA structure only.
- Model Global Daily Tool in flow/data, but use seeded/manual content for now.
- Free-first infrastructure.
- Defer CMS, real push scheduler, app-store work, and public-release rights audit.

Deliver:
- Weekend vertical slice demo path.
- Supabase-ready data model.
- Mobile-first app flow.
- Verification evidence: install, typecheck/build, browser/mobile smoke, attribution scan, content guardrail scan.
```

**Final Recommended Prompt Shape For Codex**

```text
You are the independent Codex/GPT-5.5 challenger and verification agent for The Michael Chekhov Toolkit.

Mode: read-only unless explicitly assigned a bounded implementation lane. Do not edit files in this pass.

Review against:
- Weekend Lisa pilot goal: confidence/proof-of-progress demo, not full beta.
- Target stack: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- React prototype is reference only.
- Attribution must be visible before external sharing.
- No AI-generated embodied prompts in beta.
- Global Daily Tool may be seeded/manual by June 13.
- Free-first posture.

Output:
- Findings first, ordered by severity.
- Scope risks.
- Security/RLS risks.
- Build/type/test risks.
- Attribution/content guardrail risks.
- Exact evidence still required before Lisa.
- Clear pass/fail recommendation for demo readiness.
```

Bottom line: use Claude to make the weekend slice coherent, use Codex to keep it honest, and keep Hermes as the authority that prevents scope creep and decides when evidence is strong enough to show Lisa.
