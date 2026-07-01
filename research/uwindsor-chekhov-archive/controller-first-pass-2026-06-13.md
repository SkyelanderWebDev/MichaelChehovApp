# UWindsor Chekhov archive — Rudy/controller first pass

Date: 2026-06-13
Commission: Lisa/Dawson request for a deep research dive into the UWindsor Michael Chekhov archive, with emphasis on quotes for The Michael Chekhov Toolkit and Chekhov's approach to directing.

## What is done now

### 1. Plan created

Plan file:

- `brainstorms/uwindsor-chekhov-archive-research-plan-2026-06-13.md`

The plan defines:
- quote provenance requirements,
- directing and general-app keyword strategy,
- crawl/extraction workflow,
- quote candidate schema,
- app-safe use tiers,
- clearance/copyright risks,
- open questions for Dawson/Lisa.

### 2. Council pinged

Two council lanes were started after the plan was created.

#### Codex council lane

- Model/provider observed in Codex stderr: `gpt-5.5`, OpenAI provider.
- Sandbox: read-only.
- Status: completed.
- Report saved to:
  - `research/uwindsor-chekhov-archive/council/codex-council-report.md`

Important note: Codex could not resolve `collections.uwindsor.ca` from its sandbox, so it could not perform live verification. Its report is still useful for schema, pagination, data model, keyword scoring, and reproducible command design.

#### Opus council lane

- First Opus run dispatched successfully as `claude-opus-4-8`, but stdout was contaminated by a local stop hook. I did not treat that as the report.
- I reran Opus in safe mode against the local artifacts.
- Debug verification: `model=claude-opus-4-8`, `modelSupported=true`, first-party dispatch lines present.
- Status: completed.
- Report saved to:
  - `research/uwindsor-chekhov-archive/council/opus-council-report.md`

### 3. Rudy/controller archive pass started

I used the Omeka S API directly and created a complete metadata/API manifest.

Key live crawl results:
- Site id: `2`
- Site title: `Michael Chekhov: The Actor is the Theatre`
- Site pages: reported 27, fetched 27
- Items: reported 726, fetched 726
- Media: reported 726, fetched 726
- Media types:
  - 545 PDFs
  - 181 JPEG images

Artifacts:
- `research/uwindsor-chekhov-archive/crawl_manifest.py`
- `research/uwindsor-chekhov-archive/archive_manifest.json`
- `research/uwindsor-chekhov-archive/archive_summary.md`
- `research/uwindsor-chekhov-archive/raw_site.json`
- `research/uwindsor-chekhov-archive/raw_site_pages.json`
- `research/uwindsor-chekhov-archive/raw_items.json`
- `research/uwindsor-chekhov-archive/raw_media.json`
- `research/uwindsor-chekhov-archive/metadata_hits_directing.csv`
- `research/uwindsor-chekhov-archive/metadata_hits_general.csv`

### 4. Initial directing extraction sample completed

I created a transient Python venv, installed `pypdf`/`pdfminer.six`, extracted text from the top 16 directing-scored PDFs, then removed the transient venv and saved requirements.

Artifacts:
- `research/uwindsor-chekhov-archive/requirements.txt`
- `research/uwindsor-chekhov-archive/extract_priority_snippets.py`
- `research/uwindsor-chekhov-archive/extraction_index.csv`
- `research/uwindsor-chekhov-archive/pdf_cache/`
- `research/uwindsor-chekhov-archive/extracted_text/`
- `research/uwindsor-chekhov-archive/directing_snippets_sample.md`

The sample includes page-indexed OCR/text-layer snippets. These are candidate-only and still need visual/manual verification before final quotation.

## Strongest early directing targets

From metadata scoring + first extraction + Opus council reconciliation, the strongest clusters are:

1. 1937 Dartington rehearsal/directing criticism
   - Key items: 731, 656, 660, 662, 719, 746, 696, 682, 735, 710.
   - Strong on director's role, feeling of the whole, atmosphere, style, mise-en-scène, tempo/rhythm, and practical rehearsal correction.

2. 1941 New York classes for professional actors
   - Keystone: item 1077, “The role of the director.”
   - Also: 1078 and related professional actor classes.
   - Cleaner OCR and stronger conceptual framing.

3. 1942 New York public lectures
   - Especially item 1085, “The Actor is the Theatre.”
   - Better for philosophical/app-facing lines, but less specifically director-centered.

4. Production rehearsal clusters
   - Especially item 925, Spanish Evening rehearsal.
   - Strong on rehearsal-as-ground, atmosphere, audience, and presentational problem solving; more context-bound.

## Preliminary candidate themes/passages to verify first

Do not treat these as final quotes yet. They are OCR/text-layer candidates requiring visual verification and clearance decisions.

1. Table-work trap / intellect vs acting
   - Source: item 1077, PDF pages 1–2.
   - Candidate idea: sitting at the table for months, becoming clever about the play, but unable to act.
   - Why it matters: strong directing/rehearsal quote, very app-relevant.

2. Conveying the director's ideas without over-talking
   - Source: item 1077, page 1.
   - Candidate idea: a process that helps the director convey ideas to actors without speaking/philosophizing too much.
   - Why it matters: compact statement of Chekhov's director pedagogy.

3. Feeling of the whole
   - Source: item 731, pages 1–2.
   - Candidate idea: each cast member works apart from rehearsal and imagines the whole play as if in the audience.
   - Why it matters: director + ensemble + composition.

4. Director and actor at once / contact with the group
   - Source: item 656, page 2 in sample extraction.
   - Candidate idea: director must retain contact with the cast/group and understand what is happening in actors' souls.
   - Why it matters: explicit director/ensemble guidance.

5. Atmosphere as rehearsal ground
   - Sources: item 925, item 660.
   - Candidate idea: atmosphere as the ground or leading impulse of rehearsal.
   - Why it matters: directly connects app taxonomy territory to directing.

6. “The actor is the theatre”
   - Source: item 1085.
   - Candidate idea: theatre consists of the actor.
   - Why it matters: strongest app-facing/philosophical candidate; exact wording and clearance must be verified.

7. Tempo / intensity of life
   - Source: item 662.
   - Candidate idea: 25% tempo vs society moving at 100%.
   - Why it matters: memorable, energetic, practical.

8. Everything in rehearsal as gesture/action/movement
   - Source: item 1078.
   - Candidate idea: interpret what happens in rehearsal/stage as gesture/action/movement.
   - Why it matters: bridges psychological gesture and directing.

## 98%-confidence assessment

The plan is strong enough to proceed without more questions.

The final quote bank is not yet at 98% confidence because:
- only 16/726 items have text extraction so far;
- the archive includes OCR noise;
- exact quote wording needs visual/manual verification against PDF page images;
- speaker attribution must be handled carefully because many documents are transcribed class/rehearsal notes, not published prose authored directly by Chekhov;
- permission/clearance status for app/public quotation remains unresolved.

Recommended label for current state:

- Plan: 98%-ready.
- Metadata/source map: high confidence.
- Directing target map: medium-high confidence.
- Exact quote bank: candidate/internal only.

## Comments / questions / concerns / conundrums for Dawson and Lisa

No blocker to continue the research pass. These decisions affect final packaging and app use:

1. Intended surface
   - Should this become Library/source cards only, or also inspiration cards/daily quote surfaces?

2. Public quotation threshold
   - Until explicit clearance, should public/beta use be limited to archive links and paraphrased summaries, microquotes, or short direct excerpts?

3. Attribution wording
   - Is this acceptable: “Michael Chekhov, lesson of [date], transcribed by Deirdre Hurst du Prey / archive source, UWindsor Michael Chekhov Collection”?
   - This avoids overclaiming “Chekhov wrote/said” when the source is a class note transcript.

4. Directing emphasis
   - Does Lisa want practical rehearsal/director guidance first, philosophical theatre/directing principles first, or both?

5. Archive permission path
   - Should we plan a later permission packet for UWindsor/NMCA/estate review once the candidate quote list is narrowed?

Default if unanswered:
- Continue building an evidence-backed candidate bank.
- Keep all direct quotes internal-review-only.
- Prioritize Library/source-card and “Chekhov on Directing” research section use over public marketing/inspiration surfaces.
- Do not convert quotes into practice instructions.

## Recommended next execution pass

1. Extract the full 1937 Dartington directing cluster and 1941 professional actor classes.
2. Add `ocr_confidence`, `needs_visual_verification`, and `verified_against_page_image` fields.
3. Create `quote_candidates.csv` from page-indexed extracted text.
4. Manually/visually verify the first 10 directing candidates.
5. Draft two outputs:
   - `directing_quotes.md` — Chekhov on directing, with exact source citations.
   - `app_quote_bank.md` — app-safe candidate quote bank, grouped by theme and use tier.
