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

## Cycle 3, 2026-05-26, Brief Quality

Chosen dimension: Brief Quality.

Why this was chosen: after Cycle 2, Signal Quality, Brief Quality, and Information Architecture were still the lowest-scoring dimensions at 5/10. Brief Quality is the best immediate fix because the previous audit had already named the defect: the brief opened with a dramatic "pressure point" formula even when the lead cluster had uncertainty around place, corroboration, or missing checks. That makes the brief sound more settled than the record is.

Findings:

- The Associated Press standards say disputable material should be attributed and internet-sourced information should be vetted and tied back to its original source. For Signal Desk, that means the brief should name the source span or source lane early, especially when the lead item is partly corroborated or single-source.
- The BBC accuracy guidance says reporting should be well sourced, based on evidence, corroborated where possible, and honest about what is not known. That maps directly onto the brief's first paragraph: the opening should admit missing place, confirmation, or source depth before offering a reading.
- ACAPS presents methodology as part of analytical work rather than a private back-office concern. For this project, the brief should expose a small part of the method, including confirmation status, source lanes, and missing checks, so the reader can see how the desk moved from items to interpretation.
- The current public brief already has useful fields downstream, especially `confirmation_status`, `source_lanes`, `sources_span`, and `what_is_missing`. The flaw is ordering. The evidence warning appears too late, after the opening has already framed the day.

Implementation decision:

- Update `tools/signal_desk/synthesize.py` so the lead paragraph is evidence-first.
- Include confirmation status, location precision, source lanes or source names, and missing checks in the opening.
- Keep the existing section structure so the dashboard does not need frontend changes.
- Avoid touching feeds or source-lane coverage in this cycle.

Sources consulted:

- [Associated Press, Telling the Story](https://www.ap.org/about/news-values-and-principles/telling-the-story/)
- [BBC Editorial Guidelines, Accuracy](https://bbctodays.pages.dev/editorialguidelines/guidelines/accuracy)
- [ACAPS, Our methodologies](https://www.acaps.org/en/methodology/our-methodologies)

## Cycle 4, 2026-05-26, Signal Quality

Chosen dimension: Signal Quality.

Why this was chosen: after Cycle 3, Signal Quality and Information Architecture were the lowest-scoring dimensions at 5/10. Signal Quality is the better next fix because one bad geographic inference corrupts several surfaces at once: map pin, brief language, next-check instruction, and perceived confidence. The visible example was a Gaza casualty headline being read as Tyre because the string matcher found `Tyre` inside `Martyred`.

Findings:

- GeoNames search documentation distinguishes broad text search from exact place-name matching and supports country filters. The practical lesson for the local fallback gazetteer is the same: a place resolver should not treat arbitrary substring hits as place matches.
- Nominatim's current search documentation warns that `countrycodes` is a hard filter, while the structured `country` term is fuzzy. For Signal Desk, Lebanon map pins should behave like a hard Lebanon context. If a story clearly says Gaza and does not mention Lebanon, Hezbollah, or a Lebanese place, it should not be forced onto a Lebanese pin.
- Natural Earth's populated places documentation frames places as named point features. That supports the fallback approach of keeping a local gazetteer, but only if matching respects the name boundary. Short aliases like `tyr` are dangerous unless they are handled as whole tokens.
- The current bug is local and fixable: `tools/signal_desk/analyze.py` uses substring matching in `location_hint()`, while `tools/signal_desk/geo.py` uses a word-boundary regex but then falls back to raw substring matching with `or name in text`. Both paths can turn non-place text into a Lebanese place.

Implementation decision:

- Replace substring place matching with a shared-style word-boundary helper in both analysis and geo-tagging.
- Add a small foreign-place guard for Gaza terms. If Gaza appears without Lebanon, Hezbollah, or a named Lebanese place, keep the item visible but unpinned as `Location unclear`.
- Keep source collection unchanged so Arabic, Palestinian, Gulf, Iranian, and Israeli Arabic-facing coverage is not reduced.

Sources consulted:

- [GeoNames Search Webservice](https://www.geonames.org/export/geonames-search.html)
- [Nominatim Search API manual](https://nominatim.org/release-docs/latest/api/Search/)
- [Natural Earth populated places documentation](https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/naturalearth/ne_10m_populated_places/ne_10m_populated_places.README.html)

## Cycle 5, 2026-05-26, Information Architecture

Chosen dimension: Information Architecture.

Why this was chosen: after Cycle 4, Information Architecture was the lowest-scoring dimension at 5/10. The platform now collects broader sources, geocodes more carefully, and writes more honest brief prose, but the evidence state still lives in scattered places: `confirmation_status`, `location_precision`, `source_lanes`, `what_is_missing`, and `recommended_next_check`. The next useful move is to give every cluster one compact verification dossier that the brief, map, preview server, and future frontend can all read.

Findings:

- ACLED's codebook separates event facts from data quality fields. It records location, coordinates, geo-precision, source, notes, source scale, and update timing as structured fields rather than forcing readers to infer reliability from the event note. Signal Desk should do the same by carrying a small verification object beside each cluster.
- ACLED's geography guidance also makes a practical distinction between named places and lower-precision regional mentions. For Signal Desk, the dossier should say when an item is mapped, district-level, national, or unpinned, because a wrong pin is worse than a visible warning.
- Ushahidi's platform documentation treats report status as something users can filter by, including published, under review, and archived. Signal Desk does not need that exact moderation model, but it does need a similarly scannable status label for claims that need another source, need a sharper place, or are ready for the brief.
- HDX quality material warns against reducing data quality to a single unexplained score. It favors visible ingredients: metadata, missing data, freshness, comparison, and quality caveats. Signal Desk's dossier should therefore include a short label plus the missing pieces and next checks, not only a numeric confidence value.
- HDX's QA checklist treats source, date, location, methodology, and caveats as separate review gates. That maps well onto Signal Desk's current fields and supports a reusable cluster-level object with source count, source lanes, location precision, missing checks, and the recommended next action.
- W3C PROV models provenance as entities generated by activities and derived from other entities. Signal Desk does not need full RDF provenance, but the information architecture should keep enough provenance hooks to show which sources produced the cluster and when the run generated it.

Implementation decision:

- Add a typed `verification_status` and `verification` dossier to every cluster.
- Build the dossier after geo-tagging so the status reflects the final location precision, not the pre-map guess.
- Use the dossier in brief synthesis so the prose and the API share the same evidence state.
- Add the verification status to map GeoJSON properties for future UI use.
- Do not touch feeds or source lanes in this cycle, so Arabic and source coverage stay intact.

Sources consulted:

- [ACLED Codebook PDF](https://acleddata.com/sites/default/files/wp-content-archive/uploads/dlm_uploads/2024/10/ACLED-Codebook-2024-7-Oct.-2024.pdf)
- [Ushahidi filtering posts documentation](https://docs.ushahidi.com/platform-user-manual/legacy/6.-managing-data-in-your-deployment/6.2-filtering-posts)
- [The Centre for Humanitarian Data, Quality Measures for Humanitarian Data](https://centre.humdata.org/quality-measures-for-humanitarian-data/)
- [HDX Dataset Quality Assurance Checklist](https://data.humdata.org/dataset/2048a947-5714-4220-905b-e662cbcd14c8/resource/658d5c4f-1680-4cb5-9fbf-10a0a64e2c39/download/hdx-qa-checklist.pdf)
- [W3C PROV Data Model](https://www.w3.org/TR/prov-dm/Overview.html)

## Cycle 6, 2026-05-26, Pipeline Robustness

Chosen dimension: Pipeline Robustness.

Why this was chosen: after Cycle 5, six dimensions were tied at 6/10, but the latest dry run exposed the sharpest operational risk. The run completed, but source health collapsed to 1 ok source and 39 failed sources. A normal public-copy run under those conditions would make the dashboard look current while actually publishing a thin and possibly distorted source shelf.

Findings:

- Great Expectations treats validation as a reusable checkpoint: it validates data, saves validation results, can run actions, and leaves human-readable results behind. Signal Desk should similarly keep the guard result in `run-health.json`, not only print a warning.
- Dagster's asset checks can be marked blocking so downstream assets do not materialize when a critical check fails. For Signal Desk, the downstream step is public copy. The safe behavior is to write diagnostic output but block the public dashboard copy when source health fails.
- AWS Glue Data Quality lets a job publish rule results and choose whether a failed ruleset should stop a job before loading target data, after loading, or not at all. Signal Desk should use the middle ground: keep the dated store output for diagnosis, but refuse to load `public/data/signal-desk/` unless an explicit override is supplied.
- AWS Glue also exposes rule pass and fail counts as metrics. Signal Desk already has source-health totals and counts, so the guard should be transparent: source count, source-health failure rate, scored item count, and reason list.
- HDX data review uses both automated checks and manual review criteria, including metadata completeness, relevance, resource integrity, and sensitive-data risk. For this pipeline, that supports a simple quality gate built around source shelf health and minimum usable output before public publication.

Implementation decision:

- Add a publication guard to `tools/signal_desk/run.py`.
- Default public copy should be allowed only when the run has enough live sources, enough scored items, and an acceptable source-health failure rate.
- Dry runs should report whether public copy would be blocked, but still exit successfully.
- Normal runs should still write dated store output and `run-health.json`, then refuse public copy with a nonzero exit when the guard fails.
- Add an explicit `--allow-unsafe-public-copy` override for emergency manual use, and record that override in health output.

Sources consulted:

- [Great Expectations, Data Validation workflow](https://docs.greatexpectations.io/docs/0.18/oss/guides/validation/validate_data_overview/)
- [Dagster, Data Quality](https://dagster-io-dagster-6.mintlify.app/guides/data-quality)
- [AWS Glue, Evaluating data quality for ETL jobs](https://docs.aws.amazon.com/glue/latest/dg/tutorial-data-quality.html)
- [AWS Glue Data Quality](https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html)
- [HDX Data Review](https://centre.humdata.org/ufaqs/data-review/)

## Cycle 7, 2026-05-26, Source Coverage

Chosen dimension: Source Coverage.

Why this was chosen: after Cycle 6, Source Coverage remained at 6/10 and the latest collector diagnosis showed a more precise problem. Every live RSS source failed with the same DNS-style `urlopen` error, then the fallback emitted two sample items. That means the immediate issue is not that Arabic or regional sources should be removed; it is that source-health output does not yet distinguish feed failure, HTTP failure, parse failure, timeout, and local network failure.

Findings:

- Python's `urllib.error` documentation says `URLError` is the base exception for request problems and exposes a `reason` field, which can itself be another exception. The collector should inspect that reason instead of flattening every failure into a text note.
- Python's `urllib.request` documentation confirms that `urlopen()` raises `URLError` on protocol errors and returns response status information for HTTP/HTTPS responses. Source health should therefore separate HTTP errors from DNS or socket failures.
- Python's `urllib.request.Request` supports custom headers, including User-Agent, and the collector already uses that. Since the current failure happens before host resolution, changing the source diet or headers would not solve this run.
- The current failure note, `<urlopen error [Errno 8] nodename nor servname provided, or not known>`, points to name resolution rather than a source-specific RSS structure problem. The audit should show that as an environment/network error.
- Source coverage should not be reduced in response to an environment-level DNS failure. The safer move is to keep all Arabic, Israeli, Palestinian, Gulf, Iranian, wire, and Lebanese lanes intact, while making the failure category visible in run health.

Implementation decision:

- Add a typed `error_kind` field to `SourceHealth`.
- Classify RSS and HTML index failures into `dns-error`, `timeout`, `http-error`, `tls-error`, `parse-error`, or `fetch-error`.
- Mark successful live feeds as `ok` and fallback sample emission as `fallback`.
- Add `error_kind_counts` to run health so future audits can see whether source coverage failed because of the network, a source URL, or parsing.
- Do not remove or reduce any source entries.

Sources consulted:

- [Python urllib.error documentation](https://docs.python.org/3.10/library/urllib.error.html)
- [Python urllib.request documentation](https://docs.python.org/3.11/library/urllib.request.html)

## Cycle 8, 2026-05-26, Source Coverage

Chosen dimension: Source Coverage.

Why this was chosen: after Cycle 7, live source access remained blocked by DNS in the Python process. The right response is not to shrink the Arabic, Israeli, Palestinian, Gulf, Iranian, wire, or Lebanese source shelf. The safer response is to let the same feed list be tested from saved source snapshots, while marking those snapshots clearly as cached evidence rather than live reporting.

Findings:

- The RSS 2.0 specification keeps the core record simple: a feed contains channel metadata and item records, with item fields such as title, link, description, and publication date. A local snapshot path can reuse the existing RSS parser because the source shape is the same whether the XML came from the network or from disk.
- RFC 4287 defines Atom entries with title, updated time, links, and summary/content fields. The current collector already handles Atom-style entries, so cached Atom files should pass through the same code path instead of needing a separate import format.
- The WARC standard exists for full web archives and is the stronger long-term format when saving complete crawl evidence. It is too heavy for this cycle. A simple directory of named `.xml`, `.rss`, `.atom`, or `.html` files is enough for source debugging without pretending to be a full archive.
- JSON Lines remains useful for later append-only source-event history, but it is not the best fit for this specific problem. The collector needs to test the original source formats, especially XML and HTML, not a transformed intermediate file.
- Python's current `pathlib` documentation supports straightforward text reads from local paths. That keeps the implementation small and explicit: resolve one operator-provided snapshot directory, match files by feed name, parse them, and record snapshot health.

Implementation decision:

- Add a `--rss-snapshot-dir` option to the pipeline.
- Match snapshot files to existing feed names rather than creating a second source list.
- Parse RSS, Atom, and HTML-index snapshots through the same collector logic used for live sources.
- Mark snapshot source health as `snapshot`, and exclude snapshots from live-source publication-guard counts.
- Keep fallback samples separate from snapshots, and keep all existing source entries intact.

Sources consulted:

- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [RFC 4287, The Atom Syndication Format](https://www.rfc-editor.org/rfc/rfc4287)
- [ISO 28500:2017, WARC file format](https://www.iso.org/standard/68004.html)
- [JSON Lines documentation](https://jsonlines.org/?lang=en)
- [Python pathlib documentation](https://docs.python.org/3/library/pathlib.html)
