# Chekhov App — Claude Code + Codex Tandem One-Hour Plan

> For Hermes/Rudy: use this as the bounded work contract for Claude Code and Codex. Keep changes small, verify after each lane, and do not deploy/share externally without Dawson approval.

**Prepared:** 2026-05-27 15:42 CDT

**Goal:** Get the NMCA/Lisa Dalton Phase 1 prototype from “mostly working local build” to “locally runnable, type-clean enough, mobile-demo-ready enough to share after one more deploy pass.”

**Current repo:** `/Users/dawson/Documents/Claude/Projects/Michael Chekhov App`

**Current branch:** `main`

**Tech stack:** React 18 + Vite + Tailwind + shadcn/ui, Express, Drizzle, SQLite via `better-sqlite3`, npm/package-lock.

---

## Read-only inspection findings

### Already done / healthy

- SQLite migration is present:
  - `server/db.ts` uses `better-sqlite3` and auto-creates tables.
  - `shared/schema.ts` uses `sqliteTable`.
  - `drizzle.config.ts` points at `./data/chekhov.db`.
  - `.gitignore` excludes `data/`.
- POA Journal exists and is integrated:
  - `client/src/components/POAJournal.tsx`
  - `ToolRevealCard` has `Begin POA`.
  - Server has journal routes and storage methods.
- Production build works:
  - `npm run build` succeeds.
- Browser smoke on Vite-only frontend shows the main UI, Select All, Draw Tool, reveal card, Flyback, and Begin POA are present.

### Blocking / near-blocking issues

1. `npm run check` fails, but only from example/demo files under `client/src/components/examples/`:
   - missing `onOpenDetail` prop in example `CategoryWheel` usage;
   - stale `toolName` property instead of `parentToolName`;
   - stale phantom category ids such as `psychophysical`, `characterization`, and `tpt`.

2. `npm run dev` fails on this macOS/Hermes environment:
   - `server/index.ts` hardcodes `host: "0.0.0.0"` and `reusePort: true`.
   - Node raises `listen ENOTSUP: operation not supported on socket 0.0.0.0:5000`.
   - Vite-only dev can run with `npx vite --host 127.0.0.1 --port 5173`, but API calls then fail because Express is absent.

3. Browser smoke on Vite-only frontend confirms a persistence/API failure:
   - selecting all + Draw Tool opens a reveal card;
   - toast says `Failed to save the drawn tool` because `/api/drawn-tools` is unavailable in Vite-only mode.
   - This should disappear once the full Express+Vite dev server can bind locally.

4. Mobile/desktop visual polish still needs a focused pass:
   - wheel labels/check badges are crowded;
   - right panel competes with wheel area;
   - PsychoPhysical section is cramped;
   - needs iPhone-width verification, especially POA sticky save and reveal card overflow.

---

## One-hour priority

Do NOT spend the first hour on deployment, new features, or taxonomy expansion.

Spend the first hour on: “make local full-stack dev run, make TypeScript check clean, then verify the core Lisa flow.”

Definition of done for the hour:

- `npm run dev` starts on local macOS/Hermes without changing production deploy behavior.
- `npm run check` passes.
- `npm run build` still passes.
- Browser smoke can run against the full server, not Vite-only:
  - select all;
  - draw tool;
  - save drawn tool to SQLite;
  - open Begin POA;
  - save a minimal POA entry;
  - reload and confirm history/journal persisted.

---

## Tandem model

### Claude Code lane — product/architecture integrator

Use Claude Code for the careful app-level fix because it should preserve the stakeholder/product context in `CLAUDE.md`.

Recommended Claude Code command:

```bash
cd /Users/dawson/Documents/Claude/Projects/Michael\ Chekhov\ App
claude -p 'You are working on the official NMCA Michael Chekhov Toolkit prototype. Read CLAUDE.md and .claude/plans/2026-05-27-agent-tandem-hour-plan.md. Implement Task A and Task B only: make npm run dev bind safely on macOS/local environments without breaking deploy assumptions, and make npm run check pass by either fixing or excluding stale example files. Keep changes minimal. Do not deploy. Run npm run check and npm run build before final report.' --allowedTools 'Read,Edit,Bash(npm run *),Bash(git diff *),Bash(git status *)' --max-turns 12
```

Claude Code should report:

- files changed;
- exact host/bind behavior chosen;
- `npm run check` result;
- `npm run build` result;
- any risks.

### Codex lane — independent reviewer/tester

Use Codex after Claude Code’s patch, not concurrently on the same files. Codex should be the boring-reliable verification worker.

Recommended Codex goal contract:

```bash
cd /Users/dawson/Documents/Claude/Projects/Michael\ Chekhov\ App
codex exec --full-auto 'Review the current diff and verify the Phase 1 prototype locally. Do not broaden scope. Do not deploy. Run npm run check and npm run build. Inspect whether npm run dev can start on a local macOS host. If the server starts, smoke-test the API routes with curl: GET /api/drawn-tools, POST /api/drawn-tools with a minimal valid payload, GET /api/drawn-tools again. Final report: changed files, commands run, pass/fail, risks, and the smallest next action.'
```

Codex should not rewrite UI or re-architect storage unless explicitly asked after review.

---

## Task A — Fix local full-stack dev bind

**Objective:** Make `npm run dev` work locally while preserving deploy-friendly behavior.

**Files:**

- Modify: `server/index.ts`

**Current problem:**

```ts
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  log(`serving on port ${port}`);
});
```

This fails in the current environment with `ENOTSUP` on `0.0.0.0:5000`.

**Preferred minimal implementation:**

- Introduce env-configurable host.
- Default local development to `127.0.0.1`.
- Use `0.0.0.0` only when explicitly requested with `HOST=0.0.0.0` or in a known deploy environment.
- Remove `reusePort` unless a deploy platform requires it.

Example shape:

```ts
const port = parseInt(process.env.PORT || "5000", 10);
const host = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");

server.listen({ port, host }, () => {
  log(`serving on http://${host}:${port}`);
});
```

**Verification:**

```bash
npm run dev
```

Expected: server stays running and logs a local URL. Then in another shell:

```bash
curl -s http://127.0.0.1:5000/api/drawn-tools
```

Expected: `[]` or JSON array.

---

## Task B — Make TypeScript check pass

**Objective:** `npm run check` passes without weakening production type safety.

**Files likely involved:**

- `client/src/components/examples/CategoryWheel.tsx`
- `client/src/components/examples/HistoryPanel.tsx`
- `client/src/components/examples/ToolRevealCard.tsx`
- maybe `tsconfig.json`

**Current errors:** stale example/demo files only.

**Acceptable approaches, in order:**

1. If examples are intended to remain live docs, update them to current props/types:
   - use `parentToolName`, not `toolName`;
   - pass `selectedLevels` and `onSaveJournal` to `ToolRevealCard`;
   - pass `onOpenDetail` to `CategoryWheel`;
   - replace phantom IDs with real IDs from `TOOL_CATEGORIES`.

2. If examples are abandoned Replit artifacts, move them out of the TypeScript include path or exclude `client/src/components/examples/**/*` in `tsconfig.json`.

Preference: fix examples if it is less than 15 minutes; otherwise exclude them explicitly with a comment noting they are visual reference examples, not production code.

**Verification:**

```bash
npm run check
npm run build
```

Expected: both pass.

---

## Task C — Full-stack smoke test

**Objective:** Prove the prototype’s core path persists data locally.

**Manual/browser flow:**

1. Start full server with `npm run dev`.
2. Open `http://127.0.0.1:5000`.
3. Click Select All.
4. Click Draw Tool.
5. Confirm no `Failed to save the drawn tool` toast.
6. Click Begin POA.
7. Enter a short Practice note.
8. Save Practice Notes.
9. Reload.
10. Confirm history still contains the draw.

**API fallback smoke if browser is unavailable:**

```bash
curl -s http://127.0.0.1:5000/api/drawn-tools
curl -s -X POST http://127.0.0.1:5000/api/drawn-tools \
  -H 'content-type: application/json' \
  -d '{"id":"smoke-1","categoryId":"expanding-contracting","categoryName":"Expanding & Contracting","parentToolName":"Expanding","childToolName":"Opening","scaleValue":null,"unveiledValue":null,"journalEntry":null}'
curl -s http://127.0.0.1:5000/api/drawn-tools
```

Expected: created row appears.

---

## Task D — If time remains: mobile polish triage only

Do not attempt broad redesign in the first hour. If A-C finish early, create a short visual punch list:

- iPhone-width wheel/card crowding;
- right panel/drawer behavior;
- POA modal full-screen behavior;
- sticky save button visibility;
- reveal card overflow;
- touch target sizes.

Then stop and report. Let Dawson approve whether Claude or Codex should take the UI polish pass.

---

## Do-not-touch without explicit approval

- Do not deploy or share a URL.
- Do not rename the product publicly.
- Do not alter the NMCA taxonomy unless Lisa/NMCA changes require it.
- Do not add auth/accounts.
- Do not replace React/Vite with Vue/Nuxt in Phase 1.
- Do not globally upgrade Node, Claude Code, Codex, npm, or project dependencies unless required to fix a verified blocker.

---

## AI Research implementation tie-in

The 2026-05-26 and 2026-05-27 AI Research digests reinforce the same orchestration split this plan uses:

- **Claude Code:** fast, context-rich product iteration and review-each-diff work. Use it first here because `CLAUDE.md` carries real NMCA/Lisa Dalton context and the local-dev/typecheck fix needs product sensitivity, not blind broad refactoring.
- **Codex:** cheaper/steadier long-horizon or unattended worker. Use it second here as the independent verifier: diff review, `npm run check`, `npm run build`, local full-stack server smoke, and API persistence smoke.
- **Cursor:** cloud-runner/computer-use verification lane. Good to track, but not necessary for this local Phase 1 hour.
- **Hermes/general-agent harnesses:** persistent workflow/Kanban lane, not the right primary coding harness for this specific first-hour patch. Boxmining's harness taxonomy says evaluate persistent agents by workflow handling, not deterministic coding performance.

Specific 2026-05-26/27 findings folded into this plan:

1. Theo + Nate Herk independently attest the same operating split: Claude is faster/context-richer but token-heavier; Codex is better for boring-reliable longer runs. This validates the Claude-first, Codex-review sequence.
2. The Anthropic Max20x / third-party wrapper clawback means avoid unnecessary wrapper layers for this first hour. Run Claude Code through the native CLI where possible; keep Codex bounded by explicit goal contract.
3. Chase AI's Claude Code plugin/skill list is **not** a first-hour dependency. Do not install Impeccable, caveman, skill-creator, or other new plugins until source identity and rollback are bound.
4. Honker is relevant to the broader “SQLite can go further than people think” architecture conversation, but not to this prototype hour. The app only needs basic local SQLite persistence right now; no SQLite extensions.
5. Mirage is held. Do not use MacFUSE / virtual-filesystem agent tooling on the Chekhov/NMCA work machine.
6. Security/supply-chain posture matters: no broad global upgrades, no unknown installs, no deployment, and no client/stakeholder URL sharing until the local verification loop is clean.
