**API/Crawl Findings**

I could not reach UWindsor from this sandbox:

```bash
curl -sS -I 'https://collections.uwindsor.ca/api/sites/2'
# curl: (6) Could not resolve host: collections.uwindsor.ca
```

So I could not truthfully verify live counts or sample records here. For Rudy, the proposed Omeka S crawl should start with:

```bash
BASE='https://collections.uwindsor.ca'

curl -sS -D - "$BASE/api/sites/2" -o /dev/null
curl -sS "$BASE/api/site_pages?site_id=2&per_page=100" | jq 'length'
curl -sS "$BASE/api/items?site_id=2&per_page=100&page=1" | jq 'length, .[0] | keys'
curl -sS "$BASE/api/media?site_id=2&per_page=100&page=1" | jq 'length, .[0] | keys'
```

Pagination approach: use `per_page=100&page=N`, read total headers if present, and also stop when a page returns `[]` or fewer than `per_page`. Expected from prior recon: 27 pages, 726 items, 726 media, so items/media should be 8 pages at `per_page=100`.

Useful item/media fields to extract:

```text
o:id
o:title
@id
o:created
o:modified
o:resource_class
o:resource_template
o:item_set
o:media
dcterms:title
dcterms:creator
dcterms:date
dcterms:description
dcterms:subject
dcterms:source
dcterms:identifier
dcterms:rights
o:media_type
o:source
o:original_url
o:thumbnail_urls
o:item
```

Also preserve all unknown predicates under `all_properties`; archive-specific tags/keywords may not use predictable names.

**Manifest Schema Proposal**

`archive_manifest.json`:

```json
{
  "crawl": {
    "source": "UWindsor Omeka: Michael Chekhov: The Actor is the Theatre",
    "site_id": 2,
    "api_base": "https://collections.uwindsor.ca/api",
    "crawled_at": "ISO-8601",
    "per_page": 100,
    "counts": { "site_pages": 27, "items": 726, "media": 726 }
  },
  "site_pages": [
    {
      "id": 0,
      "title": "",
      "slug": "",
      "api_url": "",
      "site_url": "",
      "block_item_ids": []
    }
  ],
  "items": [
    {
      "item_id": 0,
      "api_url": "",
      "site_url": "",
      "title": "",
      "date": [],
      "creator": [],
      "subject": [],
      "tags": [],
      "description": [],
      "source": [],
      "identifier": [],
      "rights": [],
      "resource_class": {},
      "resource_template": {},
      "media_ids": [],
      "all_properties": {}
    }
  ],
  "media": [
    {
      "media_id": 0,
      "item_id": 0,
      "api_url": "",
      "title": "",
      "media_type": "",
      "source": "",
      "original_url": "",
      "thumbnail_urls": {},
      "planned_local_path": "",
      "text_extraction": {
        "status": "pending",
        "method": null,
        "text_path": null,
        "page_count": null,
        "ocr_required": null,
        "errors": []
      }
    }
  ]
}
```

`quote_candidates.csv` columns:

```text
candidate_id,item_id,item_title,item_date,item_creator,item_subjects,
media_id,media_title,media_type,item_page_url,media_api_url,original_url,
local_file,text_method,page_number,char_start,char_end,candidate_text,
context_before,context_after,matched_terms,directing_score,method_score,
provenance_score,total_score,ocr_confidence,needs_manual_verification,rights,notes
```

**Text Extraction/OCR Plan**

First check whether media API exposes text-like fields. If not, download `o:original_url`.

```bash
curl -sS "$BASE/api/media?site_id=2&per_page=5&page=1" \
  | jq '.[0] | {id:."o:id", title:."o:title", item:."o:item", media_type:."o:media_type", source:."o:source", original_url:."o:original_url", thumbnail_urls:."o:thumbnail_urls"}'
```

PDF pipeline:

```bash
pdftotext -layout input.pdf output.txt
pdfinfo input.pdf
```

If extracted text is empty or garbage:

```bash
ocrmypdf --skip-text --deskew --rotate-pages input.pdf ocr.pdf
pdftotext -layout ocr.pdf output.txt
```

Image media needs OCR:

```bash
tesseract image.jpg output -l eng tsv
```

Blockers: live API access failed in this environment, so media text availability and exact item page URL pattern still need Rudy verification.

**Directing Keyword/Search Plan**

Core directing terms:

```text
director, directors, director's, directing, direction, directed
stage director, staging, rehearsal, rehearsals, rehearse, production,
cast, company, ensemble, scene, scenes, play, theatre, theater, performance
```

Chekhov-method proximity terms:

```text
atmosphere, psychological gesture, gesture, imaginary body, objective,
radiation, receiving, imagination, creative individuality, higher ego,
tempo, rhythm, composition, character, transformation, qualities, movement
```

Rank candidate passages by:

```text
+5 core directing term in candidate text
+4 directing term in title/subject/description
+3 directing term within 60 tokens of Chekhov-method term
+2 source type suggests lecture/notes/manuscript/interview/rehearsal
+2 clean embedded PDF text with page number
-3 OCR-only with poor confidence
-5 repeated boilerplate/navigation/catalog text
```

No quote should be treated as usable until manually checked against the PDF/image page.

**Data Quality Risks**

OCR will likely split names, hyphenate words, and corrupt punctuation. Metadata may use inconsistent dates/creators. “Direction” can mean navigation or artistic direction, so proximity scoring matters. Rights/permissions must stay attached to every quote candidate. UI search may index text that the API does not expose, so compare API results against `/chekhov/index/search`.

**Suggested Next Commands**

```bash
BASE='https://collections.uwindsor.ca'

curl -sS -D headers.txt "$BASE/api/items?site_id=2&per_page=100&page=1" -o items-page1.json
cat headers.txt | grep -i 'total\|link\|content-type'
jq 'length, .[0] | keys' items-page1.json

for p in $(seq 1 8); do
  curl -sS "$BASE/api/items?site_id=2&per_page=100&page=$p" > "items-$p.json"
  jq length "items-$p.json"
done

for p in $(seq 1 8); do
  curl -sS "$BASE/api/media?site_id=2&per_page=100&page=$p" > "media-$p.json"
  jq length "media-$p.json"
done

curl -L -sS "$BASE/chekhov/index/search" | grep -Eo 'name="[^"]+"' | sort -u
curl -G -L "$BASE/chekhov/index/search" --data-urlencode 'query=directing'
```

For the controller: build manifest first, then download media, then extract text, then generate `quote_candidates.csv` from verified local text with page/offset provenance.