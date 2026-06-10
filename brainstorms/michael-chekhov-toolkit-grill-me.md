# Grill Me Capture: The Michael Chekhov Toolkit

## Session Metadata
- Date: 2026-06-04 21:18 CDT
- Project/root: `/Users/dawson/Documents/Claude/Projects/Michael Chekhov App`
- User goal: Prepare a rigorous `/grill-me` workflow, dual-brain/council review, and Claude Code/Codex handoff plan so the next 24 hours can produce a real Michael Chekhov app deliverable.
- Current confidence: 98% ready for implementation handoff. Ionic Vue + Capacitor, Supabase backend/auth, cloud-managed hosting, free-first summer beta, weekend Lisa pilot scope, June 13 secure beta bar, closed-beta Library risk posture, Global Daily Tool staging, Lisa/NMCA attribution stance, and first-beta prompt/content rule are approved. Remaining live question is the Codex verification contract.
- Status: active

## Executive Summary
The project is already a working React/Vite/Express/SQLite prototype, not a blank-slate build. It has the core Chart of Inspired Action taxonomy, radial category wheel, random draw, reveal card, Flyback journal, structured/journal POA modal, history panel, local SQLite persistence, and a patched macOS-friendly full-stack dev bind in the existing dirty diff.

The right next move is not to start a Vue/Nuxt rewrite blindly. The right next move is to run Grill Me against the high-leverage uncertainties surfaced by the council: Daily Practice ownership/locking, Lisa's exact phone demo path, NMCA/Lisa attribution wording, whether Phase 2 is React PWA/Capacitor or Vue/Nuxt, and how to keep the app from becoming an oracle-card novelty rather than an embodied practice tool.

Live Grill Me decision: the final product should be organized around one tool per practitioner per day. In the mature app, a morning notification prompts the practitioner to choose one of three daily entry paths: pick their own tool, draw a random tool, or opt into the shared global "Daily Tool" practiced in tandem with practitioners around the world. POA should attach to that daily practice choice rather than behaving like a free-floating date-only journal.

## Key Decisions
- Product name: **The Michael Chekhov Toolkit**.
  - Rationale: user explicitly chose this name; safer than "Chekhov's Hired Gun" and clearer than generic "Actor's Toolkit".
  - Confidence: 100% user-approved.
- Build both reusable workflows:
  - Hermes skill: `grill-me`.
  - Claude Code project slash command: `.claude/commands/grill-me.md`.
  - Rationale: Hermes can run the interview now; Claude Code can use the same method inside the repo later.
  - Confidence: 100% user-approved.
- Preserve existing dirty WIP.
  - Rationale: user confirmed current modified files are probably work-in-progress and should be kept.
  - Confidence: 100% user-approved.
- Treat the current app as a prototype needing review/handoff, not as a greenfield build.
  - Rationale: code audit + build/smoke show substantial functionality already exists.
  - Confidence: 95%.
- Final product ritual: one tool per practitioner per day.
  - Rationale: user defined the intended mature loop as a morning notification with three choices: pick own, random draw, or shared global Daily Tool.
  - Confidence: 95%; exact lock/re-draw behavior still needs one follow-up.
- POA ownership should be Daily Practice-centered, not date-only.
  - Rationale: the date matters, but the semantic owner is the user's chosen tool for that practice day, with source = self-selected | random | global-daily.
  - Confidence: 90%; implementation details pending.
- Daily tool lock behavior: preview/re-roll/change until `Start Today’s Practice`, then lock for the day after start/save.
  - Rationale: preserves one-tool-per-day ritual while avoiding punitive accidental first taps.
  - Confidence: 100% user-approved.
- Lisa demo context: Lisa has already seen the April React prototype.
  - Rationale: user reported Lisa played with it for ~5 minutes on phone and ~15 minutes on laptop.
  - Confidence: 100% user-reported.
  - Implication: the next demo must emphasize what is new/improved, not merely prove the app opens.
- POA placement: keep the POA where Lisa already likes it unless implementation requires light adaptation.
  - Rationale: user said Lisa likes the POA where it is.
  - Confidence: 90%; exact UI copy/entry wrapper can adapt to Vue without relocating the POA as the main visible change.
- Pilot and demo timeline.
  - Rationale: user wants Lisa to test a pilot Saturday/Sunday, then lead an hour-long group demonstration on June 13 for summer use/testing.
  - Confidence: 95% user-stated.
- Nine-day readiness ambition.
  - Rationale: user wants to show, definitely within 9 days, desktop/iOS/Android readiness with logins, profiles, and security. The group/certified actors/teachers should be able to use it as closely as possible as if it were an App Store app during testing.
  - Confidence: 95% as product goal.
  - Delivery definition: app-like beta usage and feedback loop by June 13; final product target by August 1; store approval is not necessarily the June 13 bar.
- Approved build path: Ionic Vue + Capacitor with hosted PWA fallback.
  - Rationale: this best matches app-like iOS/Android beta testing while preserving Vue direction and web access fallback.
  - Confidence: 100% user-approved.
  - Implication: existing React prototype becomes functional reference/source of behavior, not the production app foundation.
- Hosting strategy default: cloud-managed backend for beta/production, not Dawson’s Mac as the primary host.
  - Rationale: app-like beta testing with logins/security needs reliable uptime, TLS, auth email flows, backups, and database access controls.
  - Confidence: 90%; self-hosting can be a later/optional advanced control lane.
  - Scale model: start managed PaaS/Supabase/edge hosting, then move to VPS/dedicated/self-hosted only if economics/control justify it.
- Cost posture: free-first for summer beta where possible.
  - Rationale: user wants to avoid paying for managed backend/hosting during summer if possible. Current official pages show Supabase Free ($0/mo; 50k MAU; 500MB DB) and free web/PWA hosting options; Apple TestFlight/App Store distribution requires Apple Developer Program ($99/year).
  - Confidence: 90%; pricing can change and exact provider limits must be rechecked at setup.
  - Implication: default to PWA/home-screen install for free iOS/Android access; pay only if TestFlight/Play internal testing becomes necessary.
- Free-first summer beta rule approved.
  - Rationale: user agreed to use free tiers and avoid paid Apple/Google/Ionic/hosting upgrades unless a specific testing/trust reason appears.
  - Confidence: 100% user-approved.
- Supabase approved as default auth/profile/database provider.
  - Rationale: user accepted the recommended Supabase Auth + Postgres + Row Level Security model for fastest credible secure beta.
  - Confidence: 100% user-approved.
  - Implication: handoff should include RLS-first schema design for profiles, daily practices, POA entries, library items, and feedback.
- Weekend Lisa pilot scope approved.
  - Rationale: user said the dual-brain cut line answers the previous Grill Me question.
  - Confidence: 100% user-approved.
  - Weekend must include: Ionic Vue/PWA vertical slice, official product name, visible NMCA/Lisa attribution, Today’s Practice wrapper, Start Today’s Practice lock, POA save/return where Lisa likes it, hosted free/private PWA access if feasible, real iPhone smoke, and a short “what’s new since April” demo script.
  - Weekend explicitly defers: full auth, global push/notification infrastructure, paid library/content system, real global Daily Tool scheduler/admin CMS, and native store/TestFlight/Play distribution unless a trust/testing blocker appears.
- June 13 secure beta bar approved, with a Pareto-Skeleton Library added.
  - Rationale: user approved the recommended June 13 beta scope and added that the Library should have a minimal-but-real skeleton, including at least one paragraph/excerpt from Lisa’s book or Michael Chekhov material if permissions/source allow.
  - Confidence: 100% on product intent; 80–90% on exact content until source/rights are confirmed.
  - June 13 must include: Supabase Auth/profiles/Postgres/RLS, hosted installable PWA, per-user Daily Practice by local date, POA tied to Daily Practice, Today return path, basic History, onboarding/tester instructions, in-app feedback, mobile/a11y smoke, and a minimal Library skeleton.
  - Library skeleton default: read-only Library tab with a few curated resource cards, quote/excerpt scaffolding, source citation fields, and one approved excerpt/paragraph from Lisa or Michael Chekhov material.
  - Deep research lane: user may initiate Claude Code deep research overnight/tomorrow morning on Michael Chekhov databases and books; implementation handoff should leave a clean slot for that research output to populate the Library seed.
- Closed-beta Library risk posture approved for June 13.
  - Rationale: user is nearly positive Michael Chekhov material entered public domain last year and is comfortable being somewhat aggressive for this closed group while solidifying rights by August.
  - Confidence: 95% on user risk tolerance; legal/source status still requires verification before public/final release.
  - Implementation stance: for closed June 13 beta, allow limited excerpts/paragraphs from Michael Chekhov material with prominent citations and internal-beta/source-under-review labeling; do not present rights as conclusively cleared until researched.
  - Lisa/NMCA material stance: prefer user-provided or Lisa/NMCA-approved excerpts; if used before explicit approval, keep limited, cited, and closed-beta only.
  - August gate: before public launch/final product, run a rights/source audit and replace/trim anything not permissioned, public-domain, licensed, or approved.
- Global Daily Tool / notification staging approved.
  - Rationale: user approved modeling the Global Daily Tool now while keeping real push notifications, admin CMS, and timezone-heavy scheduling out of the June 13 critical path.
  - Confidence: 100% user-approved.
  - Weekend stance: show Daily Tool as one of the three entry choices, using a fixed seeded or deterministic local tool if needed.
  - June 13 stance: make Global Daily Tool product-real in user flow and data model (`source = global_daily`, date, tool id, optional seed/admin metadata), but operationally simple/manual/seeded.
  - Deferred: true push notifications, real worldwide scheduler, admin CMS, and timezone-complex automation.
- Lisa/NMCA attribution stance approved.
  - Rationale: user approved the official-but-not-overclaiming attribution stance and noted Lisa sanctioned the original project; user can ask Lisa directly this weekend if wording needs adjustment.
  - Confidence: 100% user-approved for beta; wording can be refined after Lisa feedback.
  - App/About/footer default: “The Michael Chekhov Toolkit is a private beta practice app inspired by the Chart of Inspired Action from the National Michael Chekhov Association and Lisa Dalton. Built for actor training, rehearsal, and daily Michael Chekhov practice.”
  - Attribution/copyright default: “Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.”
  - Library/source-card default: “Source: Michael Chekhov / Lisa Dalton / NMCA. Excerpt and citation included for private beta study; source and rights review in progress for public release.”
- First beta avoids AI-generated embodied prompts.
  - Rationale: user prefers the first beta to use sourced excerpts plus POA structure rather than AI-generated embodied teaching prompts.
  - Confidence: 100% user-approved.
  - Implementation stance: keep POA scaffolding and tool taxonomy; include sourced/cited excerpts only; do not invent or generate embodied prompts for the beta.
  - If adaptation text is necessary for UI clarity, keep it purely navigational/microcopy and do not frame it as Michael Chekhov, Lisa, or NMCA teaching.
- Library/paid-content direction is the second highest leverage lane.
  - Rationale: user wants beginnings of library: Lisa YouTube links, daily quote catalog, Chekhov books/lectures/databases, and later paid deeper material such as Wil Kilroy improv ideas.
  - Confidence: 90%; content rights/access tiers need later decisions.
- Platform priority revised: Vue/Nuxt build is now the highest-leverage delivery signal.
  - Rationale: user clarified Lisa has already seen the React prototype; the major proof of progress is a Vue-built pilot that can credibly move toward desktop, iOS, and Android readiness.
  - Confidence: 95% user-stated; exact Nuxt/PWA/Capacitor/native packaging target pending.
  - Historical note: earlier council default was to avoid an unforced rewrite, but that default is superseded by user/stakeholder strategy.

## Design Tree / Coverage Map
- Users & stakeholders:
  - Lisa Dalton / NMCA: official stakeholder; has already tested April React prototype and now needs a pilot suitable for weekend feedback.
  - Actors: want low-friction embodied practice and rehearsal/audition usefulness.
  - Directors: want rehearsal prompts, possible pinned-tool/session mode.
  - Middle/high school theatre teachers: need safety, clarity, time-boxing, novice scaffolding, group/presentation use.
  - Undergraduate/graduate students/professors: need learnability, source integrity, outcomes, possible export.
- Jobs to be done:
  - Begin the day from a notification or app open with one Chekhov practice choice.
  - Choose today's tool via: pick own tool, random draw, or opt-in shared global Daily Tool.
  - Turn the chosen/drawn tool into an embodied practice, not just a name reveal.
  - Record Practice/Observe/Apply notes for that day's tool.
  - Let a teacher/director/student use the tool in rehearsal/class/homework.
- Success criteria:
  - Lisa can test a Vue-built Ionic/PWA pilot Saturday/Sunday and see credible progress beyond the April React prototype: official name/attribution, Today’s Practice ritual, Start Today’s Practice lock, POA save/return, hosted/private access, and real iPhone smoke.
  - Tool draw persists to SQLite; POA entry persists and can be retrieved after reload.
  - NMCA attribution is visible before any external share.
  - Interface is usable at phone width with touch targets and accessible labels.
  - The next Claude Code/Codex handoff has bounded tasks with acceptance checks.
  - By the June 13 group demo, the project can truthfully claim secure tester-ready beta status: hosted installable PWA, desktop/mobile usability, Supabase Auth/profiles/RLS, persisted per-user Daily Practice/POA, onboarding/feedback, and a Pareto-Skeleton Library with approved/cited seed material.
- Scope / non-goals for the immediate Grill Me prep:
  - No deploy without explicit approval.
  - No taxonomy edits without NMCA/Lisa approval.
  - No Vue/Nuxt rewrite until platform decision is clarified.
  - No public/client-facing naming beyond "The Michael Chekhov Toolkit".
- Domain model:
  - `toolData.ts`: category → parent tool → children/examples; includes family/energyFlow and hasScale.
  - `daily_practices` or equivalent should become the mature semantic owner: local date + selected tool + source (`self-selected`, `random`, `global-daily`) + status/lock state.
  - `drawn_tools`: current prototype draw persistence; may become one source/type of Daily Practice or remain as draw history.
  - `journal_entries`: POA entries should attach to the chosen Daily Practice/tool-day, not float by date alone.
- User flows:
  - Current: open → select categories → draw → reveal → Flyback or Begin POA → save notes → history.
  - Needed Grill Me focus: Lisa 60-second demo path; return-to-POA path; one-tool daily practice path; possible classroom presentation path.
- Data/state:
  - SQLite local DB works in smoke test.
  - Current POA route model supports entries by drawnToolId, but `getJournalEntryByDate` suggests date-only assumptions and should be fixed toward a Daily Practice/tool-day model.
  - Mature app needs notification/global Daily Tool infrastructure later; immediate prototype can model the choice locally without push/account/global sync.
- UX/accessibility/mobile:
  - Visible desktop layout works but title still says "Actor's Toolkit".
  - Draw button can sit below fold on desktop when right drawer is open.
  - Wheel checkbox/toggle controls need labels/pressed states and bigger touch targets.
  - Reveal overlay is ad-hoc; should become accessible Dialog/focus trap.
- Technical architecture:
  - React 18 + Vite + Tailwind + shadcn/Radix + Express + Drizzle + better-sqlite3.
  - User has now insisted that Vue/Nuxt delivery is the highest-leverage signal; architecture should be planned around Vue/Nuxt plus a credible desktop/iOS/Android route.
- Testing/verification:
  - `npm run check` passed.
  - `npm run build` passed with Browserslist/PostCSS warnings.
  - Full-stack dev server served `GET /api/drawn-tools` 200.
  - Browser smoke completed select all → draw → Begin POA → save practice note → reload/history persisted; smoke DB rows were then cleaned.
- Handoff needs:
  - Claude Code: product/UX integration tasks after Grill Me.
  - Codex: bounded verification/diff review/check/build/API smoke after Claude Code changes.
- Risks/blind spots:
  - Missing NMCA/Lisa attribution in UI.
  - POA temporal model ambiguity.
  - Stale CLAUDE.md known-issues table relative to current dirty diff.
  - No automated tests.
  - Real iPhone verification not yet done.

## Q&A Log

### Q1: What should the app be called?
Recommended answer/default: Use "The Michael Chekhov Toolkit". It is clear, official-sounding, and avoids the warmer-brand conflict around "Chekhov's Hired Gun".
User answer: "Let's call the app 'The Michael Chekhov Toolkit'."
Extracted decisions/context: All new workflow/handoff docs use this name. The current UI still says "Actor's Toolkit" and should be renamed after Grill Me or in the first bounded implementation lane.
Open follow-ups: Exact UI/footer/about attribution wording still needs NMCA/Lisa confirmation.

### Q2: Should we create both the Hermes skill and Claude Code command?
Recommended answer/default: Yes, create both.
User answer: "Both is fine."
Extracted decisions/context: Created Hermes skill `grill-me` and project slash command `.claude/commands/grill-me.md`.
Open follow-ups: None.

### Q3: Should existing dirty repo work be preserved?
Recommended answer/default: Yes, treat existing dirty work as intentional WIP.
User answer: "Yeah it's probably a work in progress thing. Keep it for now."
Extracted decisions/context: Do not reset, overwrite, or clean existing modified source files. Council/handoff should inspect but preserve.
Open follow-ups: Whether to commit the WIP after Codex verifies remains a later implementation decision.

### Q4: How should we treat the prototype vs Vue/mobile rebuild?
Recommended answer/default: Stress-test the existing prototype first; decide platform during Grill Me rather than starting a rewrite.
User answer: The app is mostly built as a prototype; likely all that remains is building it with Vue for mobile app access/web app accessibility, but Grill Me should clarify.
Extracted decisions/context: Platform decision is a top Grill Me question. Council default is: keep React for next 24h, defer Vue/Nuxt unless Grill Me reveals a non-negotiable reason.
Open follow-ups: React PWA vs React+Capacitor vs Vue/Nuxt.

### Q5: What should the council review feed into?
Recommended answer/default: Use council review to generate the high-leverage ideas and Claude Code/Codex handoff plan.
User answer: Exactly; assist in building the handoff plan with all high-leverage ideas from council review.
Extracted decisions/context: Dual-brain review artifact and handoff seeds are now required deliverables before actual Grill Me starts.
Open follow-ups: None before the Grill Me session.


### Q6: What is the POA temporal model?
Recommended answer/default: one POA entry per `(drawnToolId, date)` pair, so an actor can practice the same drawn tool across multiple days without collisions.
User answer: In the final version, the day begins with a morning ping notification. The practitioner chooses one of three paths: pick their own tool, draw a random tool, or do the shared global “Daily Tool” that practitioners around the world can opt into together. Ideally, it is one tool per day.
Extracted decisions/context:
- The product should be daily-practice-centered: one active tool per practitioner per local day.
- The mature domain object should likely be `DailyPractice` / `ToolOfTheDay`, with source = `self-selected`, `random`, or `global-daily`.
- POA should attach to that daily tool/practice-day, not to a free-floating date-only journal.
- Global Daily Tool, notifications, and worldwide tandem practice are product-important, but likely Phase 2+ infrastructure unless explicitly pulled into the first 24-hour deliverable.
Open follow-ups:
- Does the daily tool lock after first choice/start, or can the practitioner re-draw/change it during the day?
- For the immediate Lisa demo, do we simulate the three-choice daily entry locally or keep the existing draw-first flow and label the future model in the handoff?


### Q7: Once the practitioner chooses today’s tool, should it lock for the day?
Recommended answer/default: Let them preview/re-roll/change their mind until they press something like “Start Today’s Practice.” After that, lock the tool for the day, especially once any POA note is saved.
User answer: “Yes, I like that recommendation.”
Extracted decisions/context:
- The app should avoid punitive accidental selection.
- The daily practice only becomes binding after an intentional commitment action.
- After commitment/save, the day should not become a slot-machine/re-roll loop.
- Implementation should distinguish `previewed`/candidate draw state from `started`/locked Daily Practice state.
Open follow-ups:
- Exact button copy can be decided in implementation; “Start Today’s Practice” is the current default.


### Q8: For Lisa’s next 60-second phone demo, should we show the future daily-practice entry flow, or keep the current draw-first prototype flow?
Recommended answer/default: Show the future daily-practice entry flow as a lightweight Phase 1 wrapper around the existing draw functionality, so Lisa feels the intended product without requiring notifications/accounts/global sync yet.
User answer: Lisa has already seen the React app back in April. She played with it for about 5 minutes on her phone and maybe 15 minutes on her laptop.
Extracted decisions/context:
- This is not Lisa’s first exposure to the prototype.
- A basic “it opens, draws, reveals” demo is insufficient as the main next proof point.
- The next demo should foreground visible progress since April: daily practice ritual, POA completion/return loop, official naming/attribution, mobile polish, and reduced gimmick risk.
Open follow-ups:
- What is the single most important “new thing” Lisa should feel in the next demo?


### Q9: What is the single most important “new thing” Lisa should feel in the next demo?
Recommended answer/default: She should feel that it has become a real daily practice ritual: Choose Today’s Practice → Start Today’s Practice → POA → saved Today/History state.
User answer: Lisa likes the POA where it is. The highest-leverage delivery point is that the app has been built in Vue. User wants Lisa to test the pilot Saturday/Sunday, then wants to lead an hour-long demonstration to a group on June 13 that can use/test it over the summer. User wants to show in 2–3 days, and definitely within 9 days, that the app is desktop, iOS, and Android ready with logins, profiles, and security ready. Secondary leverage: beginnings of a library with Lisa YouTube links, a quote catalog that could power daily notifications, Chekhov books/lectures/databases, and paid deeper material such as Wil Kilroy’s improv ideas.
Extracted decisions/context:
- The earlier “stay React for 24h” engineering default is superseded by the stakeholder/product strategy: Vue/Nuxt build is the visible proof of progress.
- Do not make POA relocation the headline change; preserve the POA affordance Lisa already likes.
- The next handoff must be platform/auth/security-aware, not only UI polish.
- There are two milestones: weekend Lisa pilot, then June 13 group demo/summer testing readiness.
- Library/paid content is strategically important but should likely be scoped as a foundation/placeholder lane after platform/auth baseline unless user says otherwise.
Open follow-ups:
- Define exactly what “desktop, iOS, and Android ready” means for the 9-day window.
- Choose auth/profile/security provider and minimum security bar.
- Decide whether library foundation enters weekend pilot or waits for the June 13 lane.


### Q10: When you say “desktop, iOS, and Android ready” within 9 days, what exact bar do you mean?
Recommended answer/default: Use Nuxt 3/Vue as the canonical app, shipped first as a responsive/installable PWA that works well on desktop, iPhone, and Android browser/home-screen install. If needed for June 13, wrap with Capacitor for iOS/Android internal testing; do not make App Store/Play Store approval the 9-day requirement.
User answer: The group on the call and certified actors/teachers should be able to use it during testing as closely as possible as if it were an app on the App Store. User understands prototyping and wants the final product by August 1. User is impartial to final code, knows Vue can create apps for iOS/Android, and is open to Capacitor if it enables good feedback and usage for ~1.5 months. User wants to know if another way better fulfills the need.
Extracted decisions/context:
- The June 13/summer-testing target is app-store-like beta usage, not necessarily public store approval before June 13.
- August 1 is the true final-product target.
- Stack is a means, not an identity preference; choose the path that best supports rapid app-like testing, security, profiles, and eventual production.
- Capacitor is acceptable if it provides meaningful mobile feedback and usage during the summer beta window.
Open follow-ups:
- Choose the implementation/distribution path: Ionic Vue + Capacitor, Nuxt PWA + Capacitor, Expo/React Native, or stay React/PWA/Capacitor.
- Confirm availability of Apple Developer and Google Play testing accounts if TestFlight/Play testing is required.


### Q11: Should the handoff choose Ionic Vue + Capacitor as the recommended build path for the summer beta, with a hosted PWA fallback?
Recommended answer/default: Yes: Ionic Vue app shell, Capacitor for iOS/Android beta builds, hosted web/PWA fallback, managed auth/profile provider, existing React app used as functional reference, target app-like beta by June 13 and final product by August 1.
User answer: “Yes, that sounds good.”
Extracted decisions/context:
- The production/summer-beta handoff should recommend Ionic Vue + Capacitor.
- A hosted PWA fallback should be included so testers can access the app even if TestFlight/Play testing is delayed or inconvenient.
- Existing React app should be mined for behavior, taxonomy, POA flow, data model lessons, and UI references, not treated as the codebase that must be polished into production.
Open follow-ups:
- Choose managed auth/profile backend.
- Define how much of the Ionic Vue app must exist for the weekend Lisa pilot versus by June 13.


### Q12: Where would this be hosted, and could it be self-hosted on a Mac/Mac mini/OrangePi?
Recommended answer/default: Host the beta/production backend in the cloud with managed services; do not make Dawson’s personal machine the primary host for authenticated summer testers. Use self-hosting only as an optional later/control path or local/staging mirror.
User answer/question: User asked whether this would be hosted on their machine or in the cloud, what it looks like at scale, whether it could conceivably be hosted on a Mac, Mac mini, or OrangePi via ethernet, and how that snowballs at scale. User is okay with self-hosting for now if appropriate, but wants to understand scaling implications.
Extracted decisions/context:
- Hosting/ops architecture needs to be made explicit in the handoff.
- The app should not accidentally become dependent on Dawson’s Mac uptime, home internet, router config, dynamic IP, local backups, and manual security patching if certified teachers are testing it.
- A cloud-managed path better matches logins/profiles/security and app-like beta expectations.
- Self-hosting is technically possible for demos/private/internal use, but becomes an operations burden at exactly the moment user trust matters.
Open follow-ups:
- Choose hosting posture: fully managed cloud, hybrid, or self-host-first.
- Choose provider split if cloud: Supabase + Vercel/Netlify/Cloudflare/Fly/Render/etc.


### Q13: Should the handoff default to managed cloud backend for beta/production, with self-hosting only as an optional later/control path, and can it stay free for summer?
Recommended answer/default: Yes to managed cloud as the default. For costs, use a free-first posture: Supabase Free + free PWA hosting should likely cover a small summer beta; avoid paid native distribution unless TestFlight/Play testing is required.
User answer/question: User agreed managed cloud/self-host-later sounds good and asked whether they do not have to pay for any of that for the summer.
Extracted decisions/context:
- Default hosting posture is approved: managed cloud for beta/prod, self-hosting optional later/control path.
- Cost is a real constraint/preference; handoff should avoid avoidable paid services for the summer.
- Current official pricing checks showed Supabase Free includes $0/mo, 50,000 monthly active users, 500MB database; Cloudflare Pages and Vercel have free/hobby options; Apple Developer Program is $99/year for TestFlight/App Store benefits.
- Free PWA/home-screen install can cover iOS/Android access without App Store/TestFlight fees.
Open follow-ups:
- Is Dawson willing to pay Apple’s $99/year and/or Google Play registration only if true native beta distribution becomes necessary?


### Q14: Should the handoff set a “free-first summer beta” rule?
Recommended answer/default: Yes. Use free tiers for June 13 and summer testing. Do not pay for Apple Developer, Google Play, Ionic Appflow, Vercel Pro, Supabase Pro, or a custom domain unless there is a specific user-trust/testing reason. If testers strongly need true TestFlight-style native installation, Apple’s $99/year may be worth it.
User answer: “Yes, all that looks good.”
Extracted decisions/context:
- Free-first summer beta rule is approved.
- PWA/home-screen install should be the default mobile access path.
- Paid native distribution and paid platform upgrades should be gated by concrete testing/trust need, not assumed.
Open follow-ups:
- None on cost posture; provider/account setup details remain implementation work.


### Q15: Should we use Supabase as the default auth/profile/database provider?
Recommended answer/default: Yes. Use Supabase Auth for login, Supabase Postgres for practice/profile/library data, Row Level Security so each user can only access their own practice records, and Supabase Storage later only if needed for media/assets.
User answer: “Excellent, that looks good.”
Extracted decisions/context:
- Supabase is approved as the default managed backend provider.
- Secure beta model should be RLS-first, not custom auth.
- Likely core tables: `profiles`, `daily_practices`, `poa_entries`, `tool_events`/`drawn_tools`, `library_items`, and `feedback`.
- Access model: user-owned practice data; approved public/read-only library content; admin/facilitator role for global Daily Tool/library management later; no public anonymous writes unless intentionally rate-limited.
Open follow-ups:
- Resolved by Q16/Q17: weekend does not require full login; Supabase auth/profile/RLS is a June 13 lane.


### Interlude after Q15: Dual-brain reprioritization of council review
User request: Before answering weekend pilot scope, user asked for a quick dual-brain review of the council review to identify the highest-leverage ideas possible either for this weekend or by June 13.
Second-brain method: A read-only subagent reviewed `brainstorms/claude-council-review-2026-06-04.md`, `brainstorms/michael-chekhov-toolkit-dual-brain-review.md`, and this live Grill Me capture, using newer user decisions as source of truth.
Extracted synthesis:
- Weekend must prove meaningful evolution from April: Ionic Vue/PWA vertical slice, official naming/attribution, Today’s Practice ritual, Start Today’s Practice lock, POA save/return, and real phone verification.
- June 13 must prove beta readiness, not feature breadth: Supabase Auth/Postgres/RLS, hosted free-first PWA, profiles, secure user-owned practice records, onboarding, feedback capture, and reliable desktop/iOS/Android access.
- Defer anything that does not strengthen trust, embodied pedagogy, app-like readiness, or summer feedback: full store distribution, paid library, real push/global Daily Tool automation, rehearsal timers, exports, classroom mode, and broad taxonomy/prompt expansion without Lisa/NMCA approval.
Recommended cut line:
- Weekend Lisa pilot: Ionic Vue/PWA shell; product name; visible NMCA/Lisa attribution; Today’s Practice wrapper with pick/random/global placeholder; Start Today’s Practice lock; POA where Lisa likes it but attached to today’s practice; hosted private/free PWA access; real iPhone smoke; short “what’s new since April” script; optional simple feedback link.
- June 13 group demo: Supabase Auth/profiles/Postgres/RLS; hosted installable PWA instructions for desktop/iOS/Android; persisted daily practice per user/local day; POA tied to daily practice; history/today return; in-app feedback capture; basic onboarding/tester setup; mobile/a11y pass; optional Capacitor build smoke; optional small read-only Library seed with approved links/resources.
- Defer: full push notifications; real global Daily Tool scheduler/admin CMS; TestFlight/App Store/Play distribution unless a concrete trust need justifies cost; full paid/library content rights system; broad embodied prompt corpus; rehearsal timers; director filters; classroom projector mode; CSV export; streaks; calendar; POA relocation.
Implication for next question:
- The next answer should define weekend scope using this cut line, not by trying to include every council idea.


### Q16: What exactly belongs in the weekend Lisa pilot scope?
Recommended answer/default: Use the dual-brain cut line: Ionic Vue/PWA vertical slice, product name, visible NMCA/Lisa attribution, Today’s Practice wrapper, Start Today’s Practice lock, POA save/return where Lisa likes it, hosted free/private PWA access if feasible, real iPhone smoke, and a short “what’s new since April” script. Defer full auth, global push, paid library, real global scheduler/admin CMS, and native store distribution.
User answer: “Excellent, with this in mind, I think this answers the previous question in the grill me session.”
Extracted decisions/context:
- Weekend Lisa pilot scope is approved as the milestone-appropriate cut line.
- Weekend goal is stakeholder confidence and visible evolution from April, not a complete beta platform.
- Auth/security/profile work remains a June 13 lane, not a weekend blocker, unless implementation can include a minimal Supabase stub without endangering the vertical slice.
- The weekend demo should include a script that explicitly names what changed since April.
Open follow-ups:
- Define the June 13 group-demo/summer-beta scope and acceptance bar.



### Q17: What is the exact June 13 group demo / summer beta bar?
Recommended answer/default: Treat June 13 as secure tester-ready beta, not final product: Supabase Auth/profiles/Postgres/RLS, hosted installable PWA, per-user Daily Practice by local date, POA tied to Daily Practice, Today return path, basic History, onboarding/tester instructions, in-app feedback capture, mobile/a11y smoke pass, real desktop/iPhone/Android verification if possible, optional Capacitor build smoke, and optional small read-only Library seed with approved Lisa/NMCA/Chekhov links.
User answer: Add a Pareto-Skeleton of the Library for June 13, at least with a paragraph pulled from Lisa’s book or Michael Chekhov material. User may initiate a Claude Code deep research lane overnight or tomorrow morning on Michael Chekhov databases and books. Other than that, the recommended June 13 bar looks good.
Extracted decisions/context:
- June 13 scope is approved as secure tester-ready beta, with Library skeleton promoted from optional to included.
- The Library should be minimal but real, not only a placeholder tab.
- The Library skeleton should include source/citation structure from the beginning.
- At least one paragraph/excerpt should be included if source/permission allows; if not, use public-domain/permissioned Michael Chekhov material or a citation/summary until Lisa/NMCA approves exact text.
- Claude Code deep research can be a separate content-ingestion/research lane feeding Library seeds.
Open follow-ups:
- Resolved by Q18 for closed beta; August/public release still requires source/rights audit.



### Q18: What should the first Library excerpt/source rule be?
Recommended answer/default: Build a read-only Library tab with 3–5 cards and quote/excerpt scaffolding. Use actual quoted paragraphs only when Lisa-approved, public-domain, or directly user-provided for this project; otherwise use summaries, citations, and links until the deep-research lane confirms rights and source quality.
User answer: User is nearly positive all Michael Chekhov material entered public domain as of last year. User wants to solidify the rights stance by August, but for the closed June 13 group is comfortable being a little aggressive with usage — “forgiveness over permission in JUST THIS INSTANCE.”
Extracted decisions/context:
- For the closed June 13 beta, limited Chekhov excerpts are acceptable if clearly cited and kept inside the closed tester context.
- Do not overbuild legal/content access systems now; build the Library skeleton and use it to test value.
- Do not publicly claim rights are settled yet; mark source/rights status as under review where appropriate.
- By August/public launch, run a formal rights/source audit and replace any questionable excerpts with permissioned/public-domain/licensed/approved material.
Open follow-ups:
- Choose exact UI attribution/citation language for beta Library cards.



### Q19: How real should the Global Daily Tool / notification system be by June 13?
Recommended answer/default: Model it now and demo it locally, but do not build the full global scheduler/push infrastructure before June 13 unless it becomes surprisingly easy after auth. For weekend, show “Daily Tool” as one of the three choices using a fixed seeded or deterministic local tool. For June 13, include enough schema/user flow to support `source = global_daily`, a selected date, selected tool id, and optional admin/facilitator metadata; populate manually or with seed data. Defer morning push notifications, true worldwide scheduling, admin CMS, and timezone complexity.
User answer: “That looks fine for now.” User also asked to double-check whether the question numbering got off after context compression.
Extracted decisions/context:
- Global Daily Tool should be real in the product model and visible in the user flow by June 13.
- It does not need real push notifications, a true scheduler, or admin CMS by June 13.
- The implementation handoff should keep the schema future-proof without expanding the critical path.
- Numbering/order check requested and performed after checkpointing this answer.
Open follow-ups:
- None on Global Daily Tool staging.



### Q20: What attribution wording should the app use for Lisa/NMCA/Chart of Inspired Action?
Recommended answer/default: Use official-but-not-overclaiming wording in the weekend and June 13 beta. App/About/footer: “The Michael Chekhov Toolkit is a private beta practice app inspired by the Chart of Inspired Action from the National Michael Chekhov Association and Lisa Dalton. Built for actor training, rehearsal, and daily Michael Chekhov practice.” Attribution/copyright line: “Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.” Library/source cards: “Source: Michael Chekhov / Lisa Dalton / NMCA. Excerpt and citation included for private beta study; source and rights review in progress for public release.” Use “used with permission” for Chart/NMCA framing if true from the Lisa/NMCA relationship, and private-beta/source-review wording for Library excerpts until August audit.
User answer: User approved the attribution stance. User can ask Lisa directly this weekend if the wording needs to change, but Lisa sanctioned the original project, so user does not expect an issue.
Extracted decisions/context:
- Attribution wording is approved for weekend and June 13 beta.
- “Used with permission” is acceptable for Chart/NMCA framing in beta.
- Keep the wording easy to adjust after Lisa feedback.
- Library/source-card excerpts still carry private-beta/source-review language until August/public release rights audit.
Open follow-ups:
- Lisa may refine wording this weekend; implementation should make attribution text easy to change in one source-of-truth constant/config.



### Q21: How should we handle embodied prompt text for the weekend and June 13?
Recommended answer/default: Separate “tool taxonomy” from “teaching/prompt language.” For weekend, use the existing Chart/tool taxonomy and minimal generic POA scaffolding; do not invent a large Chekhov teaching corpus or present AI-written prompts as Lisa/NMCA doctrine. For June 13, add a small number of Chekhov-sourced or Lisa/NMCA-aligned embodied prompts only when sourced/cited/approved; label any adaptation as beta practice scaffolding, not doctrine.
User answer: User’s feeling is that the first beta should avoid AI-generated embodied prompts entirely and only use sourced excerpts plus POA structure.
Extracted decisions/context:
- First beta should not contain AI-generated embodied teaching prompts.
- Use sourced excerpts, citations, and the POA structure as the teaching/content layer.
- The app can still have neutral navigational UI copy, but should not present invented practice language as Chekhov/Lisa/NMCA guidance.
- This reduces domain-fidelity and “oracle/gimmick” risk for Lisa/NMCA review.
Open follow-ups:
- None on prompt/content rule for first beta.


## Verification Log
- `npm run check && npm run build`: passed on 2026-06-04.
  - Build warning: Browserslist/caniuse-lite is old.
  - Build warning: a PostCSS plugin did not pass `from` to `postcss.parse`.
- Full-stack local server:
  - Started with `npm run dev` under current WIP server bind.
  - `GET http://127.0.0.1:5000/api/drawn-tools` returned 200 JSON (`[]` before smoke).
- Browser smoke:
  - Opened `http://127.0.0.1:5000`.
  - Selected all categories.
  - Drew tool: Archetypal Gestures → Penetrate → "Pierce".
  - Opened Begin POA.
  - Saved structured Practice note.
  - Reload showed history persisted.
  - Queried SQLite and confirmed `drawn_tools` and `journal_entries` rows existed.
  - Cleaned smoke rows afterward; DB returned to 0 drawn tools / 0 journal entries.
- Visual/a11y observations from browser:
  - Header still says "Actor's Toolkit".
  - Desktop wheel is visually coherent, but right drawer competes with main content.
  - Draw button can be below the first viewport after the wheel + PsychoPhysical sub-section.
  - History timestamp displayed "in about 5 hours" after smoke, likely due SQLite UTC string being parsed as local time.
  - Reveal/POA path works, but reveal overlay is ad-hoc rather than accessible Dialog.

## Open Flags
- Confirm whether Dawson is willing to pay Apple Developer Program ($99/year) and/or Google Play Console fee if true native beta distribution is needed.
- Decide cloud host/provider split for app shell, auth/database, functions/API, and file/content storage.
- Self-hosting is possible but needs explicit ops/security ownership if chosen.
- Confirm Apple Developer / Google Play Console availability if TestFlight/Play testing is part of the June 13 beta path.
- Library/paid material rights and access tiers remain unresolved for public/August release; closed June 13 beta may use limited cited Chekhov excerpts under user-approved aggressive/internal-beta risk posture.
- NMCA/Lisa attribution wording is approved for beta but not yet visible in UI; make it easy to edit after Lisa weekend feedback.
- First beta should avoid AI-generated embodied prompts; use sourced excerpts plus POA structure only.
- CLAUDE.md is stale in known-issues section and product name.
- The current UI name must change from "Actor's Toolkit" to "The Michael Chekhov Toolkit".
- Real-device mobile testing has not been completed.
- No automated tests exist yet.

## Handoff Seeds
- Claude Code context:
  - Official NMCA/Lisa Dalton prototype.
  - Preserve dirty WIP unless explicitly told to commit/change it.
  - Framework rewrite is now approved in principle: recommend Ionic Vue + Capacitor with hosted PWA fallback for summer beta.
  - Use product name "The Michael Chekhov Toolkit".
  - Use approved beta attribution wording for Lisa/NMCA/Chart of Inspired Action; keep it centralized for easy revision after Lisa feedback.
  - June 13 includes a Pareto-Skeleton Library: read-only resource/excerpt cards with citations and at least one Lisa/Michael Chekhov paragraph; closed-beta can be somewhat aggressive with Chekhov excerpts, but mark source/rights under review and audit before August/public launch.
  - Global Daily Tool should be modeled and visible by June 13, but seeded/manual; do not build real push notifications, admin CMS, or worldwide scheduler yet.
  - First beta should avoid AI-generated embodied prompts; use sourced excerpts/citations and POA structure as the content layer.
- Codex bounded work lanes:
  - Verify `npm run check`, `npm run build`, full-stack API smoke, and diff size.
  - Review Claude Code diffs for source-of-truth drift, a11y regressions, and POA model correctness.
- Tests/checks to require:
  - Typecheck/build.
  - API smoke for drawn tools and journal entries.
  - Browser/mobile manual smoke.
  - At least one regression/integration test once POA temporal model changes.
- Files/artifacts likely needed:
  - `CLAUDE.md` refresh.
  - `client/src/pages/Home.tsx` title/attribution/footer.
  - `client/src/components/ToolRevealCard.tsx` accessible Dialog conversion.
  - `client/src/components/POAJournal.tsx` POA temporal model and mid-edit safety.
  - `client/src/components/HistoryPanel.tsx` POA badge/open affordance.
  - `server/routes.ts`, `server/storage.ts`, `shared/schema.ts` for POA model updates.

## Q22 / Interlude — Agent orchestration research and dual-brain plan
- User pivoted Q22 from a simple Codex verification contract to a deeper research question: compare Opus 4.8/Claude Code and GPT-5.5/Codex for this app, feed sourced research to Opus, run Codex as a second brain, and synthesize how both should work together.
- Research completed against official Anthropic/Claude Code, Anthropic model, OpenAI Codex, and OpenAI GPT-5.5 docs.
- Actual dual-brain runs completed:
  - Opus/Claude Code: `claude-opus-4-8`, `--effort xhigh`, read-only/planning; successful run required `--setting-sources local` to avoid non-interactive hook contamination.
  - Codex/GPT-5.5: `gpt-5.5`, `model_reasoning_effort="high"`, `--sandbox read-only`.
- Reconciled decision:
  - Hermes/controller owns scope, reconciliation, merge, deploy/share, and Lisa-readiness gates.
  - Claude Code/Opus 4.8 should be primary architect/integrator for the weekend vertical slice: product flow, domain/stakeholder coherence, mobile polish, and final demo narrative.
  - Codex/GPT-5.5 should be independent challenger/reviewer and bounded worker only for crisp evidence-backed lanes: RLS/schema, type/build cleanup, deterministic fixes, attribution/content scans, security/diff review.
  - Both may one-shot the same prompt in read-only/planning mode, but should not freely edit the same repo/files concurrently.
  - Parallel implementation requires isolated worktrees and non-overlapping file ownership.
- Weekend gates from the synthesis:
  - Context/spec guardrails exist before build.
  - One reconciled weekend spec exists.
  - App opens locally/mobile-width.
  - Today’s Practice path works.
  - Pick My Own / Draw Random / Daily Tool seed are represented.
  - Start Today’s Practice locks the choice.
  - POA structure works; save/return/reload if possible.
  - Attribution visible before external sharing.
  - Content scan shows no AI-generated embodied prompts.
  - Build/typecheck status is known.
  - Supabase/RLS either works or is honestly marked as June 13/fallback, not overclaimed as secure beta.
- Artifacts:
  - Source research brief: `brainstorms/agent-orchestration-research-2026-06-04.md`
  - Opus output: `brainstorms/agent-orchestration-opus-2026-06-04.md`
  - Codex output: `brainstorms/agent-orchestration-codex-2026-06-04.md`
  - Final synthesis: `brainstorms/agent-orchestration-final-plan-2026-06-04.md`

## Next Grill Me Question Queue
1. Phase 0 build handoff: create/refresh `CLAUDE.md`, `AGENTS.md`, and a weekend execution spec with the attribution/no-AI-prompt guardrails before any implementation run.

## Council Artifact Links
- Claude prompt: `brainstorms/claude-council-prompt.md`
- Claude raw summary: `brainstorms/claude-council-review.raw.md`
- Claude full council review: `brainstorms/claude-council-review-2026-06-04.md`
- Integrated dual-brain review/handoff: `brainstorms/michael-chekhov-toolkit-dual-brain-review.md`
