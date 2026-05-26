from __future__ import annotations

from datetime import datetime

from tools.signal_desk.models import GeoTaggedCluster


def synthesize_brief(clusters: list[GeoTaggedCluster], generated_at: datetime) -> str:
    date_label = generated_at.strftime("%B %-d, %Y") if hasattr(generated_at, "strftime") else "today"
    if not clusters:
        return f"# MENA Morning Brief, {date_label}\n\n## The one thing that matters today\nNo verified clusters were produced. The honest answer is silence until the sources give us something stronger.\n"

    lead = clusters[0]
    moved = "\n\n".join(
        f"### {cluster.headline}\n{cluster.what_happened or cluster.analysis}\n\nStatus: {cluster.confirmation_status.replace('-', ' ')}. Next check: {cluster.recommended_next_check or cluster.what_to_watch}"
        for cluster in clusters[:6]
    )
    map_line = "; ".join(
        f"{cluster.primary_location.name if cluster.primary_location else 'Unlocated'}: {cluster.headline}"
        for cluster in clusters[:4]
    )
    quiet = [cluster for cluster in clusters if cluster.confirmation_status in {"single-source", "unconfirmed"}]
    quiet_text = "\n".join(f"- {cluster.headline}" for cluster in quiet[:4]) or "- No low-confidence cluster dominated the run."
    unconfirmed = "\n".join(
        f"- {cluster.headline}: {', '.join(cluster.sources_span) or 'single source'}."
        for cluster in clusters
        if cluster.confirmation_status != "corroborated"
    ) or "- No major high-risk claim required a single-source warning."

    return f"""# MENA Morning Brief, {date_label}

## The one thing that matters today
{lead.primary_location.name if lead.primary_location else 'Beirut'} is the morning's first pressure point. The first question is what happened there. The second is who wants that report to harden into fact before anyone has checked the place, time, and civilian effect.

## What moved
{moved}

## On the map
{map_line}

## Quiet signals
{quiet_text}

## What I could not confirm
{unconfirmed}
"""
