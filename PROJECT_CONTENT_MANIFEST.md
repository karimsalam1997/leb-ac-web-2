# Lebanese Academic Content Manifest

Date: 2026-06-26

This file separates the project into plain buckets: live website source, draft writing, research/archive material, generated output, and local-only material. It is a map for future cleanup. It does not move, delete, publish, or retire anything by itself.

## Rules

- Treat `longform-essays.md` as the live long-essay source.
- Treat `launch-content.md` as the live source for letters and notebook entries until those sections get their own files or routes.
- Treat `RESEARCH/` as evidence, not junk.
- Treat transcript folders as source bodies only after checking that they contain transcript text or caption files.
- Treat `output/`, `tmp/`, and `store/output/` as generated output.
- Do not use `git add .`.

## Live Website Source

| Area | Current Source | Count | Status | Notes |
|---|---:|---:|---|---|
| Long essays | `longform-essays.md` | 11 essays | Live | Parsed by `src/lib/content.ts`. This is the main essay source. |
| Letters | `launch-content.md` | 5 letters | Live | `/letters` and `/letters/[slug]` exist. |
| Notebook | `launch-content.md` | 5 entries | Live | `/notebook` and `/notebook/[slug]` exist. |
| Posts | Sanity client plus fallback code | unclear | Secondary | `/posts` exists, but markdown essays are still the real editorial center. |
| Signal Desk | `public/data/signal-desk/` | 5 public files | Live local data | Refreshed on 2026-06-26 after dry-run guard passed. |
| App code | `src/` | app source | Live | Lint and build pass after the audit plumbing fix. |

## Live Long Essays

These 11 titles are in `longform-essays.md`:

1. The City That Could Not Repair Itself
2. The Cartel in the Costume of a Country
3. The Land That Mourns in One Language
4. The Generator Republic
5. How a Generator Owner Showed Why Lebanon Has No State
6. The Census That Cannot Be Taken
7. Sovereignty Theatre
8. The Rubble Zone
9. The Seventeen Countries
10. Downtown Without a City
11. The Park That Remembers

## Launch Shelf

`launch-content.md` contains the older launch shelf:

- 20 essay-style entries.
- 5 letters.
- 5 notebook entries.

The important point: some of these overlap with live long essays, while others are older seeds. Do not bulk copy them into the live file. Use them as candidates during editorial consolidation.

## Rewrite Shelf

`voice-rebuild-2026-05-22/rewritten-essays-v1/` contains 11 rewritten essay files. These are draft/revision evidence, not automatically live.

Use this folder when improving voice, rhythm, openings, scene pressure, and anti-AI phrasing. Do not assume it is newer than `longform-essays.md` without comparing the actual passages.

## Draft Writing

Known draft files include:

- `drafts/the_generator_pasha.md`
- `drafts/the_state_that_manufactures_its_own_sects.md`
- `drafts/2026-05-11-hezbollah-fpv-drones-essay-draft.txt`
- `drafts/2026-05-11-dragonfly-atlantic-draft.txt`
- Root-level revised/journalist drafts for Cartel, Mourning, Downtown, and state-workaround essays.

Recommended handling:

- Keep these as drafts.
- Add a one-line status before publishing from them.
- Do not merge them into `longform-essays.md` without a source and image pass.

## Research And Archive Material

Important research shelves:

- `RESEARCH/electronic-intifada-hezbollah-captions/`
- `RESEARCH/jad-ghosn-youtube-transcripts-2026-06-26/`
- `RESEARCH/lebanon-war-battlefield-report-2026-06-24/`
- `RESEARCH/makdisi-culture-of-sectarianism/`
- `RESEARCH/precarious-republic-summary/`
- `RESEARCH/source_archive_inventory_2026-06-24.md`
- `RESEARCH/source_archive_manifest_2026-06-24.csv`
- `RESEARCH/youtube_transcript_inventory_2026-06-24.md`
- `RESEARCH/youtube_transcript_manifest_2026-06-24.csv`
- `RESEARCH/book_intelligence_system_2026-06-26.md`
- `RESEARCH/book_manifest_2026-06-26.csv`

Recommended handling:

- Keep transcript-body shelves separate from metadata-only indexes.
- Keep book manifests separate from generated reader PDFs.
- Keep chat-derived research marked as chat-derived until source trails are checked.
- Create stable provenance fields before any large archive cleanup.

## Generated Output

Generated or derived output lives mainly in:

- `public/data/signal-desk/`
- `store/output/`
- `output/`
- `tmp/`
- `drafts/pdfs/`
- render-check folders

Recommended handling:

- Keep public Signal Desk files only when intentionally refreshed.
- Do not commit temporary render screenshots unless they are part of a deliverable.
- Do not delete generated PDFs until the source text and script are known.

## Image Material

Known image shelves:

- `public/home/`
- `public/editorial/`
- `public/brand/`
- `public/essay-images/`
- `public/north-star/`
- `Essay Images/`

Current quick count: 78 public image files under `public/` at depth 2.

Recommended handling:

- Make a separate image credit and usage manifest before changing image names.
- Keep sourced images, generated images, and brand assets in separate columns.
- Check whether article pages expose credits clearly enough before publishing outside the current prototype circle.

## Current Safe Next Moves

1. Create an essay packet template with fields for status, source layer, image plan, SEO, social copy, and readiness.
2. Decide which generator essay survives, or merge them into one sharper piece.
3. Decide whether the mourning material is one essay or two registers.
4. Split the Downtown flagship into urban political economy and archaeology/memorycide tracks.
5. Add RSS once the publication cadence is stable enough to syndicate.
