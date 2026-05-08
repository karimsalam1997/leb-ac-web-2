const homeBase = "/home";
const downtownRepairHero = "/editorial/downtown-repair-hero.jpg";
const essayImageBase = "/essay-images";
const beirutParkBase = "/editorial/beirut-park";

export type ArticleImageAsset = {
  src: string;
  alt: string;
  caption?: string;
  position?: string;
};

export const homeAssets = {
  logoMark: `${homeBase}/logo-mark@3x.png`,
  hero: {
    src: `${homeBase}/hero-beirut-coast.jpg`,
    position: "center 56%",
  },
  poster: `${homeBase}/poster-collapse.png`,
  pattern: `${homeBase}/pattern-left@3x.png`,
  stamps: `${homeBase}/stamps-strip@3x.png`,
  departments: {
    essays: {
      src: `${homeBase}/essay-ruins.jpg`,
      position: "center 54%",
    },
    letters: {
      src: `${homeBase}/letters-manuscript.jpg`,
      position: "center 55%",
    },
    notebook: {
      src: `${homeBase}/notebook-ruins.jpg`,
      position: "center 50%",
    },
    archive: {
      src: `${homeBase}/archive-river.jpg`,
      position: "center 58%",
    },
  },
  edition: [
    {
      src: `${homeBase}/hero-beirut-coast.jpg`,
      position: "center 56%",
    },
    {
      src: `${homeBase}/essay-ruins.jpg`,
      position: "center 54%",
    },
    {
      src: `${homeBase}/letters-manuscript.jpg`,
      position: "center 55%",
    },
    {
      src: `${homeBase}/notebook-ruins.jpg`,
      position: "center 50%",
    },
    {
      src: `${homeBase}/archive-river.jpg`,
      position: "center 58%",
    },
    {
      src: `${homeBase}/ledger-coast.jpg`,
      position: "center 54%",
    },
  ],
};

export const generatedArticleImages = homeAssets.edition.map((asset) => asset.src);

const articleImageSets: Record<string, ArticleImageAsset[]> = {
  "the-mehtail-republic": [
    {
      src: `${essayImageBase}/the-mehtail-republic-header-v2.png`,
      alt: "A Lebanese professional working between diaspora office life and Beirut infrastructure collapse",
      position: "center 48%",
    },
    {
      src: `${essayImageBase}/the-mehtail-republic-diaspora-nodes-v2.png`,
      alt: "Lebanese competence abroad contrasted with generator dependency at home",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/the-mehtail-republic-private-solidarity-v2.png`,
      alt: "A family absorbing the burden of failed public systems through private care",
      position: "center 52%",
    },
  ],
  "the-census-that-cannot-be-taken": [
    {
      src: `${essayImageBase}/03-census-that-cannot-be-taken-header.png`,
      alt: "A census ledger and map representing Lebanon's avoided demographic count",
      position: "center 48%",
    },
    {
      src: `${essayImageBase}/03-census-registration-card-map.png`,
      alt: "Registration cards layered over a Lebanese map",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/03-census-shadowed-voting-lines.png`,
      alt: "Voters and census shadows suggesting representation without measurement",
      position: "center 48%",
    },
  ],
  "sovereignty-theatre": [
    {
      src: `${essayImageBase}/04-sovereignty-theatre-header.png`,
      alt: "A theatrical diplomatic room representing performed sovereignty",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/04-sovereignty-empty-meeting-table.png`,
      alt: "An empty meeting table staged for Lebanon's absent sovereignty",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/04-sovereignty-little-sovereignties-balconies.png`,
      alt: "Balconies and small authorities standing in for fragmented sovereignty",
      position: "center 48%",
    },
  ],
  "the-rubble-zone": [
    {
      src: `${essayImageBase}/05-the-rubble-zone-header.png`,
      alt: "A destroyed village landscape representing the politics of rubble",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/05-the-rubble-zone-buffer-map.png`,
      alt: "A buffer-zone map drawn across a damaged Lebanese landscape",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/05-the-rubble-zone-classroom.png`,
      alt: "A damaged classroom inside the rubble zone",
      position: "center 52%",
    },
  ],
  "the-seventeen-countries": [
    {
      src: `${essayImageBase}/06-the-seventeen-countries-header.png`,
      alt: "Lebanon pictured as many small administrative worlds within one border",
      position: "center 48%",
    },
    {
      src: `${essayImageBase}/06-the-seventeen-countries-counter-maze.png`,
      alt: "A maze of public counters representing fragmented daily administration",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/06-the-seventeen-countries-bus-stop.png`,
      alt: "A bus stop scene showing everyday negotiation across Lebanese public life",
      position: "center 50%",
    },
  ],
  "the-land-that-mourns-in-one-language": [
    {
      src: `${essayImageBase}/07-land-that-mourns-header.png`,
      alt: "A mourning Lebanese landscape shaped by shared grief",
      position: "center 48%",
    },
    {
      src: `${essayImageBase}/07-land-that-mourns-divine-feminine-triptych.png`,
      alt: "A triptych evoking Astarte, Mother Mary, and Fatima as figures of shared mourning",
      position: "center 48%",
    },
    {
      src: `${essayImageBase}/07-land-that-mourns-mourning-women.png`,
      alt: "Women mourning across generations in a Lebanese landscape",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/07-land-that-mourns-archive-table.png`,
      alt: "An archive table holding traces of grief and memory",
      position: "center 52%",
    },
  ],
  "downtown-without-a-city": [
    {
      src: `${essayImageBase}/08-downtown-without-a-city-header.png`,
      alt: "Downtown Beirut shown as a restored district without civic life",
      position: "center 50%",
    },
    {
      src: `${essayImageBase}/08-downtown-without-a-city-neighborhood-repair.png`,
      alt: "A repaired neighborhood scene contrasting with empty downtown redevelopment",
      position: "center 52%",
    },
    {
      src: `${essayImageBase}/08-downtown-without-a-city-old-souk-memory.png`,
      alt: "Memory of Beirut's old souks layered into the present city",
      position: "center 50%",
    },
  ],
  "the-park-that-remembers": [
    {
      src: `${beirutParkBase}/main-sightline.jpg`,
      alt: "The Beirut Park sundial sightline through the redesigned landscape",
      caption: "The Gnomon Plaza sightline, aligning the sundial, gazebo, and Pigeon Tower.",
      position: "center 48%",
    },
    {
      src: `${beirutParkBase}/gate-pavilion-sunset.jpg`,
      alt: "The Beirut Park gateway and pavilion at sunset",
      caption: "The main gate and pavilion turn arrival into a real civic threshold.",
      position: "center 52%",
    },
    {
      src: `${beirutParkBase}/pathways.jpg`,
      alt: "Crushed limestone pathways winding through the Beirut Park planting",
      caption: "Crushed limestone paths slow the body down and return rain to the ground.",
      position: "center 52%",
    },
    {
      src: `${beirutParkBase}/gazebo-lake.jpg`,
      alt: "The Ottoman gazebo beside the lake in the Beirut Park redesign",
      caption: "The Ottoman Gazebo frames water, gathering, and the public right to linger.",
      position: "center 48%",
    },
    {
      src: `${beirutParkBase}/pigeon-tower-release.jpg`,
      alt: "The Pigeon Tower releasing birds at sunset",
      caption: "The Pigeon Tower makes a living Beirut rooftop tradition monumental.",
      position: "center 44%",
    },
    {
      src: `${beirutParkBase}/colonnaded-vines.jpg`,
      alt: "Roman columns reused as a vine-covered pergola",
      caption: "Dormant columns become shade, letting heritage work again.",
      position: "center 50%",
    },
    {
      src: `${beirutParkBase}/adonis-grove.jpg`,
      alt: "The Adonis Grove in bloom",
      caption: "The Adonis Grove turns mourning into a seasonal, shared landscape.",
      position: "center 48%",
    },
    {
      src: `${beirutParkBase}/backgammon-pigeons.jpg`,
      alt: "Stone backgammon tables and pigeons in the Beirut Park redesign",
      caption: "Permanent tawleh tables make play part of the park's civic architecture.",
      position: "center 52%",
    },
  ],
};

const generatedImageBySlug: Record<string, string> = {
  "the-city-that-could-not-repair-itself": downtownRepairHero,
  "the-cartel-in-the-costume-of-a-country": homeAssets.hero.src,
  "cartel-in-the-costume-of-a-country": homeAssets.hero.src,
  "the-mehtail-republic": homeAssets.departments.essays.src,
  "the-census-that-cannot-be-taken": homeAssets.departments.letters.src,
  "sovereignty-theatre": homeAssets.departments.archive.src,
  "the-brilliant-nodes": homeAssets.departments.notebook.src,
  "what-taif-actually-said": homeAssets.departments.essays.src,
  "the-rubble-zone": homeAssets.edition[5].src,
  "the-service-state": homeAssets.departments.letters.src,
  "the-franchisor-has-left-the-building": homeAssets.departments.archive.src,
  "the-franchisor-has-left": homeAssets.departments.archive.src,
  "the-transaction": homeAssets.departments.letters.src,
  "the-seventeen-countries": homeAssets.departments.archive.src,
  "the-cartel-board-meeting": homeAssets.departments.notebook.src,
  "the-dog-river-keeps-the-minutes": homeAssets.departments.notebook.src,
  "the-dog-river-remembers": homeAssets.departments.notebook.src,
  "the-fracture-was-the-blueprint": homeAssets.edition[5].src,
  "stones-that-outlived-their-gods": homeAssets.departments.essays.src,
  "the-land-that-mourns-in-one-language": homeAssets.departments.archive.src,
  "same-grief-for-three-thousand-years": homeAssets.departments.archive.src,
  "the-looted-coast": homeAssets.edition[5].src,
  "memorycide-on-the-coast": homeAssets.edition[5].src,
  "downtown-without-a-city": homeAssets.departments.archive.src,
  "cousins-across-a-river-that-shouldnt-exist": homeAssets.departments.notebook.src,
  "every-letter-on-this-screen": homeAssets.departments.letters.src,
  "the-seventeen-countries-wearing-a-trenchcoat": homeAssets.departments.archive.src,
  "the-architecture-of-consolation": homeAssets.departments.essays.src,
  "the-park-that-remembers": articleImageSets["the-park-that-remembers"][0].src,
};

export function getArticleImage(slug: string, index = 0) {
  const imageSet = articleImageSets[slug];

  return (
    imageSet?.[index % imageSet.length]?.src ??
    generatedImageBySlug[slug] ??
    generatedArticleImages[index % generatedArticleImages.length]
  );
}

export function getArticleImages(slug: string) {
  return articleImageSets[slug] ?? [
    {
      src: getArticleImage(slug, 0),
      alt: slug,
    },
  ];
}

const generatedLetterImages: Record<string, string> = {
  "letter-to-the-south": homeAssets.departments.archive.src,
  "letter-to-beirut": homeAssets.hero.src,
  "letter-to-karl": homeAssets.departments.letters.src,
  "letter-to-the-young-lebanese-abroad": homeAssets.edition[5].src,
  "letter-to-the-nahr-ibrahim": homeAssets.departments.archive.src,
  "letter-from-beirut-about-normality": homeAssets.departments.letters.src,
  "letter-to-a-friend-about-staying": homeAssets.hero.src,
  "letter-from-the-shoreline": homeAssets.hero.src,
  "letter-on-small-authorities": homeAssets.departments.archive.src,
};

export function getLetterImage(slug: string, index = 0) {
  const fallback = [
    homeAssets.departments.letters.src,
    homeAssets.hero.src,
    homeAssets.departments.archive.src,
    homeAssets.departments.notebook.src,
  ];

  return generatedLetterImages[slug] ?? fallback[index % fallback.length];
}

const generatedNotebookImages: Record<string, string> = {
  "the-generator": homeAssets.departments.essays.src,
  "a-bench-is-a-political-object": homeAssets.departments.notebook.src,
  "the-building-as-republic": homeAssets.edition[5].src,
  "the-horns-at-faqra": homeAssets.departments.essays.src,
  "ahirams-keyboard": homeAssets.departments.letters.src,
  "beirut-april": homeAssets.hero.src,
  "paper-grain-and-power": homeAssets.departments.letters.src,
  "raouche-1975": homeAssets.hero.src,
  "on-discipline": homeAssets.departments.letters.src,
  "the-city-at-dusk": homeAssets.hero.src,
};

export function getNotebookImage(slug: string, index = 0) {
  const fallback = [
    homeAssets.departments.notebook.src,
    homeAssets.departments.letters.src,
    homeAssets.edition[5].src,
    homeAssets.departments.essays.src,
  ];

  return generatedNotebookImages[slug] ?? fallback[index % fallback.length];
}

export const visualAssets = {
  coast: homeAssets.hero.src,
  coastWide: homeAssets.hero.src,
  skyline: homeAssets.edition[5].src,
  apartment: homeAssets.departments.essays.src,
  map: homeAssets.departments.notebook.src,
  letterpress: homeAssets.departments.letters.src,
  manuscript: homeAssets.departments.letters.src,
  notebookSpread: homeAssets.departments.notebook.src,
  archSketch: homeAssets.departments.notebook.src,
  documentStack: homeAssets.departments.letters.src,
  archive: homeAssets.departments.archive.src,
  port: homeAssets.hero.src,
};

export const arabicCopy = {
  homeQuote: "لم يكن هذا الانهيار صدفة، بل من تصميم وتخطيط ومصلحة.",
  homeSubquote: "لم يكن حتمياً. لقد بُنِي.",
  essaysTitle: "مقالات",
  essaysSubtitle: "مقالات طويلة، تأملات، وأفكار عن لبنان، الذاكرة، السلطة، والهوية.",
  articleLeft: "حين يُصمَّم الانهيار، لا يعود مفاجأة، بل نهاية مُعلنة.",
  articleRight: "نحن لا نعيش أزمة، نحن نعيش نتيجة.",
};
