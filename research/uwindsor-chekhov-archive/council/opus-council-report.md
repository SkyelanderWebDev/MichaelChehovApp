I have everything I need. The key structural facts: metadata crawl is complete (726/726 items), but text extraction covers only **16 prioritized items** out of 726, and the OCR — even at its cleanest — still carries character-level errors. No exact wording can be certified from the local text layer alone. Here is the council report.

---

# Opus Council Report — UWindsor Chekhov Archive, Directing/Dramaturg Pass
**For:** Rudy / Dawson / Lisa · **Date:** 2026-06-13 · **Mode:** read-only, candidate-only
*(Rerun: first Opus stdout was hook-contaminated; this pass relies only on repo artifacts, not hook output.)*

## 1. Is the plan sufficient for 98% confidence? Not yet — one big gap.

The **plan itself is excellent** — ground rules, provenance fields, attribution separation, and clearance tiers are all correct and align with the "don't invent Chekhov practice prompts" constraint. As a *design*, it meets the 98% bar.

The **execution is not there yet.** The acceptance criteria in §5 are only partially satisfied:

| Criterion | Status |
|---|---|
| Full API manifest, counts match | ✅ Met — 27/27 pages, 726/726 items, 726/726 media |
| Major 1935–1942 text clusters crawled or marked extraction-blocked | ⚠️ **Partial** — only **16 of 726 items** have extracted text (the top directing-scored items). 545 PDFs total; ~529 never text-extracted. |
| Every recommended quote has page-level evidence | ⚠️ Page *index* yes; **exact wording no** — OCR is too noisy to certify wording without the page image |
| Directing covers adjacent concepts (atmosphere, ensemble, rhythm, etc.) | ✅ Met at metadata level; ✅ partially at text level |
| No AI-generated practice prompt presented as archive material | ✅ Honored |

**To reach 98%, adjust three things:**
1. **Extend text extraction** beyond 16 items — at minimum the full 1937 Dartington and 1941 professional-actor clusters (the directing core), with each item marked *extracted / OCR-needed / extraction-blocked*. Right now coverage is ~2%.
2. **Add an OCR-confidence column and a "verified-against-page-image" flag.** No quote should leave candidate status without a human eyeballing the PDF page. The current text layer cannot support that step by itself.
3. **Resolve speaker attribution** (see §5) — these are transcribed class notes, not Chekhov's published prose. That must be settled before anything is labeled "Michael Chekhov said."

Bottom line: **plan = 98%-ready; data = roughly 60–70% for directing, much lower for the general quote bank.**

## 2. Strongest directing source clusters

From the metadata + extracted snippets, four clusters stand out, in priority order:

1. **1937 Dartington rehearsal-criticism lessons** *(strongest, densest)* — items **731, 656, 660, 662, 719, 746, 696, 682, 735, 710**. These are Chekhov directly critiquing directing and staging in the room ("Advice to Directors," "Suggestions for Directors"). Item **731** (June 28 1937) is the single highest-scoring item. This cluster is where Chekhov-on-directing is most explicit and most quotable.
2. **1941 New York "Classes for Professional Actors"** *(cleanest, titled topics)* — items **1077 ("The role of the director"), 1078, 1070, 1074, 1081**. Item **1077** is the only item in the whole archive explicitly titled around directing, and its OCR is among the cleanest. This is the keystone directing document.
3. **1942 New York public lectures** *(most standalone/philosophical)* — items **1085 ("The Actor is the Theatre"), 1087, 1070**. Director–audience relationship and theatre-of-the-future framing; produces short, marketing-adjacent lines.
4. **Production rehearsal clusters** *(directing-as-practice, but production-bound)* — Spanish Evening (**925, 924, 822, 821**), The Possessed/Shdanoff, Golden Steed, Balladina, the fishing scene. Rich on atmosphere, mise-en-scène, ensemble, tempo — but tied to specific productions, so weaker as standalone quotes.

## 3. Preliminary candidate quote themes (CANDIDATE / INTERNAL ONLY)

⚠️ **These are OCR snippets, not final quotes.** I could not certify exact wording from the local text layer — even the cleanest passages contain character errors. Each must be visually verified against the PDF page image before any use. Wording below is *as-extracted* and likely contains transcription noise; do not paste into the product.

1. **The actor is the theatre** — *item 1085, p.1*. "I think the theatre consists of the actor and that is all." Strongest standalone line; also the archive's own title. *(High app appeal; verify exact wording — title-page OCR is rough.)*
2. **Feeling of the whole / rehearse alone in imagination** — *item 731, p.1–2*. Each cast member must work apart from rehearsals and go through the whole play "as if sitting in the audience." Directing + ensemble.
3. **The three parts** — *item 731, p.1*. Directors help the cast by reminding them of beginning, middle, end. Composition.
4. **The table-work trap** — *item 1077, p.1–2*. "We were sitting at the table for months and months… becoming very clever and wise about the play, but none of us could begin to act!" Director–actor relationship; intellect vs. doing. *(Cleanest OCR of the set — strong candidate.)*
5. **Director and actor at once** — *item 656, p.2*. "You must be director and actor at the same time… know what is going on in the souls of your cast"; warns the director can "lose contact with his group." Director–ensemble awareness.
6. **Atmosphere as the "ground" of rehearsal** — *item 925, p.2 / item 660, p.1*. Take atmosphere "as a ground or a leading impulse… awaken[ed] through our imagination." Atmosphere in directing.
7. **Tempo / intensity of life** — *item 662, p.2*. "If we appear before society with a twenty-five percent tempo when society is moving at one hundred percent, we will be smashed." Tempo/rhythm.
8. **Finding the style of the play** — *item 731, p.2 / item 822*. "Find the fairy tale, and let it move, and speak… which will grow as a style for the play." Style/form.
9. **Body and stage space** — *item 662, p.2*. "As long as you believe that your body is all that you have to fill the stage space with, you will always suffer on the stage." Radiation/presence.
10. **Everything in rehearsal as gesture** — *item 1078, p.1*. Interpreting "everything which is going on while we are rehearsing on the stage, as gesture, or action, or movement." Psychological gesture / directing lens.

Prioritize **#4, #2, #5, #1** for first manual verification — best mix of directing relevance, app fit, and OCR legibility.

## 4. App-use guidance — where quotes can live *after* clearance

Ranked from safest to riskiest for the first beta:

- ✅ **Library / Source cards** — short attributed quote + the live UWindsor item URL + date. This is the natural, lowest-risk home: it cites rather than republishes, and reinforces provenance. Best target for beta.
- ✅ **"Chekhov on Directing" reading/research section** — longer contextual passages (cluster 1 & 2) framed as study material with full citation.
- ⚠️ **Inspiration cards** (short standalone lines like #1, #7) — only after *both* exact-wording verification *and* clearance. Tempting but highest temptation to over-polish OCR.
- 🚫 **Practice prompts / technique instructions** — do **not** convert any archive line into a "do this exercise" prompt for the first beta. This is the explicit red line: it risks presenting note-taker phrasing or AI smoothing as Chekhov's method.
- 🚫 **Marketing/public copy** — highest clearance bar (NMCA + UWindsor + estate); keep out of beta entirely.

Across all tiers: store as candidate with `clearance_flag` until Lisa/NMCA/UWindsor sign off, and never display an OCR string that hasn't been visually checked.

## 5. Blind spots & questions for Dawson/Lisa

**Blind spots the artifacts reveal:**
- **Attribution is the deepest risk.** These are *transcribed class/rehearsal notes* (e.g., item 925 is explicitly "rough notes taken during a rehearsal"), largely recorded by **Deirdre Hurst du Prey / Beatrice Straight**. They capture Chekhov teaching, but they are not his authored, published prose. Labeling any line "Michael Chekhov said, verbatim" overclaims until this is settled. This affects *both* accuracy and copyright (transcriber/estate layer sits on top of Chekhov's).
- **Coverage is thin.** 16/726 items extracted. The general/app quote bank (warm, actor-centered lines) is essentially unbuilt — current extraction was directing-weighted.
- **No OCR confidence scoring yet**, and no item is marked extraction-blocked vs. simply not-yet-done. The manifest can't currently distinguish "no quotes here" from "not looked at."
- **Copyright status is genuinely unresolved** — 1935–1942 unpublished material, Chekhov d. 1955, du Prey transcripts, UWindsor as holding institution. Web access ≠ license.

**Questions (the plan's §7 four are still unanswered and now blocking polish, not just start):**
1. Intended surface for beta — Library/source cards only, or also inspiration cards? (Determines how much verification effort to front-load.)
2. Quotation-length tolerance before explicit UWindsor/NMCA clearance — microquotes, short excerpts, or nothing public until cleared?
3. For directing, does Lisa want **practical rehearsal/director guidance** (clusters 1 & 4) or **philosophical statements on theatre** (cluster 3), or both?
4. Is it acceptable to attribute as *"Michael Chekhov, lesson of [date], transcribed by Deirdre Hurst du Prey, UWindsor Archive"* — i.e., transparently transcription-based rather than implying published quotation?

**My recommendation:** before any further curation, (a) extend extraction to the full 1937 + 1941 directing clusters, (b) add OCR-confidence + visual-verification flags, and (c) get Lisa's ruling on the attribution wording in Q4 — that single decision unblocks everything downstream.

---

*No files were edited. No quotes were fabricated or polished into final form; all snippets above remain candidate/internal pending visual verification and clearance.*
