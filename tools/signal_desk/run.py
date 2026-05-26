from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import time
from typing import Callable, TypeVar

from tools.signal_desk.analyze import analyze, load_frameworks
from tools.signal_desk.collectors import local_analysis, rss, telegram, youtube
from tools.signal_desk.config import PUBLIC_DATA_DIR, STORE_DIR, load_framework_config, parse_since
from tools.signal_desk.filter import filter_items
from tools.signal_desk.geo import district_aggregates, events_geojson, geo_tag, write_fallback_districts
from tools.signal_desk.models import ApiMeta, SignalDeskApi, SourceHealth
from tools.signal_desk.normalize import normalize
from tools.signal_desk.source_lanes import build_ground_needs, build_source_lanes
from tools.signal_desk.synthesize import synthesize_brief
from tools.signal_desk.verification import attach_verification_dossiers


T = TypeVar("T")


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, default=str), encoding="utf-8")


def timed(stage_timings: dict[str, float], name: str, work: Callable[[], T]) -> T:
    started = time.perf_counter()
    try:
        return work()
    finally:
        stage_timings[name] = round(time.perf_counter() - started, 3)


def source_health_summary(source_health: list[SourceHealth]) -> dict[str, object]:
    failed = [status.source for status in source_health if not status.ok]
    return {
        "total": len(source_health),
        "ok": len(source_health) - len(failed),
        "failed": len(failed),
        "failed_sources": failed[:12],
        "items_returned": sum(status.item_count for status in source_health),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Lebanese Academic Signal Desk pipeline.")
    parser.add_argument("--since", default="7d", help="Window to collect, e.g. 24h, 3d, 7d, or ISO date.")
    parser.add_argument("--only-rss", action="store_true", help="Skip Telegram and YouTube collectors.")
    parser.add_argument("--no-public-copy", action="store_true", help="Do not copy latest output into public/data.")
    parser.add_argument("--dry-run", action="store_true", help="Run the full pipeline and health checks without writing output files.")
    args = parser.parse_args()

    since = parse_since(args.since)
    generated_at = datetime.now(timezone.utc)
    run_dir = STORE_DIR / generated_at.strftime("%Y-%m-%d")
    stage_timings: dict[str, float] = {}

    raw_items, source_health = timed(stage_timings, "collect:rss", lambda: rss.collect(since))
    if not args.only_rss:
        for name, collector in (
            ("collect:telegram", telegram),
            ("collect:youtube", youtube),
            ("collect:local-analysis", local_analysis),
        ):
            items, health = timed(stage_timings, name, lambda collector=collector: collector.collect(since))
            raw_items.extend(items)
            source_health.extend(health)

    canonical = timed(stage_timings, "normalize", lambda: normalize(raw_items))
    scored = timed(stage_timings, "filter", lambda: filter_items(canonical))
    framework_config = timed(stage_timings, "load-frameworks-config", load_framework_config)
    frameworks = timed(stage_timings, "load-frameworks", lambda: load_frameworks(framework_config))
    clusters = timed(stage_timings, "analyze-geo-verify", lambda: attach_verification_dossiers(geo_tag(analyze(scored, frameworks))))
    brief = timed(stage_timings, "synthesize-brief", lambda: synthesize_brief(clusters, generated_at))
    aggregates = timed(stage_timings, "district-aggregates", lambda: district_aggregates(clusters))
    tags = timed(stage_timings, "signal-tags", lambda: sorted({tag for cluster in clusters for tag in cluster.signal_tags}))
    source_lanes = timed(stage_timings, "source-lanes", lambda: build_source_lanes(scored))
    ground_needs = timed(stage_timings, "ground-needs", lambda: build_ground_needs(clusters))

    api = SignalDeskApi(
        meta=ApiMeta(
            generated_at=generated_at,
            window_start=since,
            source_count=len({item.source_id for item in raw_items}),
            cluster_count=len(clusters),
            located_cluster_count=len([cluster for cluster in clusters if cluster.primary_location and cluster.location_precision != "unknown"]),
            mode="rss-first-review",
            notes=[
                "Telegram live scraping remains review-first; local scraper JSONL can feed source leads without touching credentials.",
                "Longer analysis files are loaded as context and kept separate from live reporting claims.",
                "Low-confidence pins are deliberately rendered differently in the frontend.",
            ],
        ),
        brief_markdown=brief,
        clusters=clusters,
        district_aggregates=aggregates,
        signal_tags=tags,
        frameworks=frameworks,
        source_health=source_health,
        source_lanes=source_lanes,
        ground_needs=ground_needs,
    )

    store_output_written = not args.dry_run
    public_copy_written = store_output_written and not args.no_public_copy
    public_output_files = ["brief.md", "clusters.json", "events.geojson", "api.json", "lebanon-districts.geojson"]
    store_output_files = [*public_output_files, "run-health.json"]
    health = {
        "generated_at": generated_at.isoformat(),
        "window_start": since.isoformat(),
        "dry_run": args.dry_run,
        "only_rss": args.only_rss,
        "store_output_written": store_output_written,
        "public_copy_written": public_copy_written,
        "run_dir": str(run_dir),
        "public_data_dir": str(PUBLIC_DATA_DIR),
        "raw_item_count": len(raw_items),
        "canonical_item_count": len(canonical),
        "scored_item_count": len(scored),
        "cluster_count": len(clusters),
        "located_cluster_count": len([cluster for cluster in clusters if cluster.primary_location and cluster.location_precision != "unknown"]),
        "source_count": len({item.source_id for item in raw_items}),
        "source_health": source_health_summary(source_health),
        "source_lane_counts": {lane.id: lane.item_count for lane in source_lanes},
        "stage_timings_seconds": stage_timings,
        "store_output_files": store_output_files if store_output_written else [],
        "public_output_files": public_output_files if public_copy_written else [],
    }

    if store_output_written:
        run_dir.mkdir(parents=True, exist_ok=True)
        (run_dir / "brief.md").write_text(brief, encoding="utf-8")
        write_json(run_dir / "clusters.json", [cluster.model_dump(mode="json") for cluster in clusters])
        write_json(run_dir / "events.geojson", events_geojson(clusters))
        write_json(run_dir / "api.json", api.model_dump(mode="json"))
        write_fallback_districts(run_dir / "lebanon-districts.geojson")
        write_json(run_dir / "run-health.json", health)

    if public_copy_written:
        PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
        for name in public_output_files:
            shutil.copyfile(run_dir / name, PUBLIC_DATA_DIR / name)

    if args.dry_run:
        print(f"Signal Desk dry run complete: {run_dir}")
    else:
        print(f"Signal Desk run complete: {run_dir}")
    print(f"Clusters: {len(clusters)} / Items: {len(raw_items)}")
    print("Stage timings:")
    for stage, seconds in stage_timings.items():
        print(f"- {stage}: {seconds:.3f}s")
    print("Run health:")
    print(json.dumps(health, indent=2, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
