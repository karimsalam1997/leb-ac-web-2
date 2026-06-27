import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { getLetter, letters } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { getLetterImage } from "@/lib/visual-assets";

export function generateStaticParams() {
  return letters.map((letter) => ({ slug: letter.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const letter = getLetter(slug);

    if (!letter) {
      return { title: "Letter Not Found / Lebanese Academic" };
    }

    const index = letters.findIndex((candidate) => candidate.slug === letter.slug);

    return buildPageMetadata({
      title: letter.title,
      description: letter.excerpt,
      path: `/letters/${letter.slug}`,
      image: getLetterImage(letter.slug, Math.max(index, 0)),
    });
  });
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const letter = getLetter(slug);

  if (!letter) {
    notFound();
  }

  const letterIndex = Math.max(
    letters.findIndex((candidate) => candidate.slug === letter.slug),
    0,
  );
  const relatedLetters = letters
    .filter((candidate) => candidate.slug !== letter.slug)
    .slice(0, 3);

  return (
    <SiteShell activePath="/letters">
      <article className="paper-frame letter-page pt-5">
        <div className="letter-page-grid editorial-rule">
          <aside className="letter-page-side">
            <Link href="/letters" className="read-link">
              Back to Letters <span className="link-arrow">-&gt;</span>
            </Link>
            <div className="letter-page-stamp">
              <span>Letter</span>
              <strong>{String(letterIndex + 1).padStart(2, "0")}</strong>
            </div>
          </aside>

          <div className="letter-page-main">
            <div className="article-kicker">Letter</div>
            <h1 className="article-display-title">{letter.title}</h1>
            <p className="article-standfirst">{letter.excerpt}</p>
            <div className="article-byline-block">
              <span className="article-byline-name">{letter.location}</span>
              <span className="article-byline-dateline">
                {letter.date} · {letter.readTime}
              </span>
            </div>

            <div className="body-copy body-copy-continuation letter-page-body">
              {letter.body.map((paragraph, index) => (
                <p key={`${letter.slug}-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="letter-page-image-column">
            <EditorialImage
              src={getLetterImage(letter.slug, letterIndex)}
              alt={letter.title}
              className="letter-page-image"
              sizes="(min-width: 1180px) 18rem, 100vw"
            />
          </aside>
        </div>
      </article>

      <section className="paper-frame pt-7 pb-10">
        <div className="related-reference-row">
          <div className="editorial-kicker text-[var(--foreground)]">More Letters</div>
          {relatedLetters.map((related, index) => (
            <article key={related.slug} className="grid grid-cols-[92px_1fr] gap-4">
              <Link href={`/letters/${related.slug}`}>
                <EditorialImage
                  src={getLetterImage(related.slug, index)}
                  alt={related.title}
                  className="aspect-square border border-[color:var(--paper-border)]"
                  sizes="92px"
                />
              </Link>
              <div>
                <h2 className="editorial-title text-[1.25rem] leading-tight">
                  <Link href={`/letters/${related.slug}`}>{related.title}</Link>
                </h2>
                <div className="dense-meta mt-2">
                  {related.location}
                  <br />
                  {related.date}
                </div>
              </div>
            </article>
          ))}
          <Link href="/submit" className="read-link self-start">
            Write a letter <span className="link-arrow">-&gt;</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
