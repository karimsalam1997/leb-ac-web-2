import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { essays, letters, notebookEntries } from "@/lib/content";
import { getArticleImage, visualAssets } from "@/lib/visual-assets";

const heroEssay = essays[0];
const essayDeck =
  "Long-form writing on Lebanon, memory, power, and identity — against the idea that collapse is natural.";

export default function Home() {
  const leadEssays = essays.slice(1, 5);
  const ledgerEssays = essays;
  const recentLetters = letters.slice(0, 4);
  const recentNotebook = notebookEntries.slice(0, 3);

  return (
    <SiteShell activePath="/">
      <section className="paper-frame">
        <div className="front-grid">
          <article className="front-lead">
            <div className="editorial-kicker">Featured Essay</div>
            <h1 className="display-title front-lead-title">
              <Link href={`/essays/${heroEssay.slug}`}>
                {heroEssay.title.split(" ").map((word, index) => (
                  <span key={`${word}-${index}`}>{word}</span>
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
            <Link href={`/essays/${heroEssay.slug}`} className="read-link mt-4">
              Read essay <span className="link-arrow">→</span>
            </Link>
          </article>

          <Link href={`/essays/${heroEssay.slug}`} className="front-hero-image">
            <EditorialImage
              src={getArticleImage(heroEssay.slug, 0)}
              alt={heroEssay.title}
              className="h-full min-h-[310px]"
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </Link>

          <Link href={`/essays/${heroEssay.slug}`} className="front-poster">
            <p className="arabic">لم يكن هذا الانهيار صدفة، بل من تصميم وتخطيط ومصلحة.</p>
            <span />
            <strong>It was not inevitable. It was built.</strong>
          </Link>
        </div>

        <div className="pattern-rule" />
        <div className="front-manifesto">{essayDeck}</div>
      </section>

      <section className="paper-frame">
        <div className="department-grid">
          <DepartmentCard
            title="Essays"
            arabic="مقالات"
            href="/essays"
            imageHref={`/essays/${leadEssays[0]?.slug ?? heroEssay.slug}`}
            image={getArticleImage(leadEssays[0]?.slug ?? heroEssay.slug, 1)}
            heading={leadEssays[0]?.title ?? heroEssay.title}
            copy={leadEssays[0]?.dek ?? heroEssay.dek}
            meta={leadEssays[0] ? `${leadEssays[0].date} · ${leadEssays[0].readTime}` : heroEssay.date}
          />

          <section className="department-card letter-stack">
            <div className="department-heading">
              <Link href="/letters">Letters</Link>
              <span className="arabic">رسائل</span>
              <Link href="/letters" aria-label="View letters">→</Link>
            </div>
            <div className="letter-stack-list">
              {recentLetters.map((letter, index) => (
                <Link
                  key={letter.slug}
                  href={`/letters#${letter.slug}`}
                  className="mini-row"
                >
                  <EditorialImage
                    src={index % 2 === 0 ? visualAssets.letterpress : visualAssets.manuscript}
                    alt={letter.title}
                    className="mini-row-image"
                    sizes="92px"
                  />
                  <span>
                    <strong>{letter.title}</strong>
                    <small>{letter.date} · {letter.readTime}</small>
                  </span>
                </Link>
              ))}
            </div>
            <Link href="/letters" className="read-link mt-3 !text-[1rem]">
              View all letters <span className="link-arrow">→</span>
            </Link>
          </section>

          <section className="department-card notebook-preview">
            <div className="department-heading">
              <Link href="/notebook">Notebook</Link>
              <span className="arabic">دفتر الملاحظات</span>
              <Link href="/notebook" aria-label="Open notebook">→</Link>
            </div>
            <Link href={`/notebook#${recentNotebook[0]?.slug ?? ""}`}>
              <EditorialImage
                src={visualAssets.notebookSpread}
                alt={recentNotebook[0]?.title ?? "Notebook"}
                className="notebook-front-image"
                sizes="(min-width: 1024px) 24vw, 100vw"
              />
            </Link>
            <h2>{recentNotebook[0]?.title}</h2>
            <p>{recentNotebook[0]?.excerpt}</p>
            <Link href="/notebook" className="read-link mt-3 !text-[1rem]">
              Open notebook <span className="link-arrow">→</span>
            </Link>
          </section>

          <DepartmentCard
            title="Archive"
            arabic="الأرشيف"
            href="/essays"
            imageHref={`/essays/${leadEssays[1]?.slug ?? heroEssay.slug}`}
            image={visualAssets.archive}
            heading={leadEssays[1]?.title ?? "Beirut, April 1975"}
            copy={leadEssays[1]?.excerpt ?? "Notes from the archive of collapse, repair, memory, and power."}
            meta="Beirut · Levant · Diaspora"
            accent="teal"
          />
        </div>
      </section>

      <section id="archive" className="paper-frame">
        <div className="ledger-header">
          <div>
            <div className="editorial-kicker">Complete Essay Ledger</div>
            <h2 className="editorial-title">All essays</h2>
          </div>
          <Link href="/essays" className="read-link !text-[1rem]">
            Full index <span className="link-arrow">→</span>
          </Link>
        </div>

        <div className="essay-ledger-grid">
          {ledgerEssays.map((essay, index) => (
            <article key={essay.slug} className="ledger-card">
              <Link href={`/essays/${essay.slug}`} className="ledger-image-link">
                <EditorialImage
                  src={getArticleImage(essay.slug, index + 5)}
                  alt={essay.title}
                  className="ledger-image"
                  sizes="(min-width: 1024px) 16vw, 50vw"
                />
              </Link>
              <div>
                <div className="dense-meta">{String(index + 1).padStart(2, "0")} · {essay.category}</div>
                <h3>
                  <Link href={`/essays/${essay.slug}`}>{essay.title}</Link>
                </h3>
                <p>{essay.excerpt}</p>
                <div className="dense-meta">{essay.date} · {essay.readTime}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="subscribe-strip">
          <div className="letters-banner">
            <Mail size={21} strokeWidth={1.5} />
            <span>Letters from Beirut</span>
          </div>
          <p>Dispatches from a city that refuses to be a footnote.</p>
          <form className="subscribe-input">
            <input className="h-10 px-3 text-base" placeholder="Enter your email" />
            <button className="h-10 bg-[var(--accent)] px-5 text-white">Subscribe</button>
          </form>
          <Link href="/submit" className="read-link !text-[1rem]">
            Submit a letter <span className="link-arrow">→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function DepartmentCard({
  title,
  arabic,
  href,
  imageHref,
  image,
  heading,
  copy,
  meta,
  accent,
}: {
  title: string;
  arabic: string;
  href: string;
  imageHref?: string;
  image: string;
  heading: string;
  copy: string;
  meta: string;
  accent?: "teal";
}) {
  return (
    <article className="department-card" data-accent={accent}>
      <div className="department-heading">
        <Link href={href}>{title}</Link>
        <span className="arabic">{arabic}</span>
        <Link href={href} aria-label={`Open ${title}`}>→</Link>
      </div>
      <Link href={imageHref ?? href}>
        <EditorialImage
          src={image}
          alt={heading}
          className="department-image"
          sizes="(min-width: 1024px) 24vw, 100vw"
        />
      </Link>
      <h2>{heading}</h2>
      <p>{copy}</p>
      <div className="dense-meta">{meta}</div>
    </article>
  );
}
