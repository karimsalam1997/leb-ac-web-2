from __future__ import annotations

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from hashlib import sha1
from html import unescape
import re
import socket
import ssl
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

import certifi

from tools.signal_desk.config import load_feeds
from tools.signal_desk.models import RawItem, SourceHealth, SourceHealthErrorKind


def strip_html(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", unescape(value or ""))).strip()


def text_of(element: ET.Element, name: str) -> str:
    found = element.find(name)
    return strip_html(found.text if found is not None and found.text else "")


def child_text(element: ET.Element, names: list[str]) -> str:
    for child in list(element):
        local_name = child.tag.rsplit("}", 1)[-1]
        if local_name in names and child.text:
            return strip_html(child.text)
    return ""


def parse_date(value: str) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        parsed = parsedate_to_datetime(value)
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def entry_id(source_name: str, url: str, title: str) -> str:
    return sha1(f"{source_name}:{url}:{title}".encode("utf-8")).hexdigest()[:16]


def error_kind(exc: Exception) -> SourceHealthErrorKind:
    if isinstance(exc, urllib.error.HTTPError):
        return "http-error"
    if isinstance(exc, ET.ParseError):
        return "parse-error"
    if isinstance(exc, urllib.error.URLError):
        reason = exc.reason
        if isinstance(reason, socket.gaierror):
            return "dns-error"
        if isinstance(reason, (TimeoutError, socket.timeout)):
            return "timeout"
        if isinstance(reason, ssl.SSLError):
            return "tls-error"
        return "fetch-error"
    if isinstance(exc, (TimeoutError, socket.timeout)):
        return "timeout"
    if isinstance(exc, ssl.SSLError):
        return "tls-error"
    return "fetch-error"


def failed_health(source: str, exc: Exception) -> SourceHealth:
    return SourceHealth(source=source, ok=False, item_count=0, note=str(exc)[:180], error_kind=error_kind(exc))


def fetch_feed(feed: dict, since: datetime) -> tuple[list[RawItem], SourceHealth]:
    name = str(feed["name"])
    url = str(feed["url"])
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; LebaneseAcademicSignalDesk/0.2; +https://lebaneseacademic.com)",
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.6, */*;q=0.3",
        },
    )
    ssl_context = ssl.create_default_context(cafile=certifi.where())

    try:
        with urllib.request.urlopen(request, timeout=14, context=ssl_context) as response:
            xml = response.read()
        root = ET.fromstring(xml)
    except Exception as exc:
        return [], failed_health(name, exc)

    items = root.findall(".//item") or root.findall(".//{http://www.w3.org/2005/Atom}entry")
    output: list[RawItem] = []

    for item in items[:35]:
        title = text_of(item, "title") or child_text(item, ["title"])
        link = text_of(item, "link") or child_text(item, ["link"])
        if not link:
            atom_link = item.find("{http://www.w3.org/2005/Atom}link")
            link = atom_link.get("href", "") if atom_link is not None else ""
        summary = (
            text_of(item, "description")
            or text_of(item, "summary")
            or child_text(item, ["description", "summary", "content"])
        )
        published_at = parse_date(
            text_of(item, "pubDate")
            or text_of(item, "published")
            or text_of(item, "updated")
            or child_text(item, ["pubDate", "published", "updated"])
        )
        if published_at < since:
            continue
        if not title and not summary:
            continue

        output.append(
            RawItem(
                id=entry_id(name, link, title),
                source_id=name,
                source_type="rss",
                source_bias=str(feed.get("bias", "")),
                lang=str(feed.get("lang", "en")),
                title=title or "Untitled source item",
                text=summary or title,
                url=link,
                published_at=published_at,
                raw={"tier": feed.get("tier", 2)},
            )
        )

    return output, SourceHealth(source=name, ok=True, item_count=len(output), error_kind="ok")


def fetch_html_index(feed: dict, since: datetime) -> tuple[list[RawItem], SourceHealth]:
    name = str(feed["name"])
    url = str(feed["url"])
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; LebaneseAcademicSignalDesk/0.2; +https://lebaneseacademic.com)",
            "Accept": "text/html,application/xhtml+xml,*/*;q=0.6",
        },
    )
    ssl_context = ssl.create_default_context(cafile=certifi.where())

    try:
        with urllib.request.urlopen(request, timeout=14, context=ssl_context) as response:
            html = response.read().decode("utf-8", "ignore")
    except Exception as exc:
        return [], failed_health(name, exc)

    seen: set[str] = set()
    output: list[RawItem] = []
    for match in re.finditer(r'href="([^"]*/article/[^"]+)"[^>]*>(.*?)</a>', html, re.I | re.S):
        link = match.group(1)
        title = strip_html(match.group(2))
        if not title or link in seen:
            continue
        if not any(term.lower() in title.lower() for term in feed.get("terms", [])):
            continue
        seen.add(link)
        output.append(
            RawItem(
                id=entry_id(name, link, title),
                source_id=name,
                source_type="rss",
                source_bias=str(feed.get("bias", "")),
                lang=str(feed.get("lang", "en")),
                title=title[:180],
                text=title,
                url=link,
                published_at=datetime.now(timezone.utc),
                raw={"tier": feed.get("tier", 2), "html_index": True, "since": since.isoformat()},
            )
        )
        if len(output) >= int(feed.get("limit", 18)):
            break

    return output, SourceHealth(source=name, ok=True, item_count=len(output), note="Read from public homepage because RSS was blocked or unavailable.", error_kind="ok")


def fallback_items(since: datetime) -> list[RawItem]:
    now = datetime.now(timezone.utc)
    samples = [
        {
            "source": "Signal Desk fallback",
            "bias": "Local fallback sample, not live reporting",
            "title": "Israeli warnings and Lebanese displacement pressure converge on Tyre",
            "text": "Warnings, border strikes, and displacement pressure around Tyre and south Lebanon point to the same structural fact: civilians are being pushed to live around a military timetable they do not control.",
            "url": "https://lebaneseacademic.com/signal-desk",
            "tags": ["Tyre", "south Lebanon", "displacement"],
        },
        {
            "source": "Signal Desk fallback",
            "bias": "Local fallback sample, not live reporting",
            "title": "Cabinet paralysis keeps Beirut inside the profitable dysfunction machine",
            "text": "In Beirut, the language of reform keeps circling the same disabled institutions while private actors collect fees from the broken public system.",
            "url": "https://lebaneseacademic.com/signal-desk",
            "tags": ["Beirut", "reform", "economic"],
        },
    ]
    return [
        RawItem(
            id=entry_id(sample["source"], sample["url"], sample["title"]),
            source_id=sample["source"],
            source_type="rss",
            source_bias=sample["bias"],
            lang="en",
            title=sample["title"],
            text=sample["text"],
            url=sample["url"],
            published_at=now,
            raw={"fallback": True, "since": since.isoformat(), "tags": sample["tags"]},
        )
        for sample in samples
    ]


def collect(since: datetime) -> tuple[list[RawItem], list[SourceHealth]]:
    all_items: list[RawItem] = []
    health: list[SourceHealth] = []
    for feed in load_feeds():
        if feed.get("kind") == "html_index":
            items, status = fetch_html_index(feed, since)
        else:
            items, status = fetch_feed(feed, since)
        all_items.extend(items)
        health.append(status)

    if not all_items:
        all_items = fallback_items(since)
        health.append(SourceHealth(source="fallback", ok=True, item_count=len(all_items), note="No live RSS items available; emitted review-only sample data.", error_kind="fallback"))

    return all_items, health
