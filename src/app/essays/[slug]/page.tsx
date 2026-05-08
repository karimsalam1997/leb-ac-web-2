import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import {
  type Citation,
  type EssaySection,
  essays,
  getCanonicalEssaySlug,
  getEssay,
  getRelatedEssays,
} from "@/lib/content";
import {
  type ArticleImageAsset,
  getArticleImage,
  getArticleImages,
} from "@/lib/visual-assets";

export function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const canonicalSlug = getCanonicalEssaySlug(slug);
    const essay = canonicalSlug ? getEssay(canonicalSlug) : undefined;

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
  const canonicalSlug = getCanonicalEssaySlug(slug);

  if (canonicalSlug && canonicalSlug !== slug) {
    permanentRedirect(`/essays/${canonicalSlug}`);
  }

  const essay = canonicalSlug ? getEssay(canonicalSlug) : undefined;

  if (!essay) {
    notFound();
  }

  const related = getRelatedEssays(essay);
  const paragraphs = essay.sections.flatMap((section) => section.paragraphs);
  const leadParagraphs = paragraphs.slice(0, 3);
  const bodySections = getBodySections(essay.sections, leadParagraphs.length);
  const articleImages = getArticleImages(essay.slug);
  const articleImage = articleImages[0]?.src ?? getArticleImage(essay.slug, 0);
  const supportingImages = articleImages.slice(1);
  const isDowntownRepairEssay = essay.slug === "the-city-that-could-not-repair-itself";
  const pullQuote = essay.pullQuote.trim();

  return (
    <SiteShell activePath="/essays">
      <div className="reading-progress" aria-hidden="true">
        <span />
      </div>
      <article className="paper-frame article-page pt-5">
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

            <div className="body-copy mt-7">
              {leadParagraphs.map((paragraph, index) => {
                const note = index === 1 ? essay.notes[0] : undefined;

                return (
                  <Fragment key={`${essay.slug}-lead-${index}`}>
                    <p>
                      {paragraph}
                      {note ? <sup>{note.id}</sup> : null}
                    </p>
                    <InlineFootnote note={note} />
                  </Fragment>
                );
              })}
            </div>

            <figure className="my-6">
              <Link href={articleImage} className="block" aria-label={`Open image for ${essay.title}`}>
                <EditorialImage
                  src={articleImage}
                  alt={`${essay.title} lead image`}
                  className="aspect-[1.72/0.55] border border-[color:var(--paper-border)]"
                  priority
                  sizes="(min-width: 1024px) 56vw, 100vw"
                />
              </Link>
              {isDowntownRepairEssay ? (
                <figcaption className="caption mt-2">
                  Downtown Beirut, photographed by Karim Salam.
                </figcaption>
              ) : null}
            </figure>

            <div className="article-section-mark">
              <Image
                src="/brand/la-witness-glyph.png"
                alt=""
                width={50}
                height={54}
                className="object-contain"
                style={{ width: "50px", height: "54px" }}
              />
            </div>

            <section className="grid gap-8 md:grid-cols-[1fr_0.42fr]">
              <div>
                <div className="article-continuation">
                  {bodySections.map((section, sectionIndex) => (
                    <section key={`${essay.slug}-section-${sectionIndex}`} className="article-body-section">
                      {section.heading ? (
                        <h2 className="editorial-title mb-4 text-[2rem]">
                          {section.heading}
                        </h2>
                      ) : null}
                      <div className="body-copy body-copy-continuation">
                        {section.paragraphs.map((paragraph, paragraphIndex) => {
                          const isLastBodyParagraph =
                            sectionIndex === bodySections.length - 1 &&
                            paragraphIndex === section.paragraphs.length - 1;
                          const note = isLastBodyParagraph ? essay.notes.at(-1) : undefined;

                          return (
                            <Fragment
                              key={`${essay.slug}-body-${sectionIndex}-${paragraphIndex}`}
                            >
                              <p>
                                {paragraph}
                                {note ? <sup>{note.id}</sup> : null}
                              </p>
                              <InlineFootnote note={note} />
                            </Fragment>
                          );
                        })}
                      </div>
                      <ArticleInlineImage
                        asset={supportingImages[sectionIndex]}
                        essayTitle={essay.title}
                      />
                    </section>
                  ))}
                  <div className="article-section-mark article-section-mark-end">
                    <Image
                      src="/brand/la-witness-glyph.png"
                      alt=""
                      width={60}
                      height={60}
                      aria-hidden="true"
                      className="object-contain"
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                </div>
              </div>
              {pullQuote ? (
                <aside className="self-start pt-10 text-right text-[var(--accent)]">
                  <p className="text-[1.35rem] italic leading-[1.35]">
                    {pullQuote}
                  </p>
                </aside>
              ) : null}
            </section>
          </div>

          <aside className="article-notes-aside min-w-0">
            <div className="article-notes">
              <div className="editorial-kicker mb-5 text-[var(--foreground)]">Notes</div>
              <ol className="notes-list">
                {essay.notes.map((note) => (
                  <li key={note.id}>
                    <div className="dense-meta mb-2 text-[var(--accent)]">{note.id}</div>
                    <p className="text-[0.94rem] leading-6 text-[var(--ink-soft)]">
                      {renderNoteText(note.text)}
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

      {essay.notes.length ? (
        <section id="notes" className="paper-frame pt-7 article-full-notes">
          <div className="editorial-rule grid gap-6 md:grid-cols-[0.28fr_1fr]">
            <div>
              <div className="editorial-kicker text-[var(--foreground)]">Full Notes</div>
            </div>
            <ol className="notes-list grid gap-4 md:grid-cols-2">
              {essay.notes.map((note) => (
                <li key={note.id}>
                  <div className="dense-meta mb-2 text-[var(--accent)]">{note.id}</div>
                  <p className="text-[0.94rem] leading-6 text-[var(--ink-soft)]">
                    {renderNoteText(note.text)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

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

function InlineFootnote({ note }: { note?: Citation }) {
  if (!note) {
    return null;
  }

  return (
    <details className="inline-footnote">
      <summary>Note {note.id} ↓</summary>
      <p>{renderNoteText(note.text)}</p>
    </details>
  );
}

function ArticleInlineImage({
  asset,
  essayTitle,
}: {
  asset?: ArticleImageAsset;
  essayTitle: string;
}) {
  if (!asset) {
    return null;
  }

  return (
    <figure className="article-inline-figure">
      <Link href={asset.src} className="block" aria-label={`Open image for ${essayTitle}`}>
        <EditorialImage
          src={asset.src}
          alt={asset.alt}
          className="article-inline-image"
          imagePosition={asset.position}
          quality={92}
          sizes="(min-width: 1180px) 48vw, 100vw"
        />
      </Link>
      {asset.caption ? (
        <figcaption className="caption article-inline-caption">
          {asset.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function getBodySections(sections: EssaySection[], paragraphsToSkip: number) {
  let remainingToSkip = paragraphsToSkip;

  return sections.reduce<EssaySection[]>((visibleSections, section) => {
    if (remainingToSkip >= section.paragraphs.length) {
      remainingToSkip -= section.paragraphs.length;
      return visibleSections;
    }

    const paragraphs = section.paragraphs.slice(remainingToSkip);
    remainingToSkip = 0;

    if (paragraphs.length) {
      visibleSections.push({
        heading: section.heading,
        paragraphs,
      });
    }

    return visibleSections;
  }, []);
}

function renderNoteText(text: string) {
  return text.split(/(https?:\/\/\S+)/g).map((part, index) => {
    if (!part.startsWith("http")) {
      return part;
    }

    return (
      <a key={`${part}-${index}`} href={part} className="underline underline-offset-4">
        {part}
      </a>
    );
  });
}
