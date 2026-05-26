from __future__ import annotations

from datetime import datetime

from tools.signal_desk.models import GeoTaggedCluster


LANE_LABELS = {
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
        f"{verification_text(cluster)}"
    )


def synthesize_brief(clusters: list[GeoTaggedCluster], generated_at: datetime) -> str:
    date_label = generated_at.strftime("%B %-d, %Y") if hasattr(generated_at, "strftime") else "today"
    if not clusters:
        return f"# MENA Morning Brief, {date_label}\n\n## The one thing that matters today\nNo verified clusters were produced. The honest answer is silence until the sources give us something stronger.\n"

    lead = clusters[0]
    moved = "\n\n".join(
        f"### {cluster.headline}\n{cluster.what_happened or cluster.analysis}\n\n{evidence_line(cluster)}\n\nStatus: {cluster.confirmation_status.replace('-', ' ')}. Next check: {cluster.recommended_next_check or cluster.what_to_watch}"
        for cluster in clusters[:6]
    )
    map_line = "; ".join(
        f"{cluster.primary_location.name if cluster.primary_location else 'Unlocated'}: {cluster.headline}"
        for cluster in clusters[:4]
    )
    quiet = [cluster for cluster in clusters if cluster.confirmation_status in {"single-source", "unconfirmed"}]
    quiet_text = "\n".join(f"- {cluster.headline}" for cluster in quiet[:4]) or "- No low-confidence cluster dominated the run."
    unconfirmed = "\n".join(
        f"- {cluster.headline}: {cluster.verification.label}; {', '.join(cluster.sources_span) or 'single source'}."
        for cluster in clusters
        if cluster.confirmation_status != "corroborated"
    ) or "- No major high-risk claim required a single-source warning."

    return f"""# MENA Morning Brief, {date_label}

## The one thing that matters today
{lead_opening(lead)}

## What moved
{moved}

## On the map
{map_line}

## Quiet signals
{quiet_text}

## What I could not confirm
{unconfirmed}
"""
