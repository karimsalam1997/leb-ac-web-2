# Lebanese Academic Automation Cycle History

This file is the running "where we were, what changed, and where we are now" ledger for the editorial/design automation.

Every cycle should append a new entry here. The entry should include:

- Cycle number or timestamp.
- Starting commit for that cycle.
- Ending commit for that cycle.
- What the cycle changed.
- What the site looked or felt like before the change.
- What the site looks or feels like after the change.
- Files changed.
- Verification performed.
- Working local preview URL.
- Next recommended target.

The permanent pre-automation baseline lives in `site-archive/automation-baseline.md` and should not be overwritten.

## 2026-05-27, Cycle 01, Issue 01 Packaging

Starting commit: `0540b4e` (`Add editorial automation archive baseline`)

Checkpoint commit: `907eef4` (`Refine Leb Ac Web copy voice guidance`)

### What Changed

- Turned `/essays` into a clearer Issue 01 cover and table of contents.
- Added an issue deck, issue stats, and a four-part spine naming Downtown Beirut, Sakiet el-Janzeer, 1932, and the Blue Line.
- Added filter context so topic browsing reads as a filtered issue view.
- Rewrote homepage mission/archive copy so it names the issue's real subjects and corrects the old "eight launch essays" line.
- Tightened the Park essay in `longform-essays.md`, including replacing the banned figurative "landscape" tag/phrasing and removing some over-neat public-space language.
- Saved a reversible issue snapshot before changing issue-facing copy.
- Appended new ideas to `site-archive/opportunities.md`.
- Added `site-archive/living-voice-lab.md` so future voice cycles do not treat the old house voice as law.
- Added small Signal Desk type/map shims only because tracked dormant Signal Desk files blocked production typecheck.

### Before

The essays page opened as a plain register: "Essays" plus "10 Essays / Issue 01." The homepage archive block still said "eight launch essays." The issue had strong contents but not enough public packaging.

### After

The issue now opens with a short Beirut-located argument, issue stats, and a spine that tells the reader what kind of route they are entering before the filters and article list.

### Files Changed

- `src/app/page.tsx`
- `longform-essays.md`
- `src/app/essays/essay-index-client.tsx`
- `src/app/globals.css`
- `src/components/signal-desk/signal-desk-map.tsx`
- `src/lib/signal-desk.ts`
- `src/types/signal-desk-map-shims.d.ts`
- `site-archive/opportunities.md`
- `site-archive/living-voice-lab.md`
- `site-archive/issue-snapshots/2026-05-27-cycle-01-before-issue-packaging.md`
- `AUDIT_LOG.md`
- `site-archive/cycle-history.md`

### Verification

- `npm ci --prefer-offline --ignore-scripts --no-audit` passed.
- `npm run lint` passed again during manual checkpoint review.
- `npm run build` passed again during manual checkpoint review.
- `git diff --check` passed again during manual checkpoint review.
- Built-output text checks confirmed the new homepage and essays issue copy.
- `curl` checks confirmed the new Issue 01 deck on `/essays` and the new archive copy on `/`.
- Local server process check confirmed `http://127.0.0.1:3001` is served from `/Users/karimsalam/.codex/worktrees/c473/Leb Ac Web copy`.

### Working Local Preview URL

Working: `http://127.0.0.1:3001/essays`

### Next Recommended Target

Anti-AI Prose cleanup in `longform-essays.md`, continuing beyond the first Park essay pass into the Downtown sections and any remaining banned vocabulary or generic civic-design phrasing.

## 2026-05-27, Cycle 02, Park Essay Verification And Archive Pass

Starting commit: `907eef4` (`Refine Leb Ac Web copy voice guidance`)

Ending ledger commit: this `Record Cycle 02 editorial cleanup` checkpoint.

### What Changed

- Verified and recorded the focused `The Park That Remembers` cleanup already captured in `907eef4`.
- Added a dated research-opportunity entry to `site-archive/opportunities.md`.
- Recorded four unused archive-derived ideas: `The Aquifer Republic`, `Same Body, Different Religion`, `The Country That Exports Its People`, and `Baalbek Was Not a Ruin`.
- Added this cycle note and the matching `AUDIT_LOG.md` entry so the next run has a plain-English handoff.

### Before

The issue packaging was stronger after Cycle 01, but the next weakness was still voice. A homepage-visible essay had been tightened, yet the automation ledger did not fully separate that prose work from the issue-packaging checkpoint or record the new archive opportunities.

### After

The Park essay now clears the targeted banned-term scan used in this cycle, and the opportunity report gives the next editor concrete archive-derived essay paths instead of vague reminders to mine the research folder.

### Files Changed

- `longform-essays.md`
- `site-archive/opportunities.md`
- `AUDIT_LOG.md`
- `site-archive/cycle-history.md`

### Verification

- Targeted Park-section banned-term scan passed.
- `npm run lint` passed.
- `git diff --check` passed.
- `npm run build` passed.
- Built output checks found the revised Park dek and closing line in `.next/server`.

### Working Local Preview URL

Working: `http://127.0.0.1:3001/essays`

`http://127.0.0.1:3000/essays` returned 200, but `lsof` shows that server belongs to `/private/tmp/leb-ac-web-origin-main`. Use port 3001 for this automation branch while that process is running. Do not use port 3000 as proof unless the process owner is checked again.

### Next Recommended Target

Run a separate Anti-AI Prose pass on `The City That Could Not Repair Itself` and `Downtown Without a City`, beginning with em dashes, banned constructions, generic transitions, and any paragraph that could have been written from outside Beirut.

### Handoff Note

The site builds, and the exact-worktree preview is currently available on port 3001. The next automation should verify `HEAD`, verify preview-server ownership, then continue the longform cleanup.

## 2026-05-27, Cycle 03, Flagship Downtown Voice Pass

Starting commit: `03b7bf7` (`Record Cycle 02 editorial cleanup`)

Ending commit: not created. The commit attempt for `Clean flagship Downtown prose` was blocked by Git metadata write permissions.

### What Changed

- Cleaned `The City That Could Not Repair Itself` in `longform-essays.md`.
- Removed targeted AI-scented and banned constructions from the flagship essay: em dashes, `not only`, `not just`, `unlock`, figurative `landscape`, `This matters`, `This is why`, `The point is`, `The task is`, and `not X but Y` scaffolding.
- Kept the essay's research, section order, and core argument intact.
- Added Cycle 03 voice findings to `site-archive/living-voice-lab.md`.
- Added three archive-derived opportunities to `site-archive/opportunities.md`.
- Added an editorial research note to `RESEARCH_LOG.md`.
- Added the matching `AUDIT_LOG.md` cycle note.

### Before

The issue packaging was clearer after Cycle 01, and the Park essay had been cleaned in Cycle 02. The flagship Downtown essay still sounded too guided in places, with assistant-style transitions and proposal language interrupting an otherwise strong argument.

### After

The flagship essay now reads more directly. It keeps the strong concession that Hariri built something, keeps the Naccache memorycide frame, and loses several of the visible writing crutches that made the prose feel machine-shaped.

### Files Changed

- `longform-essays.md`
- `site-archive/living-voice-lab.md`
- `site-archive/opportunities.md`
- `RESEARCH_LOG.md`
- `AUDIT_LOG.md`
- `site-archive/cycle-history.md`

### Verification

- Targeted flagship-section construction scan passed.
- `npm run lint` passed.
- `npm run build` passed after the final prose/log patch.
- `git diff --check` passed after the final log append.
- Built-output text checks found the revised Downtown dek and closing line.

### Commit Status

Commit blocked after successful verification.

Git failed while trying to create `/Users/karimsalam/Documents/Leb Ac Web copy/.git/worktrees/Leb-Ac-Web-copy4/index.lock` with `Operation not permitted`. A direct write test inside the same Git metadata folder also failed, so this is a sandbox/write-permission issue rather than a stale lock.

The worktree remains dirty with the intended Cycle 03 files changed. Do not start Cycle 04 until these changes are either committed from an environment with write access to that Git worktree metadata folder or explicitly carried forward by the user.

### Working Local Preview URL

Preview status: unverified from this sandbox.

`lsof` confirms a Node server is listening on `http://127.0.0.1:3001` from this exact worktree, but localhost connections from the current shell and Node REPL are blocked with `Operation not permitted` / `fetch failed`.

Candidate manual URL: `http://127.0.0.1:3001/essays/the-city-that-could-not-repair-itself`

### Next Recommended Target

First resolve the Git metadata permission blocker and commit the verified Cycle 03 changes. Then run the same anti-AI construction pass on `Downtown Without a City`, and decide whether it should remain a standalone essay or become a shorter companion/gateway to the flagship Downtown piece.

### Handoff Note

Do not treat port 3001 as verified until a future run can actually connect to it. The process belongs to this worktree, but route access was blocked in this sandbox. Continue from the dirty Cycle 03 working tree, fix or bypass the Git metadata permission blocker, create the missing local commit, and only then start the `Downtown Without a City` pass.
