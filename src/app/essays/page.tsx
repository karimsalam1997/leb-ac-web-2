import { EssaysIndexClient, type EssayIndexItem } from "./essay-index-client";
import { SiteShell } from "@/components/site-shell";
import { essays } from "@/lib/content";
import { getArticleImage } from "@/lib/visual-assets";

export default function EssaysPage() {
  const essayItems: EssayIndexItem[] = essays.map((essay, index) => ({
    slug: essay.slug,
    title: essay.title,
    dek: essay.dek,
    byline: essay.byline,
    date: essay.date,
    readTime: essay.readTime,
    excerpt: essay.excerpt,
    tags: essay.tags,
    imageSrc: getArticleImage(essay.slug, index),
    sourceIndex: index,
  }));

  return (
    <SiteShell activePath="/essays">
      <EssaysIndexClient essays={essayItems} />
    </SiteShell>
  );
}
