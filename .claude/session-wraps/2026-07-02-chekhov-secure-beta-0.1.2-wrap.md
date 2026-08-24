# 2026-07-02 — Chekhov Toolkit secure beta 0.1.1/0.1.2 wrap

## Session Summary

Shipped the Michael Chekhov Toolkit secure beta chart/POA follow-up sprint, then immediately ran and shipped a dependency security remediation pass. Production is live on the stable Vercel alias with build `0.1.2 / secure-beta-0.1.2`.

## What Landed

### Build 0.1.1 product release

- Reordered Chart of Inspired Action to 16 numbered categories.
- Added Psychological Gesture as #16 under Transformation with the approved scaffold:
  - Inspiration — parent-only
  - Imagination — Body / Behavior / Activity
  - Intellect — Way / Win / Loss
- Kept Quick Draw centered and first-viewport on mobile.
- Added collapsible numbered chart key.
- Added saved/completed POA history PDF export with student-name safeguards:
  - real display name unless it exactly equals email local-part
  - `full_name`
  - blank fallback
- Kept Connect as a planned-community shell only; no chat schema/code deployed.
- Fixed reviewer findings before merge:
  - removed email-derived display-name use for PDF names
  - hid History export for rows with no POA
- Follow-up fixes after browser review:
  - aligned chart family color slices with category nodes
  - changed Quick Draw result actions to Add Note / Begin POA in Journal / Dismiss
  - wired Add Note through existing Flyback reflection path, no schema change
  - wired Begin POA to persist/start the drawn practice for signed-in users, with signed-out handoff fallback

### Build 0.1.2 dependency security release

- Ran npm audit/remediation after Vercel install warned about dependency vulnerabilities.
- Upgraded Vite/Vitest/Cypress toolchain.
- Added targeted `minimatch@9.0.7` override for the TypeScript-ESLint chain.
- Bumped build marker to `0.1.2 / secure-beta-0.1.2`.
- Wrote release note: `.claude/plans/2026-07-02-build-0.1.2-dependency-security.md`.

## Commits / Deployment

- Product release commit: `65944a77aac0a09dfd747f0d447d6b630cb1818c` — `feat: ship secure beta build 0.1.1`
- Dependency remediation commit: `1cf7893f214555ebc082d3b386c76b996a93078a` — `chore: remediate Ionic dependency audit`
- Branch: `secure-beta-launched`
- Origin branch verified at `1cf7893f214555ebc082d3b386c76b996a93078a`.
- Stable production alias: `https://michael-chekhov-toolkit-beta.vercel.app`
- Immutable deployment: `https://michael-chekhov-toolkit-beta-j0d4j5xhl-skyelandersolutions.vercel.app`
- Vercel deployment id: `dpl_34nZhzEuXWCsvuMsMrZuWREhunn1`
- Vercel inspect: `https://vercel.com/skyelandersolutions/michael-chekhov-toolkit-beta/34nZhzEuXWCsvuMsMrZuWREhunn1`
- GitHub Actions for 0.1.2: `https://github.com/SkyelanderWebDev/MichaelChehovApp/actions/runs/28611301514`

## Verification Receipts

Final local gates for 0.1.2:

- `npm audit --audit-level=moderate` — PASS, 0 vulnerabilities
- `npm run lint` — PASS
- `npm run build` — PASS
- `npm run test:unit` — PASS, 129 tests / 20 files
- `npm run test:e2e:ci` — PASS, 27 total, 26 passing, 1 pre-existing pending signed-in persistence credential-gated spec
- `npm run verify:build-version` — PASS, `0.1.2 / secure-beta-0.1.2`
- `git diff --check` — PASS
- Added-lines credential-pattern scan returned clean.

Production verification:

- `vercel inspect` reports status `Ready` for production deployment.
- Stable alias is attached.
- `curl -I https://michael-chekhov-toolkit-beta.vercel.app` returns `HTTP/2 200`.
- Browser smoke on Settings confirmed `Secure beta build 0.1.2 · 2026-07-02`.

## Honest Limits / Follow-up

- Signed-in production Supabase POA/PDF/note flows remain unit/e2e-shell verified only; no live tester credential browser run was performed.
- Cypress 15 warns about test-only `Cypress.env()` usage in the gated signed-in persistence spec; migrate later.
- Vite 8 emits Lightning CSS warnings for Ionic upstream `:host-context(...)`; build succeeds.
- Existing bundle-size warnings remain; schedule a performance/code-splitting pass later.
- Local repo has unrelated untracked planning/bakeoff folders; this wrap note is intentionally not committed to avoid mixing unrelated dirt.

## Next

- Optional: live signed-in tester smoke against production Supabase, if Dawson approves using tester credentials.
- Optional: migrate Cypress credential plumbing away from `Cypress.env()`.
- Optional: dependency deprecation cleanup / ESLint 9+ migration as a separate tooling modernization pass.
- Optional: performance/code-splitting pass for large chunks.
