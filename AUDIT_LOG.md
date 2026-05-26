# SIGNALS DESK Audit Log

## Cycle 1, 2026-05-26

### Scores Before

1. Signal Quality: 5/10
2. Source Coverage: 4/10
3. Map Quality: 6/10
4. Brief Quality: 5/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 4/10
7. Information Architecture: 5/10

Three lowest-scoring dimensions: Source Coverage, Pipeline Robustness, Brief Quality / Information Architecture.

Chosen fix: Source Coverage.

Reason: the platform already had a functioning RSS-first pipeline and a readable dashboard, but its source diet still leaned too heavily on a limited English-language shelf. That weakens every later stage. If the input layer cannot distinguish Lebanese local records, Palestinian records, Gulf official messaging, Iranian state messaging, resistance media, and Israeli Arabic-facing output, the analysis engine will keep sounding more certain than the evidence deserves.

### What Changed

- Added new Lebanese local, Palestinian, Gulf official, Israeli Arabic-facing, and Iranian state source entries to `tools/signal_desk/config/feeds.yaml`.
- Added explicit source lanes for Palestinian record, Gulf official line, and Iranian state line in `tools/signal_desk/source_lanes.py`.
- Updated the dashboard label map so the new lanes render clearly in cluster source lines.
- Regenerated the public Signal Desk data after the source expansion.
- Fixed a Signal Desk dashboard lint issue by anchoring time-window filtering to the pipeline run timestamp instead of the live browser clock.
- Fixed a map type-check issue by using the larger halo for national-level low-confidence pins.
- Added `studio-lebanese-academic/dist/**` to ESLint ignores so generated Sanity build output no longer causes lint to run out of memory.

### Scores After

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 5/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 5/10
7. Information Architecture: 5/10

### Verification

- Pipeline run passed: 33 sources, 593 raw items, 12 clusters, 8 located clusters.
- New source lane counts appeared in the generated API: Palestinian record 3, Gulf official line 11, Iranian state line 2.
- `npm run lint` completed with 0 errors and 1 pre-existing warning in `src/app/essays/[slug]/page.tsx`.
- `npm run build` passed.
- Browser check passed at `http://127.0.0.1:3000/signal-desk`: page rendered, source lanes appeared, and no browser console errors were reported.

### Next Highest-Priority Improvement

Pipeline Robustness. The rubric asks for `--dry-run`, but the CLI still does not support it. The next cycle should add a real dry-run mode, stage-by-stage timing, and a small run health report so failures are visible without overwriting public data.

### One Thing Outside The Rubric

The brief is 713 words and structurally valid, but it still opens with a slightly generic "pressure point" formula when the top cluster is messy. The synthesis engine needs a stronger rule: if the lead cluster is low-location or low-confirmation, the opening should admit that immediately rather than making the uncertainty sound dramatic.

## Cycle 2, 2026-05-26

### Scores Before

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 5/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 5/10
7. Information Architecture: 5/10

Lowest-scoring dimensions: Signal Quality, Brief Quality, Pipeline Robustness, and Information Architecture.

Chosen fix: Pipeline Robustness.

Reason: the dashboard already has a broader source shelf after Cycle 1, but the operator still needed a safe way to test the pipeline before touching public data. That is the boring part of the system, and it matters. If the collector fails or the source mix collapses, the dashboard should show that before anything overwrites `public/data/signal-desk/`.

### What Changed

- Added `--dry-run` to `tools/signal_desk/run.py`.
- Added stage-by-stage timing using a monotonic timer.
- Added a compact run health payload with counts, source-health status, lane counts, write status, output paths, and timing data.
- Normal runs now write `run-health.json` beside the generated store output.
- Dry runs now execute the pipeline but skip both dated store writes and public dashboard copies.

### Scores After

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 5/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

### Verification

- `python3 -m py_compile tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- `python3 -m tools.signal_desk.run --help` showed the new `--dry-run` flag.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed and reported `store_output_written: false` and `public_copy_written: false`.
- The dry run completed the full pipeline path and printed stage timings plus the run health payload.
- A normal public-copy run was deliberately not executed because the current environment returned fallback-only collection: 40 source-health records, 39 failed sources, 2 fallback items, and 2 clusters. Copying that would have reduced the public dashboard data.

### Next Highest-Priority Improvement

Pipeline Robustness again. Add a minimum-live-source guard before public copy, probably something like "do not publish if only fallback data is present" and "do not publish if too many sources fail." That would turn the warning from this cycle into a hard safety rail.

### One Thing Outside The Rubric

The store output path still uses only the date, `store/output/YYYY-MM-DD/`. Multiple normal runs on the same day can overwrite each other, which makes later comparison harder.

## Cycle 3, 2026-05-26

### Scores Before

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 5/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

Lowest-scoring dimensions: Signal Quality, Brief Quality, and Information Architecture.

Chosen fix: Brief Quality.

Reason: the system already had the evidence fields it needed, but the generated brief opened too theatrically. It named a "pressure point" before explaining source depth, location precision, or what was missing. For a war-monitoring desk, that is the wrong order. The brief should show the reader the floor before asking them to walk across it.

### What Changed

- Updated `tools/signal_desk/synthesize.py` so the lead paragraph opens with confirmation status, location precision, source trail, source lanes, and missing checks.
- Added compact source and lane formatting helpers for readable brief prose.
- Added an evidence line under each top moved cluster, so the reader sees the source trail before the next-check instruction.
- Kept the existing brief section structure, so no frontend changes were needed.
- Did not touch feeds, Arabic coverage, or source-lane coverage.

### Scores After

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

### Verification

- `python3 -m py_compile tools/signal_desk/synthesize.py tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted brief assertion passed: the generated brief now includes `Evidence:` and `Source lanes:`, and no longer includes `morning's first pressure point`.
- Pipeline dry run passed: 33 sources, 588 raw items, 12 clusters, 8 located clusters.
- Dry-run health reported 39 source-health records, 39 ok, 0 failed, `store_output_written: false`, and `public_copy_written: false`.
- No browser check was needed because this cycle changed only backend brief synthesis.

### Next Highest-Priority Improvement

Signal Quality. The generated public data still shows at least one likely place-matching error: a Gaza headline can be pulled into a Lebanon/Tyre reading. The next cycle should harden geographic disambiguation so non-Lebanon place names do not get forced into Lebanese map logic.

### One Thing Outside The Rubric

The brief now exposes source evidence more honestly, but it is getting longer. A later UI pass may need collapsible evidence notes or a denser "source shelf" layout so readers can scan without losing the audit trail.

## Cycle 4, 2026-05-26

### Scores Before

1. Signal Quality: 5/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

Lowest-scoring dimensions: Signal Quality and Information Architecture.

Chosen fix: Signal Quality.

Reason: a single bad place inference can bend the whole product. In the current public data, a Gaza casualty headline was being treated as Tyre because the matcher found `Tyre` inside the word `Martyred`. That made the map, the brief, and the next-check language sound locally grounded when the item was actually a Gaza item.

### What Changed

- Replaced substring location matching in `tools/signal_desk/analyze.py` with token-boundary matching.
- Removed the raw substring fallback in `tools/signal_desk/geo.py` that allowed short aliases like `tyr` to match inside ordinary words.
- Added a small Gaza guard: if Gaza terms appear without Lebanon, Hezbollah, or a named Lebanese place, the cluster stays visible but unpinned as `Location unclear`.
- Updated `location_precision_for()` so `Location unclear` is treated as `unknown`.
- Kept feeds and source lanes unchanged, so Arabic/source coverage was not reduced.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

### Verification

- `python3 -m py_compile tools/signal_desk/analyze.py tools/signal_desk/geo.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted regression assertions passed: `Martyred` no longer maps to Tyre, real Tyre mentions still map, and Gaza-only clusters become `Location unclear`.
- Pipeline dry run passed: 33 sources, 591 raw items, 12 clusters, 7 located clusters.
- Dry-run health reported 39 source-health records, 39 ok, 0 failed, `store_output_written: false`, and `public_copy_written: false`.
- No browser check was needed because this cycle changed backend analysis and geo-tagging only.

### Next Highest-Priority Improvement

Information Architecture. The system now has better evidence and better geocoding, but the reader still has to move across brief, map, source lanes, and verification gaps as separate surfaces. The next cycle should make the data structure easier to scan, probably by adding a compact dossier summary or verification status field that the frontend and brief can both reuse.

### One Thing Outside The Rubric

Running Python checks creates `__pycache__` folders under `tools/signal_desk/`. They are easy to remove, but the repo still does not ignore them.

## Cycle 5, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 5/10

Lowest-scoring dimension: Information Architecture.

Chosen fix: Information Architecture.

Reason: the platform had the right evidence ingredients, but they were scattered across separate fields and prose. A reader, brief, map, or frontend component had to reconstruct the same question each time: is this item ready to read, does it need another source, does it need a sharper place, and what should be checked next?

### What Changed

- Added a typed `verification_status` to every cluster.
- Added a compact `verification` dossier with label, summary, source count, source lanes, location precision, missing pieces, next checks, and provenance trail.
- Built the dossier after geo-tagging so location warnings reflect the final map decision.
- Updated brief synthesis to use the same verification dossier that the API now carries.
- Added verification status, label, and missing pieces to map GeoJSON feature properties.
- Left feeds and source lanes untouched, so Arabic and source coverage were not reduced.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 6/10

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/verification.py tools/signal_desk/run.py tools/signal_desk/synthesize.py tools/signal_desk/geo.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted verification assertions passed: a sample cluster received `verification_status: needs-source`, the brief included `Verification: Needs another source`, and GeoJSON properties carried the same verification fields.
- Pipeline dry run passed: 2 raw RSS items, 2 clusters, 2 located clusters, no store output, and no public copy.
- Dry-run health reported 40 source-health records, 1 ok, 39 failed, `store_output_written: false`, and `public_copy_written: false`.
- No browser check was needed because this cycle changed backend data structure and brief synthesis only.

### Next Highest-Priority Improvement

Pipeline Robustness. Add a publication safety guard before public copy, because the current environment can still produce a technically successful run from a collapsed source shelf. A normal run should refuse to copy public data when live source health is too poor or when the output is fallback-thin.

### One Thing Outside The Rubric

The frontend type file under `src/lib/signal-desk.ts` is currently untracked in this worktree. Future UI work should avoid mixing that file into an automation commit unless the whole Signal Desk frontend is being intentionally added.

## Cycle 6, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 6/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality, Source Coverage, Map Quality, Brief Quality, Pipeline Robustness, and Information Architecture.

Chosen fix: Pipeline Robustness.

Reason: the latest dry run completed, but it completed from a collapsed source shelf: 1 live source, 2 scored items, and 39 failed source-health checks out of 40. That is exactly the kind of run that should remain available for diagnosis but should not be allowed to refresh the public dashboard.

### What Changed

- Added a publication guard to `tools/signal_desk/run.py`.
- Added CLI thresholds for `--min-live-sources`, `--min-scored-items`, and `--max-source-failure-rate`.
- Added `--allow-unsafe-public-copy` as an explicit manual override.
- Added a `publication_guard` object to run health with pass/fail status, override flag, reasons, and metrics.
- Kept dry runs non-blocking while still reporting whether public copy would be refused.
- Kept dated store output available for normal diagnostic runs, but public copy now exits with a nonzero status when the guard fails.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

### Verification

- `python3 -m py_compile tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted publication guard assertions passed: weak source health blocks public copy, healthy source health passes, and the unsafe override is recorded.
- `python3 -m tools.signal_desk.run --help` showed the new guard flags.
- Pipeline dry run passed with no public writes and reported `publication_guard.public_copy_allowed: false`.
- Dry-run health reported 40 source-health records, 1 ok, 39 failed, 2 scored items, and four guard reasons.
- No browser check was needed because this cycle changed backend publication safety only.

### Next Highest-Priority Improvement

Source Coverage. The guard prevents bad publication, but it does not fix why most live sources failed in this environment. The next useful pass should inspect RSS failure notes and make source collection more resilient without reducing Arabic or regional coverage.

### One Thing Outside The Rubric

The guard writes safer health metadata, but `run-health.json` is still stored only inside the dated output folder on normal runs. A later observability pass could add a small append-only health history for comparing runs across days.

## Cycle 7, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality, Source Coverage, Map Quality, Brief Quality, and Information Architecture.

Chosen fix: Source Coverage.

Reason: the next priority was to inspect why source coverage collapsed. The inspection showed that all live RSS and HTML-index sources failed with the same DNS-style `urlopen` error. That is not evidence that the Arabic, Palestinian, Israeli, Gulf, Iranian, wire, or Lebanese sources should be cut. It is evidence that this shell cannot resolve external hostnames right now.

### What Changed

- Added a typed `error_kind` to `SourceHealth`.
- Classified RSS and HTML-index failures as `dns-error`, `timeout`, `http-error`, `tls-error`, `parse-error`, or `fetch-error`.
- Marked fallback sample emission as `fallback`.
- Added `error_kind_counts` to `source_health` in run health.
- Added `live_source_count` to run health.
- Updated the publication guard so fallback no longer counts as a live source-health pass.
- Did not remove or reduce any source entries, preserving Arabic and source-lane coverage.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Source Coverage remains at 6 because the diagnostic is better, but live source access is still blocked by DNS/network resolution in this environment.

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/collectors/rss.py tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted source-health assertions passed: DNS failures classify as `dns-error`, HTTP failures as `http-error`, XML parse failures as `parse-error`, and fallback does not count as a live source.
- Pipeline dry run passed with no public writes.
- Dry-run health reported `error_kind_counts: {"dns-error": 39, "fallback": 1}` and `live_source_count: 0`.
- The publication guard reported `public_copy_allowed: false` with zero live sources and zero live source-health checks.
- No browser check was needed because this cycle changed collector diagnostics and run health only.

### Next Highest-Priority Improvement

Blocked for live Source Coverage until DNS/network access is available to the Python process. Once that is restored, rerun the source audit and fix any actual feed-level `http-error`, `parse-error`, or `timeout` failures. If this environment must remain offline, the next safe improvement is an explicit cached-feed input path so local source snapshots can be tested without pretending fallback samples are live reporting.

### One Thing Outside The Rubric

`source_health.ok` still counts fallback as ok in the compact summary, even though the new `live_source_count` and guard metrics now separate it. A later polish pass could add `live_ok` to the summary for less ambiguity.

## Cycle 8, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 6/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality, Source Coverage, Map Quality, Brief Quality, and Information Architecture.

Chosen fix: Source Coverage.

Reason: live DNS is still blocked in this shell, so the useful source-coverage move is not to remove failed feeds. The useful move is to let the same source shelf be tested from saved RSS, Atom, or HTML snapshots, while making the run health say plainly that these are cached source records, not live reporting.

### What Changed

- Added `--rss-snapshot-dir` to `tools/signal_desk/run.py`.
- Added `--rss-snapshot-only` so a fully offline run can avoid network fetches for missing snapshot files.
- Refactored RSS and HTML-index parsing so live fetches and local snapshots use the same parser.
- Added feed-name snapshot matching, for example `The Times of Israel` becomes `the-times-of-israel.xml`.
- Added `snapshot` and `snapshot-missing` source-health categories.
- Added `rss_snapshot_dir`, `rss_snapshot_only`, and `snapshot_source_count` to run health.
- Updated the publication guard so cached snapshots do not count as live source access.
- Documented the snapshot workflow in `tools/signal_desk/README.md`.
- Kept all existing feeds and source lanes intact, so Arabic and source coverage were not reduced.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Source Coverage improves because the full source shelf can now be tested from cached source evidence in an offline environment. Live source access is still blocked by DNS, so this is not a claim that live collection is fixed.

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/collectors/rss.py tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- `python3 -m tools.signal_desk.run --help` showed the new `--rss-snapshot-dir` and `--rss-snapshot-only` flags.
- Targeted snapshot assertions passed with a temporary RSS file: one snapshot source was read, missing snapshots were reported as `snapshot-missing`, and snapshot items were not counted as live items.
- Snapshot-only pipeline dry run passed: 1 cached source item, 1 cluster, `snapshot_source_count: 1`, `live_source_count: 0`, and public copy blocked by the guard.
- Normal RSS dry run still passed under DNS failure: 39 `dns-error` source-health records, 1 fallback record, 2 fallback items, no public writes, and public copy blocked by the guard.
- No browser check was needed because this cycle changed backend collection and run-health behavior only.

### Next Highest-Priority Improvement

Map Quality. The pipeline now has a safer way to test source inputs offline, but the map still treats most location work as a final point or an unclear point. The next scoped pass should improve how district-level or low-confidence places are represented so the map does not look more precise than the evidence.

### One Thing Outside The Rubric

Python verification still creates `__pycache__` directories under `tools/signal_desk/`. They are untracked, but the repo still lacks an ignore rule for them.

## Cycle 9, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 6/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality, Map Quality, Brief Quality, and Information Architecture.

Chosen fix: Map Quality.

Reason: the map already avoids pinning totally unclear claims, but broad places still move through the data as point geometry. That is technically usable, but it can make a district or regional mention look sharper than the source evidence. The data should say when a point is a named-place pin and when it is only a representative center for a broader area.

### What Changed

- Added map display fields to every cluster: `map_marker_kind`, `map_precision_label`, `map_radius_meters`, and `map_warning`.
- Set exact named places to `pin` with a small reference radius.
- Set district or broad-area mentions to `representative-area` with a larger meter radius.
- Set unknown locations to `unmapped` with a direct warning.
- Added the same map display fields to `events.geojson` feature properties.
- Kept GeoJSON point geometry for compatibility, but made the uncertainty visible in properties.
- Did not touch feeds or source lanes, so Arabic and source coverage were not reduced.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/geo.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted map-data assertions passed: Tyre resolved as a `pin`, South Lebanon resolved as a `representative-area` with a 36 km radius, unclear Gaza-only location stayed `unmapped`, and `events.geojson` carried map display properties while excluding the unmapped cluster.
- Normal RSS dry run passed with no public writes.
- Dry-run health still showed DNS-blocked live source access, 39 `dns-error` records, 1 fallback record, 2 fallback items, and public copy blocked by the guard.
- No browser check was needed because this cycle changed backend map data only.

### Next Highest-Priority Improvement

Brief Quality. The brief now has verification language, but it still does not use the new map display warning. A useful next pass would make the brief name when a mapped point is only a representative area, so prose and map data carry the same caution.

### One Thing Outside The Rubric

The frontend map currently has hard-coded low-confidence circle radii. The data now publishes `map_radius_meters`, but the frontend has not yet been wired to use it.

## Cycle 10, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 6/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality, Brief Quality, and Information Architecture.

Chosen fix: Brief Quality.

Reason: Cycle 9 made map uncertainty visible in the data, but the generated brief still read the map line as if every place label carried the same precision. A reader should not need to inspect `events.geojson` to know whether South Lebanon is a real pin or a representative area.

### What Changed

- Added map context to each brief evidence line.
- Added a map-line formatter for the `On the map` section.
- Exact named places now appear as named-place pins.
- Representative areas now show their radius in the brief, for example a 36 km South Lebanon radius.
- Unmapped claims now say they are unmapped because the place is unclear.
- Reused the map fields added in Cycle 9 instead of recalculating precision inside the prose layer.
- Kept the existing brief structure and did not touch source feeds or lanes.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

### Verification

- `python3 -m py_compile tools/signal_desk/synthesize.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted brief assertion passed: a South Lebanon cluster produced a brief sentence saying it is a representative area with about a 36 km radius, and the `On the map` line carried the same caveat.
- Normal RSS dry run passed with no public writes.
- Dry-run health still showed DNS-blocked live source access, 39 `dns-error` records, 1 fallback record, 2 fallback items, and public copy blocked by the guard.
- No browser check was needed because this cycle changed backend brief synthesis only.

### Next Highest-Priority Improvement

Information Architecture. Most dimensions now sit at 7, but the information model still leaves run-level health separate from the brief and cluster dossiers. A useful next pass would expose a compact run-level source condition in the generated API or brief so readers can see when the whole source shelf is degraded.

### One Thing Outside The Rubric

The brief still uses a fixed title, `MENA Morning Brief`, even though the product is now more specifically a Lebanon and Levant Signal Desk.

## Cycle 11, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 6/10

Lowest-scoring dimensions: Signal Quality and Information Architecture.

Chosen fix: Information Architecture.

Reason: cluster dossiers now explain individual claims, but the whole-run source state was still split across `source_health`, `run-health.json`, and the publication guard. A reader of the generated brief or API needed one compact answer to a basic question: was this a live source run, a degraded source run, a snapshot run, or only fallback data?

### What Changed

- Added a `SourceCondition` model.
- Added `source_condition` to `api.meta`.
- Added `source_condition` to run health.
- Classified runs as `healthy`, `degraded`, `snapshot-only`, `fallback-only`, or `empty`.
- Added source-condition text to the generated brief.
- Reused the existing source-health counts and error-kind categories instead of creating a second source-health system.
- Kept the detailed `source_health` array unchanged.
- Did not touch feeds or source lanes, so Arabic and source coverage were not reduced.

### Scores After

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 7/10

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/run.py tools/signal_desk/synthesize.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted source-condition assertions passed for `fallback-only` and `snapshot-only` runs.
- Targeted brief assertion passed: an empty brief with fallback-only source condition included a `Source condition` section.
- Normal RSS dry run passed with no public writes.
- Dry-run health included `source_condition.status: fallback-only`, 39 `dns-error` records, 1 fallback record, 2 fallback items, and public copy blocked by the guard.
- No browser check was needed because this cycle changed backend API metadata and brief synthesis only.

### Next Highest-Priority Improvement

Signal Quality. It is now the lowest-scoring remaining dimension. The next scoped pass should improve clustering or deduplication so fallback/sample, snapshot, Telegram, and RSS items do not produce misleading clusters when headlines overlap only loosely.

### One Thing Outside The Rubric

The frontend type file does not yet expose `meta.source_condition`, so the dashboard cannot display the new run-level source condition without a small frontend typing and UI pass.

## Cycle 12, 2026-05-26

### Scores Before

1. Signal Quality: 6/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 7/10

Lowest-scoring dimension: Signal Quality.

Chosen fix: Signal Quality.

Reason: fallback samples are useful for dry-run diagnostics, but they were still flowing through clustering as normal-looking signals. In a DNS-blocked run, that can make local sample text look like fresh reporting unless every downstream surface preserves the fallback label.

### What Changed

- Added fallback-only cluster detection in `tools/signal_desk/analyze.py`.
- Forced fallback-only clusters to `low` severity and `unconfirmed` status.
- Prefixed fallback-only cluster headlines with `Fallback sample:`.
- Replaced normal event language with explicit review-only fallback language.
- Routed fallback items into a dedicated `pipeline-sample` source lane.
- Added the `pipeline-sample` lane label to brief synthesis.
- Kept fallback samples available for diagnostics and did not remove or reduce any live source feed.

### Scores After

1. Signal Quality: 7/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 7/10

### Verification

- `python3 -m py_compile tools/signal_desk/analyze.py tools/signal_desk/source_lanes.py tools/signal_desk/synthesize.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted fallback assertions passed: fallback clusters were prefixed, low severity, unconfirmed, marked as review-only fallback samples, and assigned to `pipeline-sample`.
- Normal RSS dry run passed with no public writes.
- Dry-run health showed `source_lane_counts.pipeline-sample: 2`, 39 `dns-error` records, 1 fallback record, 2 fallback items, and public copy blocked by the guard.
- No browser check was needed because this cycle changed backend analysis, source-lane classification, and brief labels only.

### Next Highest-Priority Improvement

All rubric dimensions are now at 7/10. The next useful improvements are frontend wiring for `meta.source_condition` and `map_radius_meters`, or live source repair once DNS/network access is available. I am stopping here because those next steps either touch currently untracked frontend files or depend on live network resolution.

### One Thing Outside The Rubric

The preview server has its own hard-coded low-confidence map radius logic and does not yet read the new map radius fields.
