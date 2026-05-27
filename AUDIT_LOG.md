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

## Cycle 13, 2026-05-26

### Scores Before

1. Signal Quality: 7/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 7/10
7. Information Architecture: 7/10

All rubric dimensions were tied at 7/10.

Chosen fix: Pipeline Robustness.

Reason: the first candidate was a tracked preview-map fix for `map_radius_meters`, but this sandbox blocks local server binding and the in-app browser blocks local file URLs. Since frontend rendering could not be verified here, I pivoted to the next fully testable robustness issue already named in Cycle 7: fallback source health still appeared under the same top-level `ok` count as live source recovery.

### What Changed

- Updated `tools/signal_desk/run.py` so `source_health` in run health now separates `live_ok`, `snapshot_ok`, and `fallback_ok`.
- Kept the existing `ok` field for compatibility with any older checks.
- Preserved the publication guard's stricter live-source metrics.
- Did not change feeds, source lanes, Arabic coverage, public data, or frontend files.

### Scores After

1. Signal Quality: 7/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Pipeline Robustness improves because a fallback-only run now says `ok: 1`, `live_ok: 0`, and `fallback_ok: 1` in the top-level health summary, which is much harder to misread.

### Verification

- `python3 -m py_compile tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted source-health assertion passed for live, snapshot, fallback, and failed source-health records.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health showed `source_health.live_ok: 0`, `source_health.snapshot_ok: 0`, `source_health.fallback_ok: 1`, 39 `dns-error` records, and public copy blocked by the publication guard.
- Browser rendering was not required for the final code change because the committed change is backend health reporting only.

### Next Highest-Priority Improvement

Map Quality / UI wiring once a browser-verifiable environment is available. The preview server and the Next.js map can still be wired to read `map_radius_meters`, but that should be committed only where local preview rendering can be checked.

### One Thing Outside The Rubric

This sandbox currently denies local port binding with `PermissionError: [Errno 1] Operation not permitted`, and the in-app browser blocks local file URLs. That prevents the automation from completing browser verification for frontend Signal Desk changes in this run.

## Cycle 14, 2026-05-26

### Scores Before

1. Signal Quality: 7/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Lowest-scoring dimensions: Signal Quality, Source Coverage, Map Quality, Brief Quality, UI/UX & Design, and Information Architecture.

Chosen fix: Signal Quality.

Reason: the frontend/map path remains blocked by browser verification limits, and live Source Coverage remains blocked by DNS. The most useful backend-only signal fix was the location fallback: vague text with no named Lebanese place was still being assigned to Beirut. That makes the signal look locally sharper than the source record allows.

### What Changed

- Updated `location_hint()` in `tools/signal_desk/analyze.py`.
- Named Lebanese places still resolve as named places.
- Lebanon, Lebanese, Hezbollah, UNIFIL, or Blue Line context without a named local place now resolves to national-level `Lebanon`.
- Text with no Lebanese place or Lebanon context now resolves to `Location unclear`.
- Kept the Gaza guard and token-boundary place matching unchanged.
- Did not change feeds, source lanes, Arabic coverage, public data, or frontend files.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Signal Quality improves because the pipeline no longer invents a Beirut location when the text has no named place. It now either uses a named place, a national Lebanon-level marker, or no map location.

### Verification

- `python3 -m py_compile tools/signal_desk/analyze.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted location assertions passed: no-place text becomes `Location unclear`, Hezbollah/Lebanese context becomes national-level `Lebanon`, real Beirut mentions still resolve to `Beirut`, and Gaza-only text remains `Location unclear`.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health still showed DNS-blocked live source access, `source_health.live_ok: 0`, `fallback_ok: 1`, 39 `dns-error` records, and public copy blocked by the publication guard.
- No browser check was needed because this cycle changed backend signal analysis only.

### Next Highest-Priority Improvement

Source Coverage once DNS/network access is available, or Map Quality/UI wiring once browser verification is available. In this sandbox, both paths are currently blocked for safe completion.

### One Thing Outside The Rubric

The live public data under `public/data/signal-desk/` appears older than the latest store output and does not yet carry the newer map-radius fields. A guarded public copy should wait until live source health recovers or a reviewed snapshot run is intentionally promoted.

## Cycle 15, 2026-05-26

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 7/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Lowest-scoring dimensions: Source Coverage, Map Quality, Brief Quality, UI/UX & Design, and Information Architecture.

Chosen fix: Brief Quality.

Reason: Source Coverage remains blocked by DNS/network resolution, and Map/UI work remains blocked by browser verification limits. The useful backend-only brief fix was the title. The generated brief still called itself `MENA Morning Brief`, but the pipeline is now a Lebanon-centered Signal Desk with regional source context, not a general MENA digest.

### What Changed

- Added `brief_title()` in `tools/signal_desk/synthesize.py`.
- Changed empty and non-empty generated briefs from `MENA Morning Brief` to `Lebanon Signal Desk Brief`.
- Left the existing section structure, source-condition text, map evidence, and verification language unchanged.
- Did not change feeds, source lanes, Arabic coverage, public data, or frontend files.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Brief Quality improves because the first line now sets the correct geographic and editorial frame before the reader reaches the source-condition caveat.

### Verification

- `python3 -m py_compile tools/signal_desk/synthesize.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted brief-title assertion passed: empty generated briefs now start with `# Lebanon Signal Desk Brief, May 26, 2026` and do not contain `MENA Morning Brief`.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health still showed DNS-blocked live source access, `source_health.live_ok: 0`, `fallback_ok: 1`, 39 `dns-error` records, and public copy blocked by the publication guard.
- No browser check was needed because this cycle changed backend Markdown synthesis only.

### Next Highest-Priority Improvement

Source Coverage needs live DNS/network access. Map Quality, UI/UX, and frontend Information Architecture need a browser-verifiable environment before committing display changes. In this run, those are the practical stop conditions.

### One Thing Outside The Rubric

The frontend type layer still needs to expose newer backend fields such as `meta.source_condition` and `map_radius_meters`, but that should be paired with a browser-rendered dashboard check.

## Cycle 16, 2026-05-27

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 7/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Lowest-scoring dimensions: Source Coverage, Map Quality, UI/UX & Design, and Information Architecture.

Chosen fix: Source Coverage.

Reason: Map Quality and UI/UX still need browser-rendered verification before frontend changes are safe to commit in this automation. Source Coverage had a contained backend gap: the source shelf had many media and Google News routes, but no direct official ingestion path for UNIFIL's mission news or the Lebanese Army's Arabic official statements.

### What Changed

- Added source-specific `link_patterns` support to the HTML-index collector.
- Switched HTML-index parsing from one hard-coded `/article/` regex to a small `HTMLParser` anchor extractor.
- Converted relative HTML links to absolute URLs using the source page as the base.
- Kept the old default `/article/` behavior for existing L'Orient Today parsing.
- Added `UNIFIL News` as an official English HTML-index source.
- Added `Lebanese Army Official Arabic` as an official Arabic HTML-index source.
- Kept every existing feed, source lane, fallback sample, and publication guard unchanged.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Source Coverage improves because the pipeline can now ingest official UNIFIL and Lebanese Army field-layer pages directly once network access is available, while still preserving the Arabic source layer and existing media shelf.

### Verification

- `python3 -m py_compile tools/signal_desk/collectors/rss.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted HTML parser assertions passed for UNIFIL official slugs, Lebanese Army Arabic `/ar/content/` links, relative-to-absolute URL conversion, and unchanged L'Orient Today `/article/` parsing.
- Feed config assertion passed: `UNIFIL News` and `Lebanese Army Official Arabic` are present in `load_feeds()`.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health showed `total: 42`, `live_ok: 0`, `fallback_ok: 1`, 41 `dns-error` records, 2 fallback items, and `source_condition.status: fallback-only`.
- No browser check was needed because this cycle changed backend collection and feed configuration only.

### Next Highest-Priority Improvement

Map Quality and UI/UX remain at 7/10, but the next pass should only wire `map_radius_meters` or `meta.source_condition` into the dashboard where a browser-rendered Signal Desk page can be checked.

### One Thing Outside The Rubric

HTML-index items still use collection time as `published_at` because the collector does not yet parse nearby date text from official pages. That is acceptable for source leads, but future official-page work should preserve page dates when the markup exposes them clearly.

## Cycle 17, 2026-05-27

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 7/10

Lowest-scoring dimensions: Map Quality, UI/UX & Design, and Information Architecture.

Chosen fix: Information Architecture.

Reason: the configured source shelf is part of the product's meaning, but it was only visible by opening `feeds.yaml`. Source health says what happened during one run. It does not say what the platform is configured to watch. That matters most in degraded runs, because DNS failure should not hide the intended coverage map.

### What Changed

- Added a `SourceInventory` model to API metadata.
- Built source inventory from the configured feed list, not from returned items.
- Added total configured sources.
- Added counts by language.
- Added counts by collection mode.
- Added counts by tier.
- Added the configured source-name list.
- Added the same `source_inventory` object to run health.
- Kept source health, source condition, source lanes, public copy rules, and feed coverage unchanged.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

Information Architecture improves because the API and health record now separate three things: configured source inventory, observed source health, and run-level source condition.

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted inventory assertions passed: 41 configured sources, 9 Arabic, 30 English, 2 Hebrew, 3 HTML-index sources, 38 RSS/default sources, and both new official sources present.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health included `source_inventory.total_configured: 41`, `by_language.ar: 9`, `by_collection_mode.html_index: 3`, and `by_tier.tier-1: 28`.
- Dry-run source condition remained honest: `fallback-only`, `live_ok: 0`, 41 `dns-error` records, 2 fallback items, and no public copy.
- No browser check was needed because this cycle changed backend API metadata and run-health output only.

### Next Highest-Priority Improvement

Map Quality and UI/UX & Design are now the only 7/10 dimensions. The next real improvement is frontend-facing: render map-radius uncertainty from `map_radius_meters`, or display `source_condition` / `source_inventory` in the dashboard.

### One Thing Outside The Rubric

The frontend TypeScript layer still does not model `meta.source_inventory`, so the dashboard cannot use the inventory without a dedicated frontend pass.

## Cycle 18, 2026-05-27

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 7/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

Lowest-scoring dimensions: Map Quality and UI/UX & Design.

Chosen fix: Map Quality.

Reason: the map already carried per-cluster precision fields, but the run did not summarize the whole map's reliability. A reader or operator had to inspect each cluster to know whether the map was mostly exact pins, representative areas, or unmapped claims.

### What Changed

- Added a `MapCoverage` model to API metadata.
- Built map coverage from clusters after geotagging and verification.
- Added total cluster count.
- Added mapped and unmapped cluster counts.
- Added representative-area count.
- Added maximum map radius in meters.
- Added counts by marker kind.
- Added counts by location precision.
- Added the same `map_coverage` object to run health.
- Did not change GeoJSON geometry, map frontend rendering, source coverage, or brief language.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 8/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

Map Quality improves because the API and run health now explain the overall map precision profile instead of leaving that to be inferred from individual events.

### Verification

- `python3 -m py_compile tools/signal_desk/models.py tools/signal_desk/run.py` passed.
- `python3 -m compileall -q tools/signal_desk` passed.
- Targeted map-coverage assertions passed for mapped versus unmapped clusters, representative-area count, maximum radius, marker-kind counts, and location-precision counts.
- `python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run` passed with no public writes.
- Dry-run health included `map_coverage.total_clusters: 2`, `mapped_clusters: 2`, `unmapped_clusters: 0`, `max_radius_meters: 2500`, `by_marker_kind.pin: 2`, and `by_location_precision.exact: 2`.
- Dry-run source condition remained `fallback-only`, with 41 `dns-error` records, 2 fallback items, and no public copy.
- No browser check was needed because this cycle changed backend API metadata and run-health output only.

### Next Highest-Priority Improvement

UI/UX & Design is now the only 7/10 dimension. The remaining useful work is frontend-facing: display source condition, source inventory, and map coverage in the dashboard, and wire the map to use `map_radius_meters`.

### One Thing Outside The Rubric

`map_coverage` describes geometric precision, not source freshness. A fallback-only run can still show exact fallback sample pins, so readers must pair map coverage with `source_condition`.

## Cycle 19, 2026-05-27, Blocked

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 8/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

Lowest-scoring dimension: UI/UX & Design.

Chosen fix: UI/UX & Design.

Reason: UI/UX is now the only remaining 7/10 dimension. The next useful work is to display source condition, source inventory, and map coverage in the dashboard, and to render map uncertainty using `map_radius_meters`.

### Blocker

The remaining UI/UX work touches the frontend Signal Desk surface. In this worktree, `src/app/signal-desk/` and `src/lib/signal-desk.ts` are currently untracked, while the dashboard components are tracked. A safe automation commit should not absorb or rewrite pre-existing untracked frontend work. The UI change also requires browser-rendered verification, which was the same practical blocker named in the previous run.

### Safe Diagnostic Changes

- No source, UI, feed, or generated public data files were changed in this blocked cycle.
- This entry records the stop condition so the next run can pick up from the same point without guessing.

### Verification

- `git status --short -- src/app/signal-desk src/components/signal-desk src/lib/signal-desk.ts` showed `src/app/signal-desk/` and `src/lib/signal-desk.ts` as untracked.
- The tracked Signal Desk backend files were clean after Cycle 18.
- No browser check was run because no frontend change was made.

### Next Highest-Priority Improvement

UI/UX & Design remains the next priority, but it should be done only after deciding whether the existing untracked Signal Desk route and data loader belong in the automation commit, or after those files are committed separately by the user.

### One Thing Outside The Rubric

The frontend route/data-loader state is now the main repository hygiene issue for Signal Desk. Until it is resolved, backend automation can keep improving metadata, but the dashboard cannot safely surface it.

## Cycle 20, 2026-05-27, Blocked

### Scores Before

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 8/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

Lowest-scoring dimension: UI/UX & Design.

Chosen fix: UI/UX & Design.

Reason: UI/UX is still the only remaining 7/10 dimension. Current research supports a compact dashboard trust surface that makes source condition, configured source inventory, and map coverage visible in plain language, with degraded or fallback-only runs treated as real warnings.

### Blocker

The improvement still touches the frontend Signal Desk surface. In this worktree, `src/app/signal-desk/page.tsx` and `src/lib/signal-desk.ts` are untracked, while the dashboard components are tracked. A safe automation commit cannot absorb pre-existing untracked frontend work, and a dashboard change committed without those route/data-loader files would be incomplete.

### Safe Diagnostic Changes

- Appended current UI/UX research to `RESEARCH_LOG.md`.
- Confirmed the frontend tracking split with targeted `git ls-files` checks.
- Did not change feeds, Arabic/source coverage, generated public data, backend pipeline code, or tracked UI components.

### Scores After

1. Signal Quality: 8/10
2. Source Coverage: 8/10
3. Map Quality: 8/10
4. Brief Quality: 8/10
5. UI/UX & Design: 7/10
6. Pipeline Robustness: 8/10
7. Information Architecture: 8/10

### Verification

- `git ls-files --others --exclude-standard -- src/app/signal-desk src/lib/signal-desk.ts src/components/signal-desk` showed `src/app/signal-desk/page.tsx` and `src/lib/signal-desk.ts` as untracked.
- `git ls-files -- src/app/signal-desk src/lib/signal-desk.ts src/components/signal-desk` showed only `src/components/signal-desk/signal-desk-dashboard.tsx` and `src/components/signal-desk/signal-desk-map.tsx` as tracked.
- `git diff --name-only -- AUDIT_LOG.md RESEARCH_LOG.md tools/signal_desk src/components/signal-desk src/app/signal-desk src/lib/signal-desk.ts` was clean before this log-only cycle.
- No lint, build, pipeline, or browser check was run because no source or frontend implementation was made.

### Next Highest-Priority Improvement

UI/UX & Design remains the next priority. The route/data-loader state should be resolved first, either by committing those files separately or confirming that the automation may include them.

### One Thing Outside The Rubric

Two `git status` commands hung in this sandbox, so targeted `git ls-files` and `git diff --name-only` checks were used instead. Repository hygiene should include checking whether a local Git integration or filesystem watcher is making full status calls stall.

## Editorial Experience Cycle 01, 2026-05-27

### Scores Before

1. Editorial Voice: 7/10
2. Anti-AI Prose: 6/10
3. Issue 01 Packaging: 4/10
4. Essay Structure: 7/10
5. Homepage Clarity: 6/10
6. Essay Reading Experience: 7/10
7. Mobile Layout: 6/10
8. Topic Filters: 6/10
9. Visual Modernity: 7/10
10. Art/Image Direction: 7/10
11. Interaction/Motion: 6/10
12. Technical Health: 5/10

Lowest-scoring dimension: Issue 01 Packaging.

Chosen fix: turn `/essays` from a plain index into an Issue 01 cover and table of contents.

Reason: the site already had strong essays, good imagery, and a serious paper-like visual language, but the issue did not yet feel authored. The essays page said "Essays" and counted the archive, while the homepage still described the issue as "eight launch essays" even though the live issue contains 10 essays. That made the public surface feel like a list instead of a deliberate first issue.

### Prose Audit Before Rewriting

- Generic platform copy: "independent platform for long-form writing on Lebanon, power, memory, and identity" could belong to many literary-political sites.
- False issue packaging: "eight launch essays" was factually stale and weakened trust.
- Place-light framing: the essays page did not name Downtown Beirut, Sakiet el-Janzeer, the 1932 census, or the Blue Line before asking the reader to browse.
- Over-neat archive language: "compact first register, built for return" had atmosphere, but not enough argument.

### What Changed

- Archived the pre-change Issue 01 state in `site-archive/issue-snapshots/2026-05-27-cycle-01-before-issue-packaging.md`.
- Rewrote the homepage mission strip to start from Beirut in May 2026 and name the issue's real subjects.
- Corrected the homepage archive copy from "eight launch essays" to 10 essays and renamed the CTA to "Open Issue 01."
- Rebuilt the `/essays` header as an Issue 01 cover with a deck, issue stats, and a compact thematic spine.
- Added filter context so the reader sees whether they are viewing the full issue or a topic-filtered slice.
- Tightened the Park essay in `longform-essays.md`, including replacing the banned figurative "landscape" tag/phrasing and removing some over-neat public-space language.
- Appended new future ideas to `site-archive/opportunities.md` without replacing the earlier opportunity list.
- Added `site-archive/living-voice-lab.md` so future voice cycles do not treat the old house voice as law.
- Added a narrow `src/lib/signal-desk.ts` type contract and local map type shims because tracked Signal Desk files blocked production typecheck before this cycle could be verified.

### Scores After

1. Editorial Voice: 7/10
2. Anti-AI Prose: 6/10
3. Issue 01 Packaging: 6/10
4. Essay Structure: 7/10
5. Homepage Clarity: 7/10
6. Essay Reading Experience: 7/10
7. Mobile Layout: 6/10
8. Topic Filters: 7/10
9. Visual Modernity: 7/10
10. Art/Image Direction: 7/10
11. Interaction/Motion: 6/10
12. Technical Health: 6/10

Issue 01 Packaging improves because the issue now has a public argument before the list begins. Homepage Clarity improves because the archive copy now matches the real essay count and gives the reader a route through the issue.

### Verification

- `npm ci --prefer-offline --ignore-scripts --no-audit` passed and restored local dependencies.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Built-output checks found the new homepage issue copy in `.next/server/app/index.rsc`.
- Built-output checks found the new `/essays` issue deck and filter context in `.next/server/app/essays/page.js` and the client chunk.
- Local preview is working at `http://127.0.0.1:3001/essays`.
- `curl` checks confirmed the new Issue 01 deck on `/essays` and the updated homepage archive copy on `/`.
- Process inspection confirmed port 3001 is served from `/Users/karimsalam/.codex/worktrees/c473/Leb Ac Web copy`.
- Checkpoint commit: `907eef4` (`Refine Leb Ac Web copy voice guidance`).

### Reversibility

- Snapshot saved: `site-archive/issue-snapshots/2026-05-27-cycle-01-before-issue-packaging.md`.
- The snapshot records the prior essay order, deks, homepage issue copy, essays index copy, and cover logic.

### What Still Feels Weak

- The longform source still contains banned or AI-scented words such as figurative "landscape," "unlock," and "leverage."
- The local preview is available, but a visual browser screenshot pass was not completed in this checkpoint.
- The mobile search icon is still inert.
- Signal Desk map runtime dependencies are still not installed. The current public route set does not include Signal Desk, and the type shims only unblock typecheck for tracked dormant components.

### Next Recommended Target

Anti-AI Prose. Continue the cleanup pass across `longform-essays.md`, especially the Downtown sections where banned vocabulary and generic civic-design phrasing are still visible.

### Newly Noticed Opportunities

- A dedicated Issue 01 route could become the real issue cover later.
- Very long essays need a reader-side table of contents.
- The image shelf should be audited so sourced images carry more of the argument where possible.

## Editorial Experience Cycle 02, 2026-05-27

### Scores Before

1. Editorial Voice: 7/10
2. Anti-AI Prose: 5/10
3. Issue 01 Packaging: 6/10
4. Essay Structure: 7/10
5. Homepage Clarity: 7/10
6. Essay Reading Experience: 7/10
7. Mobile Layout: 6/10
8. Topic Filters: 7/10
9. Visual Modernity: 7/10
10. Art/Image Direction: 7/10
11. Interaction/Motion: 6/10
12. Research Depth: 7/10
13. Unused Essay Opportunities: 5/10
14. Technical Health: 5/10

Lowest-scoring dimensions: Anti-AI Prose and Unused Essay Opportunities.

Chosen fix: a focused voice cleanup of `The Park That Remembers`, paired with a research-opportunity pass.

Reason: the previous cycle gave the issue a stronger public wrapper, but the canonical essay source still carried banned or generic habits. The Park essay was the cleanest high-value target because it was visible on the homepage and still used civic-design language that sounded too polished for Lebanese Academic.

### Research Opportunity Pass

Inspected `RESEARCH/`, `RESEARCH 2/`, `may-august-2025-lebanese-academic-social-science-chats.md`, `launch-content.md`, `editorial-angle-map.md`, and the current essay inventory in `longform-essays.md`.

Added four future ideas to `site-archive/opportunities.md`:

- `The Aquifer Republic`
- `Same Body, Different Religion`
- `The Country That Exports Its People`
- `Baalbek Was Not a Ruin`

The generator crackdown material is already largely covered by the live generator essay. The Canaanite and sacred-feminine material overlaps with `The Land That Mourns in One Language`, so the useful future angle is shared ritual mechanics rather than another straight mythology essay.

### Prose Audit Before Rewriting

- The Park metadata still used `Landscape`, which is banned in the project voice rules when it becomes abstract site language.
- The old pull quote used a neat negative sequence: "Not a theme park. Not a museum. Not an escape from Beirut."
- Several paragraphs leaned on tidy explanatory transitions: "This is where," "This matters," "This is what I mean."
- The old ending explained the argument too cleanly instead of landing on a specific image.
- The essay used civic-design phrases that could have belonged to a proposal deck rather than a Beirut essay.

### What Changed

- Rewrote the Park essay dek, topic tag, and pull quote in `longform-essays.md`.
- Removed the targeted banned or AI-scented terms from the Park section, including `Landscape`, `key`, `This matters`, `This is where`, `not only`, and `not just`.
- Replaced the generic design-proposal opening with a sharper first movement about Beirut's interrupted public space.
- Tightened the Hobsbawm and invented-tradition passage so it sounds less like a lecture and more like an argument.
- Reworked the closing so it ends on an old man, a child, water, and a public place rather than a neat slogan.
- Logged archive-derived future essay ideas in `site-archive/opportunities.md`.

### Scores After

1. Editorial Voice: 7/10
2. Anti-AI Prose: 6/10
3. Issue 01 Packaging: 6/10
4. Essay Structure: 7/10
5. Homepage Clarity: 7/10
6. Essay Reading Experience: 7/10
7. Mobile Layout: 6/10
8. Topic Filters: 7/10
9. Visual Modernity: 7/10
10. Art/Image Direction: 7/10
11. Interaction/Motion: 6/10
12. Research Depth: 7/10
13. Unused Essay Opportunities: 6/10
14. Technical Health: 5/10

Anti-AI Prose improves because a homepage-visible essay now clears the targeted banned-term scan. Unused Essay Opportunities improves because the archive pass produced specific future essays with source file names and duplication notes.

### Reversibility

No new issue snapshot was required because this cycle did not change issue structure, essay order, titles across the issue, cover logic, or filter behavior. Cycle 01's issue snapshot remains the reversible record for issue packaging. The source changes are visible in Git.

### Verification

- Targeted Park-section banned-term scan passed with no matches for the terms cleaned in this cycle.
- `npm run lint` passed.
- `git diff --check` passed.
- `npm run build` passed.
- Built output contains the revised Park dek and closing line in `.next/server`.

### Working Local Preview URL

Working: `http://127.0.0.1:3001/essays`

`http://127.0.0.1:3000/essays` returned 200, but that server belongs to `/private/tmp/leb-ac-web-origin-main`, not this worktree. Use port 3001 for this automation branch while that process is running.

### Git Checkpoint

The run began on `0540b4e`. During verification, `HEAD` moved to `907eef4` and the worktree became clean, which captured the implemented source changes. This note records that mid-run checkpoint instead of pretending the automation created it manually.

A follow-up ledger commit was attempted with `git add AUDIT_LOG.md site-archive/cycle-history.md && git commit -m "Record Cycle 02 editorial cleanup"`, but it failed because the sandbox could not create `/Users/karimsalam/Documents/Leb Ac Web copy/.git/worktrees/Leb-Ac-Web-copy4/index.lock`. These two ledger files therefore remain modified in the worktree.

### What Still Feels Weak

- The full `longform-essays.md` file still contains many em dashes and banned constructions outside the Park essay.
- The flagship Downtown essay should get a separate, slower voice pass because it is too large for a quick cleanup.
- This exact worktree is currently available at `http://127.0.0.1:3001/essays`.

### Next Recommended Target

Continue Anti-AI Prose cleanup, starting with `The City That Could Not Repair Itself` and the short `Downtown Without a City` essay. Clean banned constructions first, then decide whether the flagship Downtown essay needs a structural edit.

## Editorial Experience Cycle 03, 2026-05-27

### Scores Before

1. Editorial Voice: 7/10
2. Anti-AI Prose: 5/10
3. Karim-Specific Voice Discovery: 6/10
4. Issue 01 Packaging: 6/10
5. Essay Structure: 7/10
6. Homepage Clarity: 7/10
7. Essay Reading Experience: 7/10
8. Mobile Layout: 6/10
9. Topic Filters: 7/10
10. Visual Modernity: 7/10
11. Art/Image Direction: 7/10
12. Interaction/Motion: 6/10
13. Research Depth: 7/10
14. Unused Essay Opportunities: 6/10
15. Technical Health: 5/10

Lowest-scoring dimension: Anti-AI Prose.

Chosen fix: targeted voice cleanup of `The City That Could Not Repair Itself`.

Reason: the flagship Downtown essay carries the issue's whole argument about memory, property, repair, and public life. It was already strong in research and structure, but it still had too many machine-like hinges: em dashes, `not only`, `not just`, `This is why`, `This matters`, `unlock`, and thesis-guide phrasing that sounded too much like an assistant explaining the essay's own movement.

### Research Opportunity Pass

Inspected `RESEARCH/`, `RESEARCH 2/`, `DRAFT-downtown-beirut-memorycide.md`, `launch-content.md`, `may-august-2025-lebanese-academic-social-science-chats.md`, and the current inventory in `longform-essays.md`.

Added three future ideas to `site-archive/opportunities.md`:

- `The Reconstruction Trap`
- `The Counter-Archive`
- `The Parking Lot Beat The Plaza`

The first is a future war/reconstruction essay rather than another Solidere history. The second needs careful sourcing before publication because it touches private artifact collections. The third should stay out of Issue 01 for now because the parking-lot image already appears inside the flagship Downtown essay.

### Prose Audit Before Rewriting

- The flagship Downtown essay still had em dashes and banned `not only` / `not just` structures.
- Several transitions explained the argument too neatly: `This is why`, `This matters`, `What would it mean`, and `The point is`.
- The word `unlock` made one passage sound like a development deck rather than a Lebanese Academic essay.
- The conclusion still contained a generic `task is to` sentence.
- The strongest living material was already present: the concession that Hariri built something, the vacancy/repair frame, the Naccache memorycide frame, and the parking-lot image.

### What Changed

- Rewrote the flagship essay dek to remove the `not simply` construction.
- Cleaned the essay body for the targeted banned and AI-scented constructions.
- Replaced proposal-deck language with plainer political language, including `turn land into cash` instead of `unlock land`.
- Preserved the argument and section structure; this was a voice repair, not a structural rewrite.
- Added Cycle 03 notes to `site-archive/living-voice-lab.md`.
- Added the research findings to `RESEARCH_LOG.md` and `site-archive/opportunities.md`.

### Scores After

1. Editorial Voice: 8/10
2. Anti-AI Prose: 6/10
3. Karim-Specific Voice Discovery: 7/10
4. Issue 01 Packaging: 6/10
5. Essay Structure: 7/10
6. Homepage Clarity: 7/10
7. Essay Reading Experience: 7/10
8. Mobile Layout: 6/10
9. Topic Filters: 7/10
10. Visual Modernity: 7/10
11. Art/Image Direction: 7/10
12. Interaction/Motion: 6/10
13. Research Depth: 7/10
14. Unused Essay Opportunities: 7/10
15. Technical Health: 5/10

Editorial Voice improves because the issue lead now sounds less guided and more authorial. Anti-AI Prose improves because the flagship essay clears the targeted construction scan. Unused Essay Opportunities improves because the archive pass produced three non-duplicative future essay paths. Technical Health does not improve because the local commit could not be created from this sandbox.

### Reversibility

No new issue snapshot was required because this cycle did not change issue order, issue title, essay order, cover logic, topic filters, or issue-facing structure. The prose changes are still visible in the working tree and can be inspected through Git diff, but no local commit checkpoint was created.

### Verification

- Targeted flagship-section scan passed for em dashes, `not only`, `not just`, `unlock`, figurative `landscape`, `This matters`, `This is why`, `The point is`, `The task is`, and `not X but Y` scaffolding.
- `git diff --check` passed after the final log append.
- `npm run lint` passed.
- `npm run build` passed after the final prose/log patch.
- Built-output check found the revised Downtown dek and closing line in `.next/server`.

### Commit Status

Commit blocked after successful verification.

Attempted commit message: `Clean flagship Downtown prose`.

Git failed while trying to create `/Users/karimsalam/Documents/Leb Ac Web copy/.git/worktrees/Leb-Ac-Web-copy4/index.lock` with `Operation not permitted`. No stale lock file was present, and a direct write test inside that Git worktree metadata folder also failed with `Operation not permitted`. This is a sandbox/write-permission blocker, not a prose or build failure.

Per the automation rule, the relay stops here rather than beginning another cycle. Current worktree remains dirty with the six intended files changed: `AUDIT_LOG.md`, `RESEARCH_LOG.md`, `longform-essays.md`, `site-archive/cycle-history.md`, `site-archive/living-voice-lab.md`, and `site-archive/opportunities.md`.

### Working Local Preview URL

Preview status: unverified from this sandbox.

`lsof` confirms a Node server is listening on `http://127.0.0.1:3001` from `/Users/karimsalam/.codex/worktrees/c473/Leb Ac Web copy`, but both shell `curl` and Node `fetch` are blocked from connecting to localhost with `Operation not permitted` / `fetch failed`. Do not record this as a verified working preview until the next run can access it.

Candidate URL for manual inspection: `http://127.0.0.1:3001/essays/the-city-that-could-not-repair-itself`

### What Still Feels Weak

- The shorter `Downtown Without a City` essay still needs the same construction scan.
- The full `longform-essays.md` file still contains em dashes and banned constructions outside the flagship Downtown and Park essays.
- Local commit creation is blocked by Git metadata write permissions.
- Browser/mobile visual verification remains blocked by localhost access in this sandbox.

### Next Recommended Target

First resolve the Git metadata permission blocker and commit the verified Cycle 03 changes. After that checkpoint exists, run the same anti-AI pass on `Downtown Without a City`, then decide whether the two Downtown essays should remain separate or whether the shorter one should become a gateway/companion rather than a partial duplicate.
