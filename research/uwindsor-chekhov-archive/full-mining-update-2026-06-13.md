# UWindsor Chekhov archive — clarified scope + full raw quote mining update

Date: 2026-06-13

## Dawson/Lisa decisions recorded

1. Intended app surfaces:
   - a quote bucket for **common actor struggles**;
   - a future daily notification ping with a **one- to two-sentence inspirational quote**.

2. Clearance:
   - nothing is publicly cleared until **both Dawson and Lisa** clear it.
   - all mined quotes remain `internal_candidate_only` and `not_publicly_cleared`.

3. Attribution:
   - transparent attribution to lesson/date/transcription/UWindsor source is acceptable.
   - preferred over overclaiming direct authored Chekhov prose when the source is a class-note transcription.

4. Lisa's current academic/directing target:
   - source reference points for footnotes on identifying main events, climaxes, rehearsing significant moments first, and related practical/philosophical directing ideas.
   - scope expanded to find all “juicy” quotes across the archive, not just director-labeled items.

## Full raw PDF mining pass completed

Command run:

```bash
/tmp/chekhov-quote-venv/bin/python research/uwindsor-chekhov-archive/mine_quote_candidates.py --min-score 32 --priority-limit 1000 --progress-every 25 > research/uwindsor-chekhov-archive/full_quote_mining_run.log 2>&1
```

Receipts:

- PDFs considered: 545
- PDFs processed: 545
- Failed PDFs: 0
- Network downloads: 524
- Cached PDFs reused: 21
- Extracted text files: 545
- Raw deduplicated quote candidates above threshold: 45,574
- Priority candidate CSV rows: 1,000

Category counts in raw candidates:

- actor_struggle: 27,972
- directing_academic_footnote: 25,802
- daily_inspiration: 19,275
- method_terms: 14,125

## New artifacts

Full mining outputs:

- `research/uwindsor-chekhov-archive/mine_quote_candidates.py`
- `research/uwindsor-chekhov-archive/full_quote_mining_run.log`
- `research/uwindsor-chekhov-archive/quote_mining_summary.md`
- `research/uwindsor-chekhov-archive/quote_candidates_raw.csv`
- `research/uwindsor-chekhov-archive/quote_candidates_priority.csv`
- `research/uwindsor-chekhov-archive/quote_extraction_status.csv`
- `research/uwindsor-chekhov-archive/page_text_index.jsonl`
- `research/uwindsor-chekhov-archive/pdf_cache/`
- `research/uwindsor-chekhov-archive/extracted_text_all/`

Surface-specific raw reports:

- `research/uwindsor-chekhov-archive/build_surface_reports.py`
- `research/uwindsor-chekhov-archive/common_actor_struggles_quote_bucket_raw.md`
- `research/uwindsor-chekhov-archive/common_actor_struggles_quote_bucket_raw.csv`
- `research/uwindsor-chekhov-archive/chekhov_on_directing_footnote_targets_raw.md`
- `research/uwindsor-chekhov-archive/chekhov_on_directing_footnote_targets_raw.csv`

Clarified brief:

- `research/uwindsor-chekhov-archive/clarified-quote-brief-2026-06-13.md`

## Strong early vein for Lisa's stated directing target

The raw mining immediately surfaced a strong cluster around:

- feeling of the whole;
- beginning, middle, end;
- the beginning/end as practical frame;
- rhythmical events;
- the director's task in composing beginning vs. end;
- rehearsing beginning/end first, then details;
- psychological gesture for the whole play;
- significant/important moments and climax language.

Early high-scoring items for manual verification include:

- item 857, March 16, 1938 — feeling of the whole; beginning/middle/end; rhythmical changing.
- item 680, March 16, 1937 afternoon — director's task combining beginning and end; psychological gesture.
- item 837, February 25, 1938 — beginning/end; feeling of the whole; intellectual vs. real artistic experience.
- item 699, May 4, 1937 — rehearse beginning and end first, then detail; gesture/objective/atmosphere as points of view.
- item 847, March 8, 1938 — rhythm as feeling of the whole with beginning/middle/end.
- item 663, February 3, 1937 — three points/moments leading through the whole play.
- item 746, July 18, 1937 — director finding psychological gesture for the whole play.
- item 1077, December 1, 1941 — role of the director; action/quality over forcing feelings.

## Current confidence labels

- Full source and text extraction coverage for PDFs: high.
- Raw candidate mining completeness: high for embedded/OCR text; does not include image-only OCR beyond existing PDF text layers.
- Exact quote wording: not yet verified.
- App/public readiness: not cleared.
- Best next work: manual visual verification + curated quote-bank drafting.

## Recommended next pass

1. Manually verify the top 25–50 directing/footnote candidates against the PDF page images.
2. Manually verify the top 25–50 actor-struggle/daily-ping candidates.
3. Produce two human-readable curated documents:
   - `common_actor_struggles_quote_bucket_verified_draft.md`
   - `chekhov_on_directing_footnote_bank_verified_draft.md`
4. Keep exact wording, page index, item URL, PDF URL, attribution, and clearance state attached to every entry.
