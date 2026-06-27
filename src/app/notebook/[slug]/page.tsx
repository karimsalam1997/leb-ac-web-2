import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { getNotebookEntry, notebookEntries } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { getNotebookImage } from "@/lib/visual-assets";

export function generateStaticParams() {
  return notebookEntries.map((entry) => ({ slug: entry.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const entry = getNotebookEntry(slug);

    if (!entry) {
      return { title: "Notebook Entry Not Found / Lebanese Academic" };
    }

    const index = notebookEntries.findIndex((candidate) => candidate.slug === entry.slug);

    return buildPageMetadata({
      title: entry.title,
      description: entry.excerpt,
      path: `/notebook/${entry.slug}`,
      image: getNotebookImage(entry.slug, Math.max(index, 0)),
    });
  });
}

export default async function NotebookEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getNotebookEntry(slug);

  if (!entry) {
    notFound();
  }

  const entryIndex = Math.max(
    notebookEntries.findIndex((candidate) => candidate.slug === entry.slug),
    0,
  );
  const relatedEntries = notebookEntries
    .filter((candidate) => candidate.slug !== entry.slug)
    .slice(0, 3);

  return (
    <SiteShell activePath="/notebook">
      <article className="paper-frame notebook-page pt-5">
        <div className="notebook-page-grid editorial-rule">
          <aside className="notebook-page-side">
            <Link href="/notebook" className="read-link">
              Back to Notebook <span className="link-arrow">-&gt;</span>
            </Link>
            <div className="notebook-page-number">
              <span>Note</span>
              <strong>{String(entryIndex + 1).padStart(2, "0")}</strong>
            </div>
          </aside>

          <div className="notebook-page-main">
            <div className="article-kicker">Notebook</div>
            <h1 className="article-display-title">{entry.title}</h1>
            <p className="article-standfirst">{entry.excerpt}</p>
            <div className="article-byline-block">
              <span className="article-byline-name">Lebanese Academic</span>
              <span className="article-byline-dateline">{entry.date}</span>
            </div>

            <figure className="notebook-page-figure">
              <EditorialImage
                src={getNotebookImage(entry.slug, entryIndex)}
                alt={entry.title}
                className="notebook-page-image"
                sizes="(min-width: 1024px) 54vw, 100vw"
              />
            </figure>

            <div className="body-copy body-copy-continuation notebook-page-body">
              {entry.body.map((paragraph, index) => (
                <p key={`${entry.slug}-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="paper-frame pt-7 pb-10">
        <div className="related-reference-row">
          <div className="editorial-kicker text-[var(--foreground)]">More Notes</div>
          {relatedEntries.map((related, index) => (
            <article key={related.slug} className="grid grid-cols-[92px_1fr] gap-4">
              <Link href={`/notebook/${related.slug}`}>
                <EditorialImage
                  src={getNotebookImage(related.slug, index)}
                  alt={related.title}
                  className="aspect-square border border-[color:var(--paper-border)]"
                  sizes="92px"
                />
              </Link>
              <div>
                <h2 className="editorial-title text-[1.25rem] leading-tight">
                  <Link href={`/notebook/${related.slug}`}>{related.title}</Link>
                </h2>
                <div className="dense-meta mt-2">{related.date}</div>
              </div>
            </article>
          ))}
          <Link href="/essays" className="read-link self-start">
            Read Essays <span className="link-arrow">-&gt;</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
