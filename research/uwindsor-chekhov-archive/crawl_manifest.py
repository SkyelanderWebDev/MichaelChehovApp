#!/usr/bin/env python3
"""Polite Omeka S manifest crawl for the UWindsor Michael Chekhov archive.

This is metadata/API only: it does not download PDFs/media binaries.
"""
from __future__ import annotations

import csv
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE = "https://collections.uwindsor.ca"
SITE_ID = 2
SITE_SLUG = "chekhov"
USER_AGENT = "Hermes/Rudy research crawl for Dawson and Lisa Dalton; contact via site owner if needed"
OUT_DIR = Path(__file__).resolve().parent

DIRECTING_TERMS = [
    "direct", "director", "directing", "stage director", "rehearsal", "rehearse",
    "production", "staging", "scene", "mise", "composition", "audience", "ensemble",
    "atmosphere", "rhythm", "tempo", "form", "style", "play", "theatre", "theater",
    "task", "objective", "action", "group", "actor-director", "actors and director",
]
GENERAL_APP_TERMS = [
    "imagination", "imaginary", "atmosphere", "radiation", "concentration", "attention",
    "objective", "gesture", "psychological gesture", "body", "movement", "feeling", "truth",
    "beauty", "ensemble", "rhythm", "tempo", "character", "transformation", "individuality",
    "inspiration", "creative", "actor", "art", "theatre", "theater", "will", "soul",
]


def fetch_json(path: str, params: dict[str, Any] | None = None) -> tuple[Any, dict[str, str]]:
    url = BASE + path
    if params:
        url += "?" + urlencode(params)
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            headers = {k: v for k, v in resp.headers.items()}
            return data, headers
    except (HTTPError, URLError, TimeoutError) as exc:
        raise RuntimeError(f"Fetch failed for {url}: {exc!r}") from exc


def fetch_all(path: str, params: dict[str, Any] | None = None, per_page: int = 100) -> tuple[list[Any], dict[str, Any]]:
    all_rows: list[Any] = []
    page = 1
    total_header = None
    while True:
        p = dict(params or {})
        p.update({"per_page": per_page, "page": page})
        rows, headers = fetch_json(path, p)
        if not isinstance(rows, list):
            raise RuntimeError(f"Expected list from {path}, got {type(rows).__name__}")
        if total_header is None:
            total_header = headers.get("Omeka-S-Total-Results")
        all_rows.extend(rows)
        if len(rows) < per_page:
            break
        page += 1
        time.sleep(0.25)
    meta = {"reported_total": int(total_header) if total_header and total_header.isdigit() else total_header, "pages_fetched": page, "rows_fetched": len(all_rows)}
    return all_rows, meta


def vals(obj: dict[str, Any], key: str) -> list[str]:
    out: list[str] = []
    for v in obj.get(key, []) or []:
        if isinstance(v, dict):
            if "@value" in v:
                out.append(str(v["@value"]))
            elif "o:id" in v:
                out.append(str(v["o:id"]))
    return out


def first(obj: dict[str, Any], key: str) -> str | None:
    xs = vals(obj, key)
    return xs[0] if xs else None


def tags(obj: dict[str, Any]) -> list[str]:
    out: list[str] = []
    for t in obj.get("o-module-folksonomy:tag", []) or []:
        if isinstance(t, dict) and t.get("o:id"):
            out.append(str(t["o:id"]))
    return sorted(set(out), key=str.lower)


def media_ids(item: dict[str, Any]) -> list[int]:
    ids: list[int] = []
    for m in item.get("o:media", []) or []:
        if isinstance(m, dict) and isinstance(m.get("o:id"), int):
            ids.append(m["o:id"])
    return ids


def normalize_item(item: dict[str, Any], media_by_id: dict[int, dict[str, Any]]) -> dict[str, Any]:
    mids = media_ids(item)
    media_records = [media_by_id.get(mid, {}) for mid in mids]
    return {
        "id": item.get("o:id"),
        "title": item.get("o:title") or first(item, "dcterms:title"),
        "item_url": f"{BASE}/{SITE_SLUG}/item/{item.get('o:id')}",
        "api_url": item.get("@id"),
        "date": first(item, "dcterms:date"),
        "creator": vals(item, "dcterms:creator"),
        "subject": vals(item, "dcterms:subject"),
        "description": vals(item, "dcterms:description"),
        "extent": vals(item, "dcterms:extent"),
        "format": vals(item, "dcterms:format"),
        "language": vals(item, "dcterms:language"),
        "identifier": vals(item, "dcterms:identifier"),
        "tags": tags(item),
        "item_sets": [s.get("o:id") for s in item.get("o:item_set", []) if isinstance(s, dict)],
        "media_ids": mids,
        "media": [
            {
                "id": m.get("o:id"),
                "media_type": m.get("o:media_type"),
                "source": m.get("o:source"),
                "filename": m.get("o:filename"),
                "size": m.get("o:size"),
                "sha256": m.get("o:sha256"),
                "original_url": m.get("o:original_url"),
                "api_url": m.get("@id"),
            }
            for m in media_records
            if m
        ],
    }


def haystack(row: dict[str, Any]) -> str:
    parts: list[str] = []
    for k in ["title", "date"]:
        v = row.get(k)
        if v:
            parts.append(str(v))
    for k in ["creator", "subject", "description", "extent", "format", "language", "identifier", "tags"]:
        v = row.get(k)
        if isinstance(v, list):
            parts.extend(map(str, v))
        elif v:
            parts.append(str(v))
    return "\n".join(parts)


def match_terms(text: str, terms: list[str]) -> list[str]:
    low = text.lower()
    found = []
    for term in terms:
        # word-boundary-ish for single words, substring for phrases.
        if " " in term or "-" in term:
            ok = term.lower() in low
        else:
            ok = re.search(r"(?<![a-z])" + re.escape(term.lower()) + r"(?![a-z])", low) is not None
        if ok:
            found.append(term)
    return found


def write_hits(path: Path, rows: list[dict[str, Any]], terms: list[str]) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    for row in rows:
        found = match_terms(haystack(row), terms)
        if found:
            hits.append({
                "score": len(found),
                "matched_terms": "; ".join(found),
                "id": row["id"],
                "title": row.get("title") or "",
                "date": row.get("date") or "",
                "item_url": row["item_url"],
                "subjects": "; ".join(row.get("subject") or []),
                "tags": "; ".join(row.get("tags") or []),
                "media_urls": "; ".join(m.get("original_url") or "" for m in row.get("media", [])),
            })
    hits.sort(key=lambda h: (-h["score"], str(h["date"]), str(h["title"]).lower()))
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["score", "matched_terms", "id", "title", "date", "item_url", "subjects", "tags", "media_urls"])
        writer.writeheader()
        writer.writerows(hits)
    return hits


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    site, _ = fetch_json(f"/api/sites/{SITE_ID}")
    pages, pages_meta = fetch_all("/api/site_pages", {"site_id": SITE_ID})
    items, items_meta = fetch_all("/api/items", {"site_id": SITE_ID})
    media, media_meta = fetch_all("/api/media", {"site_id": SITE_ID})
    media_by_id = {m.get("o:id"): m for m in media if isinstance(m.get("o:id"), int)}
    normalized_items = [normalize_item(i, media_by_id) for i in items]

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE,
        "site_id": SITE_ID,
        "site_slug": SITE_SLUG,
        "site": {
            "id": site.get("o:id"),
            "slug": site.get("o:slug"),
            "title": site.get("o:title"),
            "summary": site.get("o:summary"),
            "api_url": site.get("@id"),
        },
        "counts": {"pages": pages_meta, "items": items_meta, "media": media_meta},
        "site_pages": [
            {"id": p.get("o:id"), "slug": p.get("o:slug"), "title": p.get("o:title"), "url": f"{BASE}/{SITE_SLUG}/{p.get('o:slug')}", "api_url": p.get("@id")}
            for p in pages
        ],
        "items": normalized_items,
    }
    (OUT_DIR / "archive_manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "raw_site.json").write_text(json.dumps(site, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "raw_site_pages.json").write_text(json.dumps(pages, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "raw_items.json").write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "raw_media.json").write_text(json.dumps(media, indent=2, ensure_ascii=False), encoding="utf-8")

    directing_hits = write_hits(OUT_DIR / "metadata_hits_directing.csv", normalized_items, DIRECTING_TERMS)
    general_hits = write_hits(OUT_DIR / "metadata_hits_general.csv", normalized_items, GENERAL_APP_TERMS)

    media_types: dict[str, int] = {}
    for m in media:
        media_types[m.get("o:media_type") or "unknown"] = media_types.get(m.get("o:media_type") or "unknown", 0) + 1
    clusters = [f"- {p.get('o:title')} — {BASE}/{SITE_SLUG}/{p.get('o:slug')}" for p in pages]

    summary = f"""# UWindsor Chekhov archive metadata crawl summary

Generated: {manifest['generated_at']}

## Counts

- Site pages: reported {pages_meta.get('reported_total')}, fetched {pages_meta.get('rows_fetched')}
- Items: reported {items_meta.get('reported_total')}, fetched {items_meta.get('rows_fetched')}
- Media: reported {media_meta.get('reported_total')}, fetched {media_meta.get('rows_fetched')}

## Media types

"""
    for mt, count in sorted(media_types.items(), key=lambda kv: (-kv[1], kv[0])):
        summary += f"- {mt}: {count}\n"
    summary += f"""
## Metadata keyword hits

- Directing-related metadata hits: {len(directing_hits)}
- General app-theme metadata hits: {len(general_hits)}

Top directing metadata hits:
"""
    for h in directing_hits[:20]:
        summary += f"- score {h['score']}: item {h['id']} — {h['title']} ({h['date']}) — {h['item_url']} — terms: {h['matched_terms']}\n"
    summary += "\n## Site page clusters\n\n" + "\n".join(clusters) + "\n"
    summary += "\n## Notes\n\nThis crawl is metadata/API only. Direct quote extraction still requires PDF text extraction and/or OCR with page-level verification.\n"
    (OUT_DIR / "archive_summary.md").write_text(summary, encoding="utf-8")
    print(summary)


if __name__ == "__main__":
    main()
