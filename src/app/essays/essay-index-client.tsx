"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EditorialImage } from "@/components/editorial-image";

const PAGE_SIZE = 12;

type SortMode = "newest" | "oldest" | "readTime";

export type EssayIndexItem = {
  slug: string;
  title: string;
  dek: string;
  byline: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  imageSrc: string;
  sourceIndex: number;
};

export function EssaysIndexClient({ essays }: { essays: EssayIndexItem[] }) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const topics = useMemo(() => getTopicsByFrequency(essays), [essays]);
  const filteredEssays = useMemo(
    () =>
      activeTopic
        ? essays.filter((essay) => essay.tags.includes(activeTopic))
        : essays,
    [activeTopic, essays],
  );

  const featuredEssay = useMemo(
    () => [...filteredEssays].sort(compareNewest)[0],
    [filteredEssays],
  );

  const sortedEssays = useMemo(() => {
    const withoutFeatured = featuredEssay
      ? filteredEssays.filter((essay) => essay.slug !== featuredEssay.slug)
      : filteredEssays;

    return sortEssays(withoutFeatured, sortMode);
  }, [featuredEssay, filteredEssays, sortMode]);

  const visibleEssays = sortedEssays.slice(0, visibleCount);
  const remainingCount = Math.max(sortedEssays.length - visibleEssays.length, 0);

  function handleTopicClick(topic: string) {
    setActiveTopic((currentTopic) => (currentTopic === topic ? null : topic));
    setVisibleCount(PAGE_SIZE);
  }

  function handleSortChange(nextSortMode: SortMode) {
    setSortMode(nextSortMode);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <section className="paper-frame pt-5">
        <header className="essays-index-header">
          <h1 className="display-title essays-index-title">Essays</h1>
          <div className="dense-meta essays-index-count">
            {essays.length} Essays / Issue 01
          </div>
        </header>
      </section>

      <section className="paper-frame essays-filter-frame">
        <div className="essays-filter-bar" aria-label="Essay filters">
          <div className="essay-topic-list" aria-label="Filter by topic">
            {topics.map(({ topic, count }) => {
              const isActive = activeTopic === topic;

              return (
                <button
                  key={topic}
                  type="button"
                  data-active={isActive}
                  aria-pressed={isActive}
                  onClick={() => handleTopicClick(topic)}
                >
                  <span>{topic}</span>
                  <span className="essay-topic-count">{count}</span>
                </button>
              );
            })}
          </div>

          <label className="essay-sort-select">
            <span className="sr-only">Sort essays</span>
            <select
              value={sortMode}
              onChange={(event) => handleSortChange(event.target.value as SortMode)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="readTime">Read Time</option>
            </select>
          </label>
        </div>
      </section>

      {featuredEssay ? (
        <section className="paper-frame">
          <article className="featured-essay-row">
            <Link href={`/essays/${featuredEssay.slug}`} className="block">
              <EditorialImage
                src={featuredEssay.imageSrc}
                alt={featuredEssay.title}
                className="aspect-[1.62/0.54] border border-[color:var(--paper-border)]"
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </Link>
            <div className="min-w-0">
              <div className="editorial-kicker">Featured Essay</div>
              <h2 className="editorial-title mt-3 text-[3rem] leading-[1.03]">
                <Link href={`/essays/${featuredEssay.slug}`}>
                  {featuredEssay.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-lg text-[1.08rem] leading-6 text-[var(--ink-soft)]">
                {featuredEssay.dek}
              </p>
              <div className="mt-9 grid grid-cols-[1fr_auto] items-end gap-4">
                <div className="dense-meta">
                  {featuredEssay.byline} / {featuredEssay.date} /{" "}
                  {featuredEssay.readTime}
                </div>
                <Link href={`/essays/${featuredEssay.slug}`} className="read-link">
                  Read essay <span className="link-arrow">-&gt;</span>
                </Link>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="paper-frame pb-10">
        <div className="essay-index-list" aria-live="polite">
          {visibleEssays.map((essay, index) => (
            <article key={essay.slug} className="essay-index-row">
              <div className="dense-meta essay-index-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <Link href={`/essays/${essay.slug}`} className="essay-index-thumb-link">
                <EditorialImage
                  src={essay.imageSrc}
                  alt={essay.title}
                  className="essay-index-thumb"
                  sizes="100px"
                />
              </Link>
              <div className="essay-index-main">
                <h3 className="editorial-title essay-index-title-link">
                  <Link href={`/essays/${essay.slug}`}>{essay.title}</Link>
                  <span className="dense-meta essay-index-meta">
                    {essay.tags.length ? essay.tags.join(" / ") : "Uncategorized"}
                    <span className="essay-index-byline"> / {essay.byline}</span>
                  </span>
                </h3>
                <p className="essay-index-excerpt">{essay.excerpt}</p>
              </div>
              <div className="dense-meta essay-index-timing">
                <time dateTime={toDateTime(essay.date)}>{essay.date}</time>
                <span>{essay.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        {remainingCount > 0 ? (
          <button
            type="button"
            className="essay-see-more"
            onClick={() => setVisibleCount((currentCount) => currentCount + PAGE_SIZE)}
          >
            See more ({remainingCount} remaining) <span aria-hidden="true">-&gt;</span>
          </button>
        ) : null}
      </section>
    </>
  );
}

function getTopicsByFrequency(essays: EssayIndexItem[]) {
  const topicCounts = new Map<string, number>();

  essays.forEach((essay) => {
    essay.tags.forEach((tag) => {
      topicCounts.set(tag, (topicCounts.get(tag) ?? 0) + 1);
    });
  });

  return [...topicCounts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

function sortEssays(essays: EssayIndexItem[], sortMode: SortMode) {
  return [...essays].sort((a, b) => {
    if (sortMode === "oldest") {
      return compareOldest(a, b);
    }

    if (sortMode === "readTime") {
      return (
        getReadMinutes(a.readTime) - getReadMinutes(b.readTime) ||
        compareNewest(a, b)
      );
    }

    return compareNewest(a, b);
  });
}

function compareNewest(a: EssayIndexItem, b: EssayIndexItem) {
  return getDateValue(b.date) - getDateValue(a.date) || a.sourceIndex - b.sourceIndex;
}

function compareOldest(a: EssayIndexItem, b: EssayIndexItem) {
  return getDateValue(a.date) - getDateValue(b.date) || a.sourceIndex - b.sourceIndex;
}

function getDateValue(date: string) {
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getReadMinutes(readTime: string) {
  const minutes = Number.parseInt(readTime, 10);
  return Number.isNaN(minutes) ? Number.MAX_SAFE_INTEGER : minutes;
}

function toDateTime(date: string) {
  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) {
    return date;
  }

  return new Date(timestamp).toISOString().slice(0, 10);
}
