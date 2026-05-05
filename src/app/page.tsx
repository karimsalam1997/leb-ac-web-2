import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { essays, letters, notebookEntries } from "@/lib/content";
import { arabicCopy, getArticleImage, getLetterImage, homeAssets } from "@/lib/visual-assets";

const heroEssay = essays[0];
const essayDeck =
  "Long-form writing on Lebanon, memory, power, and identity — against the idea that collapse is natural.";

const displayTitleLinesBySlug: Record<string, string[]> = {
  "the-cartel-in-the-costume-of-a-country": [
    "The Cartel",
    "in the",
    "Costume",
    "of a",
    "Country",
  ],
  "cartel-in-the-costume-of-a-country": [
    "The Cartel",
    "in the",
    "Costume",
    "of a",
    "Country",
  ],
};

const numberWords: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
  13: "Thirteen",
  14: "Fourteen",
  15: "Fifteen",
  16: "Sixteen",
  17: "Seventeen",
  18: "Eighteen",
  19: "Nineteen",
  20: "Twenty",
};

function editorialTitleLines(title: string) {
  const words = title.split(" ");
  const lineLength = Math.ceil(words.length / 3);

  return [
    words.slice(0, lineLength).join(" "),
    words.slice(lineLength, lineLength * 2).join(" "),
    words.slice(lineLength * 2).join(" "),
  ].filter(Boolean);
}

export default function Home() {
  const heroTitleLines =
    displayTitleLinesBySlug[heroEssay.slug] ?? editorialTitleLines(heroEssay.title);
  const primaryEssay = essays[1] ?? heroEssay;
  const supportingEssays = essays
    .filter((essay) => essay.slug !== heroEssay.slug && essay.slug !== primaryEssay.slug)
    .slice(0, 2);
  const recentLetters = letters.slice(0, 2);
  const leadNotebook = notebookEntries[0];
  const editionEssays = essays;
  const editionEssayCount = editionEssays.length;
  const editionTitle = `${numberWords[editionEssayCount] ?? editionEssayCount} ${
    editionEssayCount === 1 ? "Essay" : "Essays"
  }`;

  return (
    <SiteShell activePath="/">
      <section className="paper-frame front-page">
        <div className="front-grid">
          <article className="front-lead">
            <div className="editorial-kicker">Featured Essay</div>
            <h1 className="display-title front-lead-title">
              <Link href={`/essays/${heroEssay.slug}`}>
                {heroTitleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </Link>
            </h1>
            <p className="front-lead-dek">{heroEssay.dek}</p>

            <div className="front-byline">
              <Image
                src="/brand/la-editors-mark.png"
                alt={heroEssay.byline}
                width={44}
                height={44}
              />
              <div>
                <div>{heroEssay.byline}</div>
                <div className="dense-meta">
                  {heroEssay.date} · {heroEssay.readTime}
                </div>
              </div>
            </div>
            <Link href={`/essays/${heroEssay.slug}`} className="read-link">
              Read essay <span className="link-arrow">→</span>
            </Link>
          </article>

          <Link href={`/essays/${heroEssay.slug}`} className="front-hero-image">
            <EditorialImage
              src={homeAssets.hero.src}
              alt={heroEssay.title}
              className="front-hero-art"
              imagePosition={homeAssets.hero.position}
              priority
              quality={92}
              sizes="(min-width: 1280px) 43vw, (min-width: 1024px) 48vw, 100vw"
            />
          </Link>

          <Link
            href={`/essays/${heroEssay.slug}`}
            className="front-poster"
            aria-label={`${arabicCopy.homeQuote} ${arabicCopy.homeSubquote}`}
          >
            <Image
              src={homeAssets.poster}
              alt=""
              fill
              priority
              quality={95}
              sizes="(min-width: 1024px) 23vw, 100vw"
              className="front-poster-image"
            />
            <span className="visually-hidden">
              {arabicCopy.homeQuote} {arabicCopy.homeSubquote}
            </span>
          </Link>
        </div>

        <div className="pattern-rule" aria-hidden="true" />
        <div className="front-manifesto">{essayDeck}</div>
      </section>

      <section className="paper-frame essay-priority-section">
        <div className="essay-priority-grid">
          <article className="essay-priority-feature">
            <DepartmentHeading title="Essays" arabic="مقالات" href="/essays" />
            <Link href={`/essays/${primaryEssay.slug}`}>
              <EditorialImage
                src={homeAssets.departments.essays.src}
                alt={primaryEssay.title}
                className="essay-priority-image"
                imagePosition={homeAssets.departments.essays.position}
                quality={92}
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Link>
            <h2>
              <Link href={`/essays/${primaryEssay.slug}`}>{primaryEssay.title}</Link>
            </h2>
            <p>{primaryEssay.dek}</p>
            <div className="dense-meta">
              {primaryEssay.date} · {primaryEssay.readTime}
            </div>
            <Link href={`/essays/${primaryEssay.slug}`} className="read-link">
              Read essay <span className="link-arrow">→</span>
            </Link>
          </article>

          <div className="essay-priority-list">
            {supportingEssays.map((essay, index) => {
              const essayAsset = homeAssets.edition[(index + 2) % homeAssets.edition.length];

              return (
                <Link
                  key={essay.slug}
                  href={`/essays/${essay.slug}`}
                  className="essay-priority-row"
                >
                  <EditorialImage
                    src={getArticleImage(essay.slug, index + 2)}
                    alt={essay.title}
                    className="essay-priority-thumb"
                    imagePosition={essayAsset.position}
                    quality={90}
                    sizes="(min-width: 1024px) 14vw, 92vw"
                  />
                  <span>
                    <small>
                      {String(index + 2).padStart(2, "0")} · Essay
                    </small>
                    <strong>{essay.title}</strong>
                    <em>{essay.dek}</em>
                  </span>
                </Link>
              );
            })}
            <Link href="/essays" className="essay-priority-index">
              See the essay index <span className="link-arrow">→</span>
            </Link>
          </div>

          <aside className="home-support-rail">
            <section className="home-support-card letter-stack">
              <DepartmentHeading title="Letters" arabic="رسائل" href="/letters" />
              <div className="letter-stack-list">
                {recentLetters.map((letter, index) => (
                  <Link
                    key={letter.slug}
                    href={`/letters#${letter.slug}`}
                    className="mini-row"
                  >
                    <EditorialImage
                      src={getLetterImage(letter.slug, index)}
                      alt={letter.title}
                      className="mini-row-image"
                      imagePosition="center 54%"
                      quality={90}
                      sizes="92px"
                    />
                    <span>
                      <strong>{letter.title}</strong>
                      <small>{letter.date} · {letter.readTime}</small>
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/letters" className="read-link">
                All letters <span className="link-arrow">→</span>
              </Link>
            </section>

            <section className="home-support-card notebook-preview">
              <DepartmentHeading title="Notebook" arabic="دفتر الملاحظات" href="/notebook" />
              <Link href={`/notebook#${leadNotebook?.slug ?? ""}`}>
                <EditorialImage
                  src={homeAssets.departments.notebook.src}
                  alt={leadNotebook?.title ?? "Notebook"}
                  className="notebook-front-image"
                  imagePosition={homeAssets.departments.notebook.position}
                  quality={92}
                  sizes="(min-width: 1024px) 20vw, 100vw"
                />
              </Link>
              <h2>{leadNotebook?.title ?? "Notebook"}</h2>
              <p>{leadNotebook?.excerpt ?? "Notes from the margins of memory, public life, and power."}</p>
              <Link href="/notebook" className="read-link">
                Open notebook <span className="link-arrow">→</span>
              </Link>
            </section>
          </aside>
        </div>
      </section>

      <section className="paper-frame subscribe-strip">
        <div className="letters-banner">
          <Mail size={21} strokeWidth={1.5} />
          <span>Letters from Beirut</span>
        </div>
        <p>Dispatches from a city that refuses to be a footnote.</p>
        <form className="subscribe-input" action="/submit">
          <label className="visually-hidden" htmlFor="home-email">
            Email address
          </label>
          <input
            id="home-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            suppressHydrationWarning
          />
          <button type="submit">Subscribe</button>
        </form>
        <Link href="/submit" className="read-link">
          Submit a letter <span className="link-arrow">→</span>
        </Link>
      </section>

      <section id="archive" className="paper-frame edition-register">
        <div className="edition-register-head">
          <div>
            <div className="editorial-kicker">Current Edition</div>
            <h2 className="editorial-title">{editionTitle}</h2>
          </div>
          <p>
            A tighter launch edition built for deeper reading, not feed behavior.
          </p>
          <Link href="/essays" className="read-link">
            Full index <span className="link-arrow">→</span>
          </Link>
        </div>

        <div
          className="edition-register-grid"
          data-count={editionEssays.length}
          data-layout={editionEssays.length > 6 ? "wide" : "compact"}
        >
          {editionEssays.map((essay, index) => {
            const editionAsset = homeAssets.edition[index % homeAssets.edition.length];

            return (
              <Link
                key={essay.slug}
                href={`/essays/${essay.slug}`}
                className="edition-register-row"
              >
                <span className="edition-register-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <EditorialImage
                  src={getArticleImage(essay.slug, index)}
                  alt={essay.title}
                  className="edition-register-image"
                  imagePosition={editionAsset.position}
                  quality={90}
                  sizes="96px"
                />
                <span className="edition-register-copy">
                  <strong>{essay.title}</strong>
                  <small>{essay.date} · {essay.readTime}</small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}

function DepartmentHeading({
  title,
  arabic,
  href,
}: {
  title: string;
  arabic: string;
  href: string;
}) {
  return (
    <div className="department-heading">
      <Link href={href}>{title}</Link>
      <span className="arabic">{arabic}</span>
      <Link href={href} aria-label={`Open ${title}`}>→</Link>
    </div>
  );
}
