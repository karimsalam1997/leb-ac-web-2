#!/usr/bin/env python3
"""Build a YouTube transcript pack for the Lebanon-Israel war report."""

from __future__ import annotations

import csv
import json
import re
import sys
from datetime import datetime
from pathlib import Path

import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "RESEARCH" / "lebanon-war-battlefield-report-2026-06-24"
TRANSCRIPTS_TXT = OUT / "youtube_transcripts_txt"
TRANSCRIPTS_JSON = OUT / "youtube_transcripts_json"

QUERIES = [
    "Jad Ghosn Hezbollah Israel Lebanon 2026",
    "هامش جاد حزب الله إسرائيل لبنان 2026",
    "Jad Ghosn Wafiq Safa Hezbollah June 2026",
    "Al Mahatta المحطة حزب الله إسرائيل لبنان 2026",
    "المحطة بودكاست حزب الله إسرائيل لبنان 2026",
    "Bodcast بودكاست حزب الله إسرائيل لبنان 2026",
    "بودكاست حزب الله إسرائيل لبنان 2026",
    "Riwaya Podcast حزب الله إسرائيل لبنان 2026",
    "Tayyoun Hezbollah Lebanon Israel June 2026",
    "Mario Nawfal Hezbollah Lebanon Israel June 2026",
    "Mario Nawfal Netanyahu ceasefire Lebanon Hezbollah 2026",
    "Alpha Hezbollah Israel Lebanon June 2026",
    "Spot Shot حزب الله إسرائيل لبنان 2026",
    "Megaphone Lebanon Hezbollah Israel 2026",
    "Riwaaya Podcast Hezbollah Israel Lebanon 2026",
    "Jon Elmer Hizballah FPV drones June 2026",
    "Electronic Intifada Hizballah drones June 2026 Jon Elmer",
]

SEED_VIDEO_IDS = [
    "ItR4OPOSLaw",
    "toOmOL__Eag",
    "l_pIlBsSFWQ",
    "gXhVdK7l-9A",
    "2Xtlt_uAdYI",
    "OCeQCiRHn7A",
]

MIN_UPLOAD = "20260302"
MAX_RESULTS = 45


def clean_filename(text: str, limit: int = 130) -> str:
    text = re.sub(r"[\\/:*?\"<>|]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit].rstrip()


def search_candidates() -> dict[str, dict]:
    opts = {
        "quiet": True,
        "skip_download": True,
        "extract_flat": True,
        "socket_timeout": 25,
        "ignoreerrors": True,
    }
    candidates: dict[str, dict] = {}
    with yt_dlp.YoutubeDL(opts) as ydl:
        for query in QUERIES:
            try:
                info = ydl.extract_info(f"ytsearch12:{query}", download=False)
            except Exception as exc:
                print(f"search failed: {query}: {exc}", file=sys.stderr)
                continue
            for entry in info.get("entries") or []:
                vid = entry.get("id")
                if not vid or vid in candidates:
                    continue
                candidates[vid] = {
                    "video_id": vid,
                    "title": entry.get("title") or "",
                    "channel": entry.get("channel") or entry.get("uploader") or "",
                    "duration": entry.get("duration") or "",
                    "url": entry.get("url") or f"https://www.youtube.com/watch?v={vid}",
                    "found_by": query,
                }
    for vid in SEED_VIDEO_IDS:
        candidates.setdefault(
            vid,
            {
                "video_id": vid,
                "title": "",
                "channel": "",
                "duration": "",
                "url": f"https://www.youtube.com/watch?v={vid}",
                "found_by": "seed",
            },
        )
    return candidates


def enrich(candidate: dict) -> dict:
    opts = {
        "quiet": True,
        "skip_download": True,
        "socket_timeout": 25,
        "ignoreerrors": True,
    }
    url = f"https://www.youtube.com/watch?v={candidate['video_id']}"
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    if not info:
        return candidate
    for key in [
        "title",
        "channel",
        "uploader",
        "upload_date",
        "duration",
        "view_count",
        "webpage_url",
        "description",
    ]:
        if info.get(key) is not None:
            candidate[key] = info.get(key)
    candidate["url"] = info.get("webpage_url") or url
    return candidate


def fetch_transcript(video_id: str) -> tuple[str, list[dict]]:
    api = YouTubeTranscriptApi()
    last_error = None
    for languages in (["ar", "en"], ["en", "ar"], ["ar"], ["en"]):
        try:
            transcript = api.fetch(video_id, languages=languages)
            snippets = [
                {"text": s.text, "start": s.start, "duration": s.duration}
                for s in transcript
            ]
            language = getattr(transcript, "language_code", "") or ",".join(languages)
            return language, snippets
        except Exception as exc:
            last_error = exc
    raise RuntimeError(str(last_error))


def should_try(candidate: dict) -> bool:
    upload_date = str(candidate.get("upload_date") or "")
    if upload_date and upload_date < MIN_UPLOAD:
        return False
    title_channel = f"{candidate.get('title','')} {candidate.get('channel','')}".lower()
    terms = [
        "hezbollah",
        "hizballah",
        "حزب",
        "israel",
        "إسرائيل",
        "اسرائيل",
        "lebanon",
        "لبنان",
        "iran",
        "إيران",
        "ايران",
        "fpv",
        "drone",
        "مسيرة",
        "الجنوب",
    ]
    return any(term in title_channel for term in terms)


def write_outputs(rows: list[dict]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    TRANSCRIPTS_TXT.mkdir(parents=True, exist_ok=True)
    TRANSCRIPTS_JSON.mkdir(parents=True, exist_ok=True)

    fields = [
        "status",
        "video_id",
        "upload_date",
        "title",
        "channel",
        "duration",
        "url",
        "language",
        "snippet_count",
        "transcript_txt",
        "transcript_json",
        "found_by",
        "error",
    ]
    with (OUT / "youtube_source_metadata.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})

    summary = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "searched_queries": QUERIES,
        "seed_video_ids": SEED_VIDEO_IDS,
        "saved_transcripts": sum(1 for r in rows if r.get("status") == "saved"),
        "failed_or_skipped": sum(1 for r in rows if r.get("status") != "saved"),
    }
    (OUT / "youtube_transcript_pack_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    TRANSCRIPTS_TXT.mkdir(parents=True, exist_ok=True)
    TRANSCRIPTS_JSON.mkdir(parents=True, exist_ok=True)

    candidates = search_candidates()
    rows: list[dict] = []
    saved = 0
    for idx, candidate in enumerate(candidates.values(), 1):
        if saved >= MAX_RESULTS:
            break
        try:
            candidate = enrich(candidate)
        except Exception as exc:
            candidate["status"] = "metadata_failed"
            candidate["error"] = str(exc)
            rows.append(candidate)
            continue
        if not should_try(candidate):
            candidate["status"] = "skipped_low_relevance"
            rows.append(candidate)
            continue
        try:
            language, snippets = fetch_transcript(candidate["video_id"])
        except Exception as exc:
            candidate["status"] = "transcript_failed"
            candidate["error"] = str(exc)
            rows.append(candidate)
            continue

        upload_date = candidate.get("upload_date") or "unknown-date"
        title = candidate.get("title") or candidate["video_id"]
        base = f"{upload_date} - {clean_filename(title)} [{candidate['video_id']}]"
        txt_path = TRANSCRIPTS_TXT / f"{base}.txt"
        json_path = TRANSCRIPTS_JSON / f"{base}.json"
        text_body = "\n".join(s["text"].replace("\n", " ").strip() for s in snippets if s["text"].strip())
        header = [
            f"Title: {title}",
            f"Channel: {candidate.get('channel') or candidate.get('uploader') or ''}",
            f"Upload date: {upload_date}",
            f"URL: {candidate.get('url')}",
            f"Video ID: {candidate['video_id']}",
            f"Transcript language requested/found: {language}",
            "Note: This text comes from YouTube captions or auto-captions and may contain errors.",
            "",
        ]
        txt_path.write_text("\n".join(header) + text_body + "\n", encoding="utf-8")
        json_path.write_text(json.dumps(snippets, ensure_ascii=False, indent=2), encoding="utf-8")

        candidate.update(
            {
                "status": "saved",
                "language": language,
                "snippet_count": len(snippets),
                "transcript_txt": str(txt_path.relative_to(ROOT)),
                "transcript_json": str(json_path.relative_to(ROOT)),
                "error": "",
            }
        )
        rows.append(candidate)
        saved += 1
        print(f"saved {saved}: {candidate['video_id']} | {title}")

    write_outputs(rows)
    print(f"done: saved {saved} transcripts into {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
