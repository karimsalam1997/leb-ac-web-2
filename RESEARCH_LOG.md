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
