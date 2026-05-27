# Lebanese Academic Automation Baseline

Date captured: 2026-05-27

Worktree: `/Users/karimsalam/.codex/worktrees/c473/Leb Ac Web copy`

Starting commit: `488299d` (`Cycle 20: UI/UX & Design — logged frontend blocker after trust-surface research`)

Git state before this archive was added: clean detached worktree at the same commit as `/Users/karimsalam/Documents/Leb Ac Web copy` on `main`.

## Why this file exists

This is the permanent "before the automation" marker. Every future editorial/design automation cycle should read this file first so the agent can see where the site started, even after many cycles have changed the pages, essays, images, and layout.

Do not overwrite this file during automation runs. Add cycle-by-cycle changes to `site-archive/cycle-history.md` instead.

## Starting Site Shape

- Canonical essay source: `longform-essays.md`.
- Issue state: the essays page currently presents `Issue 01`.
- Current essay count: 10 essays.
- Main routes visible to readers: home page, essays index, letters, notebook, submit, and Signal Desk components.
- Main design files: `src/app/globals.css`, `src/app/page.tsx`, `src/app/essays/page.tsx`, `src/app/essays/essay-index-client.tsx`, `src/components/site-shell.tsx`, and `src/lib/visual-assets.ts`.
- Main image folder: `Essay Images/`.

## Starting Essay Order

1. The City That Could Not Repair Itself
2. The Cartel in the Costume of a Country
3. How a Generator Owner Showed Why Lebanon Has No State
4. The Census That Cannot Be Taken
5. Sovereignty Theatre
6. The Rubble Zone
7. The Seventeen Countries
8. The Land That Mourns in One Language
9. Downtown Without a City
10. The Park That Remembers

## Starting Design Diagnosis

The site already has a serious editorial identity: paper-like framing, literary typography, article images, homepage feature structure, issue language, and topic browsing. The weak points named before automation began were: dated topic/category controls, insufficiently modern interaction, no custom cursor or motion layer, uneven essay reading experience, Issue 01 not yet feeling like a deliberate cover/package, and prose that still contains AI-like structure in places.

## Restoration Note

Because this is a git worktree, each committed cycle can be compared or reversed. The starting point can always be inspected with:

```bash
git show 488299d:path/to/file
```

For example:

```bash
git show 488299d:longform-essays.md
git show 488299d:src/app/page.tsx
git show 488299d:src/app/globals.css
```
