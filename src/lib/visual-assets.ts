const generatedBase = "/editorial/generated-archive";

export const generatedArticleImages = [
  `${generatedBase}/beirut-coastline.jpg`,
  `${generatedBase}/generator-wires.jpg`,
  `${generatedBase}/census-ledger.jpg`,
  `${generatedBase}/bank-vault.jpg`,
  `${generatedBase}/cartel-boardroom.jpg`,
  `${generatedBase}/ruins-cranes.jpg`,
  `${generatedBase}/border-watchtowers.jpg`,
  `${generatedBase}/port-silos.jpg`,
  `${generatedBase}/diaspora-trunk.jpg`,
  `${generatedBase}/notebook-map.jpg`,
  `${generatedBase}/airmail-rooftops.jpg`,
  `${generatedBase}/street-archive.jpg`,
  `${generatedBase}/dog-river-inscription.jpg`,
  `${generatedBase}/fractured-blueprint.jpg`,
  `${generatedBase}/museum-stones.jpg`,
  `${generatedBase}/mourning-hills.jpg`,
  `${generatedBase}/looted-coast.jpg`,
  `${generatedBase}/empty-downtown.jpg`,
  `${generatedBase}/river-villages.jpg`,
  `${generatedBase}/alphabet-screen.jpg`,
  `${generatedBase}/south-village-road.jpg`,
  `${generatedBase}/beirut-balcony-dusk.jpg`,
  `${generatedBase}/typewriter-letter.jpg`,
  `${generatedBase}/faqra-stones.jpg`,
];

const generatedImageBySlug: Record<string, string> = {
  "the-cartel-in-the-costume-of-a-country": `${generatedBase}/cartel-boardroom.jpg`,
  "the-mehtail-republic": `${generatedBase}/generator-wires.jpg`,
  "the-census-that-cannot-be-taken": `${generatedBase}/census-ledger.jpg`,
  "sovereignty-theatre": `${generatedBase}/street-archive.jpg`,
  "the-brilliant-nodes": `${generatedBase}/diaspora-trunk.jpg`,
  "what-taif-actually-said": `${generatedBase}/cartel-boardroom.jpg`,
  "the-rubble-zone": `${generatedBase}/port-silos.jpg`,
  "the-service-state": `${generatedBase}/bank-vault.jpg`,
  "the-franchisor-has-left-the-building": `${generatedBase}/empty-downtown.jpg`,
  "the-transaction": `${generatedBase}/typewriter-letter.jpg`,
  "the-seventeen-countries": `${generatedBase}/river-villages.jpg`,
  "the-cartel-board-meeting": `${generatedBase}/cartel-boardroom.jpg`,
  "the-dog-river-keeps-the-minutes": `${generatedBase}/dog-river-inscription.jpg`,
  "the-fracture-was-the-blueprint": `${generatedBase}/fractured-blueprint.jpg`,
  "stones-that-outlived-their-gods": `${generatedBase}/museum-stones.jpg`,
  "the-land-that-mourns-in-one-language": `${generatedBase}/mourning-hills.jpg`,
  "the-looted-coast": `${generatedBase}/looted-coast.jpg`,
  "downtown-without-a-city": `${generatedBase}/empty-downtown.jpg`,
  "cousins-across-a-river-that-shouldnt-exist": `${generatedBase}/river-villages.jpg`,
  "every-letter-on-this-screen": `${generatedBase}/alphabet-screen.jpg`,
};

export function getArticleImage(slug: string, index = 0) {
  return generatedImageBySlug[slug] ?? generatedArticleImages[index % generatedArticleImages.length];
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
