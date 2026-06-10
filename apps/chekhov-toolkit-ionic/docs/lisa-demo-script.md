# Lisa Demo Script — The Michael Chekhov Toolkit (browser pilot)

Last updated: 2026-06-10 (bakeoff Phase 1+ / local demo auth slice).

This is a local browser demo, not a hosted beta. Run it at phone width
(390×844) in a desktop browser, or on an iPhone pointed at the dev server on
the same network. Real-iPhone smoke has **not** been run for this slice; do
not claim phone readiness until it has.

## How to run it

From the repo root (enables optional local demo accounts):

```bash
PORT=5055 HOST=127.0.0.1 npm run dev
```

From `apps/chekhov-toolkit-ionic` (the app itself):

```bash
npm run dev -- --host 127.0.0.1 --port 5179
```

Open `http://127.0.0.1:5179/home`. The app works fully as a guest even if the
first server is not running; accounts simply show as unavailable.

## What changed since April

1. The app is framed as **The Michael Chekhov Toolkit**, with the NMCA / Lisa /
   Chart of Inspired Action attribution always visible.
2. The flow is organized around **Today’s Practice**, not only random drawing.
3. The actor chooses **Pick My Own**, **Draw Random**, or **Daily Tool**.
4. Tapping any chart node (or a directory **Details** button) opens a
   **category detail sheet**: family, parent tools, and child/example labels
   straight from the taxonomy.
5. Inside the sheet the actor can **filter parent tools** (Select all /
   Deselect all / per-tool checkboxes, with a live count). **Draw Random only
   draws from what is selected.**
6. **Pick My Own is now intentional**: it opens the highlighted chart area and
   the actor previews the exact parent tool they choose.
7. Starting practice **locks one tool to today’s POA**; all chart, detail, and
   filter controls are disabled for the rest of the day.
8. **Daily Action / POA notes** save and come back after closing or reloading.
9. New: optional **local demo accounts** (username + password) so each person
   on this machine keeps their own practice day and POA notes.

## Suggested 90-second walkthrough

1. Open the app — point at the name and the attribution footer.
2. Tap the **Archetypal Gestures** node — show family, the ten parent tools,
   and the child labels. Deselect all, select just *Push* and *Pull*.
3. Done → **Draw Random** — the preview honors the filter.
4. **Draw another preview** once or twice — show preview-before-commitment.
5. **Start Today’s Practice** — show the lock banner and the disabled chart.
6. Type a Daily Action / POA note, save, reload — both come back.
7. (Optional) Create a demo account and show that the new account gets its own
   fresh day while the guest day stays put after signing out.

## Honest status / known limits

- **Browser demo only.** No hosted URL, no installable PWA yet, no real-iPhone
  smoke for this slice.
- **Auth is local demo auth**, not verified secure auth: accounts live in a
  local SQLite file (`data/chekhov.db`) with scrypt-hashed passwords and
  httpOnly session cookies, but there is no HTTPS, rate limiting, or account
  recovery. See `docs/local-demo-auth.md` for the Supabase migration plan.
- **Practice/POA data is still device-local** (browser localStorage, scoped
  per signed-in user). Accounts do not sync practice data to the server yet.
- Daily Tool is a deterministic local seed, not a real global daily tool.
- History, Flyback journal, and the structured POA fields from the React
  prototype are not in this slice (the journal-mode note is).
- Parent-tool filter selections reset on reload (by design for now); the
  locked practice and POA note do not.
- Tool content is taxonomy labels only — no embodied practice prompts, and
  nothing AI-generated presented as Michael Chekhov / NMCA / Lisa teaching.

## What is still June 13 work

- Supabase Auth / Postgres / RLS (replacing the local demo auth slice).
- Hosted installable PWA for testers.
- Per-user server-side Daily Practice + POA persistence.
- Basic History and feedback capture.
- Library skeleton with sourced/cited material.
