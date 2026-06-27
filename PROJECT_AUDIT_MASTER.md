# Lebanese Academic Full Project Audit

Date: 2026-06-26
Folder: `/Users/karimsalam/Documents/Leb Ac Web copy`

## Executive Diagnosis

Lebanese Academic is already more than a website. It is a publication, a research shelf, a source archive, a war desk prototype, a visual identity system, a local chat-memory mine, and a working folder where all of those things have begun to blur into each other.

The good news is that the center is real. The writing has a recognizable political intelligence. The site has a serious visual identity. The Signal Desk pipeline is no longer a toy. The archive contains actual transcript bodies, book dossiers, extracted text, images, source manifests, and prior audits. There is enough here to build a durable publication.

The bad news is that the plumbing is too loose for the size of the thing. The build currently fails because TypeScript is reading an old offloaded dependency archive. Normal lint crawls the same archive unless narrowed manually. The repo has 486 tracked files and about 35,000 untracked files, most of them from `node_modules.offloaded-20260528012126`. The README still reads like a default Next.js starter. The public Signal Desk files are stale relative to the safer pipeline code. Letters and notebook entries look like sections but do not yet have real detail pages. The research archive is rich, but the repo is carrying too much generated material without a clean boundary.

This is not a disaster. It is a house whose rooms are good, but whose hallways are full of boxes.

## What I Verified

- Git state: `main...origin/main [ahead 1, behind 3]`.
- Modified tracked files: `AGENTS.md`, `RESEARCH/electronic-intifada-hezbollah-captions/README.md`, and `metadata.csv`.
- Untracked count: about 35,021 files, dominated by `node_modules.offloaded-20260528012126`.
- App source lint: `npx eslint src` passes with one warning in `src/app/essays/[slug]/page.tsx`.
- Full `npm run lint`: stopped after several minutes because ESLint crawled `node_modules.offloaded-20260528012126`.
- `npm run build`: fails during type-checking inside `node_modules.offloaded-20260528012126`.
- Signal Desk dry run: passed, with 41 source-health checks ok, 634 raw items, 60 scored items, 13 clusters, and publication guard allowed.
- Public Signal Desk data: still reflects older May 26 output and includes the known Gaza-to-Tyre error in `public/data/signal-desk/brief.md`.
- Chat corpus: reachable local sources include 932 Claude conversations, 2,124 GPT conversations, a 64-chat curated Lebanese Academic export, 78 June Codex session files, and 20 memory rollout summaries.

## Highest Priority Fixes

1. **Fix the build boundary**
   - `tsconfig.json` includes `**/*.ts`, `**/*.tsx`, and `**/*.mts` across the whole folder, excluding only `node_modules`.
   - Because `node_modules.offloaded-20260528012126` is not named `node_modules`, TypeScript enters it and breaks the build.
   - Fix by excluding `node_modules.offloaded-*`, `tmp`, `output`, generated research build folders, `store/output`, and any archive directories that contain generated code or extracted package sources.

2. **Fix the lint boundary**
   - `npm run lint` should check the app, not old dependency archives.
   - `npx eslint src` already proves the real app surface is almost clean.
   - Add explicit ignores for offloaded dependencies, generated research folders, `tmp`, `output`, and Python caches.

3. **Refresh or label Signal Desk public data**
   - The pipeline code now carries source health, map precision, verification dossiers, and publication guard logic.
   - The public files still show older stale behavior, including the Tyre/Gaza mapping issue.
   - Either run a guarded public refresh when ready, or put a visible stale-data label on `/signal-desk`.

4. **Define the folder boundary**
   - The current folder is serving as website repo, archive shelf, output folder, transcript warehouse, book extraction workspace, image library, and dependency junk drawer.
   - Keep the site repo lean. Keep archival material in a named archive shelf. Keep generated artifacts in ignored output folders unless they are deliberately published.

5. **Replace the README**
   - The current README is still the starter Next.js text.
   - It should explain, in plain English, what this project is, how to preview it, how to check it before publish, how content flows into the site, and what not to touch.

## Editorial Diagnosis

The live essay source is now `longform-essays.md`; letters and notebook entries still come from `launch-content.md`; `src/lib/content.ts` remains a fallback and parser layer.

The strongest editorial asset is not the number of essays. It is the pattern of arguments buried across the essays, research files, and old chats: Solidere as memory machinery, the generator as constitution, the census as forbidden knowledge, Nahr el-Kalb as imperial recurrence, Fatima/Mary/Astarte as a Lebanese grammar of mourning, and Signal Desk as evidence-first war reading.

The danger is repetition. The project keeps returning to the cartel/franchise frame. That frame is powerful, but when every essay eats from the same drawer, the reader starts to see the machinery. The older audit was right: chats should be treated as records of thinking, not as a spice rack to season every essay.

The next editorial move should be consolidation, not expansion. Merge duplicate generator essays. Decide whether the two Fatima/mourning essays are one essay or two separate registers. Keep `The Park That Remembers` as the model for embodied prose. Split the Downtown flagship into a city-political-economy essay and a shorter archaeology/memorycide essay.

## Product Diagnosis

The site has a publication identity, but some surfaces are still promises:

- Essays have real detail pages.
- Letters are a board, not a publication section with letter pages.
- Notebook is a board, not a real notebook archive.
- Topics is a homepage anchor, not a real section.
- There is no visible custom 404 route.
- The Submit page is strong as positioning copy, but form submissions are only emailed through Resend and have no durable editorial queue.
- Newsletter signups are also emailed to the owner, not stored in a newsletter system.

This means the site should be described honestly as: essays plus a research desk, with letters and notebook as early publication surfaces. Do not let the chrome pretend the institution is bigger than the workflow.

## Archive Diagnosis

The archive is valuable and dangerous for the same reason: it is alive.

Known useful shelves include:

- `RESEARCH/source_archive_inventory_2026-06-24.md`
- `RESEARCH/source_archive_manifest_2026-06-24.csv`
- `RESEARCH/youtube_transcript_inventory_2026-06-24.md`
- `RESEARCH/youtube_transcript_manifest_2026-06-24.csv`
- `RESEARCH/electronic-intifada-hezbollah-captions/`
- `RESEARCH/jad-ghosn-youtube-transcripts-2026-06-26/`
- `RESEARCH/lebanon-war-battlefield-report-2026-06-24/`
- `RESEARCH/makdisi-culture-of-sectarianism/`
- `RESEARCH/precarious-republic-summary/`

The rule for future work should be simple: if a folder contains source material or transcript bodies, preserve it and document it. If it contains rendered checks, generated images, extracted intermediate text, cache files, or temporary outputs, mark it as generated and keep it out of normal app checks.

## 90-Day Operating Recommendation

For the next 90 days, Lebanese Academic should be run as **essays plus research desk**, not a full magazine yet.

Weekly rhythm:

- One essay lane: revise, publish, or prepare one substantial piece.
- One archive lane: clean and document one source shelf, no risky deletion.
- One Signal Desk lane: run a dry check, update public data only when guard passes.
- One maintenance lane: fix one plumbing issue, then stop.

Do not add outside writers until the submission queue, style guide, payment rule, and editorial calendar are real.

## Immediate Do-Now List

1. Exclude `node_modules.offloaded-*` from TypeScript and ESLint checks.
2. Replace the README with a plain-English operator guide.
3. Add a `PROJECT_OPERATING_RULES.md` or rewrite `AGENTS.md` into shorter sections.
4. Refresh Signal Desk public data only through the guarded command, or label the public dashboard stale.
5. Create real `/letters/[slug]`, `/notebook/[slug]`, and `/topics` pages, or rename links so they do not imply pages.
6. Build a content manifest that says which essays are live, draft, duplicate, merged, or held.
7. Move archive-generation scripts and bulky generated outputs behind a clearer ignored folder policy.
8. Add simple checks: build, app lint, image existence, metadata completeness, stale Signal Desk data, and banned AI phrase scan.

