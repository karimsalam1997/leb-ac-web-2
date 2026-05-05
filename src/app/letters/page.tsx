import { SiteShell } from "@/components/site-shell";
import { letters } from "@/lib/content";
import { getLetterImage } from "@/lib/visual-assets";
import { LettersClient, type LetterOrigin } from "./letters-client";

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

      <section className="paper-frame pb-10">
        <LettersClient letters={filterableLetters} />
      </section>
    </SiteShell>
  );
}
