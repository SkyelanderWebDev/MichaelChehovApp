# CI, RLS, and Auth E2E Receipts

This app keeps hosted Supabase receipts gated to Dawson/Rudy credentials. Normal PR CI should stay green without hosted secrets.

## A1 RLS Verification

Run:

```bash
npm run verify:rls
```

Required Supabase browser credentials:

- `VITE_SUPABASE_URL` or `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`

Use one of these tester-account modes:

- Existing confirmed users:
  - `SUPABASE_RLS_USER_A_EMAIL`
  - `SUPABASE_RLS_USER_A_PASSWORD`
  - `SUPABASE_RLS_USER_B_EMAIL`
  - `SUPABASE_RLS_USER_B_PASSWORD`
- Generated local smoke users:
  - `SUPABASE_RLS_EMAIL_DOMAIN` optional, defaults to `skyelandersolutions.com`
  - `SUPABASE_RLS_TEST_PASSWORD` optional, defaults to the script's local smoke password
  - Supabase Auth must allow signups and return a session, so email confirmations usually need to be disabled for local smoke.

Optional:

- `SUPABASE_RLS_LOCAL_DATE`, defaults to `2026-06-10`

The script uses only anon/tester access. Do not put a service-role key in Vite, Cypress, or GitHub Actions env for this app.

## A5 Signed-In Persistence E2E

Spec:

```text
tests/e2e/specs/signed-in-persistence.cy.ts
```

It verifies: signed-in POA save, navigation away, reload rehydrates POA, `Start Today’s Practice` remains locked, and a seeded previous-day row does not load as today.

It is skipped unless all of these are present:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `CYPRESS_RUN_AUTH_PERSISTENCE=1`
- `CYPRESS_SUPABASE_URL`
- `CYPRESS_SUPABASE_ANON_KEY`
- `CYPRESS_TESTER_EMAIL`
- `CYPRESS_TESTER_PASSWORD`

The tester account must already be confirmed and allowed to insert/select/delete its own `daily_practices` and `poa_entries` rows under RLS.

## GitHub Actions Behavior

- `lint`, `build`, and `test:unit` run on every PR/push.
- `test:e2e` runs through `start-server-and-test`, which boots Vite and then runs Cypress.
- The default e2e job does not inject hosted Supabase secrets, so the existing unauthenticated/misconfigured Cypress specs keep covering the normal PR path.
- `verify:rls` runs only when the RLS secrets are present. When they are absent, the job prints a skip message and exits successfully.
