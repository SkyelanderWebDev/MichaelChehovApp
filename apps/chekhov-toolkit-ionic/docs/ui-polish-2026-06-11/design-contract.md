# UI Polish Design Contract — 2026-06-11

## Goal and target artifact

Goal: turn the current Chekhov Toolkit secure beta from a form-like technical test surface into a polished mobile learning/practice app while preserving the approved private-beta, NMCA/Lisa Dalton, source-grounded constraints.

Target artifact: an Ionic Vue / PWA app redesign plan for `apps/chekhov-toolkit-ionic`, focused on app shell, Today’s Practice, Toolkit/chart browsing, POA journaling, and beta/profile surfaces.

Audience:
- Primary: Dawson/Lisa phone-testing path on iPhone.
- Secondary: secure beta testers, actors/directors/teachers/students using Michael Chekhov practice.
- Implementation agents working in the existing repo.

## Evidence used

| Evidence | Confidence | Notes |
|---|---:|---|
| Current repo source: `HomePage.vue`, `AuthPanel.vue`, `CircleChart.vue`, `ToolPreviewCard.vue`, `DailyActionCard.vue` | observed | Current UI is a stack of warm cards, auth/setup card, route buttons, CircleChart, preview/POA/feedback cards. |
| Current local browser screenshot at `http://127.0.0.1:5177/home` | observed | First viewport shows black Ionic toolbar, beige background, white cards, technical auth setup, disabled controls. |
| User-provided screenshot: Duolingo/chess-style learning path | observed | Dark immersive shell, top status resources, large unit card, vertical lesson nodes, start bubble, mascot, bottom nav. |
| User-provided screenshot: classroom/monster app | observed | Dark navy/purple shell, tabs, filter pills, avatar/object grid, score pills, floating add, bottom nav. |
| User-provided screenshot: Instagram dark feed | observed | Familiar mobile shell, stories rail, feed card rhythm, bottom navigation, creator/context header. |
| Project guardrails from `CLAUDE.md` and `AGENTS.md` | observed | Official/private beta; no AI-generated embodied prompts; attribution required; phone testing; don’t deploy/share without approval. |
| User comment: “UI/UX feels like a google form, not a fully launched app” | provided | Direct problem statement. |
| Kotlin stock app builds may be useful | provided | Treat as inspiration for app patterns, not platform migration. |
| Need for mature, actor-centered learning-app feel | inferred | Based on product context, references, and guardrails. |

## Keep / change / do not copy

### Reference 1: Duolingo/chess learning path

Keep:
- App shell discipline: top status, bottom nav, primary unit card.
- Guided path/node model for daily progress or practice continuity.
- Clear active node / locked node / start state.
- One obvious primary action.

Change:
- Replace game/curriculum tone with rehearsal ritual language.
- Replace bright cartoon palette with dark studio + warm paper.
- Use “practice continuity” rather than XP/levels unless official curriculum is approved.

Do not copy:
- Mascot character.
- Childish saturation.
- Currency/XP economy.
- Exact path artwork or Duolingo visual identity.

### Reference 2: classroom/monster app

Keep:
- Dark immersive shell.
- Strong bottom navigation.
- Object-grid scanning and score/status pills.
- Horizontal tabs/chips for categories/filters.
- Floating or prominent primary action only where truly needed.

Change:
- Replace avatar monsters with chart families, practice cards, and POA entries.
- Use actor-studio density rather than classroom game density.
- Use status pills for saved/locked/private beta/source, not classroom scores.

Do not copy:
- Monster avatars.
- Child/student reward language.
- Purple toy-app styling.
- Exact iconography/layout.

### Reference 3: Instagram dark feed

Keep:
- Familiar dark mobile shell.
- Top rail concept for quick access / recent tools / today status.
- Feed/card rhythm for Journal or source cards.
- Bottom nav affordance and clear active tab.

Change:
- Make the app private and contemplative, not public/social.
- Replace stories/creator feed with recent practice/source cards.
- Keep the user’s attention on practice, not scrolling.

Do not copy:
- Social vanity metrics, likes, comments, public feed tone.
- Instagram logo/brand style.
- Influencer content framing.

## Final design stance

**Studio Ritual**: The Michael Chekhov Toolkit should feel like a private rehearsal-room companion — warm, tactile, source-grounded, phone-native, and beautiful in both light and dark mode — where the user chooses one tool for today, locks it, and returns to POA, instead of filling out a technical beta form.

## Primary UX decision

Use Dawson’s tab order: `Library`, `Journal`, `Chart`, `Map`, `Settings`. Make `Chart` the default/center landing tab and visual anchor. `Journal` owns Today’s Practice / POA. `Map` is future location/events infrastructure for studios/teachers near the user and upcoming events/calendar, not curriculum. Move technical beta/auth/security details out of the primary practice flow into Settings. The first Chart viewport must show product identity and quick access, not Supabase setup.

## Architecture decision

Use the existing Ionic Vue / PWA lane. Kotlin/Jetpack Compose stock builds are useful references for scaffolds, bottom nav, sheets, cards, and Material motion patterns, but the current beta should not be rewritten to Kotlin just for polish. The fastest path is to bring those app-shell patterns into Ionic Vue.

## Risks and explicit unknowns

| Risk / unknown | Impact | Mitigation |
|---|---:|---|
| Over-gamification makes Chekhov practice feel childish. | High | Use ritual/progress, not XP, coins, mascots, streaks, or leaderboard language. |
| `Map/Calendar` can be mistaken for curriculum/path progression. | High | Define Map strictly as location/events: studios/teachers near you and upcoming events/calendar. No levels, no curriculum, no Today’s Practice ownership. |
| Redesign tempts generated practice prompts. | High | Use taxonomy labels, POA structure, approved/sourced excerpts only. No generated embodied prompts. |
| Hiding auth/security too much confuses beta testers. | Medium | Warm tester-access gate at action moment; full security/data details in Settings. |
| Dual light/dark theming can double the QA surface and create one ugly/unreadable mode. | Medium | Implement semantic tokens, Settings appearance selector, screenshots for both modes, contrast audit, 16px body, 44px touch targets, reduced-motion support, visible focus. Use Chekhov.net/NMCA cues for light mode: white/cream, charcoal text, restrained purple accent, warm human tone. |
| CircleChart density overwhelms mobile. | Medium | Chart is the default/center tab, but it should stay quick-access: chart, categories, basic info, bottom sheets, and links to Library for depth. |
| Existing Supabase misconfiguration state currently dominates first viewport. | Medium | Replace with warm `Tester access required` sheet; keep technical setup details in Settings. |
| Fable/Claude Code lane unavailable during this planning pass due 401 auth. | Low | GPT-5.5 controller and independent reviewer produced the plan; rerun Fable after Claude auth is fixed if needed. |

## Quality gate checklist

Before implementation is accepted:
- [ ] At 390px width, Chart first viewport shows top status, CircleChart/Chart of Inspired Action quick access, basic category/tool information, and bottom nav.
- [ ] `/home` redirects to `/chart`; Chart is the center/default tab.
- [ ] Bottom tabs appear left-to-right as Library / Journal / Chart / Map / Settings.
- [ ] Supabase/RLS/env var copy is not visible in Chart or Journal first viewport.
- [ ] Auth remains accessible through tester-access sheet/account/Settings surface.
- [ ] Settings includes Appearance: System / Light / Dark, persists user choice, and both themes pass visual/contrast smoke.
- [ ] `Pick My Own`, `Draw Random`, and `Daily Tool` are route cards, not a disabled button row.
- [ ] Preview/change/re-roll/start states are visually distinct.
- [ ] Started/locked state feels intentional and points to POA.
- [ ] Center Chart tab is visually emphasized while remaining accessible; CircleChart appears as the signature quick-access object with Library deep links.
- [ ] POA feels like an actor notebook/ritual, not a generic textarea-only form.
- [ ] Full attribution is visible in Settings/About and chart context before external review.
- [ ] No AI-generated embodied practice prompts are introduced.
- [ ] `npm run build` passes in `apps/chekhov-toolkit-ionic` after code changes.
- [ ] Mobile-width browser smoke passes; real iPhone smoke before Lisa/NMCA review.
