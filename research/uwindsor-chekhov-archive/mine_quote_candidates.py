#!/usr/bin/env python3
"""Mine raw quote candidates from the UWindsor Chekhov Omeka archive PDFs.

Outputs are candidate/internal-only. They are extracted text/OCR-layer snippets, not
publication-ready quotations. Manual visual verification against the PDF page is required
before any app or public use.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

try:
    import fitz  # type: ignore[import-not-found]
except Exception:  # pragma: no cover - dependency handled by runtime command
    fitz = None  # type: ignore[assignment]

ROOT = Path(__file__).resolve().parent
PDF_DIR = ROOT / "pdf_cache"
TEXT_DIR = ROOT / "extracted_text_all"
PAGE_INDEX = ROOT / "page_text_index.jsonl"
RAW_CSV = ROOT / "quote_candidates_raw.csv"
PRIORITY_CSV = ROOT / "quote_candidates_priority.csv"
SUMMARY = ROOT / "quote_mining_summary.md"
USER_AGENT = "Hermes/Rudy quote-mining crawl for Dawson and Lisa Dalton"

CATEGORY_TERMS: dict[str, list[str]] = {
    "actor_struggle": [
        "fear", "anxiety", "nervous", "self-conscious", "self conscious", "tension", "tense", "stiff",
        "cold", "habit", "routine", "mechanical", "dead", "lifeless", "cliche", "cliché", "clichés",
        "difficulty", "difficult", "problem", "trouble", "weak", "lazy", "blind", "blocked", "stop",
        "mistake", "naturalism", "naturalistic", "imitation", "intellectual", "analyzing", "analyse",
        "talking", "unable", "cannot", "can't", "concentrate", "attention", "body", "voice", "speech",
        "feeling", "feelings", "will", "objective", "desire", "ability", "life on stage",
    ],
    "daily_inspiration": [
        "imagination", "imaginary", "creative", "creativity", "inspiration", "inspire", "inspired",
        "individuality", "higher individuality", "higher ego", "truth", "beauty", "life", "soul", "art",
        "theatre", "theater", "actor is the theatre", "future", "free", "freedom", "transformation",
        "radiation", "receiving", "love", "joy", "courage", "whole", "ensemble", "atmosphere", "living",
    ],
    "directing_academic_footnote": [
        "director", "directors", "director's", "directing", "direction", "rehearsal", "rehearsals",
        "rehearse", "rehearsing", "production", "main event", "events", "event", "climax", "climaxes",
        "significant moment", "significant moments", "important moment", "important moments", "moment",
        "moments", "first", "beginning", "middle", "end", "whole", "composition", "scene", "scenes",
        "action", "objective", "play", "staging", "mise", "audience", "cast", "group", "ensemble",
        "atmosphere", "rhythm", "tempo", "style", "form", "structure", "author", "actor and director",
    ],
    "method_terms": [
        "psychological gesture", "gesture", "qualities", "quality", "atmosphere", "imaginary body",
        "radiation", "receiving", "concentration", "attention", "objective", "action", "tempo", "rhythm",
        "style", "form", "characterization", "transformation", "archetype", "center", "centres", "centers",
    ],
}

JUICY_MARKERS = [
    "we must", "you must", "the actor", "the director", "it is", "there is", "there are", "always",
    "never", "cannot", "can not", "should", "must", "let us", "we can", "you can", "in order to",
    "the most", "the first", "the whole", "the beginning", "the end", "the aim", "the task",
]

NOISE_RE = re.compile(r"[^A-Za-z0-9\s.,;:'\"!?()\-—–/\[\]“”‘’%]")
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+(?=(?:[A-Z0-9\"“‘']))")


@dataclass
class Candidate:
    score: int
    item_id: int
    media_id: int | None
    item_title: str
    item_date: str
    item_creator: str
    item_url: str
    pdf_url: str
    local_pdf: str
    text_path: str
    page_index: int
    candidate_text: str
    context_before: str
    context_after: str
    categories: list[str]
    matched_terms: list[str]
    extraction_quality: float
    clearance_status: str = "internal_candidate_only__not_publicly_cleared"
    verification_status: str = "needs_visual_verification"
    attribution_mode: str = "lesson/transcription/UWindsor attribution approved by Dawson, exact source context still required"


def slug(s: str, max_len: int = 90) -> str:
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:max_len] or "untitled"


def download(url: str, path: Path, expected_size: int | None = None) -> str:
    if path.exists() and path.stat().st_size > 0:
        if not expected_size or abs(path.stat().st_size - expected_size) < 2048:
            return "cached"
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=120) as resp:
        data = resp.read()
    path.write_bytes(data)
    time.sleep(0.15)
    return "downloaded"


def extract_pages_with_fitz(pdf_path: Path) -> list[str]:
    if fitz is None:
        raise RuntimeError("PyMuPDF/fitz is not installed. Install requirements first.")
    pages: list[str] = []
    with fitz.open(pdf_path) as doc:  # type: ignore[union-attr]
        for page in doc:
            try:
                pages.append(page.get_text("text") or "")
            except Exception as exc:
                pages.append(f"[EXTRACTION ERROR: {exc!r}]")
    return pages


def text_quality(text: str) -> float:
    if not text.strip():
        return 0.0
    printable = sum(1 for c in text if c.isprintable() or c.isspace()) / max(len(text), 1)
    alpha = sum(1 for c in text if c.isalpha()) / max(len(text), 1)
    spaces = sum(1 for c in text if c.isspace()) / max(len(text), 1)
    noise = len(NOISE_RE.findall(text)) / max(len(text), 1)
    # OCR is noisy, so don't be too strict. This is a rough confidence proxy.
    return max(0.0, min(1.0, printable * 0.35 + alpha * 0.45 + min(spaces * 5, 1) * 0.15 - noise * 0.6 + 0.05))


def normalize_for_candidate(text: str) -> str:
    text = text.replace("\u00ad", "")
    text = re.sub(r"(?<=\w)-\s+(?=\w)", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def term_matches(text: str) -> tuple[list[str], list[str]]:
    low = text.lower()
    cats: list[str] = []
    terms: list[str] = []
    for cat, cat_terms in CATEGORY_TERMS.items():
        found: list[str] = []
        for term in cat_terms:
            t = term.lower()
            if " " in t or "'" in t or "-" in t:
                ok = t in low
            else:
                ok = re.search(r"(?<![a-z])" + re.escape(t) + r"(?![a-z])", low) is not None
            if ok:
                found.append(term)
        if found:
            cats.append(cat)
            terms.extend(found)
    return cats, sorted(set(terms), key=str.lower)


def split_candidate_units(page_text: str) -> list[tuple[str, str, str]]:
    """Return candidate text with before/after context from sentence-ish windows."""
    clean = normalize_for_candidate(page_text)
    if not clean:
        return []
    sentences = [s.strip() for s in SENTENCE_RE.split(clean) if s.strip()]
    if len(sentences) < 2:
        # OCR often has missing punctuation; fall back to chunks.
        chunks = [c.strip() for c in re.split(r"\s{2,}|\n", page_text) if c.strip()]
        sentences = [normalize_for_candidate(c) for c in chunks if len(normalize_for_candidate(c)) >= 50]
    units: list[tuple[str, str, str]] = []
    for i, sent in enumerate(sentences):
        for n in (1, 2):
            window = " ".join(sentences[i:i+n]).strip()
            if len(window) < 70 or len(window) > 650:
                continue
            before = sentences[i - 1] if i > 0 else ""
            after = sentences[i + n] if i + n < len(sentences) else ""
            units.append((window, before[:450], after[:450]))
    return units


def source_authority(item: dict[str, Any]) -> tuple[str, int]:
    creator_text = " ; ".join(str(x) for x in (item.get("creator") or []))
    title = str(item.get("title") or "")
    combined = f"{creator_text} {title}".lower()
    if "michael chekhov" in creator_text.lower():
        if "transcribed" in creator_text.lower():
            return "primary_chekhov_transcription", 18
        return "primary_chekhov", 18
    if "michael chekhov's" in title.lower() or title.lower().startswith("michael chekhov"):
        return "likely_primary_chekhov_context", 10
    if "chekhov" in combined:
        return "chekhov_related_third_party_or_context", -4
    return "third_party_or_context", -14


def score_candidate(text: str, cats: list[str], terms: list[str], quality: float, authority_score: int) -> int:
    score = authority_score
    if "directing_academic_footnote" in cats:
        score += 18
    if "actor_struggle" in cats:
        score += 15
    if "daily_inspiration" in cats:
        score += 13
    if "method_terms" in cats:
        score += 8
    score += min(len(terms), 12) * 3
    low = text.lower()
    score += sum(3 for marker in JUICY_MARKERS if marker in low)
    # Lisa-specific footnote boosters.
    for phrase in ["main event", "climax", "significant moment", "important moment", "beginning", "middle", "end", "whole play", "first"]:
        if phrase in low:
            score += 8
    # App surface booster: concise 1-2 sentence notification quote.
    if 90 <= len(text) <= 360:
        score += 8
    elif 361 <= len(text) <= 520:
        score += 3
    if quality < 0.35:
        score -= 12
    elif quality > 0.55:
        score += 5
    # Penalize obvious front matter/catalog tables but do not eliminate.
    if any(x in low for x in ["michael chekhov's", "carbon copies", "university of windsor", "accession"]):
        score -= 5
    return score


def candidate_rows(candidates: list[Candidate]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for c in candidates:
        rows.append({
            "score": c.score,
            "item_id": c.item_id,
            "media_id": c.media_id or "",
            "item_title": c.item_title,
            "item_date": c.item_date,
            "item_creator": c.item_creator,
            "item_url": c.item_url,
            "pdf_url": c.pdf_url,
            "local_pdf": c.local_pdf,
            "text_path": c.text_path,
            "page_index": c.page_index,
            "candidate_text_from_extraction_not_final": c.candidate_text,
            "context_before": c.context_before,
            "context_after": c.context_after,
            "categories": ";".join(c.categories),
            "matched_terms": ";".join(c.matched_terms),
            "extraction_quality_proxy": f"{c.extraction_quality:.3f}",
            "clearance_status": c.clearance_status,
            "verification_status": c.verification_status,
            "attribution_mode": c.attribution_mode,
        })
    return rows


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields = [
        "score", "item_id", "media_id", "item_title", "item_date", "item_creator", "item_url", "pdf_url", "local_pdf",
        "text_path", "page_index", "candidate_text_from_extraction_not_final", "context_before", "context_after",
        "categories", "matched_terms", "extraction_quality_proxy", "clearance_status", "verification_status",
        "attribution_mode",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def load_manifest() -> dict[str, Any]:
    return json.loads((ROOT / "archive_manifest.json").read_text(encoding="utf-8"))


def pdf_media_items(manifest: dict[str, Any]) -> list[tuple[dict[str, Any], dict[str, Any]]]:
    pairs: list[tuple[dict[str, Any], dict[str, Any]]] = []
    for item in manifest["items"]:
        for media in item.get("media", []) or []:
            if media.get("media_type") == "application/pdf" and media.get("original_url"):
                pairs.append((item, media))
    return pairs


def mine(args: argparse.Namespace) -> None:
    PDF_DIR.mkdir(exist_ok=True)
    TEXT_DIR.mkdir(exist_ok=True)
    manifest = load_manifest()
    pairs = pdf_media_items(manifest)
    if args.max_pdfs:
        pairs = pairs[: args.max_pdfs]

    candidates: list[Candidate] = []
    status_rows: list[dict[str, Any]] = []
    PAGE_INDEX.write_text("", encoding="utf-8")
    processed = 0
    downloaded = 0
    cached = 0
    failed = 0

    for item, media in pairs:
        item_id = int(item["id"])
        media_id = media.get("id")
        title = str(item.get("title") or "")
        creator_text = " ; ".join(str(x) for x in (item.get("creator") or []))
        authority_label, authority_score = source_authority(item)
        pdf_path = PDF_DIR / f"item_{item_id}_{slug(title)}.pdf"
        text_path = TEXT_DIR / f"item_{item_id}_{slug(title)}.txt"
        try:
            dl_status = download(str(media["original_url"]), pdf_path, media.get("size"))
            if dl_status == "downloaded":
                downloaded += 1
            else:
                cached += 1
            pages = extract_pages_with_fitz(pdf_path)
            with text_path.open("w", encoding="utf-8") as f:
                for page_no, page_text in enumerate(pages, start=1):
                    f.write(f"\n\n===== PDF PAGE {page_no} =====\n\n")
                    f.write(page_text)
            page_records = []
            for page_no, page_text in enumerate(pages, start=1):
                quality = text_quality(page_text)
                page_record = {
                    "item_id": item_id,
                    "media_id": media_id,
                    "item_title": title,
                    "item_date": item.get("date") or "",
                    "item_url": item.get("item_url") or "",
                    "pdf_url": media.get("original_url") or "",
                    "local_pdf": str(pdf_path.relative_to(ROOT)),
                    "text_path": str(text_path.relative_to(ROOT)),
                    "page_index": page_no,
                    "chars": len(page_text),
                    "quality_proxy": quality,
                }
                page_records.append(page_record)
                for unit, before, after in split_candidate_units(page_text):
                    cats, terms = term_matches(unit)
                    if not cats:
                        continue
                    score = score_candidate(unit, cats, terms, quality, authority_score)
                    if authority_label == "third_party_or_context" and score < args.min_score + 18:
                        continue
                    if score < args.min_score:
                        continue
                    candidates.append(Candidate(
                        score=score,
                        item_id=item_id,
                        media_id=media_id if isinstance(media_id, int) else None,
                        item_title=title,
                        item_date=str(item.get("date") or ""),
                        item_creator=f"{authority_label}: {creator_text}",
                        item_url=str(item.get("item_url") or ""),
                        pdf_url=str(media.get("original_url") or ""),
                        local_pdf=str(pdf_path.relative_to(ROOT)),
                        text_path=str(text_path.relative_to(ROOT)),
                        page_index=page_no,
                        candidate_text=unit,
                        context_before=before,
                        context_after=after,
                        categories=cats,
                        matched_terms=terms,
                        extraction_quality=quality,
                    ))
            with PAGE_INDEX.open("a", encoding="utf-8") as f:
                for rec in page_records:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            status_rows.append({
                "item_id": item_id,
                "media_id": media_id,
                "title": title,
                "date": item.get("date") or "",
                "status": "ok",
                "pages": len(pages),
                "chars": sum(len(p) for p in pages),
                "pdf_path": str(pdf_path.relative_to(ROOT)),
                "text_path": str(text_path.relative_to(ROOT)),
                "candidate_count_so_far": len(candidates),
            })
        except (HTTPError, URLError, TimeoutError, RuntimeError, Exception) as exc:  # noqa: BLE001 - batch should continue
            failed += 1
            status_rows.append({
                "item_id": item_id,
                "media_id": media_id,
                "title": title,
                "date": item.get("date") or "",
                "status": f"error: {exc!r}",
                "pages": 0,
                "chars": 0,
                "pdf_path": str(pdf_path.relative_to(ROOT)),
                "text_path": str(text_path.relative_to(ROOT)),
                "candidate_count_so_far": len(candidates),
            })
        processed += 1
        if processed % args.progress_every == 0:
            print(f"processed={processed}/{len(pairs)} downloaded={downloaded} cached={cached} failed={failed} candidates={len(candidates)}", flush=True)

    # De-duplicate by normalized text + source page, then sort.
    dedup: dict[tuple[int, int, str], Candidate] = {}
    for c in candidates:
        key = (c.item_id, c.page_index, re.sub(r"\W+", "", c.candidate_text.lower())[:220])
        old = dedup.get(key)
        if old is None or c.score > old.score:
            dedup[key] = c
    candidates = sorted(dedup.values(), key=lambda c: (-c.score, c.item_date, c.item_id, c.page_index, c.candidate_text[:40]))
    raw_rows = candidate_rows(candidates)
    write_csv(RAW_CSV, raw_rows)
    write_csv(PRIORITY_CSV, raw_rows[: args.priority_limit])

    with (ROOT / "quote_extraction_status.csv").open("w", newline="", encoding="utf-8") as f:
        fields = ["item_id", "media_id", "title", "date", "status", "pages", "chars", "pdf_path", "text_path", "candidate_count_so_far"]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(status_rows)

    by_cat: dict[str, int] = {}
    for c in candidates:
        for cat in c.categories:
            by_cat[cat] = by_cat.get(cat, 0) + 1
    top_lines = []
    for c in candidates[:25]:
        top_lines.append(
            f"- score {c.score} | item {c.item_id} p.{c.page_index} | {c.item_title} | "
            f"{', '.join(c.categories)} | {c.candidate_text[:280]}"
        )
    summary = f"""# Quote mining summary — UWindsor Chekhov archive

Status: raw candidate/internal-only extraction. Exact quote wording is not final until manually verified against PDF page images. Nothing is publicly cleared until Dawson and Lisa both clear it.

## Scope processed

- PDFs considered: {len(pairs)}
- PDFs processed: {processed}
- Downloads from network: {downloaded}
- Cached PDFs reused: {cached}
- Failed PDFs: {failed}
- Raw deduplicated candidates above score threshold {args.min_score}: {len(candidates)}
- Priority candidate CSV rows: {min(len(candidates), args.priority_limit)}

## Candidate category counts

"""
    for cat, count in sorted(by_cat.items(), key=lambda kv: (-kv[1], kv[0])):
        summary += f"- {cat}: {count}\n"
    summary += "\n## Top raw candidates needing manual verification\n\n" + "\n".join(top_lines) + "\n"
    summary += "\n## Outputs\n\n"
    for path in [RAW_CSV, PRIORITY_CSV, ROOT / "quote_extraction_status.csv", PAGE_INDEX, TEXT_DIR, PDF_DIR]:
        summary += f"- `{path.relative_to(ROOT)}`\n"
    SUMMARY.write_text(summary, encoding="utf-8")
    print(summary)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-pdfs", type=int, default=0, help="Process only the first N PDFs (0 = all).")
    parser.add_argument("--min-score", type=int, default=28, help="Minimum heuristic score for raw candidates.")
    parser.add_argument("--priority-limit", type=int, default=500, help="Rows to write to priority CSV.")
    parser.add_argument("--progress-every", type=int, default=25, help="Progress print interval.")
    return parser.parse_args(argv)


if __name__ == "__main__":
    mine(parse_args(sys.argv[1:]))
