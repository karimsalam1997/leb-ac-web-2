# SIGNALS DESK Research Log

## Cycle 1, 2026-05-26, Source Coverage

Chosen dimension: Source Coverage.

Why this was chosen: the current `feeds.yaml` is respectable for an RSS-first prototype, but the latest generated brief still leaned too heavily on a few English-language and Google News routed sources. The dashboard needs more official Arabic, Palestinian, Gulf, Iranian, and Israeli-Arabic source lanes before the analysis engine can make stronger distinctions between field reporting, state messaging, and partisan claim streams.

Findings:

- Lebanese local coverage: the current file has L'Orient Today and Naharnet, but it is missing Lebanon24, LBCI, and the National News Agency layer. Lebanon24 exposes RSS categories at [Lebanon24 RSS](https://www.lebanon24.com/Rss). LBCI exposes RSS endpoints, but the direct endpoint tested with an infinite redirect in Python, so it should be routed through Google News for now. NNA is Lebanon's official agency; AMAN lists NNA as offering RSS services, but a stable public endpoint was not found during this pass, so it should also be routed through Google News until a direct feed is verified.
- Palestinian press: current feeds do not include a Palestinian official or Palestinian press lane. WAFA's Arabic homepage is active and current, and the Palestine Chronicle exposes an RSS feed, though it returned a rate-limit during the CLI test. Use Google News-routed feeds first, then revisit direct collection later.
- Gulf official media: the source shelf is missing official Gulf state agencies. Qatar News Agency has a public RSS page, Oman News Agency has an RSS page, and Saudi Press Agency has a current official English site. Direct RSS was inconsistent in a Python probe, so Google News-routed official-site feeds are safer for this cycle.
- Israeli Arabic-language outlets: the current source file has Hebrew and English Israeli sources but lacks Arabic-facing Israeli messaging. i24NEWS has an Arabic site, and Makan is the Arabic-language public broadcasting channel of Israel's public broadcaster. These should be separate from the English Israeli establishment lane because the audience and rhetoric differ.
- Iranian state and semi-state English feeds: Press TV publicly lists `/RSS`, Tehran Times publishes an RSS help page listing `/rss`, and IRNA English is live. Direct fetches were inconsistent under the current collector, so Google News routing is the safer first step.
- Telegram candidates: open-web search surfaced RNN Alerts Arabic/Lebanon and Al Mayadeen Telegram as relevant candidates. These should not be auto-ingested yet because the Telegram collector is intentionally review-first, but they belong in a later manual source-vetting pass.

Implementation decision:

- Add missing sources to `tools/signal_desk/config/feeds.yaml`, using direct RSS only where the current collector can fetch it cleanly.
- Add three explicit source lanes in `tools/signal_desk/source_lanes.py`: Palestinian record, Gulf official line, and Iranian state line.
- Update the frontend lane label map so cluster cards do not show raw lane IDs for the new lanes.

Sources consulted:

- [Lebanon24 RSS](https://www.lebanon24.com/Rss)
- [LBCI RSS search result](https://www.lbcgroup.tv/Rss/News/en/122/press-highlights)
- [National News Agency, AMAN profile](https://www.aman-alliance.org/Agency/Detail/21)
- [WAFA Arabic homepage](https://www.wafa.ps/)
- [Palestine Chronicle](https://www.palestinechronicle.com/)
- [Qatar News Agency RSS feeds](https://www.qna.org.qa/en/RSS-Feeds)
- [Oman News Agency RSS](https://omannews.gov.om/rss)
- [Saudi Press Agency](https://www.spa.gov.sa/en?hl=en-US)
- [i24NEWS Arabic](https://www.i24news.tv/ar)
- [Press TV RSS listing](https://www.presstv.ir/Satellites)
- [Tehran Times RSS help](https://www.tehrantimes.com/rss-help)
- [IRNA English](https://www2.irna.ir/en)

## Cycle 2, 2026-05-26, Pipeline Robustness

Chosen dimension: Pipeline Robustness.

Why this was chosen: after Cycle 1, four dimensions sat at 5/10, but Pipeline Robustness had the clearest immediate failure mode. The run command could write dated output and copy to `public/data/signal-desk/`, but it could not safely preview a run, show stage timing, or leave a compact health record for later checks. That means a source or parser experiment could still overwrite the public dashboard before the operator sees what happened.

Findings:

- Python's current `argparse` documentation still treats optional command flags as the normal way to expose command-line behavior, and it automatically produces help and usage text. A visible `--dry-run` flag belongs in the CLI, not in a hidden environment variable or manual convention.
- Python's current `time` documentation recommends monotonic clocks such as `perf_counter()` for elapsed time because they are not affected by normal wall-clock changes. Stage timing should use that clock, while the public run timestamp can stay as UTC wall time.
- Python's `shutil.copyfile()` documentation confirms that file copy operations may use platform fast-copy calls, but the important Signal Desk question is not copy speed. The copy should be skipped entirely during dry runs so `public/data/signal-desk/` is protected.
- JSON Lines remains a simple fit for operational health events because each line is its own JSON value. For this cycle, a single compact `run-health.json` file is enough; JSONL can come later if the pipeline needs a long append-only history.

Implementation decision:

- Add `--dry-run` to `tools/signal_desk/run.py`. It should execute collection, normalization, scoring, geo-tagging, synthesis, and health reporting, but avoid writing dated output or copying files into the public dashboard directory.
- Add stage-by-stage timing with `time.perf_counter()`, printed at the end of every run.
- Add a compact run health payload with counts, source-health summary, stage timings, output paths, and whether public files were copied.
- Keep source coverage untouched in this cycle.

Sources consulted:

- [Python argparse documentation](https://docs.python.org/3.12/library/argparse.html)
- [Python time documentation](https://docs.python.org/3.13/library/time.html)
- [Python shutil documentation](https://docs.python.org/3/library/shutil.html)
- [JSON Lines documentation](https://jsonlines.org/?lang=en)
