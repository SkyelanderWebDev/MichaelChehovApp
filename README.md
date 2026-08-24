# The Michael Chekhov Toolkit

This repository contains two application surfaces for a private-beta Michael Chekhov practice toolkit:

- `apps/chekhov-toolkit-ionic/` is the current Ionic Vue, Vite, TypeScript, and Supabase application. Its package metadata identifies Build 0.2.1.
- `client/`, `server/`, and `shared/` contain the earlier React, Vite, Express, Drizzle, and SQLite prototype used as behavior and content reference.

The repository contains current implementation, historical plans, research, generated build output, and local worktrees. Do not infer current product state from roadmap or historical files alone. `AGENTS.md` defines the canonical operating constraints and current verified-state rules; `CLAUDE.md` contains Claude-specific project context.

## Repository orientation

- `apps/chekhov-toolkit-ionic/` — active secure-beta app and its verification scripts.
- `client/` — React prototype UI and taxonomy source territory.
- `server/` — prototype Express API and local persistence.
- `shared/` — shared prototype schemas.
- `supabase/` — hosted database migrations and supporting configuration.
- `.claude/plans/` and `HANDOFF.md` — dated planning and handoff evidence; verify recency before relying on them.

## Root prototype commands

From the repository root:

```bash
npm ci
npm run dev
npm run check
npm run build
npm run db:push
```

The root package defines no test or lint script.

## Current Ionic app commands

From `apps/chekhov-toolkit-ionic/`:

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run test:unit
npm run test:e2e
npm run verify:build-version
npm run verify:build-bump
npm run verify:rls
```

The Ionic build runs `vue-tsc` before Vite, so it is also the discovered type-check path.

## Boundaries

Do not casually alter sourced taxonomy or attribution, read unpublished stakeholder material, expose environment values, deploy, share a build, change hosted data, or add paid infrastructure without explicit authorization. Keep `.env*`, local databases, tester data, credentials, and private communications out of reviews and generated documentation. A successful local command is not evidence of stakeholder validation or deployment state.
