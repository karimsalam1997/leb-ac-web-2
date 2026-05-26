from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from hashlib import sha1

from tools.signal_desk.models import AnalyzedCluster, Framework, GeoTaggedCluster, ScoredItem
from tools.signal_desk.source_lanes import lane_for


CORROBORATING_LANES = {"lebanese-local", "israeli-dissent", "wires-regional"}
PRIMARY_CLAIM_LANES = {"resistance-apparatus", "israeli-establishment"}


def load_frameworks(config: dict) -> list[Framework]:
    return [Framework(**framework) for framework in config.get("frameworks", [])]


def choose_framework_ids(text: str, frameworks: list[Framework]) -> list[str]:
    lowered = text.lower()
    selected: list[str] = []
    if any(term in lowered for term in ["sect", "parliament", "minister", "cabinet", "election"]):
        selected.append("franchise_confessionalism")
    if any(term in lowered for term in ["bank", "electricity", "generator", "reform", "collapse", "currency"]):
        selected.append("profitable_dysfunction")
    if any(term in lowered for term in ["heritage", "solidere", "downtown", "archive", "memory", "reconstruction"]):
        selected.append("memorycide")
    if any(term in lowered for term in ["budget", "aid", "appointment", "patronage", "rent"]):
        selected.append("rentier_clientelist")
    valid = {framework.id for framework in frameworks}
    return [framework_id for framework_id in selected if framework_id in valid][:2]


def confidence_for(items: list[ScoredItem]) -> str:
    source_count = len({item.source_id for item in items})
    if source_count >= 3:
        return "high"
    if source_count == 2:
        return "medium"
    return "low"


def source_lane_ids(items: list[ScoredItem]) -> list[str]:
    return sorted({lane_for(item) for item in items})


def confirmation_status_for(items: list[ScoredItem]) -> str:
    lanes = set(source_lane_ids(items))
    source_count = len({item.source_id for item in items})
    if source_count <= 1:
        return "single-source"
    if lanes & CORROBORATING_LANES and source_count >= 3:
        return "corroborated"
    if lanes & CORROBORATING_LANES:
        return "partly-corroborated"
    if lanes <= PRIMARY_CLAIM_LANES:
        return "unconfirmed"
    return "partly-corroborated"


def severity_for(tags: list[str], text: str, confirmation_status: str) -> str:
    lowered = text.lower()
    danger_words = ["strike", "shelling", "drone", "missile", "rocket", "raid", "bombing", "incursion"]
    civilian_words = ["killed", "wounded", "injured", "evacuation", "displaced", "hospital", "school", "road"]
    if any(word in lowered for word in danger_words) and any(word in lowered for word in civilian_words):
        return "critical"
    if "casualty" in tags or "displacement" in tags:
        return "high"
    if "strike-claim" in tags and confirmation_status in {"corroborated", "partly-corroborated"}:
        return "high"
    if "strike-claim" in tags:
        return "moderate"
    if "rhetoric-shift" in tags or "political-maneuver" in tags:
        return "moderate"
    return "low"


def civilian_flags_for(text: str, tags: list[str]) -> list[str]:
    lowered = text.lower()
    flags: list[str] = []
    checks = [
        ("casualties", ["killed", "wounded", "injured", "casualty", "martyr"]),
        ("evacuation", ["evacuation", "evacuate", "warning to residents"]),
        ("displacement", ["displaced", "flee", "shelter"]),
        ("roads", ["road", "highway", "crossing", "route"]),
        ("hospitals", ["hospital", "ambulance", "civil defense", "rescue"]),
        ("schools", ["school", "university"]),
        ("water", ["water", "pumping"]),
        ("electricity", ["electricity", "power", "generator"]),
        ("telecoms", ["telecom", "internet", "phone"]),
    ]
    for label, terms in checks:
        if any(term in lowered for term in terms):
            flags.append(label)
    if "casualty" in tags and "casualties" not in flags:
        flags.append("casualties")
    if "displacement" in tags and "displacement" not in flags:
        flags.append("displacement")
    return flags


def claim_side_for(items: list[ScoredItem], lanes: list[str]) -> str:
    lane_set = set(lanes)
    if lane_set == {"resistance-apparatus"}:
        return "Resistance primary claim"
    if lane_set == {"israeli-establishment"}:
        return "Israeli security narrative"
    if "israeli-dissent" in lane_set:
        return "Israeli dissent or complication"
    if "lebanese-local" in lane_set and lane_set & {"wires-regional", "israeli-establishment", "resistance-apparatus"}:
        return "Cross-source field record"
    if "video-analysis" in lane_set or "framework-desk" in lane_set:
        return "Analysis frame"
    if "wires-regional" in lane_set:
        return "Regional and wire reporting"
    return "Mixed reporting"


def location_precision_for(location: str) -> str:
    broad = {"lebanon", "israel", "iran", "syria"}
    district = {"south lebanon", "mount lebanon", "nabatieh", "beqaa", "bekaa", "baalbek-hermel"}
    lowered = location.lower()
    if lowered in broad:
        return "national"
    if lowered in district:
        return "district"
    return "exact"


def who_says_so_for(items: list[ScoredItem]) -> list[str]:
    return [
        f"{item.source_id}: {item.title[:92].rstrip()}"
        for item in sorted(items, key=lambda item: item.published_at, reverse=True)[:4]
    ]


def who_complicates_for(items: list[ScoredItem], lanes: list[str], confirmation_status: str) -> list[str]:
    lane_set = set(lanes)
    notes: list[str] = []
    if confirmation_status in {"single-source", "unconfirmed"}:
        notes.append("No independent confirming source appears inside this cluster yet.")
    if "resistance-apparatus" in lane_set and "israeli-establishment" not in lane_set:
        notes.append("No matching Israeli record appears in this cluster.")
    if "israeli-establishment" in lane_set and "lebanese-local" not in lane_set:
        notes.append("No Lebanese local confirmation appears in this cluster.")
    if "israeli-dissent" in lane_set:
        notes.append("Israeli dissent reporting complicates the official line.")
    if not notes:
        notes.append("The sources do not fully agree on meaning, even when they overlap on place or timing.")
    return notes[:3]


def missing_for(items: list[ScoredItem], confirmation_status: str, precision: str, lanes: list[str]) -> str:
    missing: list[str] = []
    if confirmation_status in {"single-source", "unconfirmed"}:
        missing.append("a second source")
    if precision != "exact":
        missing.append("a precise place")
    if "lebanese-local" not in lanes:
        missing.append("Lebanese local confirmation")
    if "wires-regional" not in lanes:
        missing.append("wire or regional corroboration")
    if not missing:
        return "The record is stronger than most items here, but casualty numbers, exact timing, and motive still need care."
    return "Missing: " + ", ".join(missing[:4]) + "."


def next_check_for(signal: str, confirmation_status: str, location: str, lanes: list[str]) -> str:
    if signal in {"casualty", "displacement", "strike-claim"}:
        return f"Check {location} against Lebanese local reporting, municipal or rescue updates, and one opposing-source record before acting on it."
    if confirmation_status in {"single-source", "unconfirmed"}:
        return f"Look for the same place and time in a Lebanese local source, an Israeli source, and a wire or regional source."
    if "israeli-establishment" in lanes or "israeli-dissent" in lanes:
        return "Compare the Israeli establishment line with Haaretz, +972, Lebanese local reporting, and wires."
    return "Check whether this remains one report or becomes a repeated pattern across separate source lanes."


def cluster_key(item: ScoredItem) -> str:
    place = re_key(location_hint(f"{item.title} {item.text_en}"))
    if item.source_type == "telegram":
        source_band = "telegram"
    elif item.source_type == "analysis":
        source_band = "analysis"
    else:
        source_band = "reporting"
    if item.signal_tags:
        return f"{source_band}:{place}:{item.signal_tags[0]}"
    return f"{source_band}:{place}:political-maneuver"


def signal_from_key(key: str) -> str:
    return key.rsplit(":", 1)[-1]


def re_key(value: str) -> str:
    return value.lower().replace(" ", "-")


def analyze(items: list[ScoredItem], frameworks: list[Framework]) -> list[GeoTaggedCluster]:
    buckets: dict[str, list[ScoredItem]] = defaultdict(list)
    event_items = [item for item in items if item.source_type != "analysis"]
    for item in event_items:
        buckets[cluster_key(item)].append(item)

    clusters: list[GeoTaggedCluster] = []
    for key, bucket in buckets.items():
        ranked = sorted(bucket, key=lambda item: item.relevance, reverse=True)[:4]
        lead = ranked[0]
        text = " ".join([item.title + " " + item.text_en for item in ranked])
        framework_ids = choose_framework_ids(text, frameworks)
        sources = sorted({item.source_id for item in ranked})
        biases = sorted({item.source_bias for item in ranked if item.source_bias})
        all_tags = sorted({tag for item in ranked for tag in item.signal_tags})
        signal = signal_from_key(key)
        location_phrase = location_hint(text)
        lanes = source_lane_ids(ranked)
        status = confirmation_status_for(ranked)
        precision = location_precision_for(location_phrase)
        severity = severity_for(all_tags, text, status)
        civilian_flags = civilian_flags_for(text, all_tags)
        headline = lead.title if len(lead.title) < 110 else lead.title[:106].rstrip() + "..."
        analysis = build_analysis(location_phrase, signal, ranked, framework_ids)
        watch = build_watch(location_phrase, signal)
        missing = missing_for(ranked, status, precision, lanes)
        cluster_id = sha1(f"{key}:{headline}:{lead.published_at.isoformat()}".encode("utf-8")).hexdigest()[:12]
        clusters.append(
            GeoTaggedCluster(
                id=cluster_id,
                item_ids=[item.id for item in ranked],
                headline=headline,
                frameworks=framework_ids,
                analysis=analysis,
                confidence=confidence_for(ranked),
                sources_span=sources,
                what_to_watch=watch,
                signal_tags=all_tags or [key],
                published_at=max(item.published_at for item in ranked),
                source_biases=biases,
                urls=[item.url for item in ranked if item.url],
                severity=severity,
                location_precision=precision,
                civilian_impact_flags=civilian_flags,
                source_lanes=lanes,
                claim_side=claim_side_for(ranked, lanes),
                confirmation_status=status,
                recommended_next_check=next_check_for(signal, status, location_phrase, lanes),
                what_happened=build_what_happened(location_phrase, signal, headline, status),
                where=location_phrase,
                who_says_so=who_says_so_for(ranked),
                who_disputes_or_complicates=who_complicates_for(ranked, lanes, status),
                why_it_matters=build_why_it_matters(location_phrase, signal, severity, civilian_flags),
                what_is_missing=missing,
            )
        )

    return sorted(clusters, key=lambda cluster: (severity_rank(cluster.severity), cluster.published_at), reverse=True)[:18]


def severity_rank(severity: str) -> int:
    return {"critical": 4, "high": 3, "moderate": 2, "low": 1}.get(severity, 0)


def location_hint(text: str) -> str:
    lowered = text.lower()
    for place in ["Tyre", "Bint Jbeil", "Marjayoun", "Nabatieh", "Sidon", "Beirut", "Baalbek", "Tripoli", "Dahiyeh", "South Lebanon"]:
        if place.lower() in lowered:
            return place
    if "lebanon" in lowered:
        return "Lebanon"
    return "Beirut"


def build_analysis(location: str, signal: str, items: list[ScoredItem], framework_ids: list[str]) -> str:
    source_line = ", ".join(sorted({item.source_id for item in items})[:3])
    if signal == "strike-claim":
        return f"{location} is where the military story and the civilian story are crossing today. The item set is still source-bound, with {source_line} carrying the available record, so the dashboard treats the claim as a signal before it treats it as settled fact."
    if signal == "economic":
        return f"{location} is not being described as a sudden failure so much as a familiar machine under stress. The useful reading is structural: when public capacity weakens, private fees and political brokerage usually become the hidden tax."
    if signal == "displacement":
        return f"{location} is registering pressure on ordinary movement, shelter, and household calculation. The strongest opposing argument is that evacuation language can be ordinary wartime caution, but in Lebanon it also changes who can stay, who can work, and who quietly loses the map."
    if "memorycide" in framework_ids:
        return f"{location} enters the brief as a memory question, not only a news item. The surface claim may be administrative or urban, but the deeper move is about what gets preserved, what gets renamed, and who benefits when the public record thins out."
    return f"{location} is the pressure point in this cluster. The strongest cautious reading is that these are separate reports, but the pattern matters because Lebanon's weak state makes every local event travel through sectarian brokerage, foreign pressure, and private survival systems."


def build_what_happened(location: str, signal: str, headline: str, status: str) -> str:
    if signal == "strike-claim":
        return f"A military claim or report is tied to {location}. The desk treats it as {status.replace('-', ' ')} until the same place and time appear across separate source lanes."
    if signal == "displacement":
        return f"Reporting around {location} points to movement pressure, shelter pressure, or warnings that affect civilian choices."
    if signal == "casualty":
        return f"Casualty language appears in the reporting around {location}. Numbers and identities need separate confirmation."
    if signal == "rhetoric-shift":
        return f"A statement or warning is moving the public line around {location}, even if the field facts remain incomplete."
    return f"The cluster centers on {headline}"


def build_why_it_matters(location: str, signal: str, severity: str, civilian_flags: list[str]) -> str:
    if severity in {"critical", "high"}:
        return f"{location} matters because it can change movement, safety checks, and whether a claim should be treated as live danger rather than background noise."
    if civilian_flags:
        return f"{location} matters because the story touches civilian systems: {', '.join(civilian_flags[:3])}."
    if signal == "rhetoric-shift":
        return "The statement matters because rhetoric often prepares the ground for later military, diplomatic, or media moves."
    return f"{location} matters if it stops being an isolated item and begins repeating across towns, roads, or source lanes."


def build_watch(location: str, signal: str) -> str:
    if signal == "strike-claim":
        return f"Watch whether {location} is named again by opposing sources within the next 24 hours."
    if signal == "economic":
        return f"Watch whether the language moves from reform promise to who pays the bill in {location}."
    if signal == "displacement":
        return f"Watch shelter numbers, school closures, and municipal language around {location}."
    return f"Watch whether {location} remains isolated or becomes part of a repeated pattern."
