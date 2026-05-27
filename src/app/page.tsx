import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Landmark,
  NotebookPen,
  Plane,
  Scale,
  UsersRound,
} from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SiteShell } from "@/components/site-shell";
import { essays, letters, notebookEntries, type Essay } from "@/lib/content";
import { buildPageMetadata, siteDescription, siteName } from "@/lib/seo";
import { getArticleImage, getArticleImages, homeAssets } from "@/lib/visual-assets";

export const metadata: Metadata = buildPageMetadata({
  title: siteName,
  description: siteDescription,
  path: "/",
  image: homeAssets.hero.src,
  absoluteTitle: true,
});

const heroEssay = essays[0];
const beirutParkEssay =
  essays.find((essay) => essay.slug === "the-park-that-remembers") ??
  essays.at(-1) ??
  heroEssay;
const latestEssays = essays.slice(1, 6);
const moreEssays = essays.slice(6, 8);
const recentLetters = letters.slice(0, 2);
const leadNotebook = notebookEntries[0];

const essayDeck =
  "Lebanese Academic starts from Beirut in May 2026: the cartel state, the generator street, the census nobody will take, and the city still arguing with its ruins.";

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

const browseTopics = [
  {
    tag: "Power",
    label: "Power",
    arabic: "السلطة",
    icon: Landmark,
    accent: "red",
  },
  {
    tag: "Political Economy",
    label: "Political Economy",
    arabic: "الاقتصاد السياسي",
    icon: ChartNoAxesColumnIncreasing,
    accent: "blue",
  },
  {
    tag: "Society",
    label: "Society",
    arabic: "المجتمع",
    icon: UsersRound,
    accent: "teal",
  },
  {
    tag: "Sovereignty",
    label: "Sovereignty",
    arabic: "السيادة",
    icon: Scale,
    accent: "red",
  },
  {
    tag: "Diaspora",
    label: "Diaspora",
    arabic: "المغترب",
    icon: Plane,
    accent: "blue",
  },
  {
    tag: "Memory",
    label: "Memory",
    arabic: "الذاكرة",
    icon: BookOpenText,
    accent: "teal",
  },
];

function editorialTitleLines(title: string) {
  const words = title.split(" ");
  const lineLength = Math.ceil(words.length / 3);

  return [
    words.slice(0, lineLength).join(" "),
    words.slice(lineLength, lineLength * 2).join(" "),
    words.slice(lineLength * 2).join(" "),
  ].filter(Boolean);
}

function getTopicCount(tag: string) {
  return essays.filter((essay) => essay.tags.includes(tag)).length;
}

function EssayCard({
  essay,
  index,
  variant = "latest",
}: {
  essay: Essay;
  index: number;
  variant?: "latest" | "more";
}) {
  const imageAsset = homeAssets.edition[index % homeAssets.edition.length];

  return (
    <Link
      href={`/essays/${essay.slug}`}
      className="home-essay-card"
      data-variant={variant}
      aria-label={`Read ${essay.title}`}
    >
      <EditorialImage
        src={getArticleImage(essay.slug, index)}
        alt={essay.title}
        className="home-essay-card-image"
        imagePosition={imageAsset.position}
        quality={90}
        sizes={
          variant === "more"
            ? "(min-width: 1024px) 28vw, 100vw"
            : "(min-width: 1180px) 18vw, (min-width: 768px) 30vw, 100vw"
        }
      />
      <span className="home-essay-card-body">
        <span className="home-essay-card-topic">{essay.tags[0] ?? essay.category}</span>
        <strong>{essay.title}</strong>
        <span>{essay.dek}</span>
        <small>
          {essay.byline} / {essay.date} / {essay.readTime}
        </small>
      </span>
    </Link>
  );
}

function SectionHeading({
  title,
  arabic,
  href,
  cta = "View all essays",
}: {
  title: string;
  arabic: string;
  href: string;
  cta?: string;
}) {
  return (
    <div className="home-section-heading">
      <div>
        <h2>{title}</h2>
        <span className="arabic">{arabic}</span>
      </div>
      <Link href={href}>
        {cta} <span className="link-arrow">-&gt;</span>
      </Link>
    </div>
  );
}

export default function Home() {
  const heroTitleLines =
    displayTitleLinesBySlug[heroEssay.slug] ?? editorialTitleLines(heroEssay.title);
  const heroImage = getArticleImage(heroEssay.slug, 0);
  const beirutParkImages = getArticleImages(beirutParkEssay.slug);
  const beirutParkFeatureImage =
    beirutParkImages.find((image) => image.src.includes("pigeon-tower-release")) ??
    beirutParkImages[0];

  return (
    <SiteShell activePath="/">
      <section className="paper-frame home-lead-section">
        <div className="home-lead-grid">
          <article className="home-lead-story">
            <div className="editorial-kicker">Featured Essay</div>
            <h1 className="display-title home-lead-title">
              <Link href={`/essays/${heroEssay.slug}`}>
                {heroTitleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </Link>
            </h1>
            <p className="home-lead-dek">{heroEssay.dek}</p>
            <div className="home-lead-meta">
              <Image
                src="/brand/la-editors-mark.png"
                alt=""
                width={42}
                height={42}
              />
              <span>
                <strong>{heroEssay.byline}</strong>
                <small>
                  {heroEssay.date} / {heroEssay.readTime}
                </small>
              </span>
            </div>
            <Link href={`/essays/${heroEssay.slug}`} className="read-link">
              Read essay <span className="link-arrow">-&gt;</span>
            </Link>
          </article>

          <Link href={`/essays/${heroEssay.slug}`} className="home-lead-image-link">
            <EditorialImage
              src={heroImage}
              alt={heroEssay.title}
              className="home-lead-image"
              imagePosition="center 48%"
              priority
              quality={92}
              sizes="(min-width: 1280px) 43vw, (min-width: 1024px) 48vw, 100vw"
            />
          </Link>

          <Link
            href={`/essays/${beirutParkEssay.slug}`}
            className="home-park-feature"
            aria-label={`Read ${beirutParkEssay.title}`}
          >
            <EditorialImage
              src={beirutParkFeatureImage?.src}
              alt={beirutParkFeatureImage?.alt ?? beirutParkEssay.title}
              className="home-park-feature-image"
              imagePosition={beirutParkFeatureImage?.position ?? "center 45%"}
              priority
              quality={92}
              sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 27vw, 100vw"
            />
            <span className="home-park-feature-copy">
              <span className="editorial-kicker">Beirut Park</span>
              <strong>{beirutParkEssay.title}</strong>
              <span>{beirutParkEssay.dek}</span>
              <em>
                Read essay <span className="link-arrow">-&gt;</span>
              </em>
            </span>
          </Link>
        </div>

        <div className="pattern-rule home-pattern-rule" aria-hidden="true" />
      </section>

      <section
        id="about"
        className="paper-frame home-mission-strip"
        aria-label="Publication mission"
      >
        <span aria-hidden="true" />
        <p>{essayDeck}</p>
        <span aria-hidden="true" />
      </section>

      <section className="paper-frame home-latest-section">
        <SectionHeading
          title="Latest Essays"
          arabic="أحدث المقالات"
          href="/essays"
        />
        <div className="home-latest-grid">
          {latestEssays.map((essay, index) => (
            <EssayCard key={essay.slug} essay={essay} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="paper-frame home-topic-section">
        <SectionHeading
          title="Browse by Topic"
          arabic="تصفح حسب الموضوع"
          href="/essays"
          cta="Explore all topics"
        />
        <div className="home-topic-grid" aria-label="Browse essays by topic">
          {browseTopics.map((topic) => {
            const Icon = topic.icon;
            const count = getTopicCount(topic.tag);

            return (
              <Link
                key={topic.tag}
                href={{ pathname: "/essays", query: { topic: topic.tag } }}
                className="home-topic-tile"
                data-accent={topic.accent}
              >
                <Icon size={30} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>{topic.label}</strong>
                  <small className="arabic">{topic.arabic}</small>
                </span>
                <em>{count}</em>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="archive" className="paper-frame home-archive-section">
        <div className="home-archive-grid">
          <div className="home-archive-copy">
            <div className="editorial-kicker">Archive / من الأرشيف</div>
            <h2 className="editorial-title">Issue 01 is a route through the machine.</h2>
            <p>
              Ten essays, from Downtown Beirut to Sakiet el-Janzeer, the 1932
              census, the Blue Line, and the public rooms a damaged city still needs.
            </p>
            <Link href="/essays" className="read-link">
              Open Issue 01 <span className="link-arrow">-&gt;</span>
            </Link>
          </div>

          <Link href="/essays" className="home-archive-image-link">
            <EditorialImage
              src={homeAssets.departments.archive.src}
              alt="Lebanese Academic archive"
              className="home-archive-image"
              imagePosition={homeAssets.departments.archive.position}
              quality={92}
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </Link>

          <div className="home-archive-ledger">
            <Archive size={28} strokeWidth={1.6} aria-hidden="true" />
            <strong>Issue 01</strong>
            <span>{essays.length} essays</span>
            <span>{letters.length} letters</span>
            <span>{notebookEntries.length} notebook notes</span>
          </div>
        </div>
      </section>

      <section className="paper-frame home-more-section">
        <SectionHeading
          title="More Essays"
          arabic="المزيد من المقالات"
          href="/essays"
        />
        <div className="home-more-grid">
          {moreEssays.map((essay, index) => (
            <EssayCard
              key={essay.slug}
              essay={essay}
              index={index + latestEssays.length + 1}
              variant="more"
            />
          ))}
        </div>
      </section>

      <section className="paper-frame home-newsletter-strip">
        <div className="home-newsletter-copy">
          <div className="home-newsletter-icon">
            <Image
              src="/brand/la-editors-mark.png"
              alt=""
              width={42}
              height={42}
            />
          </div>
          <div>
            <h2>Dispatches from a city that refuses to be a footnote.</h2>
            <p>New essays, letters, and notebook entries. Once a week.</p>
          </div>
        </div>
        <NewsletterSignup />
      </section>

      <section className="paper-frame home-correspondence-section">
        <Link href="/letters" className="home-correspondence-card">
          <span>
            <strong>Letters</strong>
            <small className="arabic">رسائل</small>
          </span>
          <p>Short letters on what matters, from Beirut and beyond.</p>
          <div className="home-correspondence-list">
            {recentLetters.map((letter) => (
              <span key={letter.slug}>
                {letter.title}
                <small>{letter.date}</small>
              </span>
            ))}
          </div>
          <Image
            src={homeAssets.departments.letters.src}
            alt=""
            width={360}
            height={170}
            className="home-correspondence-art"
          />
          <em>
            Read letters <span className="link-arrow">-&gt;</span>
          </em>
        </Link>

        <Link href="/notebook" className="home-correspondence-card">
          <span>
            <strong>Notebook</strong>
            <small className="arabic">دفتر الملاحظات</small>
          </span>
          <p>{leadNotebook?.excerpt ?? "Notes, fragments, and unfinished thoughts."}</p>
          <div className="home-correspondence-list">
            <span>
              {leadNotebook?.title ?? "Notebook"}
              <small>{leadNotebook?.date ?? "Ongoing"}</small>
            </span>
          </div>
          <NotebookPen size={120} strokeWidth={0.85} aria-hidden="true" />
          <em>
            Open notebook <span className="link-arrow">-&gt;</span>
          </em>
        </Link>
      </section>
    </SiteShell>
  );
}
