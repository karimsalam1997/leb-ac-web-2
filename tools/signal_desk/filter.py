from __future__ import annotations

import re

from tools.signal_desk.models import CanonicalItem, ScoredItem, SignalTag

TAG_TERMS: dict[SignalTag, list[str]] = {
    "casualty": ["killed", "wounded", "casualty", "martyr", "dead", "injured"],
    "strike-claim": ["strike", "rocket", "missile", "drone", "idf", "hezbollah", "attack", "shelling"],
    "rhetoric-shift": ["speech", "warning", "threat", "statement", "vow", "rhetoric"],
    "displacement": ["displaced", "evacuation", "evacuate", "flee", "shelter"],
    "political-maneuver": ["cabinet", "parliament", "minister", "election", "ceasefire", "negotiation"],
    "economic": ["bank", "currency", "inflation", "budget", "deposit", "electricity", "generator"],
    "heritage": ["heritage", "solidere", "archaeology", "museum", "downtown", "memory"],
}

SCOPE_TERMS = [
    "lebanon",
    "beirut",
    "hezbollah",
    "hizballah",
    "israel",
    "syria",
    "iran",
    "tyre",
    "sidon",
    "bekaa",
    "south lebanon",
    "dahiyeh",
    "border",
]


def tags_for(text: str) -> list[SignalTag]:
    lowered = text.lower()
    tags: list[SignalTag] = []
    for tag, terms in TAG_TERMS.items():
        if any(term in lowered for term in terms):
            tags.append(tag)
    return tags or ["political-maneuver"]


def score_item(item: CanonicalItem) -> float:
    text = f"{item.title} {item.text}".lower()
    scope_hits = sum(1 for term in SCOPE_TERMS if term in text)
    tag_hits = sum(1 for terms in TAG_TERMS.values() for term in terms if term in text)
    tier_bonus = 0.1 if item.raw.get("tier") == 1 else 0
    return min(1, 0.2 + scope_hits * 0.14 + tag_hits * 0.04 + tier_bonus)


def filter_items(items: list[CanonicalItem]) -> list[ScoredItem]:
    scored: list[ScoredItem] = []
    for item in items:
        relevance = score_item(item)
        in_scope = relevance >= 0.22 or bool(item.raw.get("fallback"))
        if not in_scope:
            continue
        text_en = re.sub(r"\s+", " ", item.text).strip()
        payload = item.model_dump()
        payload["in_scope"] = in_scope
        scored.append(
            ScoredItem(
                **payload,
                relevance=relevance,
                text_en=text_en,
                signal_tags=tags_for(f"{item.title} {item.text}"),
            )
        )
    return sorted(scored, key=lambda item: (item.relevance, item.published_at), reverse=True)[:60]
