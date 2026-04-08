# Phase 1: Ship React Prototype by Friday April 10

## Overview

Take the existing working ActorToolbox (from Replit) and make it deployment-ready. Four tasks in priority order. Complete them sequentially.

---

## Task 1: Migrate from Neon PostgreSQL to SQLite

**Why:** Remove cloud database dependency. The app should run self-contained with no external services.

### Steps

1. Install `better-sqlite3` and `@types/better-sqlite3` (remove `@neondatabase/serverless`, `ws`, `connect-pg-simple`)
2. Rewrite `server/db.ts`:
   - Replace Neon pool with better-sqlite3 connection
   - Use Drizzle's `drizzle-orm/better-sqlite3` adapter
   - Database file at `./data/chekhov.db` (create `data/` directory)
   - Auto-create tables on startup if they don't exist
3. Update `shared/schema.ts`:
   - Replace `pgTable` imports with `sqliteTable` from `drizzle-orm/sqlite-core`
   - Replace `varchar` → `text`, `timestamp` → `text` (ISO string), `integer` stays
   - Keep all Zod schemas as-is
4. Update `server/storage.ts`:
   - Should work with minimal changes once db.ts adapter is swapped
   - Verify all Drizzle queries work with SQLite dialect
5. Update `drizzle.config.ts` for SQLite dialect
6. Remove `memorystore`, `express-session`, `passport`, `passport-local` if not actively used (check routes first)
7. Add `data/` to `.gitignore`
8. Test: `npm run dev` → draw a tool → verify it persists in SQLite

### Verification
- App starts without DATABASE_URL env var
- Drawing a tool creates a record in `data/chekhov.db`
- Session history loads correctly from SQLite
- Journal entries save and retrieve correctly

---

## Task 2: Add POA Journal (Practice / Observe / Apply)

**Why:** The daily practice framework is the key feature that makes this more than just a random draw toy. This is what Lisa will care about most.

### POA Framework

Each day, after drawing a tool, the actor works with it using three modes:

- **Practice:** 5 minutes of physical movements exploring the tool's qualities
- **Observe:** 1 minute × 3 times daily (morning, midday, evening) — notice where the tool manifests naturally in the world without any intent
- **Apply:** 1 minute × 3 times daily (morning, midday, evening) — consciously use the tool while performing an everyday task

### Steps

1. **Update schema** (`shared/schema.ts`):
   Add a new `journalEntries` table (or extend `drawnTools`):
   ```
   journalEntries table:
     id: text (primary key, UUID)
     drawnToolId: text (references drawnTools.id)
     date: text (ISO date, e.g. "2026-04-08")
     mode: text ("structured" | "journal")
     
     // Structured mode fields
     practiceNotes: text (nullable)
     observeMorning: text (nullable)
     observeMidday: text (nullable)  
     observeEvening: text (nullable)
     applyMorning: text (nullable)
     applyMidday: text (nullable)
     applyEvening: text (nullable)
     
     // Journal mode field
     journalText: text (nullable)
     
     createdAt: text (ISO timestamp)
     updatedAt: text (ISO timestamp)
   ```

2. **Add API routes** (`server/routes.ts`):
   - `POST /api/journal` — create journal entry linked to a drawn tool
   - `GET /api/journal/:drawnToolId` — get journal entries for a specific draw
   - `GET /api/journal/today` — get today's journal entry (if any)
   - `PATCH /api/journal/:id` — update a journal entry

3. **Build POA Journal component** (`client/src/components/POAJournal.tsx`):
   - Mode toggle at top: "Structured" | "Journal" (switch/toggle component)
   - **Structured mode:**
     - "Practice" section: text area for 5-min movement notes
     - "Observe" section: three labeled text inputs (Morning / Midday / Evening)
       - Each with subtle prompt: "What did you notice naturally?"
     - "Apply" section: three labeled text inputs (Morning / Midday / Evening)
       - Each with subtle prompt: "How did you consciously use this tool?"
     - Save button
   - **Journal mode:**
     - Single large text area (min-h-[300px])
     - Same save button
   - Show which tool this journal entry is for (tool name + category badge)
   - Auto-save or save button with toast confirmation

4. **Integrate POA Journal into the flow:**
   - Option A (recommended): Add a "Start Practice" or "Begin POA" button on the ToolRevealCard, alongside "Draw Again" and "Flyback"
   - This opens the POAJournal component as a modal or slide-up panel
   - The existing Flyback Journal stays as-is (quick reflection), POA is the deeper practice

5. **Keep the existing Flyback Journal intact** — it serves a different purpose (quick in-the-moment reflection vs. structured daily practice)

### UI Design Notes
- Follow existing design language (border-2, rounded-xl, shadcn components)
- Structured mode inputs should feel calm and spacious, not form-like
- The mode toggle should use the existing Switch component from shadcn/ui
- Morning/Midday/Evening labels could use subtle time-of-day icons (☀️ 🌤️ 🌙)
- Color accent the P/O/A sections slightly differently for visual distinction

### Verification
- Draw a tool → click "Begin POA" → structured mode shows 7 input fields
- Toggle to journal mode → single text area
- Save → toast confirmation → data persists in SQLite
- Re-open POA for same draw → previous entries load

---

## Task 3: Mobile Polish

**Why:** Lisa Dalton WILL open this on her phone. If it doesn't work well on mobile, the prototype fails.

### Steps

1. **Test the CategoryWheel on small screens:**
   - The radial wheel layout may overlap on screens < 375px
   - Consider falling back to a grid layout on mobile (< md breakpoint)
   - Or reduce the radius percentage for small screens
   
2. **History panel mobile behavior:**
   - Currently shows below main content on mobile (`lg:hidden mt-12`)
   - Consider making it a slide-up drawer (using the Drawer component from vaul)
   
3. **Tool Reveal Card on mobile:**
   - Verify the card doesn't overflow on small screens
   - Text sizes should scale down (text-6xl is huge on mobile)
   - Buttons should be full-width on mobile
   
4. **Touch targets:**
   - All buttons/toggles minimum 44px touch target
   - Category checkboxes on the wheel might be too small (currently w-5 h-5)
   
5. **POA Journal on mobile:**
   - Full-screen modal rather than side panel
   - Inputs should be large enough for thumb typing
   - Save button always visible (sticky bottom)

### Verification
- Open on iPhone Safari (or Chrome DevTools mobile emulation)
- Can select categories without mis-tapping
- Can draw a tool and see the full reveal card
- Can open and fill out the POA journal
- History is accessible and scrollable
- No horizontal scroll on any screen

---

## Task 4: Deploy to Shareable URL

**Why:** Lisa needs a link she can tap on her phone. 

### Options (pick one):

**Option A: Vercel (Recommended)**
- Works great with Vite + Express
- Free tier is sufficient
- Caveat: SQLite won't persist on serverless. For the prototype, this is fine — data resets on redeploy. OR use Vercel's Edge Config / Turso for persistent SQLite.

**Option B: Railway**
- Supports persistent SQLite (has filesystem)
- Free tier with $5/month credit
- Simple: `railway up`

**Option C: Render**
- Free tier with persistent disk
- Auto-deploy from git

**Option D: Fly.io**
- Free tier, persistent volumes for SQLite
- `fly launch` → `fly deploy`

### For Friday Prototype
The simplest path: **if SQLite persistence doesn't matter for the demo** (Lisa is just playing with it, not building up a practice log), deploy to Vercel. The draw/reveal/POA features all work client-side or in-memory.

If persistence matters: Railway or Fly.io with a volume mount.

### Steps (Vercel path)
1. Adjust build script if needed for Vercel's serverless functions
2. `npm i -g vercel && vercel` from the project root
3. Follow the prompts, link to a Vercel project
4. Get the deployment URL
5. Test on mobile
6. Share URL with Lisa

### Verification
- URL loads on mobile Safari/Chrome
- Full flow works: select categories → draw → reveal → POA journal
- No console errors
- Reasonable load time (< 3 seconds)

---

## Success Criteria

By Friday April 10:
- [ ] App runs on SQLite (no external DB)
- [ ] POA Journal works (structured + journal mode)
- [ ] Looks good on mobile
- [ ] Deployed to a shareable URL
- [ ] Lisa can open it and play with it
- [ ] Zero pushups owed 💪
