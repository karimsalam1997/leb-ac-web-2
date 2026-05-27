# Issue 01 Snapshot Before Cycle 01 Packaging Pass

Run time: 2026-05-27 17:53 EEST

Reason for snapshot: Cycle 01 changes issue-facing copy and the essays index presentation. This preserves the previous Issue 01 surface before the change.

## Current Issue Structure

Source of truth: `longform-essays.md`

1. The City That Could Not Repair Itself, May 8, 2026, 30 min read
   Dek: Downtown Beirut was not simply rebuilt badly after the war. It was rebuilt in a way that made later crises harder to absorb: vacancy became rational, repair became optional, ownership became distant, and the symbolic center of the capital lost the ordinary citizens who make cities heal.
2. The Cartel in the Costume of a Country, May 5, 2026, 8 min read
   Dek: The argument over Hezbollah and sovereignty keeps pointing away from the bargain that makes every faction richer when the state stays weak.
3. How a Generator Owner Showed Why Lebanon Has No State, May 5, 2026, 10 min read
   Dek: A generator dispute in West Beirut became a small national X-ray: the state arrived late, the neighborhood read it sectarianly, and everyone could see how public failure turns into private power.
4. The Census That Cannot Be Taken, May 5, 2026, 8 min read
   Dek: The country's last official count is older than its living politics, and every serious reform crashes into the same forbidden question: who gets counted?
5. Sovereignty Theatre, May 5, 2026, 8 min read
   Dek: Every patron praises Lebanese sovereignty at the exact volume that keeps Lebanon useful.
6. The Rubble Zone, May 5, 2026, 8 min read
   Dek: Israel's old security-zone logic has returned to the south, promising calm through distance while producing the grievance Hezbollah knows how to use.
7. The Seventeen Countries, May 5, 2026, 7 min read
   Dek: Lebanon's scale should make government intimate; its borders within borders make public life feel like a series of counters, permissions, and local vetoes.
8. The Land That Mourns in One Language, May 5, 2026, 7 min read
   Dek: A wartime cry to Fatima opens a deeper Lebanese pattern: the religions change, but the need for a sacred feminine intercessor keeps returning under new names.
9. Downtown Without a City, May 5, 2026, 7 min read
   Dek: Beirut's postwar center solved the problem of visible ruin while leaving ordinary citizens outside the place built in their name.
10. The Park That Remembers, May 8, 2026, 14 min read
    Dek: Why we redesigned Beirut's last great public site as a national monument, not a generic green space

## Current Homepage Issue Copy

Mission strip:

> Lebanese Academic is an independent platform for long-form writing on Lebanon, power, memory, and identity - against the idea that collapse is natural.

Archive section:

> A compact first register, built for return.

> The archive is intentionally spare for now: eight launch essays, ordered like a first issue rather than an endless feed.

Homepage ledger:

> Issue 01
> 10 essays
> 2 letters
> 3 notebook notes

## Current Essays Index Copy

Header:

> Essays

Count:

> 10 Essays / Issue 01

Filter surface:

Topic buttons and a sort select only. No issue deck, issue route, thematic spine, or table-of-contents framing.

## Current Cover Logic

- `src/app/page.tsx` uses `essays[0]` as the homepage lead story.
- `src/app/essays/page.tsx` passes all essays to `EssaysIndexClient`.
- `src/app/essays/essay-index-client.tsx` chooses the newest filtered essay as the featured row.
- Article images come from `src/lib/visual-assets.ts`, usually `getArticleImage(essay.slug, 0)`.
