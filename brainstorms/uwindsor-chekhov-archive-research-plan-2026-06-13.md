# UWindsor Michael Chekhov Archive Research Plan — quote bank + directing pass

Commission: Lisa/Dawson request for a deep research dive into https://collections.uwindsor.ca/chekhov/about, focused on Michael Chekhov quotes for The Michael Chekhov Toolkit and especially Chekhov on directing.

Date: 2026-06-13
Controller: Rudy/Hermes

## 0. Ground rules

- Treat the UWindsor site as a primary archive, not as permission to republish at will.
- All direct quotations must be tied to stable source evidence: archive URL, item ID, item title, media URL, document date, page number or PDF page index, and OCR/text confidence.
- For the app, do not turn unsourced quotes into practice prompts. Candidate quotes can support Library cards, inspiration cards, research notes, or Lisa-review content only after clearance.
- Preserve Chekhov/NMCA terminology; do not normalize or rewrite archive language except in clearly marked paraphrase/notes.
- Separate “Michael Chekhov’s words” from “editorial notes,” Deirdre Hurst du Prey commentary, tags, later introductions, or third-party writings about Chekhov.

## 1. Research questions

Primary:
1. Which short, high-value Michael Chekhov quotations from the UWindsor archive are suitable candidates for in-app use, pending Lisa/NMCA/UWindsor permission review?
2. What does the archive reveal about Chekhov’s approach to directing, rehearsal, ensemble, production, the actor/director relationship, atmosphere, composition, rhythm, audience, and theatrical form?

Secondary:
- Which archive items are most quote-dense or most relevant for future Library/source cards?
- Which terms and document clusters should become reusable search handles for later research?
- Which quotes are safe enough for internal beta review vs. which require stronger copyright/clearance handling before public display?

## 2. Archive map from initial reconnaissance

The site is Omeka S. Initial verified handles:
- Site root: https://collections.uwindsor.ca/chekhov
- About: https://collections.uwindsor.ca/chekhov/about
- Site API: https://collections.uwindsor.ca/api/sites/2
- Site pages API: https://collections.uwindsor.ca/api/site_pages?site_id=2
- Items API: https://collections.uwindsor.ca/api/items?site_id=2
- Media API: https://collections.uwindsor.ca/api/media?site_id=2

Recon results before full crawl:
- site id: 2
- site title: “Michael Chekhov: The Actor is the Theatre”
- public site pages: 27
- public items for site_id=2: 726
- public media for site_id=2: 726
- top navigation includes: Prefatory Material; 1935 lessons; 1936–1942 class/lecture clusters; Research Guide; Name/Work indexes; People/Key Concept tags; photo collections; “The Pencil”.

## 3. Work products

Required final artifacts:
1. `archive_manifest.json`
   - site pages, item metadata, media metadata, source URLs, date/title/creator/subject/tags, original PDF/image URLs.
2. `archive_text_index/`
   - extracted text per media item where available.
   - OCR status/confidence notes per item.
3. `quote_candidates.csv`
   - fields: quote_text, normalized_quote, speaker_attribution, source_title, archive_item_url, api_item_id, media_url, document_date, source_cluster, page_index, page_label_if_known, topic_tags, app_use_tier, directing_relevance, excerpt_length, clearance_flag, extraction_confidence, notes.
4. `app_quote_bank.md`
   - curated short quotes for possible app/Library/inspiration use, grouped by theme.
5. `directing_quotes.md`
   - Chekhov-on-directing deep pass with exact quotes, context, and synthesis.
6. `source_clearance_notes.md`
   - copyright/permission risks; what can be linked/cited; what needs Lisa/NMCA/UWindsor approval before publication.
7. `research_log.md`
   - crawl method, commands, failures, retry notes, and known gaps.

## 4. Crawl/extraction workflow

Phase A — polite full manifest:
- Use Omeka API before scraping HTML.
- Fetch all `site_pages?site_id=2&per_page=100`.
- Fetch all `items?site_id=2&per_page=100&page=N` until 726 results are exhausted.
- Fetch referenced media records and collect `o:original_url` for PDFs/images.
- Respect site load: sequential or low-concurrency requests; cache everything locally.

Phase B — text extraction:
- First attempt embedded text extraction from PDFs.
- If embedded text is absent/low quality, mark as OCR-needed; only OCR high-priority directing/general quote candidates first.
- Preserve page index and page breaks. Page-level provenance is mandatory for quoted candidates.
- Do not silently clean OCR into a quote. Store raw extraction plus corrected quote only when correction is visually/manually verified.

Phase C — keyword and semantic passes:
- General app quote terms:
  - imagination, atmosphere, radiation, concentration, attention, objective, gesture, psychological gesture, body, movement, feeling, truth, beauty, ensemble, rhythm, tempo, character, transformation, individuality, inspiration, creative, actor, art, theatre.
- Directing terms:
  - direct, director, directing, stage director, rehearsal, production, staging, scene, mise en scene, composition, audience, ensemble, atmosphere, rhythm, tempo, form, style, gesture, actor/director, group, theatre, play, objective, task, action.
- Use both exact keyword search and clustered document-level relevance scoring.
- Treat index/tag pages as routing aids, not as quote authority.

Phase D — quote qualification:
For each candidate quote:
- Confirm it is Chekhov’s own language or clearly label otherwise.
- Keep enough surrounding context to prevent misleading extraction.
- Prefer short, standalone, warm, actor-centered lines for app candidates.
- Prefer longer contextual passages for directing synthesis.
- Score each quote:
  - App fit: 1–5
  - Directing relevance: 1–5
  - Source confidence: high/medium/low
  - Clearance risk: low/medium/high/unknown

Phase E — council synthesis and reconciliation:
- Opus lane: research librarian/dramaturg pass — thematic reading, Chekhov/directing interpretation, quote quality, app fit, risks.
- Codex lane: mechanical crawl/data pass — manifest completeness, API shape, extraction pipeline, keyword inventory, reproducibility, gaps.
- Rudy/controller: reconcile council findings, verify source evidence, assemble final quote bank and directing memo.

## 5. Acceptance criteria for “98% confidence”

- Full API manifest collected and counts match expected totals or discrepancies are explained.
- At least the major text clusters from 1935–1942 and prefatory material are crawled or explicitly marked extraction-blocked.
- Every recommended quote has a live source URL and page-level evidence.
- Directing section includes both obvious `director/directing` hits and broader Chekhov-directing concepts: atmosphere, ensemble, composition, rhythm/tempo, actor independence, rehearsal method, audience, and form/style.
- App recommendation separates:
  - source-backed internal beta candidates,
  - quote candidates requiring clearance,
  - “do not use yet” material.
- No AI-generated Chekhov-style practice prompt is presented as archive material.

## 6. Risks / blind spots

| Risk | Impact | Mitigation |
|---|---:|---|
| PDFs may be scans with little/no embedded text | High | Build manifest first; prioritize OCR for likely quote-dense items; mark confidence. |
| Archive includes third-party/editorial material | High | Store speaker attribution and surrounding context; do not assume all archive text is Chekhov. |
| Copyright/permission is not automatically granted by web access | High | Treat quote bank as internal candidates pending Lisa/NMCA/UWindsor clearance. |
| “Directing” may be expressed without the word “director” | Medium | Search adjacent concepts: composition, atmosphere, ensemble, rhythm, staging, audience, production. |
| OCR errors can alter quote meaning | High | Require manual/visual verification before final recommendation. |
| Site/API pagination or search quirks | Medium | Use API headers/counts, cache raw JSON, and record failed URLs. |

## 7. Open questions for Dawson/Lisa, not blockers to start

1. Intended use: internal beta inspiration cards, Library source cards, public marketing copy, or all of the above?
2. How much direct quotation is acceptable before explicit UWindsor/NMCA clearance: microquotes only, short excerpts, or none public until cleared?
3. Should we favor quotes from acting lessons/classes only, or include “The Pencil” / Hurst du Prey memoir material as contextual background?
4. For directing, is Lisa primarily looking for practical rehearsal/director guidance, philosophical statements about theatre, or both?

Default until answered: build the full evidence-backed candidate bank, label publication/clearance status conservatively, and keep app copy recommendations internal-review-only.
