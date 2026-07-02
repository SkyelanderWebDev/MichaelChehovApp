# Chekhov Secure-Beta Receipts Reconciliation — Session Wrap

Date: 2026-07-01 · Executed from worktree `vigilant-hugle-385312` (branch `claude/vigilant-hugle-385312`, base `secure-beta-weekend` @ `48b80a2`) · Audit plan: `~/.claude/plans/compressed-launching-sutton.md`

## Readiness label after this session

**`phone-ready secure tester beta v1`** — promoted 2026-07-01.

All six receipts landed: local gates + hosted RLS (A1) + signed-in persistence (A5) + CI RLS job + deployed-commit match + **Dawson real-phone home-screen smoke PASS (2026-07-01)** — iPhone add-to-home-screen, standalone launch, sign-in, draw → start → lock, POA save, kill/reopen persistence all confirmed by Dawson on the production alias.

## Receipts (all captured 2026-07-01, US/Central)

### 1. Local shipped-app gates — PASS
In `apps/chekhov-toolkit-ionic/` after fresh `npm ci`:
- `npm run lint` — clean (eslint, no output).
- `npm run build` — `vue-tsc && vite build` green; PWA v1.3.0 generateSW, 63 precache entries (~4.4 MiB), `dist/sw.js` generated.
- `npm run test:unit` — **19 files, 104/104 tests pass** (1.6s).
- `npm run test:e2e:ci` (no Supabase env) — **all 5 specs pass**: 20 passing, 1 pending (env-gated A5 spec correctly self-skips).

### 2. Hosted RLS cross-user denial (A1) — PASS
`npm run verify:rls` against `https://ivipmxrejnrtqghotfqf.supabase.co` (project ACTIVE_HEALTHY, browser-safe anon key only):
```
PASS profile trigger creates/selects only user A profile
PASS user A inserts own daily practice
PASS user A inserts own POA entry
PASS user A inserts own feedback
PASS user B cannot read user A daily practice
PASS user B cannot update user A daily practice
PASS user B cannot attach POA to user A daily practice
PASS anonymous user cannot read beta library rows
PASS authenticated tester can read minimal library skeleton
RLS smoke complete
```

### 3. A5 signed-in persistence e2e — PASS (after test-only spec fix)
- First run FAILED with `expected undefined to equal '2026-07-01'`. Root cause: **spec bug, not app bug** — `cy.wrap(promise)` in `tests/e2e/specs/signed-in-persistence.cy.ts` executed `prepareTesterRows`/`readTesterRows` eagerly at test start (before the UI created the practice), so the DB snapshot read empty. This is why the spec had never produced a PASS.
- Independent hosted-DB verification (Supabase SQL, before the fix) proved the app-side persistence was already correct: `daily_practices` rows for `2026-07-01 started` + seeded `2026-06-30`, and `poa_entries` in `structured` mode with practice_notes / observe_morning / journal_text, correctly day-scoped per throwaway tester.
- Fix applied (2 lines, test code only): `cy.wrap(prepareTesterRows(...))` → `cy.then(() => prepareTesterRows(...))`; same for `readTesterRows`.
- Re-run with `CYPRESS_RUN_AUTH_PERSISTENCE=1` + throwaway tester (`a5-tester-1782943096@skyelandersolutions.com`): **1/1 passing** — POA save → navigate → reload persists, `Start Today's Practice` lock survives reload, data day-scoped, yesterday's row untouched.

### 4. CI / environment-gated RLS job — CONFIRMED RUNNING
- GitHub Actions has the four required Supabase RLS environment entries set as of 2026-06-25 (project URL, browser-safe anon credential, email domain, and test login credential).
- Latest `ionic-ci.yml` run 28205890268 on `secure-beta-weekend` (merge f0e2aae): both jobs SUCCESS. The "Supabase RLS receipt" job **actually ran** `verify:rls` (all 9 PASS lines in the log — not the skip path).

### 5. Deployed-commit verification — MATCH (with one docs-only note)
- Production alias `https://michael-chekhov-toolkit-beta.vercel.app` → deployment `dpl_34wMGDE5sqgeP9qreSGwdcfeepVL`, `gitCommitSha f0e2aae5d0d…` ("Merge pull request #10 … phone-polish-round-2").
- `secure-beta-weekend` HEAD is `48b80a2` = one **docs-only** commit ahead ("docs: preserve Chekhov research and planning artifacts"). **Shipped code matches audited code.**
- Live headers re-verified: `/`, `/chart`, `/journal`, `/settings`, `/manifest.webmanifest` all 200 with CSP, HSTS (31536000), `X-Frame-Options: DENY`, `nosniff`.

## Corrections to stale docs

- `2026-06-24-new-features-scope.md` claimed A2/A3/A4/A5 "NOT yet built" — all four exist in code and A2 is live in production. Correction banner added to that file.
- 06-24 "G1 History" roadmap line is stale — Journals + Quick Draw History are implemented (Dawson-confirmed; `20260624120000_practice_core_history.sql`, quickDrawLock/practiceCoreLock unit tests, PR #10).
- 2026-06-24 audit items B1 (CI-ready e2e) and B4 (RLS in CI) are done; B2 orphan `cypress/e2e/phase1-lock.cy.js` still on disk but outside active `specPattern` (cosmetic).

## PR / deploy update (Rudy, 2026-07-01)

- Commit created: `67b79db` — `test/docs: record secure beta receipts`.
- Branch pushed: `claude/vigilant-hugle-385312`.
- Pull request opened: https://github.com/SkyelanderWebDev/MichaelChehovApp/pull/11 (`base: secure-beta-weekend`).
- GitHub checks on PR #11: `Ionic CI / Lint, build, unit, and e2e` SUCCESS; `Ionic CI / Supabase RLS receipt` SUCCESS.
- Production deploy completed via Vercel CLI for project `michael-chekhov-toolkit-beta` under `skyelandersolutions`.
- Deployment id: `dpl_2NoERBBr58KXhiy1Ytp6xchvSAgi`; deployment URL: `https://michael-chekhov-toolkit-beta-129ohygh6-skyelandersolutions.vercel.app`; alias: `https://michael-chekhov-toolkit-beta.vercel.app`.
- Post-deploy route/header smoke PASS: `/`, `/chart`, `/journal`, `/settings`, `/manifest.webmanifest` all HTTP 200 with CSP, HSTS, `X-Frame-Options: DENY`, and `nosniff`.

## Merge / post-merge deploy update (Rudy, 2026-07-01)

- PR #11 merged into `secure-beta-weekend` at merge commit `1366d6e` (`1366d6ef6341e89c077f57cd1f836708c762046a`).
- This wrap received a final post-merge receipt update on `secure-beta-weekend` after the PR merge.
- Post-merge production deploy was run from the merged `secure-beta-weekend` branch after this wrap update; see final session reply for the deployment id and route/header smoke receipt.

## Known limitations / follow-ups

- **Spec matrix flip:** `tests/e2e/specs/auth.cy.js` asserts the "tester access unavailable" gate and only passes when Supabase env is ABSENT. Running the full suite with env set fails those 2 tests by design. Follow-up: gate auth.cy.js on the inverse env flag (small test-only change).
- **Test-user residue on hosted Supabase:** throwaway `a5-tester-*@skyelandersolutions.com` (3) and generated `rls-*@skyelandersolutions.com` users accumulate from verify runs. Harmless (RLS-isolated) but worth periodic cleanup — needs Dawson-owned dashboard/admin access.
- Service worker `autoUpdate` still has no reload prompt — tell testers to close/reopen after redeploys.

## Files included in wrap commit

- `apps/chekhov-toolkit-ionic/tests/e2e/specs/signed-in-persistence.cy.ts` (2-line eager-promise fix — required for the A5 receipt).
- `.claude/plans/2026-07-01-secure-beta-receipts-wrap.md` (this file).
- Correction banner in `.claude/plans/2026-06-24-new-features-scope.md`.
- `CLAUDE.md` status banner promoting `phone-ready secure tester beta v1` and marking old demo-parity gap list historical.

## Dawson real-phone smoke — PASS (2026-07-01)

Checklist executed by Dawson on iPhone against `https://michael-chekhov-toolkit-beta.vercel.app`: Add to Home Screen → standalone launch → tester sign-in → Draw Random → Start Today's Practice → POA note → Save → kill app → reopen → lock + POA persisted. **PASS.** Label promoted to `phone-ready secure tester beta v1`.


## 2026-07-02 active-beta postscript

Dawson confirmed that the secure-beta production alias has already been shared with Lisa Dalton and that Lisa created her tester account on 2026-07-02. The app is therefore no longer merely "phone-ready" or waiting for Lisa review; it is in an **active secure beta** lane.

Build/version lock added 2026-07-02:

- App version: `0.1.0`
- Build identifier: `secure-beta-0.1.0`
- Build constants: `apps/chekhov-toolkit-ionic/src/constants/build.ts`
- Version verifier: `npm run verify:build-version`
- Release note: `.claude/plans/2026-07-02-build-0.1.0-active-secure-beta.md`

Future merges intended for deploy and future production deploys must update the build identifier/release note when tester-visible behavior, copy, auth/data shape, or security posture changes.
