import { EssaysIndexClient, type EssayIndexItem } from "./essay-index-client";
import { SiteShell } from "@/components/site-shell";
import { essays } from "@/lib/content";
import { getArticleImage } from "@/lib/visual-assets";

export default async function EssaysPage({
  searchParams,
}: {
  searchParams?: Promise<{ topic?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : {};
  const topicParam = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  const availableTopics = new Set(essays.flatMap((essay) => essay.tags));
  const initialTopic = topicParam && availableTopics.has(topicParam) ? topicParam : null;
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
      <EssaysIndexClient essays={essayItems} initialTopic={initialTopic} />
    </SiteShell>
  );
}
