# UWindsor Chekhov quote brief — Dawson/Lisa clarified intent

Date: 2026-06-13

This brief updates the first-pass research plan with Dawson/Lisa's clarified product and research goals.

## Product surfaces

The quote research should support two app surfaces:

1. A curated quote bucket for **common actor struggles**.
2. A future **daily notification** ping containing a one- to two-sentence inspirational quote.

These surfaces make short, standalone, emotionally useful quotes valuable, but they also raise the verification/clearance bar because daily notifications and actor-struggle buckets can easily feel like app guidance.

## Clearance rule

Nothing should be treated as publicly cleared until **both Dawson and Lisa** explicitly clear it.

Default status for every quote candidate:

- `internal_candidate_only`
- `not_publicly_cleared`
- `needs_visual_verification` unless manually checked against the PDF page image
- `needs_lisa_dawson_clearance` before any beta/public display

## Attribution rule

Dawson approved transparent archive/transcription attribution, e.g.:

> Michael Chekhov, lesson of [date], transcribed in [source/transcription context], UWindsor Michael Chekhov archive, item [id].

This is preferable to overclaiming a polished direct-authored quotation when the source is a class note or rehearsal transcription.

## Lisa's directing/academic justification goal

Lisa is looking to academically justify, with source reference points for footnotes, Chekhov's specific thoughts about topics including:

- identifying the main events,
- climaxes,
- rehearsing significant moments first,
- practical director/rehearsal strategy,
- philosophical support for those practices where relevant.

Therefore the directing pass should search not only `director/directing`, but also:

- main event / events,
- climax / climaxes,
- significant moments,
- important moments,
- first rehearse / rehearse first,
- beginning / middle / end,
- composition / whole / structure,
- scene / moment / beat / action / objective,
- atmosphere / rhythm / tempo / style / form,
- rehearsal / production / staging / audience / ensemble.

## “ALL juicy quotes” expansion

The research scope is no longer only a directing subset. It should attempt to surface all strong quote candidates across the archive, then tag them by likely use:

- `actor_struggle`
- `daily_inspiration`
- `directing_academic_footnote`
- `rehearsal_method`
- `atmosphere`
- `imagination`
- `psychological_gesture`
- `ensemble`
- `tempo_rhythm`
- `truth_beauty_art`
- `not_app_safe_yet`

## Practical next pipeline

1. Extract text from all 545 PDFs where embedded/OCR text exists.
2. Create page-indexed text files and extraction-status index.
3. Mine candidate passages using broad juicy/app/directing keyword scoring.
4. Output `quote_candidates_raw.csv` with all candidates and source provenance.
5. Create a smaller `quote_candidates_priority.csv` for first manual verification.
6. Manually verify the first 25–50 priority candidates against PDF page images before presenting them as exact quotes.
7. Build two curated drafts only after verification:
   - `common_actor_struggles_quote_bucket.md`
   - `chekhov_on_directing_footnote_bank.md`

## Non-negotiable guardrail

Do not convert archive quotations into invented embodied practice prompts. For the actor-struggles bucket and daily pings, use only verified source wording or explicitly approved editorial framing.
