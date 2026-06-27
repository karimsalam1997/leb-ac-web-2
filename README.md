# Lebanese Academic Operator Guide

This is the local project folder for Lebanese Academic.

Plain English first: the website, the research archive, Signal Desk, and many generated files live near each other. That is useful, but it also means checks must be careful. The website should be checked as the website. Archive folders should not be deleted or moved just because they appear in `git status`.

## What Is Live

- Website app: `src/`
- Live long essays: `longform-essays.md`
- Letters and notebook source: `launch-content.md`
- Signal Desk code: `tools/signal_desk/`
- Public Signal Desk data: `public/data/signal-desk/`
- Sanity Studio experiment: `studio-lebanese-academic/`

Sanity exists, but it is not the main live publishing system yet. The site still depends mostly on markdown files.

## What Not To Do Casually

- Do not run `git add .`.
- Do not delete `RESEARCH/`.
- Do not delete transcript folders.
- Do not move archive folders without first making a manifest.
- Do not publish Signal Desk data as a test.
- Do not assume an untracked file is junk. Some untracked files are real research.

## Normal Commands

Preview the site:

```bash
npm run dev
```

Check the app:

```bash
npm run lint
```

Build before publishing:

```bash
npm run build
```

Run Signal Desk safely without changing public files:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d --dry-run
```

Publish Signal Desk data only after the dry run looks healthy:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d
```

## Safe Work Order

1. Fix or check plumbing first: lint, build, ignored folders, generated files.
2. Keep archive work separate from website work.
3. Dry-run Signal Desk before any public refresh.
4. Make content manifests before moving drafts or research.
5. Commit small batches with plain names.

## Current Audit Files

The project audit lives in these local files:

- `PROJECT_AUDIT_MASTER.md`
- `PROJECT_AUDIT_BACKLOG.csv`
- `PROJECT_MAP.md`
- `CHAT_MEMORY_AUDIT.md`
- `EDITORIAL_SYSTEM_AUDIT.md`
- `TECH_PLUMBING_AUDIT.md`
- `PROJECT_AUDIT_MEMORY.md`

Start with `PROJECT_AUDIT_MEMORY.md` if context was lost.
