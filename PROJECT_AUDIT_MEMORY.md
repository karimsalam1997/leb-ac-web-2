# Lebanese Academic Audit Memory

Date: 2026-06-26
Project folder: `/Users/karimsalam/Documents/Leb Ac Web copy`

This file is a handoff note for context loss. Read this before continuing any audit, cleanup, workflow, or implementation work in this project.

## What The User Asked

The user asked for a full consultant-style audit of the entire Lebanese Academic project: website, `AGENTS.md`, archive, chats, memory, plumbing, infrastructure, editorial system, Signal Desk, and workflow. The audit was planned first, then implemented as local audit documents.

The user then asked whether implementing the audit would break anything. Answer given: the audit itself did not break anything because it only added files. Implementing the audit should improve workflow if done in small, reversible, verified steps. Do not mass-delete, mass-move, or bulk-stage untracked files.

The user then asked for this memory file because context loss may happen soon.

## Files Created By This Audit

These files were created in the project root:

- `PROJECT_AUDIT_MASTER.md`
- `PROJECT_AUDIT_BACKLOG.csv`
- `PROJECT_MAP.md`
- `CHAT_MEMORY_AUDIT.md`
- `EDITORIAL_SYSTEM_AUDIT.md`
- `TECH_PLUMBING_AUDIT.md`
- `PROJECT_AUDIT_MEMORY.md`

Do not treat these as deployed website changes. They are local project/audit documentation.

## Current Git State At Audit Time

Observed git state:

```text
## main...origin/main [ahead 1, behind 3]
 M AGENTS.md
 M RESEARCH/electronic-intifada-hezbollah-captions/README.md
 M RESEARCH/electronic-intifada-hezbollah-captions/metadata.csv
```

There were many untracked files, including the new audit docs and existing archive/generated material.

Important: there are about 35,000 untracked files, mostly because of `node_modules.offloaded-20260528012126`. Do not stage all. Do not delete all.

## Main Findings

### 1. The app source is not the main problem

`npx eslint src` passed with one warning:

- `src/app/essays/[slug]/page.tsx`
- Warning: `ArticleInlineImage` is defined but never used.

Update after first implementation pass:

- The unused `ArticleInlineImage` helper was removed.
- The matching unused image-shape helpers were removed.
- `npm run lint` now exits cleanly with no warnings.

### 2. The build boundary is broken

`npm run build` failed during TypeScript checking because TypeScript entered:

```text
node_modules.offloaded-20260528012126/@babel/core/src/config/files/index-browser.ts
```

This is not a normal app-code failure. It is a folder-boundary failure. `tsconfig.json` includes broad patterns like `**/*.ts`, `**/*.tsx`, and `**/*.mts`, and only excludes `node_modules`. Since `node_modules.offloaded-20260528012126` is not named exactly `node_modules`, it gets type-checked.

Likely first fix:

- Add `node_modules.offloaded-*` to `tsconfig.json` excludes.
- Also ignore it in ESLint/global ignores.

Update after first implementation pass:

- `tsconfig.json` now includes only `next-env.d.ts`, `next.config.ts`, `src/**/*.ts`, `src/**/*.tsx`, and Next generated type files.
- `node_modules.offloaded-*`, `tmp`, `output`, `store/output`, and render-check folders are excluded from TypeScript.
- `compilerOptions.types` was limited to `node`, `react`, and `react-dom` because this local `node_modules` folder contains malformed duplicate type folders like `@types/babel__core 2`.
- `npm run build` now passes.

### 3. Full lint is pointed too widely

`npm run lint` crawled `node_modules.offloaded-20260528012126` and was stopped after several minutes. Narrow app lint passed, so the normal lint command needs a cleaner scope.

Likely fix:

- Change lint script or ESLint ignores so normal lint only checks real app/config source.

Update after first implementation pass:

- `package.json` now points `npm run lint` at `src`, `next.config.ts`, and the Sanity config/schema files instead of the whole project folder.
- `eslint.config.mjs` now ignores `node_modules.offloaded-*`, `tmp`, `output`, `store/output`, render-check folders, and Sanity dist output.
- `.gitignore` now hides the same generated/storage folders without deleting them.

### 4. Signal Desk works in dry-run, but public data is stale

Safe dry-run command used:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Result:

- 41 source-health checks ok.
- 634 raw items.
- 623 canonical items.
- 60 scored items.
- 13 clusters.
- 5 located clusters.
- Publication guard allowed public copy.
- Dry run correctly did not update public files.

But public data under `public/data/signal-desk/` still reflects old May 26 output and contains the older Gaza-to-Tyre mistake in `brief.md`.

Safe next move:

- Either refresh public Signal Desk data only with the guarded non-dry-run command after reviewing dry-run output, or label `/signal-desk` as stale.

Update after second implementation pass:

- Dry-run was repeated on 2026-06-26 and passed.
- Source health was 41/41 ok.
- Publication guard allowed public copy.
- The guarded non-dry-run command refreshed `public/data/signal-desk/`.
- Public files now carry 2026-06-26 data instead of stale 2026-05-26 data.
- The Signal Desk UI now exposes current source health and map coverage from `api.meta.source_condition` and `api.meta.map_coverage`.
- Historical run-health comparison is still future work.
- Browser check passed at `http://localhost:3000/signal-desk` using system Chrome: HTTP 200, no console errors, generated time visible, source health visible, and map coverage visible.

### 5. Live content source is split

Current content truth:

- Essays: `longform-essays.md`
- Letters and notebook: `launch-content.md`
- Parser/fallback/redirects: `src/lib/content.ts`

Do not assume Sanity is the live source of truth. Sanity exists, but markdown is still feeding the core site content.

Update after second implementation pass:

- `PROJECT_CONTENT_MANIFEST.md` and `PROJECT_CONTENT_MANIFEST.csv` were created.
- The manifest separates live website source, launch shelf, rewrite shelf, drafts, research archive, transcript shelves, generated output, images, Signal Desk data, and Sanity.
- No files were moved or deleted.

### 6. Product architecture is partly real, partly promised

Real:

- Essay pages exist.
- Home, essays, about, submit, Signal Desk exist.

Still incomplete:

- No `/topics` route.
- No `/letters/[slug]` route.
- No `/notebook/[slug]` route.
- No custom `not-found.tsx`.
- Letters and notebook use board/anchor behavior while some UI language implies real pages.

Update after third implementation pass:

- `/letters/[slug]` now exists and is statically generated from `letters`.
- `/notebook/[slug]` now exists and is statically generated from `notebookEntries`.
- `/topics` now exists and lists essay topics with filtered register links.
- `src/app/not-found.tsx` now provides a custom 404 page.
- Letter and notebook list links now point to real detail pages instead of hash anchors.
- Primary navigation now points to `/topics` instead of `/#topics`.
- Sitemap now includes `/topics`, letter detail pages, and notebook detail pages.
- Browser checks passed on desktop and mobile for `/topics`, `/letters/letter-to-the-south`, `/notebook/the-generator`, and a deliberate missing route.

### 7. Archive is valuable and should not be cleaned blindly

Important archive folders/files include:

- `RESEARCH/source_archive_inventory_2026-06-24.md`
- `RESEARCH/source_archive_manifest_2026-06-24.csv`
- `RESEARCH/youtube_transcript_inventory_2026-06-24.md`
- `RESEARCH/youtube_transcript_manifest_2026-06-24.csv`
- `RESEARCH/electronic-intifada-hezbollah-captions/`
- `RESEARCH/jad-ghosn-youtube-transcripts-2026-06-26/`
- `RESEARCH/lebanon-war-battlefield-report-2026-06-24/`
- `RESEARCH/makdisi-culture-of-sectarianism/`
- `RESEARCH/precarious-republic-summary/`

Rule: separate actual transcript bodies from metadata-only indexes. Do not count a manifest as a transcript shelf.

## Safe Implementation Order

Use this order if the user asks to implement the audit:

1. **Fix build/lint boundaries**
   - Add ignores/excludes for `node_modules.offloaded-*`, generated outputs, and temporary folders.
   - Verify with `npx eslint src` and `npm run build`.
   - Status: done. `npm run lint` and `npm run build` both pass.

2. **Replace README / add operator guide**
   - Plain English.
   - Explain how to preview, check, publish, run Signal Desk safely, and avoid bulk staging.

3. **Signal Desk freshness**
   - Dry-run first.
   - Only public refresh if guard passes.
   - Otherwise label stale public data.
   - Status: done for current local public data on 2026-06-26. Current source health is visible in the dashboard. Run-health history is still future work.

4. **Content map**
   - Create a live/draft/archive/generated content manifest.
   - No moving yet.
   - Status: done. See `PROJECT_CONTENT_MANIFEST.md` and `PROJECT_CONTENT_MANIFEST.csv`.

5. **Product architecture**
   - Build real `/topics`, `/letters/[slug]`, `/notebook/[slug]`, and custom 404.
   - Status: done. Lint, build, and browser checks passed.

6. **Editorial consolidation**
   - Merge generator essays.
   - Split Downtown flagship.
   - Decide Fatima/Mourning structure.
   - Rebuild Rubble Zone with named source details.

## Things Not To Do

- Do not run `git add .`.
- Do not delete `RESEARCH/` folders.
- Do not delete transcript folders.
- Do not mass-delete untracked files.
- Do not move archives without first producing a manifest.
- Do not run a public Signal Desk refresh as a side effect of testing.
- Do not assume `node_modules.offloaded-20260528012126` is safe to delete unless the user approves cleanup and dependencies are verified.
- Do not tell the user technical details without plain-English context first.

## User Communication Rules

The user is not a coder. Explain first in plain English. Then give filenames or commands.

Good framing:

> The website itself is not broken. The check is looking in the wrong closet.

Bad framing:

> TypeScript include glob is overmatching an offloaded dependency tree.

Use the technical sentence only after the plain-English one.

## Lebanese Academic Voice Rules To Preserve

For editorial work, follow the project voice:

- Scene before thesis.
- One named Lebanese thing per paragraph when possible.
- No generic AI filler.
- Avoid `not X but Y` scaffolding unless genuinely necessary.
- Use active verbs for Israeli state violence when evidence supports it.
- Keep moral clarity and factual discipline together.
- Close on a concrete image, not a generic instruction.

## Verification Commands Already Used

```bash
npx eslint src --ignore-pattern 'studio-lebanese-academic/dist/**'
```

Passed with one warning.

```bash
npm run build
```

Now passes after the audit implementation patches.

```bash
npm run lint
```

Now passes with no warnings.

Failed because TypeScript entered `node_modules.offloaded-20260528012126`.

```bash
python3 -m compileall -q tools/signal_desk
```

Passed.

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Passed.

## Best Next Step

If the user says "go implement the first thing" or similar, start with the smallest safe plumbing fix:

- update `tsconfig.json` exclude,
- update ESLint ignores or lint script,
- run narrow lint,
- run build,
- report in plain English.

This is the first real improvement because it makes every later website change safer.
