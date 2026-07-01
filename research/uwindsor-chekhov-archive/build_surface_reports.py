#!/usr/bin/env python3
from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ROWS = list(csv.DictReader((ROOT / "quote_candidates_raw.csv").open(encoding="utf-8")))


def primary(row: dict[str, str]) -> bool:
    return "primary_chekhov" in row.get("item_creator", "")


def text(row: dict[str, str]) -> str:
    return row["candidate_text_from_extraction_not_final"]


def length_ok(row: dict[str, str], lo: int = 70, hi: int = 420) -> bool:
    n = len(text(row))
    return lo <= n <= hi


def cleanish(row: dict[str, str]) -> bool:
    t = text(row)
    if len(re.findall(r"[A-Za-z]", t)) / max(len(t), 1) < 0.55:
        return False
    if t.count(" - ") > 8:
        return False
    low = t.lower()
    if any(x in low for x in ["carbon copies", "university of windsor accession", "thumbnail", "michael chekhov collection"]):
        return False
    return True


def dedupe(selected: list[dict[str, str]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    seen: set[str] = set()
    for row in selected:
        key = re.sub(r"\W+", "", text(row).lower())[:160]
        if key in seen:
            continue
        seen.add(key)
        out.append(row)
    return out


def md_report(path: Path, title: str, selected: list[dict[str, str]]) -> None:
    lines = [
        f"# {title}",
        "",
        "Status: raw extraction candidates only. Exact wording requires visual verification against the PDF page. Nothing is publicly cleared until Dawson and Lisa both clear it.",
        "",
        f"Rows: {len(selected)}",
        "",
    ]
    for i, row in enumerate(selected, 1):
        lines += [
            f"## {i}. score {row['score']} — item {row['item_id']}, page {row['page_index']}",
            "",
            f"- Title: {row['item_title']}",
            f"- Date: {row['item_date']}",
            f"- Creator/status: {row.get('item_creator', '')}",
            f"- Archive: {row['item_url']}",
            f"- PDF: {row['pdf_url']}",
            f"- Categories: {row['categories']}",
            f"- Matched terms: {row['matched_terms']}",
            "",
            "> " + text(row).replace("\n", " "),
            "",
        ]
    path.write_text("\n".join(lines), encoding="utf-8")


def csv_report(path: Path, selected: list[dict[str, str]]) -> None:
    if not selected:
        return
    fields = list(selected[0].keys())
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(selected)


actor_daily = [
    row
    for row in ROWS
    if primary(row)
    and length_ok(row, 70, 360)
    and cleanish(row)
    and ("actor_struggle" in row["categories"] or "daily_inspiration" in row["categories"])
]
actor_daily = dedupe(sorted(actor_daily, key=lambda r: -int(r["score"])))[:150]

lisa_terms = [
    "main event", "events", "event", "climax", "climaxes", "significant moment", "significant moments",
    "important moment", "important moments", "beginning", "middle", "end", "whole play", "feeling of the whole",
    "first", "rehears",
]
directing = []
for row in ROWS:
    low = (text(row) + " " + row.get("matched_terms", "") + " " + row.get("item_title", "")).lower()
    if primary(row) and cleanish(row) and "directing_academic_footnote" in row["categories"] and any(term in low for term in lisa_terms):
        directing.append(row)
directing = dedupe(sorted(directing, key=lambda r: -int(r["score"])))[:200]

md_report(ROOT / "common_actor_struggles_quote_bucket_raw.md", "Common actor struggles / daily ping quote candidates — RAW", actor_daily)
md_report(ROOT / "chekhov_on_directing_footnote_targets_raw.md", "Chekhov on directing / footnote targets — RAW", directing)
csv_report(ROOT / "common_actor_struggles_quote_bucket_raw.csv", actor_daily)
csv_report(ROOT / "chekhov_on_directing_footnote_targets_raw.csv", directing)

print({
    "raw_rows": len(ROWS),
    "actor_daily_candidates": len(actor_daily),
    "directing_footnote_candidates": len(directing),
})
