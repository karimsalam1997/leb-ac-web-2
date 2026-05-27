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
