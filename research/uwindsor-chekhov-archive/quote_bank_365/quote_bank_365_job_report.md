# Quote bank 365 job report

Generated: 2026-06-13T15:29:26

## Status

- Built exactly 365 accepted internal quote candidate rows.
- Public/app/notification clearance remains 0 rows.
- CSV extraction rows remain OCR/text-layer candidates requiring visual verification; they are not final quote text.

## Pre-flight git status

Captured before writing quote_bank_365 outputs:

```text
?? brainstorms/uwindsor-chekhov-archive-research-plan-2026-06-13.md
?? research/
```

## Output files

- `research/uwindsor-chekhov-archive/quote_bank_365/quote_bank_365_internal_candidates.csv`
- `research/uwindsor-chekhov-archive/quote_bank_365/quote_bank_365_internal_candidates.jsonl`
- `research/uwindsor-chekhov-archive/quote_bank_365/quote_bank_365_internal_candidates.md`
- `research/uwindsor-chekhov-archive/quote_bank_365/quote_bank_365_dedupe_rejects.csv`
- `research/uwindsor-chekhov-archive/quote_bank_365/quote_bank_365_job_report.md`

## Accepted counts

- Accepted rows: 365
- Unique item IDs: 240
- Unique source pages: 363
- Tier 2 visually spot-checked draft rows accepted: 20
- Public-cleared rows: 0

### By bucket

- daily_inspiration: 85
- actor_struggle: 95
- directing_academic_footnote: 100
- method_terms: 65
- library_source_card: 20

### By verification tier

- Tier 1 model-curated internal candidate: 345
- Tier 2 visually spot-checked internal quote: 20

### By source artifact

- quote_candidates_priority.csv: 229
- chekhov_on_directing_footnote_targets_raw.csv: 108
- chekhov_on_directing_footnote_bank_verified_draft.md: 12
- common_actor_struggles_quote_bucket_verified_draft.md: 8
- common_actor_struggles_quote_bucket_raw.csv: 8

## Verified draft seed handling

- chekhov_on_directing_footnote_bank_verified_draft.md: parsed 12; accepted 12; dedupe/risk exclusions 0.
  - exclusions: 0
- common_actor_struggles_quote_bucket_verified_draft.md: parsed 13; accepted 8; dedupe/risk exclusions 5.
  - same_item_page_near_duplicate: 3
  - exact_normalized_duplicate: 1
  - substring_or_overlap_duplicate: 1

Verified draft exclusions were not content-cleanup decisions; they were dedupe/risk exclusions where the same or substantially overlapping passage was already retained with provenance/secondary tags merged.

## Deduplication / reject summary

- Reject rows logged: 877
- same_item_page_source_page_cap: 337
- overrepresented_item_cap_2: 265
- exact_normalized_duplicate: 191
- substring_or_overlap_duplicate: 78
- same_item_page_near_duplicate: 3
- excessive_unusual_characters_ocr_noise: 3

Deduplication used exact normalized hashes, substring/overlap checks, same item-page caps, same item-page near-similarity, and max-per-item diversity caps for CSV rows. Verified draft duplicates were merged/rejected when overlapping instead of allowing duplicate rows.

## Diversity goal

- Target: at least 300 unique source pages and 180 unique item IDs if feasible.
- Actual: 363 unique source pages and 240 unique item IDs.

## Known risks

- The 365-row bank is internal only; nothing is public/app-ready or cleared.
- Tier 1 rows copy OCR/text-layer candidate windows and may contain OCR errors, page-boundary cuts, or context omissions.
- Tier 2 rows are visually spot-checked but still need a second human read before any citation leaves internal Dawson/Lisa review.
- Provenance is preserved to support the next verification pass; attribution mode does not by itself grant publication rights.

## Recommended next verification pass

1. Start with Tier 2 rows and reject/merge any remaining same-page conceptual overlaps after human review.
2. For Tier 1 rows, render the cited PDF page, visually transcribe exact wording, and record verification image paths.
3. Prioritize daily/actor rows at 90–360 characters for future notification-card candidates, and directing rows tied to main events/climax/beginning-middle-end for Lisa's academic footnotes.
4. Only after Dawson + Lisa approve exact wording/use should any row move out of `internal_candidate_only__not_publicly_cleared`.

## Final git status

```text
?? brainstorms/uwindsor-chekhov-archive-research-plan-2026-06-13.md
?? research/
```

## Validation result

```json
{
  "ok": true,
  "errors": [],
  "error_count": 0,
  "accepted_csv_rows": 365,
  "accepted_jsonl_rows": 365,
  "public_cleared_rows": 0,
  "unique_items": 240,
  "unique_pages": 363
}
```
