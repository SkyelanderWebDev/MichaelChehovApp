# Secure beta tester notes — The Michael Chekhov Toolkit

Last updated: 2026-07-08 (active secure beta / Build 0.2.1 + hosted Connect activation).

The secure-beta production app uses Supabase Auth, Supabase Postgres, and Row Level Security. Hosted smoke passed on the approved Vercel + Supabase beta target; Dawson's phone/home-screen smoke passed on 2026-07-01; hosted Connect chat activation is receipt-backed as of 2026-07-03; Lisa Dalton has the production alias/profile/tester account but has not yet used the latest Connect chat path because she is traveling. Current build: `secure-beta-0.2.1`.

Approved HTTPS beta URL: https://michael-chekhov-toolkit-beta.vercel.app

## Local developer run

1. Start Supabase locally from the repo root:

```bash
supabase start
supabase db reset
supabase status
```

2. Copy the local `API URL` and `anon key` from `supabase status` into your local shell or an untracked `.env.local` file. The committed `.env.example` intentionally keeps these values blank.

```bash
cd apps/chekhov-toolkit-ionic
npm run dev -- --host 127.0.0.1 --port 5179
```

Do not commit real Supabase keys. The browser must use only the anon key, never a service-role key.

## Tester flow

1. Open the approved HTTPS beta URL. Lisa already has the production alias; other testers should use it only after Dawson shares it.
2. Create or sign in to a tester account with email + password.
3. Use Today’s Practice:
   - Pick My Own opens the selected chart area and lets you choose a parent tool.
   - Draw Random respects selected chart areas and parent-tool filters.
   - Daily Tool uses the seeded daily tool for the date.
4. Press Start Today’s Practice only when ready. The day locks after start.
5. Save Daily Action / POA notes; reload or sign out/sign in to confirm they return.
6. Send friction reports through the in-app Tester feedback panel.
7. Optional Connect chat smoke when Dawson requests it: open Connect → Group chat, enter the intended room/invite path, send one short message, receive/confirm Dawson's reply, and report any sign-in/link/composer friction. Do not treat chat as Lisa-verified until Lisa completes this on a real phone.

## Install to home screen

### iPhone / iPad Safari
1. Open the approved HTTPS beta URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Launch The Michael Chekhov Toolkit from the home-screen icon.
5. Confirm sign-in, Today’s Practice restore, POA restore, and feedback send still work from the installed PWA shell.

### Android Chrome
1. Open the approved HTTPS beta URL in Chrome.
2. Tap the menu.
3. Tap Install app or Add to Home screen.
4. Launch from the icon and run the same smoke flow.

## Honest status / known limits

- Hosted HTTPS beta URL: https://michael-chekhov-toolkit-beta.vercel.app
- Status: active secure beta, Build 0.2.1 / `secure-beta-0.2.1`, with hosted Connect activation receipt-backed. Lisa has a profile/tester account; Lisa real-phone chat smoke remains pending while she is traveling.
- The app is a hosted/installable PWA path, not TestFlight/App Store distribution.
- Daily Tool is seeded/manual for now, not a push-notification/global scheduler.
- Library is only a minimal sourced/citation skeleton until the content research/rights lane supplies approved excerpts.
- Tool content remains taxonomy/source-card labels plus POA structure; no AI-generated embodied Chekhov practice prompts are included.
- Connect chat is group-room only; no DMs, attachments, push notifications, or automated email invite delivery are included. Owner copy-link invites are the current lane.
