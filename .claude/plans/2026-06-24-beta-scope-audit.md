# Closed Beta Scope Audit — Michael Chekhov Toolkit
**Date:** 2026-06-24 · **Target:** closed tester beta, Friday · **Shipped path:** `apps/chekhov-toolkit-ionic/` (Ionic Vue + Capacitor PWA) + Supabase

Synthesized from three parallel read-only audits (security/auth/data, mobile-PWA/UX/guardrails, build/test/deploy). Legacy React/Vite/Express/SQLite at repo root is **not** deployed (Vercel builds only the Ionic dist) — keep it that way.

---

## Verdict
**No code BLOCKERS in the shipped path.** Auth is fail-closed, RLS is correct on all 6 tables, no secrets leak, guardrails clean (no AI embodied prompts, NMCA terminology intact, attribution rendered), gates green (lint/typecheck/build/unit/active-e2e all PASS). The risk is concentrated in **(a) two unproven verification receipts** and **(b) a short list of one-line hardening fixes** that should land before the URL is shared.

---

## A. Must-do before Friday (secure-beta gating)

### A1 — Run the RLS cross-user denial test against the hosted DB  *(verification — BLOCKER for "secure" claim)*
Test exists (`scripts/verify-supabase-rls.mjs`) but has **never been run** here — `npm run verify:rls` fails with missing env. Per CLAUDE.md guardrail #8, isolation is ASSUMED until proven. Run against hosted Supabase with anon creds, capture PASS output.

### A2 — Add HTTP security headers to `vercel.json`  *(HIGH, code — implement)*
No CSP / X-Frame-Options / HSTS on the deployed PWA → clickjackable, no XSS defense-in-depth. Add a `headers` block before sharing the URL.

### A3 — iOS standalone + pinch-zoom, `index.html`  *(HIGH, two one-line fixes — implement)*
- H1: add `apple-mobile-web-app-capable` meta — without it Lisa's iPhone may launch in Safari chrome, not standalone.
- H3: drop `maximum-scale=1.0, user-scalable=no` — WCAG 2.2 SC 1.4.4 fail (blocks zoom).

### A4 — Unsaved POA draft data-loss (H2)  *(HIGH, code — implement + phone-verify)*
Draft text in `DailyActionCard.vue` lives in local `reactive` and only persists on Save tap. A background `onAuthStateChange` token refresh re-runs reload and **overwrites/wipes** untyped-but-unsaved text. Add debounced autosave or guard the reload from clobbering a dirty draft. Highest-impact invisible failure for testers.

### A5 — Prove signed-in persistence end-to-end  *(verification gap)*
No e2e covers authenticated POA save→return→reload or Start-Practice lock/reload — current e2e only tests the unavailable-auth gate. Either add a signed-in spec or capture a manual phone receipt for: lock survives reload, POA reloads, day-scoped.

---

## B. Should-fix (CI + accidental-deploy hygiene)

- **B1 — e2e not CI-ready:** `test:e2e` is bare `cypress run` against `localhost:5173` with no dev-server start and **no `.github/workflows`** at all. Passes only when Vite is manually up. Add start-server-and-test + a CI workflow.
- **B2 — Orphan stale spec:** `cypress/e2e/phase1-lock.cy.js` asserts old `/home` localStorage lock behavior, fails if forced (0 passing, 3 failing). Delete or migrate to the active `tests/e2e/specs/` pattern.
- **B3 — Legacy root deploy risk:** root `package.json` still exposes `dev/build/check` and ships `better-sqlite3`/Drizzle/Express; root `npm audit` is unhealthy. Vercel is correctly pointed at Ionic, but a manual/root deploy could ship the auth-less old app. Fence it off (README note / remove root build scripts / archive).
- **B4 — RLS test in CI:** wire A1 into the CI workflow so isolation is re-proven on every deploy, not manually.

---

## C. Intent decisions (your call — not bugs)

- **C1 (H4):** Chart stays interactive after "Start Today's Practice" — `ChartPage` hardcodes `:locked="false"`. Components already support lock. Intended (lock lives in Journal) or should the wheel freeze for the day?
- **C2 (M1):** "Unlock and change tool" does **not** clear the POA tied to the old `daily_practice_id` → re-roll leaves a POA describing the wrong tool. Clear or migrate POA on unlock?
- **C3 (M2):** App open across midnight writes POA against yesterday's row (no day-rollover watcher). Acceptable for beta or add a rollover guard?
- **C4 (LOW):** `start_url` / first screen is `/chart`, but `AGENTS.md` named a "Today's Practice" entry screen. Confirm intended landing.

---

## D. Defer (track, not Friday)

- Dev/CI tooling vulns: full `npm audit` = 17 (1 critical Vitest, high Vite, moderate Cypress). **Production runtime audit is clean (0).** Dev-only — bump after beta.
- Bundle size: Ionic main chunk ~1 MB (over 500 kB warn). Code-split later.
- Android maskable-icon safe-zone padding (M6), 38px chart tap targets on <380px (M7), wheel nodes show numbers not names to low-vision sighted users (M9).
- Service worker `autoUpdate` with no reload prompt (M4) — tell testers to close/reopen after each redeploy.
- Capacitor `appName` still scaffold (`chekhov-toolkit-ionic`); PWA name correct.

---

## Recommended Friday execution order
1. **Implement bundle (one PR):** A2 headers + A3 iOS/zoom + A4 POA autosave guard → cross-vendor review.
2. **Hygiene bundle (one PR):** B2 delete orphan spec + B1 CI-ready e2e + B3 fence legacy root.
3. **Verification receipts (you / a worker with hosted env):** A1 `verify:rls` PASS + A5 signed-in persistence + real-iPhone smoke (Lisa path).
4. **Decide C1–C4**, fold any resulting changes into bundle 1.

Readiness label until A1 + A5 + real-phone smoke pass: **browser-demo-ready only** — not yet **phone-ready secure beta**.
