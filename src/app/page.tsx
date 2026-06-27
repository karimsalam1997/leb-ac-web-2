import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archive } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SiteShell } from "@/components/site-shell";
import { essays, letters, notebookEntries, type Essay } from "@/lib/content";
import { buildPageMetadata, siteDescription, siteName } from "@/lib/seo";
import { getArticleImage, getArticleImages, homeAssets } from "@/lib/visual-assets";

export const metadata: Metadata = buildPageMetadata({
  title: `${siteName} — The country, not the crisis.`,
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
  "An independent publication on Lebanon — written from underneath the headlines, where the load-bearing walls actually are. Power. Memory. Sect. The architecture of a state kept deliberately weak.";

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

// Typographic tiles — Roman numerals carry the section ordering in Fraunces
// small caps. No icons; the topic name and Arabic translation do the work.
const browseTopics = [
  {
    tag: "Power",
    label: "Power",
    arabic: "السُّلطة",
    numeral: "I",
    accent: "red",
  },
  {
    tag: "Political Economy",
    label: "Political Economy",
    arabic: "الاقتصاد السياسي",
    numeral: "II",
    accent: "blue",
  },
  {
    tag: "Society",
    label: "Society",
    arabic: "المجتمع",
    numeral: "III",
    accent: "teal",
  },
  {
    tag: "Sovereignty",
    label: "Sovereignty",
    arabic: "السيادة",
    numeral: "IV",
    accent: "red",
  },
  {
    tag: "Diaspora",
    label: "Diaspora",
    arabic: "المهجر",
    numeral: "V",
    accent: "blue",
  },
  {
    tag: "Memory",
    label: "Memory",
    arabic: "الذاكرة",
    numeral: "VI",
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
  const articleLeadImage = getArticleImages(essay.slug)[0];

  return (
    <Link
      href={`/essays/${essay.slug}`}
      className="home-essay-card"
      data-variant={variant}
      aria-label={`Read ${essay.title}`}
    >
      <EditorialImage
        src={getArticleImage(essay.slug, 0)}
        alt={essay.title}
        className="home-essay-card-image"
        imagePosition={articleLeadImage?.position ?? imageAsset.position}
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
        </div>

        <Link
          href={`/essays/${beirutParkEssay.slug}`}
          className="home-park-feature"
          aria-label={`Read ${beirutParkEssay.title}`}
        >
          <span className="home-park-feature-media">
            <EditorialImage
              src={beirutParkFeatureImage?.src}
              alt={beirutParkFeatureImage?.alt ?? beirutParkEssay.title}
              className="home-park-feature-image"
              imagePosition={beirutParkFeatureImage?.position ?? "center 45%"}
              quality={92}
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </span>
          <span className="home-park-feature-copy">
            <span className="editorial-kicker">Beirut Park</span>
            <strong>{beirutParkEssay.title}</strong>
            <span>{beirutParkEssay.dek}</span>
            <em>
              Read essay <span className="link-arrow">-&gt;</span>
            </em>
          </span>
        </Link>

        <div className="pattern-rule home-pattern-rule" aria-hidden="true" />
      </section>

      <section
        id="about"
        className="paper-frame home-mission-strip"
        aria-label="About Lebanese Academic"
      >
        <div className="home-mission-grid">
          <div className="home-mission-kicker">
            <div className="editorial-kicker">About</div>
            <div className="editorial-kicker arabic">عن المنشور</div>
          </div>
          <div className="home-mission-body">
            <p className="home-mission-lead">{essayDeck}</p>
            <p className="home-mission-coda">
              <em>Academic</em>, here, doesn&rsquo;t mean the dry, footnoted
              neutrality of the journal article. It means structural —
              looking at Lebanon from underneath the headlines, where the
              load-bearing walls actually are.
            </p>
            <p className="arabic home-mission-arabic">
              «أكاديمي» هنا لا تعني الحياد الجاف للمقال الأكاديمي. تعني البنيوي — النظر إلى لبنان من تحت العناوين، حيث الجدران الحاملة فعلًا.
            </p>
          </div>
        </div>
      </section>

      <section id="topics" className="paper-frame home-topic-section">
        <SectionHeading
          title="By Topic"
          arabic="حسب المحور"
          href="/topics"
          cta="Open the full register"
        />
        <div className="home-topic-grid" aria-label="Browse essays by topic">
          {browseTopics.map((topic) => {
            const count = getTopicCount(topic.tag);

            return (
              <Link
                key={topic.tag}
                href={{ pathname: "/essays", query: { topic: topic.tag } }}
                className="home-topic-tile"
                data-accent={topic.accent}
              >
                <span className="home-topic-numeral" aria-hidden="true">
                  {topic.numeral}
                </span>
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
          title="The Latest"
          arabic="الأحدث"
          href="/essays"
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
            <div className="editorial-kicker">The Archive / الأرشيف</div>
            <h2 className="editorial-title">A register built for return, not for scrolling.</h2>
            <p>
              {essays.length} essays, ordered, named, and connected — so an idea you
              read once can be found again, and the next essay you read knows what
              the last one said.
            </p>
            <Link href="/essays" className="read-link">
              Open the register <span className="link-arrow">-&gt;</span>
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
          title="Also Read"
          arabic="إقرأ أيضًا"
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
            <p>
              One email. Once a week. The new essay, the new letter, and the one
              paragraph that explains why we wrote them. No promotions.
            </p>
            <p className="arabic newsletter-arabic">
              رسالة أسبوعية واحدة: المقال الجديد، الرسالة الجديدة، وفقرة واحدة تشرح لماذا.
            </p>
          </div>
        </div>
        <NewsletterSignup />
      </section>

      <section className="paper-frame home-correspondence-section">
        <Link href="/letters" className="home-correspondence-card">
          <span>
            <strong>Letters</strong>
            <small className="arabic">الرسائل</small>
          </span>
          <p>Short, dated, located. From Beirut and the places it followed.</p>
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
            <small className="arabic">الدفتر</small>
          </span>
          <p>{leadNotebook?.excerpt ?? "Notes, fragments, and unfinished thoughts."}</p>
          <div className="home-correspondence-list">
            <span>
              {leadNotebook?.title ?? "Notebook"}
              <small>{leadNotebook?.date ?? "Ongoing"}</small>
            </span>
          </div>
          <span className="home-correspondence-glyph" aria-hidden="true">
            ⁂
          </span>
          <em>
            Open notebook <span className="link-arrow">-&gt;</span>
          </em>
        </Link>
      </section>
    </SiteShell>
  );
}
