import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { letters } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { getLetterImage } from "@/lib/visual-assets";
import { LettersClient, type LetterOrigin } from "./letters-client";

export const metadata: Metadata = buildPageMetadata({
  title: "Letters",
  description:
    "Short, dated, located writing from Beirut, the South, the mountain, and the diaspora — the country in fragments, signed when the writer wishes.",
  path: "/letters",
  image: getLetterImage(letters[0]?.slug ?? "", 0),
});

const lebanonLocationMatchers = [
  /beirut/i,
  /gemmayzeh/i,
  /tripoli/i,
  /saida/i,
  /sidon/i,
  /tyre/i,
  /sour/i,
  /mount lebanon/i,
  /byblos/i,
  /jbeil/i,
  /nahr ibrahim/i,
  /baabda/i,
  /metn/i,
  /keserwan/i,
  /chouf/i,
  /aley/i,
  /batroun/i,
  /akkar/i,
  /bekaa/i,
  /zahle/i,
  /baalbek/i,
  /nabatieh/i,
  /jezzine/i,
  /faqra/i,
];

function getLetterOrigin(location: string): LetterOrigin {
  return lebanonLocationMatchers.some((matcher) => matcher.test(location))
    ? "From Lebanon"
    : "From the diaspora";
}

export default function LettersPage() {
  const filterableLetters = letters.map((letter, index) => ({
    ...letter,
    imageSrc: getLetterImage(letter.slug, index),
    origin: getLetterOrigin(letter.location),
    originalIndex: index,
  }));

  return (
    <SiteShell activePath="/letters">
      <section className="paper-frame pt-5">
        <div className="letters-hero editorial-rule">
          <div>
            <h1 className="display-title text-[4.85rem] leading-none">Letters</h1>
            <p className="mt-2 text-[1.35rem] leading-7 text-[var(--foreground)]">
              From Beirut, the South, the mountain, and the places the country
              followed. Short. Dated. Located. Signed when the writer wishes.
            </p>
          </div>
          <div className="text-right">
            <h2 className="arabic text-[4rem] leading-none text-[var(--accent)]">الرسائل</h2>
            <p className="arabic mt-3 text-[1.25rem] leading-7">
              من بيروت، الجنوب، الجبل، والمدن التي تبعها البلد. قصيرة. مؤرّخة. محدّدة المكان.
            </p>
          </div>
        </div>
      </section>

      <section className="paper-frame pb-10">
        <LettersClient letters={filterableLetters} />
      </section>
    </SiteShell>
  );
}
