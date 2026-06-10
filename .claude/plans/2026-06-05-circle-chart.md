# Circle Chart Lane — Weekend Pilot

## Goal

Initiate the circle-chart build inside the isolated Ionic Vue pilot without disturbing the existing React prototype.

The first slice is a mobile-first, accessible visual map of the Chart of Inspired Action categories. It is a navigation/selection surface, not a full official reproduction and not a source of generated embodied practice prompts.

## Constraints

- Preserve NMCA/Chekhov taxonomy names from `client/src/lib/toolData.ts`.
- Do not add AI-generated embodied Michael Chekhov practice prompts.
- Use neutral UI/navigation language only.
- Keep app name and NMCA/Lisa/Chart attribution visible/reachable.
- Treat this as a weekend pilot map. Do not claim it is the final/official chart layout.
- Keep work isolated under `apps/chekhov-toolkit-ionic/`.

## First build slice

Status: built and locally verified on 2026-06-05.

Create:

- `apps/chekhov-toolkit-ionic/src/constants/attribution.ts`
- `apps/chekhov-toolkit-ionic/src/data/circleChartCatalog.ts`
- `apps/chekhov-toolkit-ionic/src/components/CircleChart.vue`

Modify:

- `apps/chekhov-toolkit-ionic/src/views/HomePage.vue`
- `apps/chekhov-toolkit-ionic/index.html`

Behavior:

1. Header shows `The Michael Chekhov Toolkit`.
2. Screen frames the surface as `Today’s Practice` / `Chart of Inspired Action`.
3. Circle chart renders all current category names as selectable, accessible nodes.
4. Users can select/clear all chart areas.
5. Users can draw a random selected chart area for preview.
6. Selected preview shows category name, family, and tool count only.
7. Attribution text is visible in the page footer.

## Verification receipts

Passed:

```bash
cd apps/chekhov-toolkit-ionic && npm run build
cd apps/chekhov-toolkit-ionic && npm run lint
npm run check
npm run build
```

Mobile smoke was run with Playwright Chromium at `390x844` against `http://127.0.0.1:5177/home`.

Observed:

- title: `The Michael Chekhov Toolkit`
- h1: `Today’s Practice`
- initial: `15 selected`, preview `Expanding & Contracting`
- Clear: `0 selected`, random draw disabled
- Select all: `15 selected`, random draw enabled
- Draw random: preview changed successfully
- attribution visible
- no horizontal overflow at 390px
- no console errors
- screenshot captured at `/tmp/chekhov-circle-mobile-playwright.png`

Known warnings:

- Ionic build reports stale Browserslist data.
- Ionic build reports Tailwind `content` option missing/empty from generated starter defaults.
- App chunk exceeds 500 kB after minification from generated Ionic bundle.

These warnings are non-blocking for this first local slice.

## Original verification plan

Run from `apps/chekhov-toolkit-ionic/`:

```bash
npm run build
```

Then run from repo root:

```bash
npm run check
npm run build
```

Optional browser smoke:

```bash
cd apps/chekhov-toolkit-ionic
npm run dev -- --host 127.0.0.1 --port 5177
```

Smoke at mobile width and verify:

- app opens,
- title and attribution visible,
- circle nodes are tappable/clickable,
- select/clear works,
- random selected chart area works,
- no console errors,
- no generated embodied prompt content.

## Next slices

- Connect circle-chart selection to the Today’s Practice choice flow.
- Add Pick My Own category drill-down using parent tools from Vue-safe catalog.
- Add seeded Daily Tool and started/locked state.
- Add POA panel and local persistence.
