# Editorial System Audit

Date: 2026-06-26

## Diagnosis

Lebanese Academic has a strong mind and an unstable editorial machine.

The writing is strongest when it begins from a Lebanese object under pressure: a generator in Sakiet el-Janzeer, a census table from 1932, the Nahr el-Kalb cliff, the old Beirut souks, the port blast, a shrine, a park path, a bank account, a municipality map. It is weakest when it explains the whole country from above and lets the same cartel/franchise vocabulary carry every essay.

The next step is not more essays. It is a cleaner editorial system.

## Current Content Sources

- `longform-essays.md`: canonical live essay source.
- `launch-content.md`: still feeds letters and notebook.
- `src/lib/content.ts`: parser, fallback corpus, redirects, and older content.
- `voice-rebuild-2026-05-22/rewritten-essays-v1/`: useful rewritten essay candidates.
- `RESEARCH/`: source dossiers and chat-derived research.
- `drafts/` and root draft files: active or dormant essay drafts.

## Live Essay Status Table

| Essay | Current State | Recommendation |
|---|---|---|
| The City That Could Not Repair Itself | Live flagship, too large, several essays inside one body | Split into Downtown political economy and archaeology/memorycide piece |
| The Cartel in the Costume of a Country | Strong manifesto frame, risks overuse | Keep as overview, but stop letting it absorb every other argument |
| The Land That Mourns in One Language | Strong personal/mythic register | Decide if it absorbs or separates from Goddess/Fatima material |
| The Generator Republic | Strong frame, needs the Abu Ali case | Merge with generator-owner essay |
| How a Generator Owner Showed Why Lebanon Has No State | Strong lived case, overlaps heavily | Merge into Generator Republic |
| The Census That Cannot Be Taken | Structurally strong, needs more embodied opening | Revise around a person or polling place |
| Sovereignty Theatre | Strong diagnosis, metaphor overused | Cut by half and replace repeated theatre language after first act |
| The Rubble Zone | Correct frame, needs more names and dates from research | Rebuild with Katz, Smotrich, Qassem, Weizman, Taybeh-Qantara, Merkava material |
| The Seventeen Countries | Great premise, needs to earn the number | Either count the layers or change title |
| Downtown Without a City | Overlaps with the Downtown flagship | Absorb best passages into Downtown piece, then retire |
| The Park That Remembers | Closest to embodied Karim voice | Use as model for future essays |

## Main Editorial Risks

1. **Theme soup**
   - Old chats contain brilliant ideas, but the essays sometimes reuse the same themes across different pieces.
   - Fix: one essay, one center of gravity.

2. **Cartel/franchise overuse**
   - The terms are strong, but repeated across too many pieces.
   - Fix: use more exact nouns: za'im, bank, ministry, municipality, port authority, generator owner, waqf, party office.

3. **Binary scaffolding**
   - Phrases like "not simply X" and "not only X" still appear in live copy.
   - Fix: replace the construction with a concrete image and a plain claim.

4. **Research staged at the bottom**
   - Some essays carry long suggested citations instead of absorbing sources into the prose.
   - Fix: quote or name source layers inside the argument, then use compact notes.

5. **Too little first person where it matters**
   - The Park works because the writer has hands in the piece.
   - Fix: use first person when the thought genuinely began in a seen object, video, walk, room, or design process.

## Publication Queue

### Ship Soon

- `The Park That Remembers`, after a light closing pass.
- `The Cartel in the Costume of a Country`, after reducing throat-clearing and making sure it does not repeat adjacent cartel essays.

### Revise

- `The Census That Cannot Be Taken`, add a human opening and sharper 1932/French Mandate body.
- `The Rubble Zone`, restore names, dates, military details, and source-layer discipline.
- `Sovereignty Theatre`, cut repeated theatre language.
- `The Seventeen Countries`, build the count.

### Merge

- `The Generator Republic` with `How a Generator Owner Showed Why Lebanon Has No State`.
- Fatima/Mourning/Goddess material, unless explicitly split into personal and structural versions.

### Retire Or Absorb

- `Downtown Without a City`, unless it becomes a short companion note.
- Duplicate or fallback cartel/franchise pieces in `launch-content.md` and `src/lib/content.ts`.

## Pre-Publication Checklist

Every essay packet should answer:

- What is the one sentence claim?
- What Lebanese object or institution carries the argument?
- What scene opens the piece?
- What is the strongest opposing argument?
- Which source claims are fact, interpretation, or extrapolation?
- Which image is evidence, not decoration?
- What should the reader read next?
- Which public metadata is needed: title, dek, excerpt, SEO title, social excerpt, image, caption, credits?
- Does the essay contain banned AI scaffolding?
- Does the ending land on a thing, not a lecture?

## 90-Day Editorial Rhythm

- Week 1: Merge generator essays.
- Week 2: Split Downtown flagship into two publication candidates.
- Week 3: Rebuild Rubble Zone from the war-source archive.
- Week 4: Decide Fatima/Mourning structure.
- Week 5: Build content manifest and status board.
- Week 6: Publish or hold one essay, no new sprawl.
- Weeks 7 to 12: one publishable essay every two weeks, with one archive/source cleanup pass between essays.

## Rule For Future Agents

Do not polish Karim into a magazine voice. The site does not need smoother prose. It needs pressure, sequence, evidence, and a body in the room.

