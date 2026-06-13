# Handoff Readiness — UI Polish to Claude/Fable

## Current confidence

Confidence after Dawson’s final tab/product-model correction and Claude/Fable auth repair: **98%** for autonomous implementation handoff, assuming the implementation lane stays scoped to Phase 0–2 and Hermes verifies the resulting diff/build/smoke receipts.

## Dawson corrections now incorporated

- Bottom tabs, left-to-right: `Library`, `Journal`, `Chart`, `Map`, `Settings`.
- `Chart` is the center/default tab and owns quick access to the Chart of Inspired Action / Toolkit basics.
- `Journal` owns Today’s Practice / POA.
- `Map` is future location/events: nearby studios/teachers and upcoming events/calendar, not curriculum.
- `Settings` owns tester access, appearance, beta/security details, attribution, and feedback.
- The app must support `System`, `Light`, and `Dark` appearance modes.
- Both light and dark modes must be intentionally designed and contrast-checked, not just inverted.

## Locked decisions for the 98% handoff

1. Visible tab labels

Recommended for phone width:

```text
Library | Journal | Chart | Map | Settings
```

Use `Toolkit` and `Calendar` as page subtitles, not slash labels in the tab bar.

Reason: `Chart/Toolkit` and `Map/Calendar` may crowd or truncate on iPhone. If Dawson explicitly wants slash labels, make that a hard instruction.

2. Initial landing route

Locked default:

```text
/home redirects to /chart
```

Reason: Chart is the center/signature tab and should be the default landing surface. Journal owns Today’s Practice / POA; Map is future location/events.

## Concerns / blind spots

1. Five tabs on small phones

Five tabs is ideal. Label length and icon quality still matter. Avoid `Chart/Toolkit` and `Map/Calendar` as literal tab labels; use `Chart` and `Map` visibly, with `Toolkit` and `Calendar` as page subtitles if needed. Make the center Chart tab more significant looking to pull visual gravity toward the center: raised circular/sigil-style button, slightly larger icon, accent ring/glow, visible label, and 44px+ target.

Acceptance check:
- No tab label wraps.
- No tab label truncates awkwardly.
- Each tap target remains at least 44px.

2. Library scope can balloon

`Library` will eventually be content-rich, but it may be thin in the first beta. That is okay.

Mitigation:
- Start Library as a source-safe browser of existing chart/tool taxonomy, approved attribution/source cards, and placeholders for future resources.
- Use empty states like “Source cards coming as beta material is approved.”
- Link Chart cards into Library for deeper pages as content grows.
- Do not invent teaching content to fill space.

3. Map/Calendar can imply an official curriculum

A map/calendar is a strong learning-app affordance. Here, Dawson’s intent is explicitly location/events: studios/teachers near you and upcoming events.

Mitigation:
- Frame Map as nearby studios/teachers and upcoming events/calendar only.
- Do not put Today’s Practice, POA, levels, mastery, curriculum, or practice progression in Map.
- Do not trigger a browser location permission prompt until the user explicitly taps a location feature.

4. Chart vs Library overlap

`Chart` and `Library` could feel redundant unless differentiated.

Recommended distinction:
- Chart = quick access to chart, categories, and the most basic information.
- Library = far more information/resource rich: searchable/browsable source/tool cards, approved excerpts, references, saved items.
- Chart cards should include a hyperlink/deep link to the relevant Library page when available.

5. Settings could become a junk drawer

Settings now holds account, appearance, beta/security details, attribution, and feedback. That is okay, but it needs grouping.

Recommended Settings groups:
- Account / Tester access
- Appearance
- Beta data and security
- Attribution / About
- Feedback
- Build/version

6. Light mode must not become the Google Form again

Light mode is the biggest design regression risk.

Mitigation:
- Reference Chekhov.net / NMCA for light-mode cues: white/cream base, charcoal text, restrained purple headline/accent family, warm human photography, clean sans body.
- Translate the palette/mood; do not copy site assets.
- Keep the same app shell, bottom tabs, route/card structure, and tactile surfaces in light mode.
- Require light and dark screenshots before scoring the redesign.

7. Fable/Claude Code auth is fixed and verified

Earlier Fable smoke failed with `401 Invalid authentication credentials`. Root cause evidence: `claude auth status` showed logged in, but `~/.claude.json` had a stale/dead bridge OAuth marker (`bridgeOauthDeadExpiresAt` in the past). Repair: ran `claude auth login --claudeai --email dawsonmacleod@protonmail.com` and completed the browser OAuth code flow.

Verification receipts:
- `claude auth status` reports logged in via `claude.ai`, provider `firstParty`, subscription `max`.
- Sonnet no-tool smoke returns `OK`.
- Fable no-tool smoke returns `OK`.
- Fable tool-enabled repo smoke with `--tools default` successfully used Bash and returned `TOOL_OK:/Users/dawson/Documents/Claude/Projects/Michael Chekhov App`.

Important: the no-tool command is only a clean auth/model smoke. For the real implementation lane, use Fable with tools enabled, e.g. `--tools default`, plus the repo docs and handoff files. Claude Code help confirms `--tools default` uses all built-in Claude Code tools; `--tools ""` disables them.

8. Supabase misconfiguration state can still leak into the primary path

If env vars are missing, the current app surfaces technical setup copy early. The redesign must not leave that behavior intact.

Mitigation:
- In Journal/POA, show only warm gate copy: “Tester access is required to save today’s practice and POA.”
- Put env/RLS/Supabase detail in Settings → Beta data and security.

9. POA structure vs existing schema

The current component stores a journal-style note; the plan recommends POA sections. If the backend/schema already supports structured fields, reuse it. If not, do not over-expand schema in the first polish pass unless cheap and safe.

Mitigation:
- Phase 0–2 can keep one saved journal field but visually group POA sections locally if schema work is risky.
- Do not block shell polish on POA schema expansion.

## 98% handoff prompt additions

Add this to the Claude/Fable implementation prompt:

```text
Dawson correction: the bottom tabs MUST be left-to-right Library, Journal, Chart, Map, Settings. Do not use Today / Toolkit / Beta as the tab bar. Chart is the center/default tab and should be visually emphasized; /home redirects to /chart. Chart owns quick access to the CircleChart/Toolkit basics and should link to Library for deeper resources. Journal owns Today’s Practice / POA. Map is future location/events for nearby studios/teachers and upcoming events/calendar, NOT curriculum, NOT a learning path, and NOT Today’s Practice. Settings owns tester access, appearance, beta/security details, attribution, and feedback. The app must support System / Light / Dark appearance modes; both light and dark must look intentional and pass readable contrast. Light mode should reference Chekhov.net/NMCA cues: white/cream, charcoal text, restrained purple accent, warm human tone.
```

## Recommended Phase 0–2 implementation contract

Goal: make the app shell and center Chart first impression feel polished without changing domain content, while moving Today’s Practice / POA into Journal and keeping Map reserved for future location/events.

Scope:
- Add semantic theme tokens for light/dark.
- Add Settings appearance selector: System / Light / Dark.
- Add persistent bottom tabs: Library / Journal / Chart / Map / Settings.
- Make the center Chart tab visually emphasized.
- Route `/home` to `/chart`.
- Move Supabase/auth technical details into Settings.
- Move Today’s Practice / POA into Journal, with app-like route cards and preview/start/locked states.
- Keep Map as a polished Coming Soon surface for future nearby studios/teachers and upcoming events/calendar only.
- Keep existing data/store behavior as much as possible.

Non-goals:
- No Kotlin rewrite.
- No deployment or sharing.
- No generated embodied practice prompts.
- No broad taxonomy edits.
- No official curriculum/path sequencing.

Verification:
- `npm run build`
- Browser smoke at `/library`, `/journal`, `/chart`, `/map`, `/settings`
- 390px and 320px screenshots in light and dark mode
- Confirm tab order and no label wrapping
- Confirm Supabase/RLS/env copy is absent from Chart and Journal first viewports
- Confirm attribution remains accessible in Settings/About and chart context
- Confirm no AI-generated embodied practice prompt content was added
