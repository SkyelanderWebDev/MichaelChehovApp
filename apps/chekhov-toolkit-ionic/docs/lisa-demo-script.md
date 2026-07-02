# Lisa / tester demo script — The Michael Chekhov Toolkit secure beta path

Last updated: 2026-07-02 (active secure beta / Build 0.1.0).

Historical demo script updated for the active secure beta. Dawson has approved and shared the production alias with Lisa; Lisa created a tester account on 2026-07-02. Use this as a lightweight guided walkthrough for an active tester, not as a pre-share readiness script.

## What changed since April

1. The app is framed as **The Michael Chekhov Toolkit**, with the NMCA / Lisa / Chart of Inspired Action attribution visible.
2. The flow is organized around **Today’s Practice**, not only random drawing.
3. The actor chooses **Pick My Own**, **Draw Random**, or **Daily Tool**.
4. Tapping any chart node (or a directory **Details** button) opens a category detail sheet with family, parent tools, and child/example labels from the taxonomy.
5. Parent-tool filters control the Draw Random pool.
6. Pick My Own is intentional: the actor previews the exact parent tool they choose.
7. Starting practice locks one tool to today’s POA.
8. Daily Action / POA notes save to Supabase and return after reload or sign-out/sign-in.
9. Tester feedback saves to a user-owned Supabase feedback row.
10. The PWA has manifest, icons, theme color, and service-worker offline shell basics for home-screen install.

## Suggested 90-second active-beta walkthrough

1. Open the app — point at the name, tester account panel, and attribution footer.
2. Sign in or create a tester account.
3. Tap the Archetypal Gestures node — show family, the ten parent tools, and child labels. Deselect all, select just Push/Pull.
4. Done → Draw Random — the preview honors the filter.
5. Draw another preview once or twice — show preview-before-commitment.
6. Start Today’s Practice — show the lock banner and disabled chart.
7. Type a Daily Action / POA note, save, reload — it returns from Supabase.
8. Sign out/sign in — Today’s Practice and POA restore for that tester account.
9. Send a short in-app beta feedback note.
10. On phone: add to home screen and repeat the restore path from the PWA icon.

## Honest status / known limits

- Do not send Lisa a new build/update without Dawson approval; she already has the secure-beta production alias.
- Build 0.1.0 is active secure beta; future Lisa-validation builds need fresh gates/receipts.
- Daily Tool is still seeded/manual, not push-notification infrastructure.
- Library content is a minimal citation/source skeleton until approved sourced excerpts land.
- Tool content is taxonomy labels/source cards plus POA structure only — no AI-generated embodied practice prompts.
