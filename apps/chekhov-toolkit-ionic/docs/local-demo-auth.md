# Local Demo Auth — posture, wiring, and Supabase migration path

Last updated: 2026-06-10 (bakeoff slice).

**Posture: local demo auth.** This is a real username/password slice good
enough to demo "the app can add users" on one machine. It is *not* a secure
hosted beta and must not be described as one.

## What is implemented

Backend (root Express/SQLite server, `server/auth.ts`):

- `POST /api/auth/signup` — Zod-validated username (3–32 chars,
  `[a-zA-Z0-9_-]`, stored lowercase) and password (8–200 chars). Passwords are
  hashed with Node's built-in **scrypt** (16-byte random salt, 64-byte key);
  nothing plaintext is stored. Duplicate usernames return 409.
- `POST /api/auth/signin` — verifies with `timingSafeEqual` and returns the
  same neutral 401 for unknown user vs. wrong password.
- `POST /api/auth/signout` — deletes the server-side session and clears the
  cookie.
- `GET /api/auth/me` — returns `{ user }` or `{ user: null }`.
- Sessions are **server-side rows** in `auth_sessions` (SQLite), 7-day expiry,
  referenced by an `mct_session` cookie that is `httpOnly` + `SameSite=Lax`.
  Only the SHA-256 hash of the token is stored, so a copied database file
  cannot be replayed.
- API responses contain `{ id, username, createdAt }` only — never
  `password_hash`, never session tokens in bodies.
- Tables are auto-created in `server/db.ts`; data lives in the gitignored
  `data/chekhov.db`.

Frontend (Ionic app):

- Vite dev proxy forwards `/api` to `http://127.0.0.1:5055` (override with
  `MCT_API_PROXY_TARGET`), so cookies stay same-origin.
- `src/stores/authStore.ts` + `src/components/AuthPanel.vue` provide sign
  up / sign in / sign out and show the current user. If the server is down the
  app stays fully usable as a guest and says so.
- `src/stores/dailyPracticeStore.ts` scopes localStorage keys per signed-in
  user (`mct-weekend-beta:u:<userId>:…`), so each local account keeps its own
  Today’s Practice and POA notes. Guest practice keeps the original keys.

## How to run / smoke it

```bash
# repo root
PORT=5055 HOST=127.0.0.1 npm run dev

# apps/chekhov-toolkit-ionic
npm run dev -- --host 127.0.0.1 --port 5179
```

API smoke (all verified during the bakeoff):

```bash
curl -s http://127.0.0.1:5055/api/auth/me                                   # {"user":null}
curl -s -c /tmp/c.txt -X POST http://127.0.0.1:5055/api/auth/signup \
  -H 'Content-Type: application/json' -d '{"username":"demo","password":"demo-pass-1234"}'
curl -s -b /tmp/c.txt http://127.0.0.1:5055/api/auth/me                     # signed in
curl -s -X POST http://127.0.0.1:5055/api/auth/signin \
  -H 'Content-Type: application/json' -d '{"username":"demo","password":"wrong"}'  # 401 neutral
```

Cypress coverage: `tests/e2e/specs/auth.cy.js` (requires the backend running
behind the proxy).

## Known limits (deliberate for the demo)

- Plain HTTP on localhost; the cookie is not `Secure`. Do not host this as-is.
- No rate limiting, lockout, CSRF token, password reset, or email anywhere.
- Username/password only; usernames are normalized to lowercase.
- **Practice/POA data does not sync to the server** — identity scopes the
  device-local data, which means the same account on a different device starts
  empty. This is documented in the demo script as a known gap.
- Local sessions table grows only until expiry cleanup on next sign-in.

## Migration path to Supabase (June 13 lane)

1. **Identity**: replace `users`/`auth_sessions` with Supabase Auth
   (email/password, or username-alias via `username@<project>.local` mapping if
   usernames must stay). The `AuthPanel`/`authStore` surface stays; `signUp`,
   `signIn`, `signOut`, `loadSession` swap their fetch calls for
   `supabase.auth.signUp/signInWithPassword/signOut/getSession`.
2. **Config**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via
   `.env`/`.env.example` only. No keys in source. None are assumed or present
   today.
3. **Data**: move Daily Practice + POA from localStorage into Postgres tables
   (`daily_practices`, `poa_entries`) keyed by `user_id` + local date, with
   **Row Level Security** so users only read/write their own rows. The
   `dailyPracticeStore` API (`getTodayPractice`, `setPreview`,
   `startTodayPractice`, `savePOA`) was kept narrow so its storage backend can
   be swapped without touching the page logic.
4. **Sessions**: Supabase manages tokens; the local `auth_sessions` table and
   cookie code are deleted rather than ported.
5. **Decommission**: remove `server/auth.ts` routes and the Vite proxy entry
   once Supabase is live; the Express server goes back to being the React
   prototype's dev server.

Nothing in this slice hard-codes secrets; there is no `.env` requirement to
run the demo.
