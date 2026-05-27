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

## Cycle 9, 2026-05-26, Map Quality

Chosen dimension: Map Quality.

Why this was chosen: after Cycle 8, Map Quality remained one of the lowest-scoring dimensions. The map already avoids totally unclear claims, but it still sends broad locations through a point-shaped GeoJSON feature. That can make a district or regional mention look sharper than the source evidence allows.

Findings:

- ACLED's codebook treats geocoding precision as a separate data field. It distinguishes a specific town or coordinate from a broader area where the chosen coordinate is only a representative point. Signal Desk should make that distinction visible in the map data, not only in prose.
- RFC 7946 defines GeoJSON Feature objects with geometry and properties. The current point geometry can stay valid, while the properties object carries the needed caveat: marker kind, radius, precision label, and warning.
- Leaflet's documented difference between circles and circle markers matters here. A Circle radius is geographic and measured in meters, while a CircleMarker radius is screen-sized. Signal Desk should publish a meter radius for uncertain places so the frontend can draw a real uncertainty halo.
- The current frontend already uses circles for lower-precision claims, but the radius is hard-coded. Moving that radius into the data makes the map more honest and reusable, even before changing the frontend.
- This cycle should not add or remove locations. It should make existing map output carry clearer uncertainty metadata.

Implementation decision:

- Add map display fields to every cluster: marker kind, precision label, uncertainty radius in meters, and a short warning.
- Compute those fields during geo-tagging after the final location precision is known.
- Add the same fields to `events.geojson` properties so map consumers do not have to infer precision from raw coordinates.
- Keep the existing point geometry for compatibility, but label broad-area points as representative centers.
- Do not touch source feeds or source lanes.

Sources consulted:

- [ACLED Codebook](https://acleddata.com/methodology/acled-codebook)
- [RFC 7946, The GeoJSON Format](https://www.rfc-editor.org/rfc/rfc7946)
- [Leaflet reference documentation](https://leafletjs.com/reference)

## Cycle 10, 2026-05-26, Brief Quality

Chosen dimension: Brief Quality.

Why this was chosen: after Cycle 9, Brief Quality remained one of the lowest-scoring dimensions. The backend now knows whether a map point is exact, representative, or unmapped, but the generated brief still reads the map line as if all locations were equally precise.

Findings:

- The Associated Press guidance stresses attribution and source credibility. For Signal Desk, the map itself is a kind of claim, so the brief should attribute the level of location certainty just as it attributes source certainty.
- BBC accuracy guidance says factual output should be clear, precise, well sourced, and honest about what is not known. A map sentence that names a place without saying that the point is only representative can mislead even when the data underneath is careful.
- PBS standards warn that accuracy includes sufficient context so the public is not misled, including care with places. The brief should therefore state the mapping caveat beside the event summary, not bury it in the data file.
- ACAPS methodology notes repeatedly treat limitations as part of the analytical product. Signal Desk should bring its location limitation into the brief's evidence line, especially for district-level and unlocated claims.
- The existing brief already has a compact evidence line. This is the least disruptive place to add map precision because it keeps the prose readable and aligns the brief with the map data from Cycle 9.

Implementation decision:

- Add a compact map-context sentence to the brief evidence line.
- Make the `On the map` section show whether each listed item is a named-place pin, representative area, or unmapped claim.
- Use the new `map_marker_kind`, `map_precision_label`, `map_radius_meters`, and `map_warning` fields instead of recalculating precision in prose.
- Keep the existing brief structure and source coverage unchanged.

Sources consulted:

- [Associated Press, Telling the Story](https://www.ap.org/about/news-values-and-principles/telling-the-story/)
- [BBC Editorial Guidelines, Accuracy PDF](https://downloads.bbc.co.uk/guidelines/editorialguidelines/pdfs/bbc-editorial-guidelines-section-3-accuracy.pdf)
- [PBS Standards, Accuracy](https://www.pbs.org/standards/accuracy/)
- [ACAPS methodology note](https://www.acaps.org/fileadmin/Dataset/Methodology_files/20260204_ACAPS_Methodology_Note_-_Syria_Area-Based_Analysis__SABA__Dashboard_and_Core_Dataset_.pdf)

## Cycle 11, 2026-05-26, Information Architecture

Chosen dimension: Information Architecture.

Why this was chosen: after Cycle 10, Information Architecture remained one of the lowest-scoring dimensions. Cluster dossiers now explain individual claims, but run-level source health still lives mostly in `run-health.json`. A reader of the brief or API cannot quickly tell whether the whole source shelf was live, degraded, snapshot-only, or fallback-only.

Findings:

- Great Expectations treats validation results as records that can be saved as JSON and rendered into human-readable documentation. Signal Desk needs the same split: machine-readable run health and a human-readable source condition in the brief.
- OpenLineage models run and dataset metadata as attachable facets. The useful lesson here is not to build a full lineage system, but to make run-level quality an explicit object beside the generated product.
- W3C PROV treats provenance as information about the entities, activities, and agents involved in producing data, because that helps users assess reliability. For Signal Desk, the source condition is a small provenance layer for the whole run.
- Cycle 6 and Cycle 7 already created detailed health and guard data. The architecture gap is that downstream readers need a compact summary, not the full operational payload.
- The source condition should reuse existing counts and error-kind categories. It should not create a second truth about source health.

Implementation decision:

- Add a `SourceCondition` model to API metadata.
- Classify each run as `healthy`, `degraded`, `snapshot-only`, `fallback-only`, or `empty`.
- Add the source condition to `api.meta`, `run-health.json`, and the generated brief.
- Keep the detailed `source_health` array unchanged.
- Do not touch feeds or source lanes.

Sources consulted:

- [Great Expectations, Validation Result](https://docs.greatexpectations.io/docs/0.18/reference/learn/terms/validation_result)
- [OpenLineage, About OpenLineage](https://openlineage.io/docs/)
- [OpenLineage, Data Quality Assertions Facet](https://openlineage.io/docs/next/spec/facets/dataset-facets/data_quality_assertions)
- [W3C PROV Data Model](https://www.w3.org/TR/prov-dm/Overview.html)

## Cycle 12, 2026-05-26, Signal Quality

Chosen dimension: Signal Quality.

Why this was chosen: after Cycle 11, Signal Quality was the only remaining 6/10 dimension. The most immediate risk is that fallback samples, which exist only to keep the pipeline testable when live sources fail, can still become ordinary-looking clusters with ordinary-looking map and brief language.

Findings:

- AP's AI standards say generated material used in a news context should be clearly labeled when it is the subject of the story, and that synthetic or generated material requires normal editorial caution. Signal Desk fallback samples are not AI news claims, but the same principle applies: generated or local sample content must be visibly labeled.
- NIST's synthetic-content transparency report emphasizes provenance, labeling, metadata, and auditing as ways to reduce risk from synthetic content. For this project, a fallback sample should carry provenance inside the cluster itself, not only in source health.
- GOV.UK's synthetic data guidance says synthetic data should be documented and version controlled so it can be evaluated and recreated. Signal Desk already marks fallback raw items; the missing step is carrying that mark into cluster analysis and source lanes.
- Research Data Scotland's synthetic data policy calls for information about how synthetic data was generated and whether real data or metadata was used. The Signal Desk equivalent is a plain warning that the item came from local fallback text, not live reporting.
- The current code already marks raw fallback items. This cycle should not remove samples, because they are useful for dry-run testing. It should make them impossible to mistake for live signals.

Implementation decision:

- Detect clusters made only from fallback samples.
- Force fallback-only clusters to low severity, unconfirmed status, and explicit fallback language.
- Prefix fallback cluster headlines with `Fallback sample`.
- Route fallback items into a dedicated `pipeline-sample` source lane.
- Keep fallback samples available for diagnostics, but stop them from looking like field reporting.

Sources consulted:

- [Associated Press, Standards around generative AI](https://www.ap.org/standards-around-generative-ai)
- [NIST, Reducing Risks Posed by Synthetic Content](https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content)
- [GOV.UK, AI Insights: Synthetic Data](https://www.gov.uk/government/publications/ai-insights/ai-insights-synthetic-data-html)
- [Research Data Scotland, Synthetic Data Policy](https://www.researchdata.scot/engage-and-learn/data-explainers/intro-to-synthetic-data/synthetic-data-policy/)

## Cycle 13, 2026-05-26, Pipeline Robustness

Chosen dimension: Pipeline Robustness.

Why this was chosen: all seven rubric dimensions were tied at 7/10 after Cycle 12. A map preview improvement was attempted first, but this sandbox blocks local port binding and the in-app browser blocks local file URLs, so a frontend verification pass cannot be completed here. The best fully verifiable improvement is the ambiguity already noted in Cycle 7: `source_health.ok` still counts fallback as ok, even though fallback is not live source recovery.

Findings:

- Great Expectations treats validation results as records that can be saved in JSON and rendered into human-readable documentation. Signal Desk's run health should follow that pattern by making the observed counts explicit instead of asking the operator to infer which ok records were live, snapshot, or fallback.
- Great Expectations validation results expose both pass/fail state and summary statistics. For Signal Desk, the equivalent is not only `ok` and `failed`, but also `live_ok`, `snapshot_ok`, and `fallback_ok`, because those three states mean different things operationally.
- Python's current JSON documentation keeps object order by default and supports readable pretty-printed output. Adding a few stable numeric fields to `run-health.json` is a low-risk way to make the health record easier to scan without changing the public API surface.
- The current publication guard already calculates `live_ok_source_health_count`, but that value is buried under `publication_guard.metrics`. Operators reading the top-level source-health summary still see `ok: 1` in fallback-only runs, which can look healthier than it is.

Implementation decision:

- Update `source_health_summary()` so `run-health.json` separates total ok, live ok, snapshot ok, fallback ok, and failed source-health checks.
- Keep the existing `ok` field for backward compatibility.
- Do not touch feed configuration, Arabic/source coverage, public dashboard data, or frontend files.

Sources consulted:

- [Great Expectations, Validation Result](https://docs.greatexpectations.io/docs/0.18/reference/learn/terms/validation_result/)
- [Python json documentation](https://docs.python.org/3/library/json.html)

## Cycle 14, 2026-05-26, Signal Quality

Chosen dimension: Signal Quality.

Why this was chosen: after Cycle 13, Pipeline Robustness moved to 8/10 while the other dimensions remained at 7/10. Frontend/map wiring is still blocked by browser verification limits in this sandbox, so the best backend-only signal improvement is the location fallback in `tools/signal_desk/analyze.py`: if no named place is found, the system still returns `Beirut`.

Findings:

- Nominatim's current search documentation distinguishes free-form search from structured search and supports hard country filters. The practical lesson for Signal Desk is that a location resolver should not invent a capital-city point just because the item is regionally relevant.
- Nominatim's `countrycodes` parameter is described as a hard filter, while the structured `country` field is fuzzy. Signal Desk's local resolver should be similarly strict: Lebanon context can justify a broad Lebanon-level reading, but it should not create a Beirut pin unless Beirut is named.
- ACLED records a `geo_precision` field and treats higher numbers as lower precision. That supports carrying broad or uncertain location as a lower-precision state instead of upgrading it to a city.
- ACLED's spatial precision guidance says specific towns get the highest precision, broader areas get lower precision, and country-level imprecision is generally not treated as a single precise event. Signal Desk is a briefing tool rather than an ACLED clone, but it should still avoid turning no-place text into a Beirut event.

Implementation decision:

- Change `location_hint()` so named Lebanese places still win.
- If a text has Lebanon context but no named local place, return `Lebanon` as national precision.
- If a text has no Lebanese place or Lebanon context, return `Location unclear`.
- Keep the Gaza guard and token-boundary matching unchanged.
- Do not touch feeds, source lanes, Arabic/source coverage, public data, or frontend files.

Sources consulted:

- [Nominatim Search API manual](https://nominatim.org/release-docs/latest/api/Search/)
- [ACLED Codebook](https://acleddata.com/methodology/acled-codebook)

## Cycle 15, 2026-05-26, Brief Quality

Chosen dimension: Brief Quality.

Why this was chosen: after Cycle 14, Signal Quality and Pipeline Robustness sit at 8/10, while Brief Quality remains at 7/10. Source Coverage is blocked by DNS, and frontend/map work is blocked by browser verification limits. The best backend-only brief improvement is to stop labeling the product as `MENA Morning Brief` when the pipeline and dashboard are now the Lebanese Academic Signal Desk.

Findings:

- AP standards for graphics and interactive work emphasize clear, concise information and source credit. A brief title is not decoration; it tells the reader what kind of product they are reading and how far its geographic claim extends.
- AP's wider story standards stress factual and contextual accuracy. A title that says `MENA` overstates the product's operating frame when the source shelf, map, and analysis rules are Lebanon-centered with regional context.
- BBC accuracy guidance describes due accuracy as accuracy appropriate to the subject, output, and audience expectation. For Signal Desk, the audience expectation should be set at the top: this is a Lebanon Signal Desk brief, not a general MENA wire digest.
- The current brief already has a `Source condition` section and location caveats. Renaming the title is a small alignment fix: it makes the top line match the evidence model already built in earlier cycles.

Implementation decision:

- Add one brief-title helper in `tools/signal_desk/synthesize.py`.
- Use `Lebanon Signal Desk Brief` for both empty and non-empty generated briefs.
- Keep the section structure and source evidence language unchanged.
- Do not touch feeds, source lanes, Arabic/source coverage, public data, or frontend files.

Sources consulted:

- [Associated Press, Telling the Story](https://www.ap.org/about/news-values-and-principles/telling-the-story/)
- [BBC Editorial Guidelines, Accuracy PDF](https://downloads.bbc.co.uk/guidelines/editorialguidelines/pdfs/Section_03_Accuracy.pdf)

## Cycle 16, 2026-05-27, Source Coverage

Chosen dimension: Source Coverage.

Why this was chosen: after Cycle 15, Source Coverage, Map Quality, UI/UX & Design, and Information Architecture were tied at 7/10. Map and UI work still needs browser rendering, and this sandbox previously blocked local preview checks. Source Coverage has a backend-only gap that can be improved safely: the source shelf has many newspapers and Google News routes, but it does not directly ingest two official field layers that matter in south Lebanon, UNIFIL and the Lebanese Army.

Findings:

- UNIFIL's public site has a dedicated News section and a visible RSS subscription link. The page carries mission reporting on LAF coordination, Blue Line access, roadblocks, unexploded devices, and peacekeeper incidents. That is an official peacekeeping layer, not independent corroboration, but it is essential provenance for claims around Resolution 1701, Naqoura, Adeisse, Kawkaba, Kafer Chouba, and other southern locations.
- UNIFIL article pages also carry related current mission items. One inspected page linked recent items on an explosives-risk campaign, an IDF Merkava tank firing near a UNIFIL position by Kafer Chouba, and a patrol finding an explosive device near Adeisse. That kind of source belongs in the pipeline even when it must be read as an institutional account.
- The Lebanese Army homepage is an Arabic official source with current "بيانات ونشاطات" entries. On 26 May 2026 it listed arrests, weapons/ammunition items, convoy security, and local incidents; on 24 May 2026 it listed dismantling an unexploded aerial bomb from Israeli aggression in the southern suburbs. This is the state-security layer the current RSS shelf mostly reaches only indirectly.
- The current HTML collector only accepts links containing `/article/`, which works for L'Orient Today but misses official sites whose article URLs use plain slugs or `/ar/content/` paths. A source-specific link-pattern option is safer than loosening the parser globally.

Implementation decision:

- Keep every existing feed intact.
- Add official UNIFIL and Lebanese Army Arabic HTML-index sources.
- Extend the HTML collector so each HTML-index source can declare allowed URL patterns.
- Convert relative links to absolute URLs with the source page as base.
- Keep fallback samples and publication-guard behavior unchanged.

Sources consulted:

- [UNIFIL News page](https://unifil.unmissions.org/news)
- [UNIFIL article: training activities with LAF](https://unifil.unmissions.org/unifil-steps-training-activities-laf)
- [Lebanese Army official homepage](https://www.lebarmy.gov.lb/)

## Cycle 17, 2026-05-27, Information Architecture

Chosen dimension: Information Architecture.

Why this was chosen: after Cycle 16, Map Quality, UI/UX & Design, and Information Architecture remained at 7/10. Map and UI changes still need a browser-rendered dashboard check. The backend IA gap is now sharper: the pipeline has a wider source shelf, but the API and run-health output do not tell an operator what the configured shelf actually contains by language, collection mode, or tier.

Findings:

- W3C DCAT treats catalogs as first-class metadata objects: a catalog lists datasets, and datasets expose distributions. Signal Desk does not need RDF, but it does need the same architectural idea: the generated product should carry a compact catalog of configured source inputs, not only the items that happened to return during one run.
- Schema.org's Dataset/DataCatalog guidance distinguishes the data itself from metadata about a collection of data. Signal Desk's clusters are the data product; the source shelf is the surrounding collection metadata. Hiding that shelf in YAML forces the reader to inspect code to understand coverage.
- The Schema.org Dataset type includes provider and catalog relationships. For Signal Desk, the practical equivalent is exposing configured source names and source grouping counts beside the run metadata.
- OpenLineage dataset facets attach small pieces of metadata to inputs and outputs. The useful lesson here is to attach lightweight source-inventory metadata to the API/run record instead of building a separate documentation page.
- The run already records live source health, but health is not the same as inventory. A DNS-blocked run should still say how many configured sources exist, which languages they cover, and how many use RSS versus HTML-index collection.

Implementation decision:

- Add a compact `SourceInventory` model to API metadata.
- Build inventory from the configured feed list, not from returned items.
- Include total configured sources, counts by language, counts by collection mode, counts by tier, and configured source names.
- Add the same inventory object to `run-health.json`.
- Keep source-health and source-condition behavior unchanged.

Sources consulted:

- [W3C DCAT Version 3](https://w3c.github.io/dxwg/dcat/)
- [Schema.org Data and Datasets overview](https://schema.org/docs/data-and-datasets.html)
- [Schema.org Dataset type](https://schema.org/Dataset)
- [OpenLineage Dataset Type Facet](https://openlineage.io/docs/1.43.0/spec/facets/dataset-facets/type/)

## Cycle 18, 2026-05-27, Map Quality

Chosen dimension: Map Quality.

Why this was chosen: after Cycle 17, Map Quality and UI/UX & Design remained at 7/10. UI work still needs browser rendering. The backend map gap is that each cluster now carries precision fields, but the run itself does not summarize whether the map is mostly exact pins, representative areas, or unmapped claims.

Findings:

- RFC 7946 defines GeoJSON FeatureCollections as lists of features, with attributes placed on features and room for extra members outside the core geometry semantics. Signal Desk already uses properties on individual event features; a compact API/run-health map coverage object can summarize the whole FeatureCollection without changing the point geometry.
- ACLED's codebook treats geographic precision as a separate analytical field and records broader or representative locations differently from precise town-level events. Signal Desk already carries similar per-cluster precision, but operators need a whole-run count so a map with many representative areas is not mistaken for a precise field map.
- Current GeoJSON tooling documentation continues to treat FeatureCollection plus feature properties as the interoperable core. That argues for keeping per-feature map caveats where they are, while placing aggregate map coverage in the surrounding API metadata and health record.
- Humanitarian data-quality work around HDX and OpenStreetMap stresses completeness and distribution checks. For this project, the practical analogue is not an external quality API; it is a local count of mapped versus unmapped clusters and precision classes.

Implementation decision:

- Add a compact `MapCoverage` model to API metadata.
- Build map coverage from generated clusters after geotagging.
- Include total clusters, mapped clusters, unmapped clusters, counts by marker kind, counts by location precision, representative-area count, and maximum uncertainty radius.
- Add the same map coverage object to `run-health.json`.
- Do not change the GeoJSON point geometry, source coverage, brief prose, or frontend map rendering.

Sources consulted:

- [RFC 7946, The GeoJSON Format](https://www.rfc-editor.org/rfc/rfc7946)
- [ACLED Codebook](https://acleddata.com/methodology/acled-codebook)
- [GEOS GeoJSON documentation](https://libgeos.org/specifications/geojson/)
- [HeiGIT, ohsome quality API country reports on HDX](https://heigit.org/introducing-ohsome-quality-api-country-reports-for-openstreetmap-data-quality-on-the-humanitarian-data-exchange-platform/)

## Cycle 20, 2026-05-27, UI/UX & Design

Chosen dimension: UI/UX & Design.

Why this was chosen: after Cycle 19, UI/UX & Design remained the only 7/10 dimension. The backend already exposes source condition, source inventory, and map coverage, but the dashboard still needs a visible trust surface that tells the reader whether the run is live, degraded, fallback-only, or map-uncertain.

Findings:

- GOV.UK's warning-text guidance says warning treatment should be reserved for important information and should include fallback text for the warning icon. For Signal Desk, a fallback-only run should be treated as a visible warning, not as quiet helper copy.
- The UK Government Data Quality Framework says data producers should communicate quality issues clearly, describe their impact on use, document metadata, and avoid assuming that users understand data-quality terminology. The dashboard should therefore translate `source_condition`, `source_inventory`, and `map_coverage` into plain reader language near the top of the page.
- W3C's WCAG 2.2 guidance for status messages says status information carried by icons or visual changes must also be available through roles or properties. If the dashboard adds a live source-condition banner, it should not rely on color alone.
- The Ministry of Justice Design System says information and warning alerts should be used sparingly, with warning alerts reserved for cases where information is missing, stale, or becoming urgent. Signal Desk should use a warning treatment only for degraded, fallback-only, or empty runs, and a quieter information treatment for healthy runs.

Implementation decision:

- The right UI change is a compact run-condition band above the clusters, with source condition, configured-source inventory, and map coverage shown in plain language.
- The map should also surface representative-area and radius warnings that already exist in the API.
- This cycle will not implement that change because the route and data-loader files for the Signal Desk surface are still untracked in this worktree. A safe automation commit should not absorb or depend on pre-existing untracked frontend files.
- No Arabic source coverage, feed configuration, generated public data, or tracked UI files should be changed in this blocked cycle.

Sources consulted:

- [GOV.UK Design System, Warning text](https://design-system.service.gov.uk/components/warning-text/)
- [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework)
- [W3C WCAG 2.2, Understanding Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [Ministry of Justice Design System, Alert](https://design-patterns.service.justice.gov.uk/components/alert/)

## Editorial Experience Cycle 03, 2026-05-27, Flagship Downtown Voice Pass

Chosen dimension: Anti-AI Prose.

Why this was chosen: Cycle 02 left the strongest handoff: the Park essay had been cleaned, but the flagship Downtown essay still carried assistant-shaped transitions, em dashes, banned constructions, and consultant vocabulary. Because this essay leads the issue and frames the site's politics of memory, small voice defects have an outsized effect on the whole site.

Research files inspected:

- `DRAFT-downtown-beirut-memorycide.md`
- `launch-content.md`
- `RESEARCH/analysing_lebanese_politics_structurally.md`
- `RESEARCH/government_crackdown_on_generator_mafia.md`
- `RESEARCH/sectarianism_as_lebanon's_central_problem.md`
- `RESEARCH/magazine_article_topics_from_our_conversations.md`
- `RESEARCH/lebanese_war_content_ideas_and_direction.md`
- `RESEARCH/phoenician_myths.md`
- `RESEARCH 2/BEIRUT_PARK_VIRAL_REPORT.md`
- `RESEARCH 2/Beirut Park_ Philosophy Over Parametrics.docx`
- `RESEARCH 2/CONSOLIDATION OF EVERYTHING TILL NOW.docx`
- `may-august-2025-lebanese-academic-social-science-chats.md`

Findings:

- The older Downtown draft and `launch-content.md` already had the strongest simple frame: Solidere did not merely build a district; it changed who could belong in the center. The live flagship essay is stronger and more sourced, but its connective tissue had become too explanatory.
- `RESEARCH/analysing_lebanese_politics_structurally.md` makes the Hariri/Solidere concession sharper: the project was physically real and ambitious, which is exactly why the extraction argument has to be more careful than a normal anti-corruption sermon.
- The May-August chat archive repeatedly returns to the parking lot as an image of public life replaced by private movement. The live essay already uses this image, so it should be sharpened there rather than duplicated into a new Issue 01 essay.
- The archive still contains a future essay path around private artifact collections and the missing Phoenician textual record. That belongs in `site-archive/opportunities.md`, not in this prose cleanup.

Implementation decision:

- Edit only `The City That Could Not Repair Itself` in `longform-essays.md`.
- Remove targeted banned or AI-scented constructions from that essay section: em dashes, `not only`, `not just`, `unlock`, figurative `landscape`, `This matters`, `This is why`, and similar handrail transitions.
- Preserve the essay's argument and research structure. This cycle is voice repair, not a structural rewrite or issue reorder.
