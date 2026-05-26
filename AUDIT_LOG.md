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
