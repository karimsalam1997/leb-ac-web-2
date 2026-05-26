from __future__ import annotations

from datetime import datetime

from tools.signal_desk.models import GeoTaggedCluster, SourceCondition


LANE_LABELS = {
    "pipeline-sample": "pipeline sample",
    "israeli-establishment": "Israeli establishment",
    "israeli-dissent": "Israeli dissent",
    "lebanese-local": "Lebanese local record",
    "resistance-apparatus": "resistance apparatus",
    "palestinian-record": "Palestinian record",
    "gulf-official": "Gulf official line",
    "iranian-state": "Iranian state line",
    "video-analysis": "video analysis",
    "wires-regional": "wires and regionals",
    "framework-desk": "framework desk",
}

PRECISION_LABELS = {
    "exact": "specific",
    "district": "district-level",
    "national": "country-wide",
    "unknown": "unclear",
}


def compact_list(values: list[str], limit: int = 3) -> str:
    cleaned = [value.strip() for value in values if value.strip()]
    if not cleaned:
        return ""
    shown = cleaned[:limit]
    if len(shown) == 1:
        text = shown[0]
    elif len(shown) == 2:
        text = f"{shown[0]} and {shown[1]}"
    else:
        text = f"{', '.join(shown[:-1])}, and {shown[-1]}"
    remaining = len(cleaned) - len(shown)
    if remaining > 0:
        return f"{text}, plus {remaining} more"
    return text


def clean_missing(value: str) -> str:
    if not value:
        return "The missing piece is still the independent check."
    if value.startswith("Missing: "):
        return "Still missing: " + value.removeprefix("Missing: ")
    return value


def lane_text(cluster: GeoTaggedCluster) -> str:
    labels = [LANE_LABELS.get(lane, lane.replace("-", " ")) for lane in cluster.source_lanes]
    return compact_list(labels) or "no clear source lane"


def source_text(cluster: GeoTaggedCluster) -> str:
    return compact_list(cluster.sources_span) or lane_text(cluster)


def radius_text(meters: int) -> str:
    if meters <= 0:
        return ""
    kilometers = round(meters / 1000)
    return f"{kilometers} km"


def map_context_text(cluster: GeoTaggedCluster) -> str:
    place = cluster.primary_location.name if cluster.primary_location else cluster.where or "Location unclear"
    if cluster.map_marker_kind == "representative-area":
        radius = radius_text(cluster.map_radius_meters)
        radius_phrase = f" with about a {radius} radius" if radius else ""
        return f"Map: {place} is shown as a representative area{radius_phrase}. Treat the coordinate as a center marker."
    if cluster.map_marker_kind == "unmapped" or cluster.location_precision == "unknown":
        return f"Map: no pin yet because the place is unclear. {cluster.map_warning}"
    return f"Map: {place} is a named-place pin. {cluster.map_warning}"


def map_line_text(cluster: GeoTaggedCluster) -> str:
    place = cluster.primary_location.name if cluster.primary_location else "Unlocated"
    if cluster.map_marker_kind == "representative-area":
        radius = radius_text(cluster.map_radius_meters)
        radius_phrase = f", {radius} radius" if radius else ""
        return f"{place}: {cluster.headline} ({cluster.map_precision_label.lower()}{radius_phrase})"
    if cluster.map_marker_kind == "unmapped" or cluster.location_precision == "unknown":
        return f"{place}: {cluster.headline} (unmapped)"
    return f"{place}: {cluster.headline} ({cluster.map_precision_label.lower()})"


def verification_text(cluster: GeoTaggedCluster) -> str:
    missing = compact_list(cluster.verification.missing, limit=4) or clean_missing(cluster.what_is_missing)
    next_check = cluster.verification.next_checks[0] if cluster.verification.next_checks else cluster.recommended_next_check
    return (
        f"Verification: {cluster.verification.label}. "
        f"{cluster.verification.summary} "
        f"Missing: {missing}. "
        f"Next check: {next_check}"
    )


def lead_opening(cluster: GeoTaggedCluster) -> str:
    place = cluster.primary_location.name if cluster.primary_location else cluster.where or "The lead cluster"
    status = cluster.confirmation_status.replace("-", " ")
    precision = PRECISION_LABELS.get(cluster.location_precision, cluster.location_precision)
    missing = clean_missing(cluster.what_is_missing)
    sources = source_text(cluster)
    lanes = lane_text(cluster)

    if cluster.confirmation_status in {"single-source", "unconfirmed"} or cluster.location_precision in {"unknown", "national", "district"}:
        return (
            f"Start with the limit: {place} leads the run, but the record is {status} and the location is {precision}. "
            f"The live trail comes through {sources}; the source lanes are {lanes}. {cluster.verification.summary} {missing} "
            "Read this as a signal to check before treating it as a settled account."
        )

    return (
        f"{place} leads the run because separate sources are now touching the same story. "
        f"The record is {status}, the location is {precision}, and the live trail comes through {sources}. "
        f"{cluster.verification.summary} {missing} Keep the event, the source interest, and the civilian effect in view at the same time."
    )


def evidence_line(cluster: GeoTaggedCluster) -> str:
    return (
        f"Evidence: {source_text(cluster)}. "
        f"Source lanes: {lane_text(cluster)}. "
        f"{map_context_text(cluster)} "
        f"{verification_text(cluster)}"
    )


def source_condition_section(source_condition: SourceCondition | None) -> str:
    if source_condition is None:
        return ""
    return (
        "\n\n## Source condition\n"
        f"{source_condition.label}. {source_condition.summary} {source_condition.caution}"
    )


def synthesize_brief(clusters: list[GeoTaggedCluster], generated_at: datetime, source_condition: SourceCondition | None = None) -> str:
    date_label = generated_at.strftime("%B %-d, %Y") if hasattr(generated_at, "strftime") else "today"
    if not clusters:
        return f"# MENA Morning Brief, {date_label}\n\n## The one thing that matters today\nNo verified clusters were produced. The honest answer is silence until the sources give us something stronger.{source_condition_section(source_condition)}\n"

    lead = clusters[0]
    moved = "\n\n".join(
        f"### {cluster.headline}\n{cluster.what_happened or cluster.analysis}\n\n{evidence_line(cluster)}\n\nStatus: {cluster.confirmation_status.replace('-', ' ')}. Next check: {cluster.recommended_next_check or cluster.what_to_watch}"
        for cluster in clusters[:6]
    )
    map_line = "; ".join(map_line_text(cluster) for cluster in clusters[:4])
    quiet = [cluster for cluster in clusters if cluster.confirmation_status in {"single-source", "unconfirmed"}]
    quiet_text = "\n".join(f"- {cluster.headline}" for cluster in quiet[:4]) or "- No low-confidence cluster dominated the run."
    unconfirmed = "\n".join(
        f"- {cluster.headline}: {cluster.verification.label}; {', '.join(cluster.sources_span) or 'single source'}."
        for cluster in clusters
        if cluster.confirmation_status != "corroborated"
    ) or "- No major high-risk claim required a single-source warning."

    return f"""# MENA Morning Brief, {date_label}

## The one thing that matters today
{lead_opening(lead)}{source_condition_section(source_condition)}

## What moved
{moved}

## On the map
{map_line}

## Quiet signals
{quiet_text}

## What I could not confirm
{unconfirmed}
"""
