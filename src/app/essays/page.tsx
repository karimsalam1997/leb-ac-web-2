import Link from "next/link";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { essays } from "@/lib/content";
import { arabicCopy, getArticleImage } from "@/lib/visual-assets";

const topics = ["All", "Memory", "War", "City", "Identity", "Economy", "Power", "Diaspora", "Culture"];

export default function EssaysPage() {
  const [featured, ...rest] = essays;

  return (
    <SiteShell activePath="/essays">
      <section className="paper-frame pt-5">
        <div className="essays-hero editorial-rule">
          <div>
            <h1 className="display-title text-[5.1rem] leading-[0.9]">Essays</h1>
            <div className="orange-rule mt-3" />
            <p className="mt-5 max-w-lg text-[1.38rem] leading-[1.45] text-[var(--foreground)]">
              Long-form arguments, reflections, and essays on Lebanon, memory, power,
              and identity.
            </p>
          </div>
          <div className="text-right">
            <h2 className="arabic text-[4.3rem] leading-none text-[var(--accent)]">
              {arabicCopy.essaysTitle}
            </h2>
            <p className="arabic mt-4 text-[1.55rem] leading-[1.45] text-[var(--foreground)]">
              {arabicCopy.essaysSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="paper-frame">
        <div className="topics-bar">
          <div className="editorial-kicker text-[var(--foreground)]">Explore Topics</div>
          <div className="topic-list">
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                data-active={topic === "All"}
                aria-pressed={topic === "All"}
              >
                {topic}
              </button>
            ))}
          </div>
          <span className="dense-meta">Sort by</span>
          <span className="dense-meta text-[var(--foreground)]">Newest</span>
        </div>
      </section>

      <section className="paper-frame">
        <article className="featured-essay-row">
          <Link href={`/essays/${featured.slug}`} className="block">
            <EditorialImage
              src={getArticleImage(featured.slug, 0)}
              alt={featured.title}
              className="aspect-[1.62/0.54] border border-[color:var(--paper-border)]"
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </Link>
          <div className="min-w-0">
            <div className="editorial-kicker">Featured Essay</div>
            <h2 className="editorial-title mt-3 text-[3rem] leading-[1.03]">
              <Link href={`/essays/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="mt-4 max-w-lg text-[1.08rem] leading-6 text-[var(--ink-soft)]">
              {featured.dek}
            </p>
            <div className="mt-9 grid grid-cols-[1fr_auto] items-end gap-4">
              <div className="dense-meta">
                {featured.byline} / {featured.date} / {featured.readTime}
              </div>
              <Link href={`/essays/${featured.slug}`} className="read-link">
                Read essay <span className="link-arrow">-&gt;</span>
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="paper-frame pb-10">
        <div>
          {rest.map((essay, index) => (
            <article key={essay.slug} className="essay-index-row">
              <div className="dense-meta text-[var(--accent)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <Link href={`/essays/${essay.slug}`} className="essay-index-thumb-link">
                <EditorialImage
                  src={getArticleImage(essay.slug, index + 1)}
                  alt={essay.title}
                  className="essay-index-thumb"
                  sizes="112px"
                />
              </Link>
              <h3 className="editorial-title text-[1.48rem] leading-tight">
                <Link href={`/essays/${essay.slug}`}>{essay.title}</Link>
              </h3>
              <p className="text-[0.95rem] leading-5 text-[var(--ink-soft)]">{essay.excerpt}</p>
              <div className="dense-meta">{essay.byline.replace("Karim Salam", "K. S.")}</div>
              <div className="dense-meta">{essay.date}</div>
              <div className="dense-meta">{essay.tags.slice(0, 2).join(" / ") || "Memory"}</div>
              <Link href={`/essays/${essay.slug}`} className="read-link justify-end !text-[1.02rem]">
                Read essay <span className="link-arrow">-&gt;</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
