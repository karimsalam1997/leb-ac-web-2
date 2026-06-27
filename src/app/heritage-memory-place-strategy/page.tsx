import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/lib/seo";

const proofSections = [
  {
    eyebrow: "Method",
    title: "Identity Capital Index",
    image: "/editorial/generated-archive/notebook-map.jpg",
    alt: "A notebook map with field notes and drawn routes.",
    body:
      "In Beirut in 2025, I began formalizing the Identity Capital Index as a way to assess how heritage, memory, public space, cultural continuity, belonging, and social trust affect the value and resilience of a place. The point is simple. A street, park, district, museum, or cultural asset can be technically built and still feel empty if nobody recognizes themselves inside it.",
    notes: [
      "Assesses memory, public use, material honesty, local recognition, and long-term value.",
      "Designed for streets, neighborhoods, public spaces, heritage assets, and cultural districts.",
      "Turns abstract authenticity into audit language a client, planner, or developer can act on.",
    ],
  },
  {
    eyebrow: "Case study",
    title: "Beirut Waterfront Park",
    image: "/editorial/generated-archive/ruins-cranes.jpg",
    alt: "Archaeological stonework near construction cranes.",
    body:
      "At the Beirut waterfront in 2026, the question was not whether a park could be pretty. The question was whether Solidere could build a place that remembered Beirut instead of importing another polished surface from nowhere. The proposal used Roman fragments, local stone, Proto-Aeolic references, an Adonis Grove, a pigeon tower, civic rituals, and maintenance logic as parts of one public argument.",
    notes: [
      "Roman fragments and stored archaeological material treated as public assets.",
      "Local stone, native planting, and vernacular forms used as governance choices.",
      "Public-space economics connected to dwell time, maintenance, stewardship, and place value.",
    ],
  },
  {
    eyebrow: "Research shelf",
    title: "Levantine Heritage Research",
    image: "/editorial/generated-archive/dog-river-inscription.jpg",
    alt: "An inscription wall by the Dog River in Lebanon.",
    body:
      "At Nahr el-Kalb, at Faqra, in Tyre, and in the old arguments over Phoenician and Canaanite identity, Lebanon keeps leaving evidence in stone and then pretending the evidence is too dangerous to read. My Lebanese Academic work has followed those threads through Adonis and Ashura mourning traditions, civil-war memory, artifact looting, and the long fight over whether Lebanese identity has to remain trapped inside sectarian categories.",
    notes: [
      "Phoenician and Canaanite continuity, Ugaritic context, and Lebanese identity beyond sect.",
      "Adonis, Christian Holy Week, and Ashura read as living forms of inherited grief.",
      "Robert Fisk, artifact looting, private collections, and the politics of material memory.",
    ],
  },
  {
    eyebrow: "Gulf frame",
    title: "Heritage and Nation-Building",
    image: "/editorial/generated-archive/faqra-stones.jpg",
    alt: "Ancient stone remains in the Lebanese mountains.",
    body:
      "In AlUla, Diriyah, Abu Dhabi, and the Saudi giga-projects after Vision 2030, archaeology is not a decorative department. It is part of how a state explains itself, attracts visitors, reassures investors, and moves from resource wealth into civilizational language. That is why heritage business development has to speak to tourism authorities, developers, ministries, planners, curators, and engineers at the same time.",
    notes: [
      "AlUla and Diriyah understood as heritage, tourism, identity, and state strategy.",
      "Gulf clients often buy meaning, legitimacy, visitor economy, and method at the same time.",
      "WSP's archaeology, conservation, planning, environment, and urban teams need that argument translated for buyers.",
    ],
  },
  {
    eyebrow: "Public authority",
    title: "Lebanese Academic",
    image: "/editorial/generated-archive/museum-stones.jpg",
    alt: "Museum stones and archival objects arranged under soft light.",
    body:
      "Lebanese Academic is the public proof. From Beirut in 2025 and 2026, I built a 40,000-follower research platform on Lebanese political economy, historical memory, sectarian governance, urban reconstruction, and cultural identity. I have written long-form essays, maintained research briefs, and appeared on Al Jazeera English to discuss Lebanon's sectarian system and institutional design.",
    notes: [
      "40,000 followers across public research and analysis work.",
      "23 long-form essays and a broader archive of 69 briefs and working papers.",
      "Al Jazeera English commentary on Lebanese sectarianism and institutional design.",
    ],
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Heritage, Memory, and Place Strategy",
  description:
    "A concise proof shelf for Karim Salam's heritage, cultural strategy, and place-based research work across Lebanon, the Levant, and Gulf heritage development.",
  path: "/heritage-memory-place-strategy",
  image: "/editorial/generated-archive/dog-river-inscription.jpg",
});

export default function HeritageMemoryPlaceStrategyPage() {
  return (
    <SiteShell activePath="/heritage-memory-place-strategy">
      <main className="heritage-proof-page">
        <section className="heritage-proof-hero">
          <Image
            src="/editorial/generated-archive/dog-river-inscription.jpg"
            alt="Nahr el-Kalb inscription wall in Lebanon."
            fill
            sizes="100vw"
            priority
            className="heritage-proof-hero-image"
          />
          <div className="heritage-proof-hero-scrim" />
          <div className="heritage-proof-hero-content">
            <div className="editorial-kicker">Heritage, Memory, and Place Strategy</div>
            <h1>Stones are not background.</h1>
            <p>
              At Nahr el-Kalb in 2026, the inscriptions still do what weak
              states are afraid of. They remember. This page gathers the work
              behind my heritage and cultural strategy profile: the Identity
              Capital Index, Beirut Waterfront Park, Levantine material memory,
              Gulf heritage statecraft, and Lebanese Academic.
            </p>
          </div>
        </section>

        <section className="heritage-proof-summary">
          <div>
            <div className="editorial-kicker">For WSP Middle East</div>
            <h2>What I bring to a heritage team.</h2>
          </div>
          <p>
            In Riyadh, AlUla, Abu Dhabi, Beirut, and Tyre, the buyer is rarely
            asking for archaeology alone. The buyer is asking how archaeology,
            conservation, planning, tourism, and public memory become a
            credible project. My work sits in that space: business development,
            regional analysis, public writing, and heritage strategy beside
            technical specialists who do the fieldwork.
          </p>
        </section>

        <section className="heritage-proof-metrics" aria-label="Selected proof points">
          <div>
            <span>$660K</span>
            <p>closed across 15 months selling into regulated accounts including Saudi Aramco.</p>
          </div>
          <div>
            <span>40K</span>
            <p>Lebanese Academic followers across public research and analysis work.</p>
          </div>
          <div>
            <span>23</span>
            <p>long-form essays, with a broader archive of 69 briefs and working papers.</p>
          </div>
          <div>
            <span>2026</span>
            <p>heritage and place-strategy work across Beirut, Tyre, Solidere, and Gulf development.</p>
          </div>
        </section>

        <section className="heritage-proof-sections">
          {proofSections.map((section, index) => (
            <article key={section.title} className="heritage-proof-section">
              <div className="heritage-proof-section-media">
                <Image
                  src={section.image}
                  alt={section.alt}
                  width={900}
                  height={620}
                  sizes="(max-width: 760px) 100vw, 42vw"
                />
              </div>
              <div className="heritage-proof-section-copy">
                <div className="dense-meta">
                  {String(index + 1).padStart(2, "0")} / {section.eyebrow}
                </div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                <ul>
                  {section.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="heritage-proof-closing">
          <div>
            <div className="editorial-kicker">Application packet</div>
            <h2>For the hiring reader.</h2>
          </div>
          <p>
            In WSP language, the archaeologist in the trench remains central.
            My work is beside that person: find the right client, explain the
            value of the work, write the argument, and carry the project across
            the room from technical method to institutional decision.
          </p>
          <Link href="/essays" className="read-link">
            Read the essay archive <span className="link-arrow">-&gt;</span>
          </Link>
        </section>
      </main>
    </SiteShell>
  );
}
