import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { essays } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { getArticleImage } from "@/lib/visual-assets";

export const metadata: Metadata = buildPageMetadata({
  title: "Topics",
  description:
    "A map of Lebanese Academic themes: political economy, sectarianism, memory, sovereignty, diaspora, and state failure.",
  path: "/topics",
  image: getArticleImage(essays[0]?.slug ?? "", 0),
});

function topicCounts() {
  const counts = new Map<string, number>();

  for (const essay of essays) {
    for (const tag of essay.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((first, second) => second.count - first.count || first.topic.localeCompare(second.topic));
}

export default function TopicsPage() {
  const topics = topicCounts();

  return (
    <SiteShell activePath="/topics">
      <section className="paper-frame topics-page pt-5">
        <div className="topics-page-hero editorial-rule">
          <div>
            <div className="article-kicker">Topics</div>
            <h1 className="display-title text-[4.85rem] leading-none">By Topic</h1>
            <p className="mt-3 max-w-2xl text-[1.25rem] leading-7 text-[var(--ink-soft)]">
              The same country, entered through different doors: power,
              memory, sect, war, repair, exile, and the state that keeps
              appearing by failing.
            </p>
          </div>
          <div className="topics-page-count">
            <span>{topics.length}</span>
            <strong>live topics</strong>
          </div>
        </div>

        <div className="topics-page-grid">
          {topics.map(({ topic, count }, index) => {
            const matchingEssays = essays.filter((essay) => essay.tags.includes(topic));

            return (
              <section key={topic} className="topic-cluster">
                <div className="topic-cluster-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{topic}</h2>
                  <strong>{count}</strong>
                </div>
                <div className="topic-cluster-essays">
                  {matchingEssays.map((essay) => (
                    <Link key={essay.slug} href={`/essays/${essay.slug}`}>
                      <span>{essay.title}</span>
                      <small>{essay.readTime}</small>
                    </Link>
                  ))}
                </div>
                <Link
                  href={{ pathname: "/essays", query: { topic } }}
                  className="read-link mt-4 !text-[1rem]"
                >
                  Open filtered register <span className="link-arrow">-&gt;</span>
                </Link>
              </section>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
