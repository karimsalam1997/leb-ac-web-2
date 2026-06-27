# Lebanese Academic Project Map

Date: 2026-06-26

This map explains what lives where. It is written for a human first. The short version: the website source, research archive, generated outputs, and chat memory are all in or near this folder, but they are not the same kind of thing.

## Live Website Source

These are the files that shape the public site.

- `src/app/`: routes and pages.
- `src/components/`: reusable page pieces.
- `src/lib/content.ts`: parser, fallback content, redirects, and local content model.
- `src/lib/visual-assets.ts`: image assignments, captions, fallbacks.
- `src/lib/seo.ts`: site metadata, canonical URLs, JSON-LD.
- `src/app/globals.css`: full styling system, currently about 9,005 lines.
- `longform-essays.md`: canonical live longform essay source.
- `launch-content.md`: still feeds letters and notebook entries.
- `public/`: public assets and generated Signal Desk data.

Current routes found:

- `/`
- `/about`
- `/essays`
- `/essays/[slug]`
- `/posts`
- `/posts/[slug]`
- `/letters`
- `/notebook`
- `/submit`
- `/signal-desk`
- `/api/newsletter`
- `/api/submit`
- `/sitemap.xml`
- `/robots.txt`
- Open Graph image routes for the site and essays.

Missing or incomplete route surfaces:

- No `/topics` route.
- No `/letters/[slug]` route.
- No `/notebook/[slug]` route.
- No custom `not-found.tsx`.

## Content Sources

The content source picture is split.

- `longform-essays.md`: live long essays, including Downtown, Cartel, Land That Mourns, Generator, Census, Sovereignty, Rubble Zone, Seventeen Countries, Downtown Without a City, and Park.
- `launch-content.md`: older launch package, still used for letters and notebook.
- `src/lib/content.ts`: fallback essay corpus plus parser and redirects.
- `voice-rebuild-2026-05-22/rewritten-essays-v1/`: rewritten essay candidates, useful for voice comparison.
- `drafts/`: draft essays, including generator and state/sect material.
- Root draft files: standalone essay drafts and revised versions.

Plain-English rule:

If you want to publish a live essay, check `longform-essays.md` first. If you want letters or notebook, check `launch-content.md`. If something appears in `src/lib/content.ts` but not in the markdown, treat it as fallback or old structure until proven live.

## Research Archive

The `RESEARCH/` folder contains topic dossiers, transcripts, source manifests, and generated book work. It should be treated as source material unless a folder is clearly generated.

Main research clusters:

- Lebanon political economy and sectarianism.
- Downtown Beirut, Solidere, memorycide, archaeology.
- Fatima, Mary, Astarte, Canaanite continuity, mourning.
- Israel, Hezbollah, Lebanon war, FPV drones, casualty-source layers.
- Jad Ghosn, Electronic Intifada, Max Blumenthal, Mario Nawfal transcript material.
- Book dossiers and extracted readings, including Makdisi and Precarious Republic.

Important archive files:

- `RESEARCH/source_archive_inventory_2026-06-24.md`
- `RESEARCH/source_archive_manifest_2026-06-24.csv`
- `RESEARCH/youtube_transcript_inventory_2026-06-24.md`
- `RESEARCH/youtube_transcript_manifest_2026-06-24.csv`
- `RESEARCH/book_intelligence_system_2026-06-26.md`
- `RESEARCH/book_manifest_2026-06-26.csv`

Transcript shelves:

- `RESEARCH/electronic-intifada-hezbollah-captions/`
- `RESEARCH/jad-ghosn-youtube-transcripts-2026-06-26/`
- `RESEARCH/lebanon-war-battlefield-report-2026-06-24/`

Book/dossier shelves:

- `RESEARCH/makdisi-culture-of-sectarianism/`
- `RESEARCH/precarious-republic-summary/`
- `output/book-analysis/`
- `output/pdf/`

## Visual Assets

There are several image worlds:

- `public/brand/`: brand marks and lockups.
- `public/editorial/`: editorial imagery, generated archive images, Beirut Park images.
- `public/essay-images/`: article images used by the site.
- `public/essay-images/sourced/`: sourced images with `credits.json`.
- `Essay Images/`: older or parallel essay image folder, not clearly part of the live public system.
- `Precedents/`: visual precedent images.

Current finding:

The project has a real sourced-image credit base, but it needs one inventory that says source, license, caption, crop, live usage, generated/sourced status, and whether the image is safe for public publication.

## Signal Desk

Signal Desk lives in two places:

- Code: `tools/signal_desk/`
- Public data: `public/data/signal-desk/`
- Historical store output: `store/output/`

Safe command:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Verified 2026-06-26 dry run:

- 41 source-health checks ok.
- 634 raw items.
- 60 scored items.
- 13 clusters.
- 5 located clusters.
- Publication guard allowed public copy.

Current issue:

The public data files are stale compared with the current pipeline. The public brief still carries older May 26 language and the known Gaza/Tyre mapping error. Dry runs do not update public files, which is correct. A guarded public refresh is needed when the operator chooses to publish fresh Signal Desk data.

## Sanity

Sanity exists, but the site is not currently organized as a pure CMS publication.

- `src/sanity/`: Next-side Sanity client and queries.
- `studio-lebanese-academic/`: Sanity Studio app.
- Project ID: `cc4vt6z9`, dataset `production`.

Decision needed:

Either Sanity becomes the future editorial CMS, or it remains an experiment. Right now the live essay source is markdown-first, so future agents should not assume Sanity is the source of truth.

## Generated And Temporary Material

Generated or temporary folders found:

- `.next/`
- `tmp/`
- `output/`
- `store/output/`
- `tools/signal_desk/__pycache__/`
- `tsconfig.tsbuildinfo`
- `.DS_Store` files
- `node_modules.offloaded-20260528012126/`

Main plumbing issue:

`node_modules.offloaded-20260528012126/` is not ignored by TypeScript's current `exclude`, so it breaks `npm run build`. It also makes lint crawl old dependencies when using the broad `npm run lint` command.

## Chat And Memory Sources

Reachable chat and memory sources:

- `may-august-2025-lebanese-academic-social-science-chats.md`: 64 curated chats.
- `/Users/karimsalam/Documents/Claude Data/conversations.json`: 932 Claude conversations.
- `/Users/karimsalam/Documents/GPT Data/conversations-000.json` through `conversations-021.json`: 2,124 GPT conversations.
- `/Users/karimsalam/.codex/sessions/2026/06/`: 78 June Codex session files found.
- `/Users/karimsalam/.codex/memories/MEMORY.md`: memory registry.
- `/Users/karimsalam/.codex/memories/rollout_summaries/`: 20 rollout summaries.

Recommended handling:

Index chats first. Do not import everything. Classify each useful chat as voice gold, essay seed, source trail, product decision, bad AI artifact, duplicate, or noise.

## Git And Working State

Current state:

- Branch: `main`.
- Remote relation: ahead 1, behind 3.
- Tracked files: 486.
- Untracked files: about 35,021.
- Modified tracked files: `AGENTS.md`, transcript archive README, transcript metadata.

Plain-English meaning:

The local folder has work that is not fully synced with GitHub. Some changes are probably intentional. Some untracked material is valuable archive work. Some is junk or generated output. Nothing should be deleted or staged in bulk.

