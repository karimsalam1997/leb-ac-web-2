const generatedBase = "/editorial/generated-archive";

export const generatedArticleImages = [
  `${generatedBase}/beirut-coastline.jpg`,
  `${generatedBase}/generator-wires.jpg`,
  `${generatedBase}/census-ledger.jpg`,
  `${generatedBase}/street-archive.jpg`,
  `${generatedBase}/diaspora-trunk.jpg`,
  `${generatedBase}/ruins-cranes.jpg`,
  `${generatedBase}/port-silos.jpg`,
  `${generatedBase}/bank-vault.jpg`,
  `${generatedBase}/empty-downtown.jpg`,
  `${generatedBase}/typewriter-letter.jpg`,
  `${generatedBase}/river-villages.jpg`,
  `${generatedBase}/cartel-boardroom.jpg`,
  `${generatedBase}/dog-river-inscription.jpg`,
  `${generatedBase}/fractured-blueprint.jpg`,
  `${generatedBase}/museum-stones.jpg`,
  `${generatedBase}/mourning-hills.jpg`,
  `${generatedBase}/looted-coast.jpg`,
  `${generatedBase}/beirut-balcony-dusk.jpg`,
  `${generatedBase}/south-village-road.jpg`,
  `${generatedBase}/alphabet-screen.jpg`,
  `${generatedBase}/border-watchtowers.jpg`,
  `${generatedBase}/notebook-map.jpg`,
  `${generatedBase}/airmail-rooftops.jpg`,
  `${generatedBase}/faqra-stones.jpg`,
];

const generatedImageBySlug: Record<string, string> = {
  "the-cartel-in-the-costume-of-a-country": `${generatedBase}/beirut-coastline.jpg`,
  "cartel-in-the-costume-of-a-country": `${generatedBase}/beirut-coastline.jpg`,
  "the-mehtail-republic": `${generatedBase}/generator-wires.jpg`,
  "the-census-that-cannot-be-taken": `${generatedBase}/census-ledger.jpg`,
  "sovereignty-theatre": `${generatedBase}/street-archive.jpg`,
  "the-brilliant-nodes": `${generatedBase}/diaspora-trunk.jpg`,
  "what-taif-actually-said": `${generatedBase}/ruins-cranes.jpg`,
  "the-rubble-zone": `${generatedBase}/port-silos.jpg`,
  "the-service-state": `${generatedBase}/bank-vault.jpg`,
  "the-franchisor-has-left-the-building": `${generatedBase}/empty-downtown.jpg`,
  "the-franchisor-has-left": `${generatedBase}/empty-downtown.jpg`,
  "the-transaction": `${generatedBase}/typewriter-letter.jpg`,
  "the-seventeen-countries": `${generatedBase}/river-villages.jpg`,
  "the-cartel-board-meeting": `${generatedBase}/cartel-boardroom.jpg`,
  "the-dog-river-keeps-the-minutes": `${generatedBase}/dog-river-inscription.jpg`,
  "the-dog-river-remembers": `${generatedBase}/dog-river-inscription.jpg`,
  "the-fracture-was-the-blueprint": `${generatedBase}/fractured-blueprint.jpg`,
  "stones-that-outlived-their-gods": `${generatedBase}/museum-stones.jpg`,
  "the-land-that-mourns-in-one-language": `${generatedBase}/mourning-hills.jpg`,
  "same-grief-for-three-thousand-years": `${generatedBase}/mourning-hills.jpg`,
  "the-looted-coast": `${generatedBase}/looted-coast.jpg`,
  "memorycide-on-the-coast": `${generatedBase}/looted-coast.jpg`,
  "downtown-without-a-city": `${generatedBase}/empty-downtown.jpg`,
  "cousins-across-a-river-that-shouldnt-exist": `${generatedBase}/river-villages.jpg`,
  "every-letter-on-this-screen": `${generatedBase}/alphabet-screen.jpg`,
  "the-seventeen-countries-wearing-a-trenchcoat": `${generatedBase}/border-watchtowers.jpg`,
  "the-architecture-of-consolation": `${generatedBase}/faqra-stones.jpg`,
};

export function getArticleImage(slug: string, index = 0) {
  return generatedImageBySlug[slug] ?? generatedArticleImages[index % generatedArticleImages.length];
}

const generatedLetterImages: Record<string, string> = {
  "letter-to-the-south": `${generatedBase}/south-village-road.jpg`,
  "letter-to-beirut": `${generatedBase}/beirut-balcony-dusk.jpg`,
  "letter-to-karl": `${generatedBase}/typewriter-letter.jpg`,
  "letter-to-the-young-lebanese-abroad": `${generatedBase}/diaspora-trunk.jpg`,
  "letter-to-the-nahr-ibrahim": `${generatedBase}/river-villages.jpg`,
  "letter-from-beirut-about-normality": `${generatedBase}/airmail-rooftops.jpg`,
  "letter-to-a-friend-about-staying": `${generatedBase}/beirut-balcony-dusk.jpg`,
  "letter-from-the-shoreline": `${generatedBase}/beirut-coastline.jpg`,
  "letter-on-small-authorities": `${generatedBase}/street-archive.jpg`,
};

export function getLetterImage(slug: string, index = 0) {
  const fallback = [
    `${generatedBase}/airmail-rooftops.jpg`,
    `${generatedBase}/beirut-balcony-dusk.jpg`,
    `${generatedBase}/south-village-road.jpg`,
    `${generatedBase}/typewriter-letter.jpg`,
    `${generatedBase}/river-villages.jpg`,
  ];

  return generatedLetterImages[slug] ?? fallback[index % fallback.length];
}

const generatedNotebookImages: Record<string, string> = {
  "the-generator": `${generatedBase}/generator-wires.jpg`,
  "a-bench-is-a-political-object": `${generatedBase}/faqra-stones.jpg`,
  "the-building-as-republic": `${generatedBase}/fractured-blueprint.jpg`,
  "the-horns-at-faqra": `${generatedBase}/museum-stones.jpg`,
  "ahirams-keyboard": `${generatedBase}/alphabet-screen.jpg`,
  "beirut-april": `${generatedBase}/notebook-map.jpg`,
  "paper-grain-and-power": `${generatedBase}/airmail-rooftops.jpg`,
  "raouche-1975": `${generatedBase}/beirut-coastline.jpg`,
  "on-discipline": `${generatedBase}/census-ledger.jpg`,
  "the-city-at-dusk": `${generatedBase}/beirut-balcony-dusk.jpg`,
};

export function getNotebookImage(slug: string, index = 0) {
  const fallback = [
    `${generatedBase}/notebook-map.jpg`,
    `${generatedBase}/airmail-rooftops.jpg`,
    `${generatedBase}/fractured-blueprint.jpg`,
    `${generatedBase}/museum-stones.jpg`,
    `${generatedBase}/alphabet-screen.jpg`,
  ];

  return generatedNotebookImages[slug] ?? fallback[index % fallback.length];
}

export const visualAssets = {
  coast: `${generatedBase}/beirut-coastline.jpg`,
  coastWide: `${generatedBase}/beirut-coastline.jpg`,
  skyline: `${generatedBase}/beirut-balcony-dusk.jpg`,
  apartment: `${generatedBase}/generator-wires.jpg`,
  map: `${generatedBase}/notebook-map.jpg`,
  letterpress: `${generatedBase}/typewriter-letter.jpg`,
  manuscript: `${generatedBase}/airmail-rooftops.jpg`,
  notebookSpread: `${generatedBase}/notebook-map.jpg`,
  archSketch: `${generatedBase}/fractured-blueprint.jpg`,
  documentStack: `${generatedBase}/census-ledger.jpg`,
  archive: `${generatedBase}/street-archive.jpg`,
  port: `${generatedBase}/port-silos.jpg`,
};

export const arabicCopy = {
  homeQuote: "لم يكن هذا الانهيار صدفة، بل من تصميم وتخطيط ومصلحة.",
  homeSubquote: "لم يكن حتمياً. لقد بُنِي.",
  essaysTitle: "مقالات",
  essaysSubtitle: "مقالات طويلة، تأملات، وأفكار عن لبنان، الذاكرة، السلطة، والهوية.",
  articleLeft: "حين يُصمَّم الانهيار، لا يعود مفاجأة، بل نهاية مُعلنة.",
  articleRight: "نحن لا نعيش أزمة، نحن نعيش نتيجة.",
};
