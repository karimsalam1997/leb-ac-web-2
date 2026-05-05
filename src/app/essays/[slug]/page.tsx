import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Printer, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { essays, getEssay, getRelatedEssays } from "@/lib/content";
import { arabicCopy, getArticleImage } from "@/lib/visual-assets";

export function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const essay = getEssay(slug);

    if (!essay) {
      return { title: "Essay Not Found / Lebanese Academic" };
    }

    return {
      title: `${essay.title} / Lebanese Academic`,
      description: essay.dek,
    };
  });
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssay(slug);

  if (!essay) {
    notFound();
  }

  const related = getRelatedEssays(essay);
  const paragraphs = essay.sections.flatMap((section) => section.paragraphs);
  const leadParagraphs = paragraphs.slice(0, 3);
  const remainingParagraphs = paragraphs.slice(3);

  return (
    <SiteShell activePath="/essays">
      <article className="paper-frame pt-5">
        <div className="article-reference-grid editorial-rule">
          <div className="min-w-0">
            <div className="dense-meta mb-4">
              {essay.category} / {essay.date} / {essay.readTime}
            </div>
            <h1 className="display-title max-w-4xl text-[4.15rem] leading-[0.95] md:text-[5.05rem]">
              {essay.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[1.35rem] leading-[1.38] text-[var(--ink-soft)] md:text-[1.55rem]">
              {essay.dek}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[color:var(--paper-border)]">
                <Image
                  src="/brand/la-editors-mark.png"
                  alt={essay.byline}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="text-xl">{essay.byline}</div>
            </div>

            <div className="article-toolbar mt-3">
              <button type="button">
                <Share2 size={17} strokeWidth={1.4} /> Share
              </button>
              <button type="button">
                <Bookmark size={17} strokeWidth={1.4} /> Save
              </button>
              <button type="button">
                <Printer size={17} strokeWidth={1.4} /> Print
              </button>
            </div>

            <div className="body-copy mt-7">
              {leadParagraphs.map((paragraph, index) => (
                <p key={`${essay.slug}-lead-${index}`}>
                  {paragraph}
                  {index === 1 && essay.notes[0] ? <sup>{essay.notes[0].id}</sup> : null}
                </p>
              ))}
            </div>

            <figure className="my-6">
              <EditorialImage
                src={getArticleImage(essay.slug, 0)}
                alt={`${essay.title} lead image`}
                className="aspect-[1.72/0.55] border border-[color:var(--paper-border)]"
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
              <figcaption className="caption mt-2">
                The Beirut coast, where private profit meets public loss. Photograph
                treatment: Lebanese Academic archive.
              </figcaption>
            </figure>

            <div className="article-section-mark">
              <Image
                src="/brand/la-witness-glyph.png"
                alt=""
                width={50}
                height={54}
                className="object-contain"
                style={{ width: 50, height: "auto" }}
              />
            </div>

            <section className="grid gap-8 md:grid-cols-[1fr_0.42fr]">
              <div>
                <h2 className="editorial-title mb-4 text-[2rem]">I. Scarcity as a System</h2>
                <div className="body-copy">
                  {remainingParagraphs.slice(0, 8).map((paragraph, index) => (
                    <p key={`${essay.slug}-body-${index}`}>
                      {paragraph}
                      {index === 5 && essay.notes.at(-1) ? (
                        <sup>{essay.notes.at(-1)?.id}</sup>
                      ) : null}
                    </p>
                  ))}
                </div>
              </div>
              <aside className="self-start pt-10 text-right text-[var(--accent)]">
                <p className="arabic text-[1.8rem] leading-[1.25]">{arabicCopy.articleRight}</p>
                <div className="ml-auto my-4 h-px w-24 bg-[var(--accent)]" />
                <p className="text-[1.35rem] italic leading-[1.35]">
                  We are not living a crisis.
                  <br />
                  We are living a consequence.
                </p>
              </aside>
            </section>
          </div>

          <aside className="hidden min-w-0 md:block">
            <div className="article-notes">
              <div className="editorial-kicker mb-5 text-[var(--foreground)]">Notes</div>
              <ol className="notes-list">
                {essay.notes.slice(0, 6).map((note) => (
                  <li key={note.id}>
                    <div className="dense-meta mb-2 text-[var(--accent)]">{note.id}</div>
                    <p className="text-[0.94rem] leading-6 text-[var(--ink-soft)]">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ol>
              <Link href="#notes" className="read-link mt-4 !text-[1rem]">
                See full notes <span className="link-arrow">-&gt;</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="paper-frame pt-7">
        <div className="related-reference-row">
          <div className="editorial-kicker text-[var(--foreground)]">Related Essays</div>
          {related.slice(0, 3).map((relatedEssay, index) => (
              <article key={relatedEssay.slug} className="grid grid-cols-[92px_1fr] gap-4">
                <Link href={`/essays/${relatedEssay.slug}`}>
                <EditorialImage
                  src={getArticleImage(relatedEssay.slug, index + 1)}
                  alt={relatedEssay.title}
                  className="aspect-square border border-[color:var(--paper-border)]"
                  sizes="92px"
                />
                </Link>
                <div>
                  <h3 className="editorial-title text-[1.25rem] leading-tight">
                    <Link href={`/essays/${relatedEssay.slug}`}>{relatedEssay.title}</Link>
                  </h3>
                  <div className="dense-meta mt-2">
                    {relatedEssay.date}
                    <br />
                    {relatedEssay.readTime}
                  </div>
                </div>
              </article>
            ))}
          <div>
            <p className="text-[1rem] leading-5 text-[var(--ink-soft)]">
              Join the conversation. Share a perspective. Challenge an idea.
            </p>
            <Link href="/submit" className="mt-4 inline-flex border border-[color:var(--accent)] px-5 py-3 text-[var(--accent)]">
              Respond with a letter <span className="link-arrow ml-3">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
