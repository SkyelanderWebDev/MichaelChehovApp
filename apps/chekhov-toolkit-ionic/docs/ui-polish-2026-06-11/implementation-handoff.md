# Implementation Handoff — Chekhov Toolkit UI Polish

## Read first

- `docs/ui-polish-2026-06-11/DESIGN.md`
- `docs/ui-polish-2026-06-11/design-contract.md`
- `CLAUDE.md`
- `AGENTS.md`
- Current app files:
  - `src/views/HomePage.vue`
  - `src/components/AuthPanel.vue`
  - `src/components/CircleChart.vue`
  - `src/components/ToolPreviewCard.vue`
  - `src/components/DailyActionCard.vue`
  - `src/router/index.ts`
  - `src/theme/variables.css`

## Non-goals

- Do not rewrite the app in Kotlin/Android. Use Kotlin/Jetpack Compose stock examples only as pattern references for scaffolds, tabs, cards, bottom sheets, and Material-like motion.
- Do not deploy or share externally without Dawson approval.
- Do not add AI-generated embodied Chekhov practice prompts.
- Do not change NMCA/Chekhov taxonomy terms casually.
- Do not claim secure beta unless auth/RLS/user-owned persistence has been verified.

## First artifact should prove

At phone width, the beta immediately feels like a polished app in both light and dark mode:
- intentional studio shell, not a document stack,
- readable/beautiful dark and light themes,
- top status bar,
- bottom tabs in Dawson’s order: Library / Journal / Chart / Map / Settings,
- Chart is the center/default tab and is visually emphasized,
- Chart/Toolkit contains the CircleChart as the quick-access identity surface without becoming a long form,
- Chart cards link to Library for deeper resources,
- Journal/POA contains Today’s Practice as the daily ritual card and POA flow,
- Map/Calendar is reserved for location-based studios/teachers near you and upcoming events,
- tester access as a warm gate/sheet rather than a technical Supabase card.

## Recommended implementation order

### Phase 0 — Shell and token rescue

Description: Replace the default document/page feel with an app shell and global design tokens.

Likely files:
- `src/theme/variables.css`
- `src/App.vue`
- `src/router/index.ts`
- new `src/components/AppShell.vue`
- new `src/components/BottomTabs.vue`
- new `src/components/TopStatusBar.vue`
- new `src/components/AppearanceSelector.vue` or equivalent Settings control

Acceptance criteria:
- [ ] Global semantic tokens define both dark and NMCA-informed light studio themes, warm paper surfaces, brass/sage/wine/purple accents, text colors, radii, and shadows.
- [ ] Light mode references Chekhov.net / NMCA cues: white/cream base, charcoal text, restrained purple accent, warm human tone, clean sans body.
- [ ] App has persistent bottom nav, left-to-right: Library / Journal / Chart / Map / Settings, with Chart centered and visually emphasized.
- [ ] Settings has Appearance: System / Light / Dark, persisted in local storage and applied before visible flicker where practical.
- [ ] App uses safe-area padding for iOS PWA.
- [ ] Default black Ionic toolbar is removed or restyled intentionally.
- [ ] No console errors in local browser.

Verification:
- [ ] `npm run build`
- [ ] Browser smoke at `/home` and `/chart`.
- [ ] Mobile-width screenshots in both dark and light mode: Chart first viewport contains top status + CircleChart quick access + bottom nav with emphasized center Chart tab.

### Phase 1 — Center Chart quick-access redesign

Description: Make Chart the default center tab and quick-access home for the Chart of Inspired Action, with basic information and Library deep links.

Likely files:
- `src/views/HomePage.vue` or new `src/views/ChartPage.vue`
- new `src/components/CenterChartTabButton.vue` if the tab bar needs a custom center control
- new/updated `src/components/CircleChartCard.vue`
- new `src/components/LibraryDeepLink.vue` or equivalent link affordance
- update router to make `/home` redirect to `/chart`.

Acceptance criteria:
- [ ] `/home` redirects to `/chart`.
- [ ] Chart is the center tab and has a visually emphasized center-tab treatment.
- [ ] Chart first viewport shows CircleChart / Chart of Inspired Action quick access and basic category/tool info.
- [ ] Chart cards link to Library for deeper information/resources.
- [ ] Technical beta/security copy is absent from Chart’s first viewport.

Verification:
- [ ] Manual smoke `/chart`, center tab selection, chart node/category details, and Library deep links.
- [ ] `npm run build`.

### Phase 2 — Auth repositioning

Description: Keep secure beta behavior but stop making Supabase the product’s first impression.

Likely files:
- `src/components/AuthPanel.vue` -> split/replace with:
  - `TesterAccessSheet.vue`
  - `AccountStatusChip.vue`
  - `BetaDetailsDisclosure.vue`
- new/updated `src/views/SettingsPage.vue`

Acceptance criteria:
- [ ] Primary copy says `Tester access`, not `Supabase Auth`.
- [ ] Action-time gate says: “Tester access is required to save today’s practice and POA.”
- [ ] Full Supabase/Auth/RLS/env details remain accessible in Settings.
- [ ] Auth errors are still readable and accessible.

Verification:
- [ ] Sign-in/sign-up still works with configured env.
- [ ] Misconfigured env state is visible in Settings, not dominating Chart or Journal.
- [ ] `npm run build`.

### Phase 3 — Journal/POA Today’s Practice flow

Description: Move Today’s Practice / POA into the Journal tab while keeping it easy to access from Chart.

Likely files:
- new/updated `src/views/JournalPage.vue`
- new `src/components/TodayPracticeCard.vue`
- new/updated `src/components/PracticeRouteCard.vue`
- new/updated `src/components/PracticePreviewSheet.vue`
- `src/components/DailyActionCard.vue` -> `POAJournalCard.vue`

Acceptance criteria:
- [ ] Journal first screen contains Today’s Practice / POA state.
- [ ] Signed-in empty state shows Pick My Own, Draw Random, Daily Tool.
- [ ] Preview state shows selected tool, source chip, category/family metadata, and one primary `Start Today’s Practice` CTA.
- [ ] Started state shows locked date/tool and points directly to POA.
- [ ] POA has clear neutral sections or a visually sectioned journal path without invented prompts.

Verification:
- [ ] Manual smoke through signed-out, preview, started, POA save/reload states where possible.
- [ ] `npm run build`.

### Phase 4 — Map/Calendar future location/events surface

Description: Create a bounded Map tab that is clearly about nearby studios/teachers and upcoming events, not curriculum or Today’s Practice.

Likely files:
- new `src/views/MapPage.vue`
- new `src/components/TeacherStudioMapPlaceholder.vue`
- new `src/components/EventsCalendarPreview.vue`

Acceptance criteria:
- [ ] Map copy explicitly says future nearby studios/teachers and upcoming events/calendar.
- [ ] Map does not contain Today’s Practice, curriculum levels, or learning-path progression.
- [ ] For this beta pass, Map is a polished `Coming soon` surface for future nearby studios/teachers and upcoming events/calendar.
- [ ] No location permission prompt is triggered until there is an actual user-initiated location feature.

Verification:
- [ ] Visit `/map`; confirm no curriculum/POA language and no automatic permission prompt.
- [ ] `npm run build`.

### Phase 5 — Library, Journal, and Settings surfaces

Description: Keep Chart quick, keep Journal/POA focused, and move deep resources, beta feedback, theme, and settings to their proper tabs.

Likely files:
- new `src/views/LibraryPage.vue`
- new `src/views/JournalPage.vue`
- new `src/views/SettingsPage.vue`
- new `src/components/PracticeHistoryCard.vue`
- update feedback components/store usage if needed.

Acceptance criteria:
- [ ] Journal shows Today’s Practice / POA plus past Daily Practices with date/tool/source/POA status.
- [ ] Journal has only a lightweight feedback nudge; full feedback form lives in Settings or modal.
- [ ] Library presents browsable source/tool material without invented teaching content and receives deep links from Chart cards.
- [ ] Settings includes tester account, sign-out, Appearance, data/security details, attribution/about, and feedback.
- [ ] Attribution remains visible before external sharing.

Verification:
- [ ] Journal opens previous practice entry if data exists.
- [ ] Feedback submit still works when signed in.
- [ ] `npm run build`.

### Phase 6 — Polish and phone QA

Description: Make the redesigned app presentable for phone testing.

Acceptance criteria:
- [ ] Contrast meets WCAG AA for normal text where practical in both light and dark mode.
- [ ] All controls are keyboard accessible and have visible focus.
- [ ] 44px minimum touch targets.
- [ ] Reduced-motion respected.
- [ ] Loading, empty, error, signed-out, misconfigured, preview, started, POA-saved states are handled.
- [ ] Real iPhone smoke before Lisa/NMCA review.

Verification:
- [ ] `npm run build`
- [ ] local mobile-width browser smoke at 390px and 320px.
- [ ] real iPhone home-screen/PWA smoke before external review.

## Copy replacements

Use these in the redesign:

- `Secure tester beta` -> `Private beta`
- `Supabase Auth` -> `Tester access`
- `Sign in with the tester account panel...` -> `Choose one tool for today’s work. Begin when you’re ready; return to POA throughout the day.` Use this in Journal/POA, not Chart or Map.
- `Supabase sign-in is required before Today’s Practice and POA can be saved for beta testing.` -> `Tester access is required to save today’s practice and POA.`
- `Neutral taxonomy preview only...` -> `Source-backed taxonomy label. No generated practice prompt.`

## Suggested route shape

```text
/library    Source/tool library, saved/recent items, approved excerpts/resources when available
/journal    Today’s Practice / POA + Daily Practice history
/chart      Default center tab: CircleChart quick access + categories + basic tool info + Library links
/map        Future nearby studios/teachers + upcoming events/calendar, not curriculum
/settings   Tester access, appearance, beta details, attribution, feedback
```

If keeping `/home` for compatibility, redirect it to `/chart`.

## Verification commands

Run from:

```text
/Users/dawson/Documents/Claude/Projects/Michael Chekhov App/apps/chekhov-toolkit-ionic
```

Commands:

```bash
npm run build
npm run lint   # if lint config is stable enough for this app
```

For local smoke:

```bash
npm run dev -- --host 127.0.0.1 --port 5177
```

Then inspect:

```text
http://127.0.0.1:5177/library
http://127.0.0.1:5177/journal
http://127.0.0.1:5177/chart
http://127.0.0.1:5177/map
http://127.0.0.1:5177/settings
```

## Fable / Claude Code implementation invocation

The no-tool command is only for auth/model smoke. For real work, use Fable with tools and skills/customizations enabled.

Recommended pattern, from repo root or an isolated worktree:

```bash
claude -p \
  --model fable \
  --effort xhigh \
  --tools default \
  --permission-mode acceptEdits \
  --add-dir "/Users/dawson/.hermes/skills" \
  --add-dir "/Users/dawson/Documents/Claude/Projects/Michael Chekhov App" \
  "Read AGENTS.md, CLAUDE.md, apps/chekhov-toolkit-ionic/docs/ui-polish-2026-06-11/DESIGN.md, design-contract.md, implementation-handoff.md, and handoff-readiness-98.md. Implement Phase 0-2 only. Use relevant Claude/Hermes skills as reference, preserve guardrails, run verification, and report changed files and commands."
```

Notes:
- `--tools default` enables Claude Code built-in tools. Do not use `--tools ""` for implementation.
- Do not run with `--safe-mode` or `--disable-slash-commands` for the real implementation lane, because those disable custom skills/plugins.
- `--add-dir /Users/dawson/.hermes/skills` makes Hermes skill files readable as reference, but Fable still needs to be told which skills/docs to consult; it does not automatically inherit Hermes’ in-memory `skill_view` tool.
- Prefer relevant safe skills over injecting every skill into the prompt. All-tool access is fine in an isolated worktree; all-skill context injection is not, because it bloats context and can introduce irrelevant/conflicting instructions.

## Agent split recommendation

- Fable/Claude Code lane, when auth is fixed: coherent product/design implementation of Phase 0–2 in an isolated worktree, with tools enabled (`--tools default`) for the implementation run. Do not use the no-tool smoke command for real work.
- GPT-5.5/Codex lane: read-only review of diff, mobile UX smoke, build/lint/type verification, attribution/no-AI-prompt scan.
- Hermes/controller: scope, dirty-tree protection, merge/deploy/share decisions, Lisa-readiness gate.
