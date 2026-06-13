# The Michael Chekhov Toolkit — UI Polish Design System

## 1. Visual Theme & Atmosphere

Recommended stance: **Studio Ritual** — a private rehearsal-room companion for daily Michael Chekhov practice: dark, warm, tactile, credible, and app-like, with a guided daily ritual rather than a form stack.

The app should feel like opening a quiet actor's notebook inside a dim rehearsal studio. Borrow the app-shell discipline of Duolingo/Instagram/classroom apps — bottom navigation, status chips, route cards, object grids, progress path, bottom sheets — but translate it into adult actor-training language. No mascots, no childish XP economy, no influencer feed tone.

Primary product promise:

> Choose one tool. Begin today's practice. Return to POA.

Core experience qualities:
- Private, not social.
- Guided, not bureaucratic.
- Source-grounded, not AI-coachy.
- App-like, not document-like.
- Warmly official, not corporate/admin.
- The chart is the signature object; POA is the daily ritual.

## 2. Color

Use a two-theme system: dark studio and NMCA-informed light studio. Dawson personally prefers dark mode, but users must be able to choose `System`, `Light`, or `Dark` in Settings. Both modes need to be readable and beautiful, not merely inverted. For light mode, reference Chekhov.net / NMCA visual cues: white/cream ground, dark charcoal body text, purple headline/accent family, warm human photography, and a clean sans body feel; translate these into app tokens without copying site assets. Observed Chekhov.net cues: body background #ffffff, text around rgb(37,37,37), purple headings/links around rgb(87,45,123), body font `Be Vietnam Pro`, display headings using `Farsan`.

Core semantic tokens:

```css
:root {
  color-scheme: light dark;

  --nmca-purple: #572d7b;
  --nmca-ink: #252525;
  --brass: #c6923e;
  --burnt-sienna: #a95532;
  --sage: #6f8758;
  --blue-green: #3e746c;
  --wine: #7e3f4d;
  --danger: #b84a48;

  --radius-card: 28px;
  --radius-pill: 999px;
}

:root, [data-theme='dark'] {
  --app-bg: #12100e;
  --app-bg-2: #18151b;
  --surface: #241a13;
  --surface-paper: #f4e7d1;
  --surface-paper-soft: #fff7e7;
  --text-primary: #f8eedf;
  --text-secondary: #b9a98e;
  --text-on-paper: #2e2117;
  --border-subtle: rgba(248, 238, 223, 0.16);
}

[data-theme='light'] {
  --app-bg: #fffdf8;
  --app-bg-2: #f3eadc;
  --surface: #ffffff;
  --surface-paper: #fff7e7;
  --surface-paper-soft: #ffffff;
  --text-primary: #252525;
  --text-secondary: #655a50;
  --text-on-paper: #252525;
  --accent-primary: #572d7b;
  --border-subtle: rgba(87, 45, 123, 0.14);
}
```

Usage rules:
- Dark mode: rehearsal-studio shell with warm paper objects and stage-light glow.
- Light mode: NMCA-informed studio daylight — white/cream, charcoal text, restrained purple accents, warm paper cards, and human warmth. Avoid plain white Google Form surfaces even though Chekhov.net itself uses a clean white base.
- Primary CTA: brass/sienna or sage depending on state; avoid default Ionic blue/purple.
- Locked/started state: sage with a warm check/lock treatment in both themes.
- Preview state: brass glow, not warning yellow.
- Error state: wine/danger, with text/icon, not color alone.
- Family colors may remain varied, but mute them into a theatrical palette in both themes.
- Settings must expose `Appearance: System / Light / Dark` and persist it in local storage.

Avoid:
- Purple-gradient AI aesthetic.
- Beige full-page document background in light mode.
- Dark-only implementation.
- Default Ionic black toolbar plus unthemed white cards.
- Red/green-only state semantics.

## 3. Typography

Use a characterful serif for ritual/product moments and a clean readable sans for controls and body. Current Georgia gives warmth but becomes document-heavy when used everywhere.

Recommended pairings:
- Display: Fraunces, Cormorant Garamond, or a similarly warm serif.
- Body/UI: Source Sans 3, IBM Plex Sans, Atkinson Hyperlegible, or Avenir Next.

Scale:
- H1 mobile: 34–42px, line-height 0.98–1.06.
- H2: 24–30px.
- Route/card title: 18–22px.
- Body: 16px minimum.
- Kicker/chip: 11–12px uppercase, letter-spaced.

Rules:
- One hero H1 per screen.
- Use concise app copy; no paragraph block above primary actions.
- Use serif only for titles, tool names, and ritual cards; use sans for form fields, buttons, chips, metadata, and nav.
- Replace technical labels such as “Supabase Auth” in primary UX with actor-facing labels such as “Tester access.”

## 4. Spacing & Grid

Design mobile-first at 390px and verify at 320px, 768px, 1024px, and desktop.

Shell:
- Use safe-area padding for iOS PWA top/bottom.
- Main scroll should account for persistent bottom tabs.
- Chart first viewport at 390px must show: top status, CircleChart quick access, basic category/tool cards, Library deep links, emphasized center Chart tab, and bottom nav. Journal first viewport must show Today’s Practice / POA when active.

Spacing scale:
- 4, 8, 12, 16, 20, 24, 32, 40.
- Cards: 20–24px mobile padding, 24–32px tablet/desktop.
- Screen gutters: 16px mobile, 20–24px tablet, centered max width for large screens.
- Route card gap: 10–12px mobile.

Layout principle:
- Replace the single long “Google Form” scroll with an app shell using Dawson’s tab order: Library / Journal / Chart / Map / Settings.
- `Chart` is the center/default tab and owns quick access to the Chart of Inspired Action: the chart itself, categories, and the most basic tool information. Chart cards can link into `Library` for deeper resources.
- `Journal` owns Today’s Practice / POA: daily practice, preview/start/locked state, POA notes, and history.
- `Library` owns content-rich source/tool material, approved excerpts, references, saved/recent items, and deeper resource pages.
- `Map` is future-facing location/events infrastructure: studios/teachers near the user and upcoming events/calendar. It is not curriculum, not Today’s Practice, and not a learning-path sequence.
- `Settings` owns tester access, theme, beta/security details, attribution, feedback, and build/version.
- Keep the active daily practice short and stateful inside Journal/POA; keep Chart quick; move full resources into Library and future geo/events into Map.

## 5. Layout & Composition

Primary navigation:
- Bottom tabs, left to right: `Library`, `Journal`, `Chart`, `Map`, `Settings`.
- Default route: `/chart`. The center tab should feel visually primary/signature, not merely one of five equal icons.
- Preferred visible labels for mobile width: `Library`, `Journal`, `Chart`, `Map`, `Settings`. Use `Toolkit` and `Calendar` as screen subtitles or secondary labels, not slash labels in the tab bar.
- Center `Chart` tab treatment: larger circular/sigil-style tab button, raised 4–8px above the bar, subtle brass/purple accent ring, and selected-state glow. Keep it accessible: visible label, 44px+ target, no motion-only indication.
- `Journal` is the daily-practice home: Today’s Practice, Daily Tool, Pick My Own/Draw Random, preview/start/locked state, POA, and practice history.
- `Chart` is quick access to the Chart of Inspired Action / Toolkit basics. Each chart/category/tool card may link to Library for the deep resource page.
- `Map` is location/events: studios/teachers near you and upcoming events/calendar. It must not imply curriculum, levels, or practice progression.
- `Settings` contains account/tester access, appearance, beta/security details, attribution/about, feedback, and build/version.
- Account/avatar chip can still appear in the top right as a shortcut into Settings.

Journal / Today’s Practice states:
1. Signed out / tester access needed.
2. Signed in, no practice selected.
3. Practice preview selected.
4. Practice started / locked.
5. POA saved / return path.

Default Chart first viewport redesign:
- Top status row: app name, `Private beta`, account/sign-in chip.
- Signature CircleChart / Chart of Inspired Action quick-access object.
- Category/tool cards with basic information only.
- Each card has a clear `Open in Library` / `Learn more` link for deeper source/resource material.
- A small Journal CTA can say `Start today’s POA` or `Return to today’s practice`, but Today’s Practice itself lives in Journal/POA.
- Bottom tabs always visible with the center Chart tab visually emphasized.

Library screen:
- Browsable source/tool material: source cards, approved excerpts when available, parent tools, search/filter, and saved/recent items.
- Must remain source-grounded; do not invent teaching content.

Journal screen:
- Today return banner if a practice is active.
- Timeline of Daily Practice cards: date, tool, source, POA saved status, reopen action.
- Actor-notebook visual treatment: paper cards, date stamps, subtle ruled line texture.

Chart / Toolkit screen:
- Full CircleChart as the visual centerpiece and default landing tab.
- Quick-access category/tool basics: name, family, one-line neutral description/metadata when available, selected/saved state.
- Family chips/filters.
- Category cards or compact directory; each card can link into Library for deep resources.
- Category detail appears as a bottom sheet.
- Avoid overloading Chart with content-rich explanations; that belongs in Library.

Map / Calendar screen:
- Future location/events surface: studios/teachers near you and upcoming events/calendar.
- For beta, Map should be a polished `Coming soon` surface unless real location/events data is explicitly approved and available.
- It must not be a curriculum, learning path, level map, or Today’s Practice home.

Settings screen:
- Tester account/sign out.
- Appearance: System / Light / Dark.
- Beta security/data details behind disclosure.
- Attribution/about.
- Feedback form and build/version notes.

## 6. Components

Core app shell:
- `AppShell`
- `TopStatusBar`
- `BottomTabs`
- `BetaStatusChip`
- `AccountAvatarButton`

Journal / Today components:
- `JournalPage`
- `TodayPracticeCard`
- `PracticeRouteCard`
- `PracticeRouteGrid`
- `PracticePreviewSheet`
- `StartedPracticeCard`
- `POAJournalCard`
- `PracticeHistoryCard`
- `ReturnToTodayBanner`
- `FeedbackNudge`

Library components:
- `LibraryPage`
- `LibrarySearchBar`
- `SourceCard`
- `ToolShelfCard`
- `SavedToolCard`

Chart / Toolkit components:
- `ChartPage`
- `CenterChartTabButton`
- `CircleChartCard`
- `CategoryNode`
- `CategoryFamilyFilter`
- `CategoryDirectoryCard`
- `CategoryDetailSheet`
- `ToolFilterPill`
- `LibraryDeepLink`
- `SourceAttributionBar`

Map / Settings components:
- `MapPage`
- `TeacherStudioMapPlaceholder`
- `EventsCalendarPreview`
- `SettingsPage`
- `TesterAccessSheet`
- `AppearanceSelector`
- `BetaDetailsDisclosure`
- `AttributionCard`

Component rules:
- Route cards are tappable objects, not small buttons.
- Preview is an elevated card or bottom sheet with one clear primary commitment CTA.
- Auth is a sheet/gate at the action moment, not a technical card above the product.
- POA uses sectioned notebook fields (`Practice`, `Observe`, `Apply`, optional reflection), not one generic textarea as the default final form.
- Feedback is a nudge/modal or Settings feature, not another large Chart or Journal card.

## 7. Motion & Interaction

Motion should feel like a quiet rehearsal-room ritual, not game confetti.

Use:
- Route transition: subtle slide/fade between tabs.
- Chart node tap: scale/glow, 150–200ms.
- Preview sheet: bottom-up entrance, spring-light but restrained.
- Start Today’s Practice: warm lock pulse/checkmark, then route to POA state.
- Save POA: small “Saved” stamp/check, maybe a date/time chip.
- Skeleton loading for cloud/session states.

Respect:
- `prefers-reduced-motion`.
- 44px touch targets.
- Visible focus states.
- Keyboard behavior for auth and POA fields.

Avoid:
- Confetti, bouncing mascots, noisy game rewards.
- Motion on every element.
- Hidden state changes that are not announced to screen readers.

## 8. Voice & Brand

Voice: warm, spare, official, actor-centered.

Preferred copy:
- “Private beta” over “Secure tester beta” in primary UX.
- “Tester access” over “Supabase Auth.”
- “Choose one tool for today’s work.”
- “Begin when you’re ready; return to POA throughout the day.”
- “Source-backed taxonomy label. No generated practice prompt.”
- “Saved to your tester account.”

Keep attribution visible, but not dominant in the main flow:
- Short attribution in Toolkit/chart context.
- Full attribution in Beta/About.

Guardrails:
- Do not use “Chekhov’s Hired Gun” in public/beta branding.
- Do not invent embodied practice instructions.
- Do not imply official curriculum sequence unless explicitly approved.
- Do not claim secure beta unless auth/RLS/user-owned persistence has been verified.

## 9. Anti-patterns

Do not ship:
- A first viewport where Supabase, env vars, RLS, or setup copy is more prominent than Today’s Practice.
- Rows of disabled Ionic buttons as the main first impression.
- Long explanatory paragraphs before the first action.
- Beige full-page document layout with stacked white form cards.
- A generic wellness dashboard or a childish Duolingo clone.
- Mascots, XP, coins, streaks, leaderboards, social likes, or influencer feed energy.
- AI-generated embodied Michael Chekhov prompts.
- “Path” or “Map” language that implies an approved curriculum. Map is for location/events, not learning progression.
- Technical security copy hidden entirely; it must remain accessible in Settings.
- Dark UI with insufficient contrast.
- Light mode that becomes a flat white form or loses the Studio Ritual atmosphere.
- A five-tab bar with labels so long that it wraps, truncates badly, or becomes hard to tap.
- App-store/native rewrite decisions triggered only by Kotlin/Jetpack Compose inspiration. Use Kotlin/Compose templates as pattern references — scaffold, bottom nav, cards, sheets, Material motion — not as a reason to abandon the current Ionic Vue beta lane.
