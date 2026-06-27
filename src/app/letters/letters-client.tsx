"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";

export type LetterOrigin = "From Lebanon" | "From the diaspora";

type LetterFilter = "All" | LetterOrigin | "Recent" | "Old";

export type FilterableLetter = {
  slug: string;
  title: string;
  location: string;
  date: string;
  readTime: string;
  excerpt: string;
  body: string[];
  imageSrc: string;
  origin: LetterOrigin;
  originalIndex: number;
};

const filterOptions: LetterFilter[] = [
  "All",
  "From Lebanon",
  "From the diaspora",
  "Recent",
  "Old",
];

function getLetterTimestamp(date: string) {
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function LettersClient({ letters }: { letters: FilterableLetter[] }) {
  const [activeFilter, setActiveFilter] = useState<LetterFilter>("All");

  const filteredLetters = useMemo(() => {
    const byOriginalOrder = (letter: FilterableLetter) => letter.originalIndex;
    const byNewest = (letter: FilterableLetter) => getLetterTimestamp(letter.date);

    if (activeFilter === "Recent") {
      return [...letters].sort(
        (first, second) =>
          byNewest(second) - byNewest(first) ||
          byOriginalOrder(first) - byOriginalOrder(second),
      );
    }

    if (activeFilter === "Old") {
      return [...letters].sort(
        (first, second) =>
          byNewest(first) - byNewest(second) ||
          byOriginalOrder(first) - byOriginalOrder(second),
      );
    }

    if (activeFilter === "From Lebanon" || activeFilter === "From the diaspora") {
      return letters.filter((letter) => letter.origin === activeFilter);
    }

    return letters;
  }, [activeFilter, letters]);

  const [featured, ...rest] = filteredLetters;

  return (
    <>
      <div className="letters-filter-row" aria-label="Filter letters">
        <div className="dense-meta letters-filter-label">Filter</div>
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            data-active={activeFilter === option}
            onClick={() => setActiveFilter(option)}
          >
            {option}
          </button>
        ))}
        <div className="dense-meta ml-auto">
          {filteredLetters.length} of {letters.length}
        </div>
      </div>

      <div className="letters-layout">
        <div className="letters-main">
          {featured ? (
            <article id={featured.slug} className="letters-featured-card">
              <div className="letters-featured-copy">
                <div className="editorial-kicker">Featured</div>
                <div className="dense-meta mt-5">
                  {featured.date} / {featured.location}
                </div>
                <h2 className="editorial-title mt-4 text-[2rem] leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-sm text-[1.15rem] leading-7">
                  {featured.excerpt}
                </p>
                <div className="letter-body">
                  {featured.body.map((paragraph, index) => (
                    <p key={`${featured.slug}-body-${index}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="dense-meta mt-7">{featured.readTime}</div>
              </div>
              <Link href={`/letters/${featured.slug}`}>
                <EditorialImage
                  src={featured.imageSrc}
                  alt={featured.title}
                  className="letters-featured-image min-h-[250px]"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </Link>
            </article>
          ) : (
            <div className="letters-empty-state">
              <div className="editorial-title text-[1.6rem]">No letters yet</div>
              <p className="mt-2 text-[1.05rem] leading-6 text-[var(--ink-soft)]">
                This filter is waiting for its first dispatch.
              </p>
            </div>
          )}

          <div className="mt-6">
            {rest.map((letter) => (
              <article key={letter.slug} id={letter.slug} className="letter-list-row">
                <Link href={`/letters/${letter.slug}`}>
                  <EditorialImage
                    src={letter.imageSrc}
                    alt={letter.title}
                    className="aspect-[1.55/1] border border-[color:var(--paper-border)]"
                    sizes="160px"
                  />
                </Link>
                <div>
                  <div className="dense-meta">{letter.date} / {letter.location}</div>
                  <h3 className="editorial-title mt-1 text-[1.55rem] leading-tight">
                    {letter.title}
                  </h3>
                  <p className="mt-1 text-[1rem] leading-5 text-[var(--ink-soft)]">
                    {letter.excerpt}
                  </p>
                  <div className="letter-body">
                    {letter.body.map((paragraph, paragraphIndex) => (
                      <p key={`${letter.slug}-body-${paragraphIndex}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="dense-meta text-right">{letter.readTime}</div>
                <Link
                  href={`/letters/${letter.slug}`}
                  className="read-link !text-[1rem]"
                  aria-label={`Read ${letter.title}`}
                >
                  Read <span className="link-arrow">-&gt;</span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="letters-sidebar">
          <div className="airmail-box letters-submit-card">
            <div className="flex items-start gap-3">
              <Mail size={25} strokeWidth={1.3} className="text-[var(--accent)]" />
              <div>
                <h2 className="editorial-title text-[1.55rem] text-[var(--accent)]">
                  Write us a letter
                </h2>
                <p className="mt-2 text-[1rem] leading-5">
                  Up to 800 words. Tell us where you wrote it from, and what
                  you saw that the news didn&apos;t.
                </p>
              </div>
            </div>
            <Link href="/submit" className="read-link mt-4">
              Open the submission form <span className="link-arrow">-&gt;</span>
            </Link>
          </div>

          <div className="letters-newsletter-card airmail-box">
            <div className="editorial-kicker">The weekly dispatch</div>
            <p className="mt-3 text-[1rem] leading-6">
              One email on Sundays — the new essay, the new letter, and a
              paragraph on why. No promotions, no algorithm.
            </p>
            <form
              className="letters-subscribe-form mt-4"
              aria-label="Subscribe to letters"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="sr-only" htmlFor="letters-email">
                Email address
              </label>
              <input
                id="letters-email"
                name="email"
                type="email"
                placeholder="Email address"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <blockquote className="letters-testimonial">
            <p>
              A letter is the unit of writing that survives the news cycle.
              Short enough to read in one breath. Specific enough to remember.
            </p>
          </blockquote>
        </aside>
      </div>
    </>
  );
}
