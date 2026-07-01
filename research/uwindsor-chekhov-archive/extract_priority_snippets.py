#!/usr/bin/env python3
"""Download/extract high-priority Chekhov PDFs and produce directing snippets.

Requires pypdf in a venv. Designed for a small prioritized sample, not the full archive.
"""
from __future__ import annotations

import csv
import json
import re
import textwrap
import time
from pathlib import Path
from urllib.request import Request, urlopen

from pypdf import PdfReader  # type: ignore[import-not-found]

ROOT = Path(__file__).resolve().parent
PDF_DIR = ROOT / "pdf_cache"
TEXT_DIR = ROOT / "extracted_text"
USER_AGENT = "Hermes/Rudy research extraction sample for Dawson and Lisa Dalton"

DIRECTING_TERMS = [
    "director", "directing", "rehearsal", "rehearsals", "production", "stage",
    "mise", "scene", "atmosphere", "ensemble", "audience", "composition", "rhythm",
    "tempo", "style", "form", "play", "actor", "author", "collaboration",
]


def slug(s: str, max_len: int = 80) -> str:
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:max_len] or "untitled"


def load_priority_ids(limit: int = 16) -> list[int]:
    ids: list[int] = []
    with (ROOT / "metadata_hits_directing.csv").open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            try:
                item_id = int(row["id"])
            except Exception:
                continue
            if item_id not in ids:
                ids.append(item_id)
            if len(ids) >= limit:
                break
    # Always include the explicit directing class if not already in top limit.
    if 1077 not in ids:
        ids.insert(0, 1077)
    return ids


def download(url: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 0:
        return
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=90) as resp:
        path.write_bytes(resp.read())
    time.sleep(0.3)


def extract_pages(pdf_path: Path) -> list[str]:
    reader = PdfReader(str(pdf_path))
    pages: list[str] = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception as exc:
            pages.append(f"[EXTRACTION ERROR: {exc!r}]")
    return pages


def clean_line(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def snippets_for_pages(pages: list[str], terms: list[str]) -> list[dict[str, object]]:
    out: list[dict[str, object]] = []
    for idx, text in enumerate(pages, start=1):
        low = text.lower()
        found = sorted({t for t in terms if t.lower() in low})
        if not found:
            continue
        # Build paragraph-ish chunks and keep chunks around matched terms.
        chunks = re.split(r"\n\s*\n|(?<=\.)\s+(?=[A-Z'\"“])", text)
        seen = set()
        for ch in chunks:
            c = clean_line(ch)
            if len(c) < 80:
                continue
            c_low = c.lower()
            matched = [t for t in found if t.lower() in c_low]
            if not matched:
                continue
            key = c[:160]
            if key in seen:
                continue
            seen.add(key)
            out.append({"page_index": idx, "matched_terms": matched, "text": c[:1200]})
            if len(out) >= 12:
                return out
    return out


def main() -> None:
    PDF_DIR.mkdir(exist_ok=True)
    TEXT_DIR.mkdir(exist_ok=True)
    manifest = json.loads((ROOT / "archive_manifest.json").read_text(encoding="utf-8"))
    by_id = {int(i["id"]): i for i in manifest["items"]}
    priority_ids = load_priority_ids()
    report = ["# Directing-oriented extracted snippet sample", "", "This is a preliminary OCR/text-layer sample from prioritized PDFs. Treat snippets as candidates pending visual/manual verification against the PDF image.", ""]
    index_rows = []
    for item_id in priority_ids:
        item = by_id.get(item_id)
        if not item or not item.get("media"):
            continue
        media = next((m for m in item["media"] if m.get("media_type") == "application/pdf" and m.get("original_url")), None)
        if not media:
            continue
        pdf_name = f"item_{item_id}_{slug(item.get('title') or '')}.pdf"
        pdf_path = PDF_DIR / pdf_name
        download(media["original_url"], pdf_path)
        pages = extract_pages(pdf_path)
        text_path = TEXT_DIR / f"item_{item_id}_{slug(item.get('title') or '')}.txt"
        with text_path.open("w", encoding="utf-8") as f:
            for n, page in enumerate(pages, start=1):
                f.write(f"\n\n===== PDF PAGE {n} =====\n\n")
                f.write(page)
        snips = snippets_for_pages(pages, DIRECTING_TERMS)
        index_rows.append({
            "item_id": item_id,
            "title": item.get("title"),
            "date": item.get("date"),
            "item_url": item.get("item_url"),
            "pdf_url": media.get("original_url"),
            "pdf_path": str(pdf_path.relative_to(ROOT)),
            "text_path": str(text_path.relative_to(ROOT)),
            "pages": len(pages),
            "snippets": len(snips),
        })
        report.append(f"## Item {item_id}: {item.get('title')} ({item.get('date') or 'undated'})")
        report.append(f"- Archive: {item.get('item_url')}")
        report.append(f"- PDF: {media.get('original_url')}")
        report.append(f"- Local text: `{text_path.relative_to(ROOT)}`")
        report.append(f"- Pages extracted: {len(pages)}")
        report.append("")
        if not snips:
            report.append("No directing-term snippets found in extracted text.\n")
            continue
        for sn in snips[:8]:
            matched_terms = sn.get("matched_terms")
            if isinstance(matched_terms, list):
                terms = ", ".join(str(t) for t in matched_terms)
            else:
                terms = str(matched_terms or "")
            snippet_text = str(sn.get("text") or "")
            wrapped = textwrap.fill(snippet_text, width=100)
            report.append(f"### Candidate snippet — PDF page {sn['page_index']} — terms: {terms}")
            report.append("")
            report.append(f"> {wrapped}")
            report.append("")
    (ROOT / "directing_snippets_sample.md").write_text("\n".join(report), encoding="utf-8")
    with (ROOT / "extraction_index.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["item_id", "title", "date", "item_url", "pdf_url", "pdf_path", "text_path", "pages", "snippets"])
        writer.writeheader()
        writer.writerows(index_rows)
    print("extracted", len(index_rows), "items")
    print(ROOT / "directing_snippets_sample.md")


if __name__ == "__main__":
    main()
