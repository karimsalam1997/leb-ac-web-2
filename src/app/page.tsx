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
const issueEditorPicks = essays
  .filter((essay) => essay.slug !== heroEssay.slug && essay.slug !== beirutParkEssay.slug)
  .slice(0, 3);

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

function getTopicCount(tag: string) {
  return essays.filter((essay) => essay.tags.includes(tag)).length;
}

type FeatureImage = string | { src: string; alt?: string; position?: string };

function HomeFeatureCard({
  essay,
  kicker,
  image,
  imagePosition,
  headingLevel = "h2",
  priority,
  visualMode = "standard",
}: {
  essay: Essay;
  kicker: string;
  image?: FeatureImage;
  imagePosition?: string;
  headingLevel?: "h1" | "h2";
  priority?: boolean;
  visualMode?: "standard" | "background";
}) {
  const Heading = headingLevel;
  const imageSrc = typeof image === "string" ? image : image?.src;
  const imageAlt = typeof image === "string" ? essay.title : (image?.alt ?? essay.title);
  const normalizedImagePosition =
    typeof image === "string" ? imagePosition : (image?.position ?? imagePosition);

  return (
    <article
      className="home-feature-card"
      data-lead={headingLevel === "h1"}
      data-visual={visualMode}
    >
      <div className="home-feature-image-link" aria-hidden={visualMode === "background"}>
        <EditorialImage
          src={imageSrc ?? getArticleImage(essay.slug, 0)}
          alt={imageAlt}
          className="home-feature-image"
          imagePosition={normalizedImagePosition ?? "center 48%"}
          priority={priority}
          quality={92}
          unoptimized
          sizes="(min-width: 1280px) 34vw, (min-width: 768px) 48vw, 100vw"
        />
      </div>
      <div className="home-feature-copy">
        <div className="editorial-kicker">{kicker}</div>
        <Heading className="display-title home-feature-title">
          <Link href={`/essays/${essay.slug}`}>{essay.title}</Link>
        </Heading>
        <p>{essay.dek}</p>
        <div className="home-feature-meta">
          <Image src="/brand/la-editors-mark.png" alt="" width={36} height={36} />
          <span>
            <strong>{essay.byline}</strong>
            <small>
              {essay.date} / {essay.readTime}
            </small>
          </span>
        </div>
        <Link href={`/essays/${essay.slug}`} className="read-link">
          Read essay <span className="link-arrow">-&gt;</span>
        </Link>
      </div>
    </article>
  );
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
  const heroImage = getArticleImage(heroEssay.slug, 0);
  const beirutParkImages = getArticleImages(beirutParkEssay.slug);
  const beirutParkFeatureImage =
    beirutParkImages.find((image) => image.src.includes("pigeon-tower-release")) ??
    beirutParkImages[0];

  return (
    <SiteShell activePath="/">
      <section className="paper-frame home-front-section" aria-label="Featured essays">
        <div className="home-front-grid">
          <HomeFeatureCard
            essay={beirutParkEssay}
            kicker="Featured Essay"
            image={beirutParkFeatureImage}
            imagePosition={beirutParkFeatureImage?.position ?? "center 44%"}
            headingLevel="h1"
            visualMode="background"
            priority
          />

          <HomeFeatureCard
            essay={heroEssay}
            kicker="Featured Essay"
            image={heroImage}
            imagePosition="center 48%"
            priority
          />

          <aside id="about" className="home-issue-rail" aria-label="Issue 01">
            <div className="home-issue-head">
              <div>
                <div className="editorial-kicker">Current Issue</div>
                <h2>Issue 01</h2>
                <p>May 2026 / Beirut</p>
              </div>
              <div className="home-issue-cover" aria-hidden="true">
                <span>Lebanese Academic</span>
                <strong>01</strong>
                <em>May 2026</em>
              </div>
            </div>

            <p className="home-issue-blurb">
              The first register gathers every published essay on the site:
              power, memory, sovereignty, culture, and the city.
            </p>

            <div className="home-issue-stats" aria-label="Issue contents">
              <span>
                <strong>{essays.length}</strong>
                Essays
              </span>
              <span>
                <strong>{letters.length}</strong>
                Letters
              </span>
              <span>
                <strong>{notebookEntries.length}</strong>
                Notes
              </span>
            </div>

            <Link href="/essays" className="home-issue-button">
              View issue <span className="link-arrow">-&gt;</span>
            </Link>

            <div className="home-editor-picks">
              <div className="editorial-kicker">Editor&apos;s Picks</div>
              {issueEditorPicks.map((essay) => (
                <Link key={essay.slug} href={`/essays/${essay.slug}`}>
                  <strong>{essay.title}</strong>
                  <small>
                    {essay.tags[0] ?? essay.category} / {essay.readTime}
                  </small>
                </Link>
              ))}
            </div>
          </aside>
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

      <section className="paper-frame home-latest-section">
        <SectionHeading
          title="Issue Contents"
          arabic="محتويات العدد"
          href="/essays"
          cta="View full issue"
        />
        <div className="home-latest-grid">
          {latestEssays.map((essay, index) => (
            <EssayCard key={essay.slug} essay={essay} index={index + 1} />
          ))}
        </div>
      </section>

      <section id="archive" className="paper-frame home-archive-section">
        <div className="home-archive-grid">
          <div className="home-archive-copy">
            <div className="editorial-kicker">Archive / من الأرشيف</div>
            <h2 className="editorial-title">A first issue, built for return.</h2>
            <p>
              Issue 01 is the current essay register, ordered like a publication
              rather than an endless feed.
            </p>
            <Link href="/essays" className="read-link">
              View Issue 01 <span className="link-arrow">-&gt;</span>
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
