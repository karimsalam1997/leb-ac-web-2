from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha1
import re

from tools.signal_desk.config import load_optional_config, resolve_project_path
from tools.signal_desk.models import RawItem, SourceHealth


def title_from_markdown(text: str, fallback: str) -> str:
    generic_titles = {"conversation with claude", "chatgpt", "untitled"}
    for line in text.splitlines():
        clean = line.strip()
        if clean.startswith("#"):
            title = clean.lstrip("#").strip()
            if title and title.lower() not in generic_titles:
                return title[:160]
    return fallback


def compact_markdown(text: str, tags: list[str]) -> str:
    paragraphs = [re.sub(r"\s+", " ", line).strip() for line in text.split("\n\n")]
    useful = [
        paragraph
        for paragraph in paragraphs
        if len(paragraph) > 100 and any(tag.lower() in paragraph.lower() for tag in tags)
    ]
    if not useful:
        useful = [paragraph for paragraph in paragraphs if len(paragraph) > 100]
    return "\n\n".join(useful[:4])[:1800]


def analysis_id(name: str, path: str) -> str:
    return sha1(f"analysis:{name}:{path}".encode("utf-8")).hexdigest()[:16]


def collect(since: datetime) -> tuple[list[RawItem], list[SourceHealth]]:
    config = load_optional_config("analysis_sources.yaml")
    output: list[RawItem] = []
    health: list[SourceHealth] = []
    context_time = since

    for source in config.get("sources", []):
        path = resolve_project_path(str(source.get("path", "")))
        name = str(source.get("name") or path.stem)
        if not path.exists():
            health.append(SourceHealth(source=name, ok=False, item_count=0, note=f"Missing local analysis file: {path}"))
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        tags = [str(tag) for tag in source.get("tags", [])]
        excerpt = compact_markdown(text, tags)
        if not excerpt:
            health.append(SourceHealth(source=name, ok=True, item_count=0, note="No usable analysis excerpt found."))
            continue
        output.append(
            RawItem(
                id=analysis_id(name, str(path)),
                source_id=name,
                source_type="analysis",
                source_bias=str(source.get("bias", "Local analysis note.")),
                lang="en",
                title=title_from_markdown(text, name),
                text=excerpt,
                url=f"local://{path}",
                published_at=context_time,
                raw={"tier": source.get("tier", 1), "analysis_context": True, "since": since.isoformat(), "tags": tags},
            )
        )
        health.append(SourceHealth(source=name, ok=True, item_count=1, note="Loaded as framework context, not as live reporting."))

    return output, health
