# Technical Plumbing Audit

Date: 2026-06-26

## Bottom Line

The app source is close to healthy. The project boundary is not.

When checked directly, `src` lints with one warning. The Signal Desk Python package compiles. Signal Desk dry-run works. But the normal build and normal lint commands are pulled into old archive and dependency folders. That means the website is being judged together with things that are not the website.

The fix is not heroic. It is boundary work.

## Verification Results

### Git

```text
## main...origin/main [ahead 1, behind 3]
 M AGENTS.md
 M RESEARCH/electronic-intifada-hezbollah-captions/README.md
 M RESEARCH/electronic-intifada-hezbollah-captions/metadata.csv
```

Notable untracked material includes book manifests, transcript folders, war report folders, generated outputs, `tmp/`, and `node_modules.offloaded-20260528012126/`.

### Lint

Command:

```bash
npx eslint src --ignore-pattern 'studio-lebanese-academic/dist/**'
```

Result:

- 0 errors.
- 1 warning: `ArticleInlineImage` is defined but unused in `src/app/essays/[slug]/page.tsx`.

Command:

```bash
npm run lint
```

Result:

- Stopped after several minutes.
- ESLint was crawling `node_modules.offloaded-20260528012126`.
- This is a command-scope problem, not proof that app code is broken.

### Build

Command:

```bash
npm run build
```

Result:

- Compilation succeeded.
- Type-checking failed inside `node_modules.offloaded-20260528012126/@babel/core/src/config/files/index-browser.ts`.
- Cause: `tsconfig.json` includes all `**/*.ts`, `**/*.tsx`, and `**/*.mts`, excluding only `node_modules`.

### Signal Desk

Command:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Result:

- Passed.
- 41 source-health checks ok.
- 634 raw items.
- 623 canonical items.
- 60 scored items.
- 13 clusters.
- 5 located clusters.
- Publication guard allowed public copy.
- Dry run correctly did not write public files.

### Python

Command:

```bash
python3 -m compileall -q tools/signal_desk
```

Result:

- Passed.

## Main Technical Findings

1. **Build boundary is broken**
   - `node_modules.offloaded-20260528012126` is outside the normal `node_modules` exclude.
   - TypeScript treats it as project source.
   - This blocks production build verification.

2. **Lint boundary is too wide**
   - The broad lint command scans dependency archives.
   - The app itself lints cleanly except one unused symbol.

3. **Generated files are too close to source**
   - `.next`, `tmp`, `output`, `store/output`, Python caches, `.DS_Store`, render-check images, and extracted book text all live near app source.
   - Some are ignored. Some are not. Some are untracked but valuable.

4. **README is not an operator guide**
   - It still says this is a default Next.js project and points to starter instructions.
   - This is actively unhelpful for a non-coder working with agents.

5. **Sanity is present but not decisive**
   - Sanity client, queries, and Studio exist.
   - Live essays are markdown-backed.
   - Future work must decide whether Sanity is the publishing system or a parked experiment.

6. **Signal Desk public data can go stale**
   - The code has safer verification and publication logic.
   - The public files are still old.
   - The dashboard needs a visible generated-at/status line and a refresh workflow.

7. **Forms work only as email relays**
   - Submit and newsletter endpoints validate basic input and email through Resend.
   - They do not store submissions or subscribers.
   - This is fine for a prototype, weak for a publication.

## Recommended Config Fixes

Do these after deciding to execute code changes:

- Add `node_modules.offloaded-*` to `tsconfig.json` exclude.
- Add `tmp`, `output`, `store/output`, `RESEARCH/**/render-check`, `RESEARCH/**/render_check`, and generated transcript/book extraction folders to TypeScript or ESLint ignores where appropriate.
- Change `npm run lint` to lint `src` and relevant config files, not the entire folder.
- Keep Python linting separate from JS linting.
- Add a `check` script that runs:
  - app lint
  - build
  - Signal Desk dry-run
  - image existence check
  - metadata/content check

## Plain-English Commands The User Needs

Preview site:

```bash
npm run dev
```

Check app lint only:

```bash
npx eslint src
```

Build before publishing:

```bash
npm run build
```

Run Signal Desk safely:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Publish Signal Desk only after dry run looks healthy:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d
```

Do not run the publish command if source health collapses or the guard refuses public copy.

## Future Automation Checks

Add these in order:

1. Build boundary check: ensure TypeScript never enters `node_modules.offloaded-*`.
2. Image existence check: every image path in `src/lib/visual-assets.ts` exists.
3. Metadata check: every live essay has title, dek, date, read time, excerpt, image, and social description.
4. Banned phrase scan: catch AI scaffolding before publish.
5. Internal link check: confirm all nav/footer links resolve.
6. Signal Desk freshness check: compare public generated date against current date and warn if stale.
7. Archive manifest check: transcript folders must include README and metadata.

## Do Not Do

- Do not mass-delete untracked archive folders.
- Do not stage all untracked files.
- Do not treat generated render checks as live publication assets.
- Do not make Sanity the assumed source of truth until the content flow is decided.
- Do not run public Signal Desk refresh as a casual side effect of testing.

