# Secure beta tester notes — The Michael Chekhov Toolkit

Last updated: 2026-06-10 (secure beta branch).

This branch replaces the local-demo account path with Supabase Auth, Supabase Postgres, and Row Level Security. It is not ready to share externally until Dawson approves the Supabase project and hosting target, and until the hosted URL plus real-phone smoke pass.

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

1. Open the approved HTTPS beta URL after Dawson shares it.
2. Create or sign in to a tester account with email + password.
3. Use Today’s Practice:
   - Pick My Own opens the selected chart area and lets you choose a parent tool.
   - Draw Random respects selected chart areas and parent-tool filters.
   - Daily Tool uses the seeded daily tool for the date.
4. Press Start Today’s Practice only when ready. The day locks after start.
5. Save Daily Action / POA notes; reload or sign out/sign in to confirm they return.
6. Send friction reports through the in-app Tester feedback panel.

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

- Deployment is held until Dawson approves a Supabase project and a hosting target.
- Real phone smoke is still required before calling this phone-ready.
- The app is a hosted/installable PWA path, not TestFlight/App Store distribution.
- Daily Tool is seeded/manual for now, not a push-notification/global scheduler.
- Library is only a minimal sourced/citation skeleton until the content research/rights lane supplies approved excerpts.
- Tool content remains taxonomy/source-card labels plus POA structure; no AI-generated embodied Chekhov practice prompts are included.
