You are the Codex council lane for Dawson/Rudy on a Lisa Dalton commission. Research target: UWindsor Omeka archive “Michael Chekhov: The Actor is the Theatre”: https://collections.uwindsor.ca/chekhov/about

Mission: mechanical crawl/data-pass design and initial verification, not code edits.

Context:
- Site appears to be Omeka S, site_id=2.
- Initial reconnaissance found 27 site pages, 726 site items, 726 media records.
- Final controller needs a reproducible pipeline to crawl the whole website effectively and extract Chekhov quote candidates, especially about directing.

Your goals:
1. Verify Omeka API endpoints and pagination approach.
2. Identify metadata fields useful for quote/source provenance: item id/title/date/creator/subject/tags/media URL/item page URL.
3. Determine how PDFs/media can be downloaded and whether embedded text is available through API or needs separate extraction/OCR.
4. Propose a robust local data model/schema for archive_manifest.json and quote_candidates.csv.
5. Build a keyword inventory and ranking method for direct quote mining, especially directing-related terms.
6. If safe in read-only mode, sample a few relevant API/search queries and report exact commands/results. Do not fabricate quotes.

Suggested endpoints:
- https://collections.uwindsor.ca/api/sites/2
- https://collections.uwindsor.ca/api/site_pages?site_id=2&per_page=100
- https://collections.uwindsor.ca/api/items?site_id=2&per_page=100&page=1
- https://collections.uwindsor.ca/api/media?site_id=2&per_page=100&page=1
- https://collections.uwindsor.ca/chekhov/index/search

Constraints:
- Read-only. Do not edit the repository.
- Keep network load polite. Sampling is enough for this council pass.
- If sandbox/network blocks access, report blocker precisely and provide fallback commands for Rudy.

Final report format:
- API/crawl findings with exact endpoint examples
- Manifest schema proposal
- Text extraction/OCR plan and blockers
- Directing keyword/search plan
- Data quality risks
- Suggested next commands/pipeline for Rudy/controller
