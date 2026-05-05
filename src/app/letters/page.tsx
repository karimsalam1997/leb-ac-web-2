import Link from "next/link";
import { Mail, PenLine } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { SiteShell } from "@/components/site-shell";
import { letters } from "@/lib/content";
import { visualAssets } from "@/lib/visual-assets";

const [featured, ...rest] = letters;
const letterImages = [
  visualAssets.letterpress,
  visualAssets.manuscript,
  visualAssets.skyline,
  visualAssets.documentStack,
];

export default function LettersPage() {
  return (
    <SiteShell activePath="/letters">
      <section className="paper-frame pt-5">
        <div className="letters-hero editorial-rule">
          <div>
            <h1 className="display-title text-[4.85rem] leading-none">Letters</h1>
            <p className="mt-2 text-[1.35rem] leading-7 text-[var(--foreground)]">
              Dispatches from Beirut and beyond. Short, dated, located.
            </p>
          </div>
          <div className="text-right">
            <h2 className="arabic text-[4rem] leading-none text-[var(--accent)]">رسائل</h2>
            <p className="arabic mt-3 text-[1.25rem] leading-7">
              رسائل من بيروت وما وراءها، قصيرة، مؤرخة، ومحددة المكان.
            </p>
          </div>
        </div>
      </section>

      <section className="paper-frame">
        <div className="letters-filter-row">
          <span data-active="true">All</span>
          <span>From Lebanon</span>
          <span>From the diaspora</span>
          <span>Anonymous</span>
          <span className="ml-auto">Newest first</span>
        </div>
      </section>

      <section className="paper-frame pb-10">
        <div className="letters-layout">
          <div>
            <article id={featured.slug} className="letters-featured-card">
              <div className="p-7">
                <div className="editorial-kicker">Featured</div>
                <div className="dense-meta mt-5">{featured.date} / {featured.location}</div>
                <h2 className="editorial-title mt-4 text-[2rem] leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-sm text-[1.15rem] leading-7">{featured.excerpt}</p>
                <div className="dense-meta mt-7">{featured.readTime}</div>
              </div>
              <Link href={`/letters#${featured.slug}`}>
                <EditorialImage
                  src={visualAssets.coastWide}
                  alt={featured.title}
                  className="min-h-[250px]"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </Link>
            </article>

            <div className="mt-6">
              {rest.map((letter, index) => (
                <article key={letter.slug} id={letter.slug} className="letter-list-row">
                  <Link href={`/letters#${letter.slug}`}>
                    <EditorialImage
                      src={letterImages[index % letterImages.length]}
                      alt={letter.title}
                      className="aspect-[1.55/1] border border-[color:var(--paper-border)]"
                      sizes="160px"
                    />
                  </Link>
                  <div>
                    <div className="dense-meta">{letter.date} / {letter.location}</div>
                    <h3 className="editorial-title mt-1 text-[1.55rem] leading-tight">
                      {letter.title}
                    </h3>
                    <p className="mt-1 text-[1rem] leading-5 text-[var(--ink-soft)]">
                      {letter.excerpt}
                    </p>
                  </div>
                  <div className="dense-meta text-right">{letter.readTime}</div>
                  <Link href={`/letters#${letter.slug}`} className="read-link !text-[1rem]">
                    Read <span className="link-arrow">-&gt;</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="letters-sidebar">
            <p className="text-[1.35rem] leading-8 text-[var(--accent)]">
              Letters are small acts of witness. They travel across time and distance
              to record what matters in the everyday.
            </p>
            <div className="my-8 h-px bg-[var(--line)]" />
            <div className="border border-[color:var(--accent)] p-7">
              <PenLine className="text-[var(--accent)]" size={28} strokeWidth={1.2} />
              <h2 className="editorial-title mt-3 text-[1.75rem] text-[var(--accent)]">
                Share a letter
              </h2>
              <p className="mt-3 text-[1.08rem] leading-6">
                Have a moment, memory, or observation to send? We welcome short letters
                from anywhere.
              </p>
              <Link href="/submit" className="read-link mt-5">
                Submit a Letter <span className="link-arrow">-&gt;</span>
              </Link>
            </div>
            <div className="airmail-box mt-7">
              <div className="flex items-start gap-3">
                <Mail size={25} strokeWidth={1.3} className="text-[var(--accent)]" />
                <div>
                  <h3 className="editorial-title text-[1.55rem] text-[var(--accent)]">
                    Letters in your inbox
                  </h3>
                  <p className="mt-2 text-[1rem] leading-5">
                    A weekly selection of letters. No noise. Just signal.
                  </p>
                </div>
              </div>
              <input className="mt-5 h-10 w-full px-3 text-sm" placeholder="Your email address" />
              <button className="mt-3 h-10 w-full bg-[var(--accent)] text-white">Subscribe</button>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
