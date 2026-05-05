const homeBase = "/home";

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

const generatedImageBySlug: Record<string, string> = {
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
};

export function getArticleImage(slug: string, index = 0) {
  return generatedImageBySlug[slug] ?? generatedArticleImages[index % generatedArticleImages.length];
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
