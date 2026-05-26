from __future__ import annotations

from datetime import datetime
from hashlib import sha1
import json

from tools.signal_desk.config import load_optional_config, resolve_project_path
from tools.signal_desk.models import MediaItem, RawItem, SourceHealth


def parse_telegram_date(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def title_from_caption(text: str) -> str:
    compact = " ".join(text.replace("\n", " ").split())
    compact = compact.replace("🟡", "").replace("🟢", "").replace("🚨", "").replace("⚔️", "")
    compact = compact.replace("Hezbollah: —", "Hezbollah:").replace("Video |", "").strip(" -")
    if not compact:
        return "Telegram field report"
    return compact[:132].rstrip()


def item_id(channel: str, post_id: object, url: str) -> str:
    return sha1(f"telegram:{channel}:{post_id}:{url}".encode("utf-8")).hexdigest()[:16]


def collect_local_jsonl(config: dict, since: datetime) -> tuple[list[RawItem], list[SourceHealth]]:
    sources = config.get("local_jsonl_sources", [])
    output: list[RawItem] = []
    health: list[SourceHealth] = []
    for source in sources:
        path = resolve_project_path(str(source.get("path", "")))
        name = str(source.get("name") or path.stem)
        if not path.exists():
            health.append(SourceHealth(source=name, ok=False, item_count=0, note=f"Missing local Telegram JSONL: {path}"))
            continue

        count = 0
        with path.open("r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    payload = json.loads(line)
                except json.JSONDecodeError:
                    continue
                published_at = parse_telegram_date(payload.get("published_at_utc"))
                if not published_at or published_at < since:
                    continue
                text = str(payload.get("text") or "").strip()
                if not text:
                    continue
                channel = str(payload.get("channel") or name)
                url = str(payload.get("url") or "")
                media = []
                if payload.get("media_preview_url"):
                    media.append(MediaItem(type="preview", url=str(payload["media_preview_url"])))
                output.append(
                    RawItem(
                        id=item_id(channel, payload.get("post_id"), url),
                        source_id=f"Telegram @{channel}",
                        source_type="telegram",
                        source_bias=str(source.get("bias", "Telegram primary-source claim; keep as unverified until cross-checked.")),
                        lang=str(source.get("lang", "en")),
                        title=title_from_caption(text),
                        text=text,
                        url=url,
                        published_at=published_at,
                        media=media,
                        raw={
                            "tier": source.get("tier", 1),
                            "views": payload.get("views"),
                            "reactions": payload.get("reactions"),
                            "score": payload.get("score"),
                            "verification_note": payload.get("verification_note"),
                            "has_video": payload.get("has_video"),
                            "has_photo": payload.get("has_photo"),
                            "video_duration": payload.get("video_duration"),
                        },
                    )
                )
                count += 1

        health.append(SourceHealth(source=name, ok=True, item_count=count, note=f"Read local scraper output from {path.name}; no Telegram session file was touched."))
    return output, health


def collect(since: datetime) -> tuple[list[RawItem], list[SourceHealth]]:
    config = load_optional_config("telegram.yaml")
    local_items, local_health = collect_local_jsonl(config, since)
    channels = [channel for channel in config.get("channels", []) if channel.get("handle") and channel.get("handle") != "@PLACEHOLDER"]
    if not channels:
        return local_items, local_health + [SourceHealth(source="telegram-live", ok=True, item_count=0, note="No live Telegram handles configured yet.")]
    return local_items, local_health + [SourceHealth(source="telegram-live", ok=True, item_count=0, note=f"{len(channels)} handles configured; live collector stub is ready for Telethon wiring.")]
