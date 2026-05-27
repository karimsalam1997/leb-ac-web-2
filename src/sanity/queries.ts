import { type PortableTextBlock } from "next-sanity";
import { client } from "./client";

export type SanityPostListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
};

export type SanityPost = SanityPostListItem & {
  image?: unknown;
  body?: PortableTextBlock[];
};

export type SanityEssayListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  dek: string;
  byline: string;
  publicationDate: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  pullQuote?: string;
};

export type SanityEssay = SanityEssayListItem & {
  arabicDisplayLine?: string;
  dateline?: string;
  bodyPullQuote?: string;
  marginaliaNote?: string;
  marginaliaNoteAttribution?: string;
  mainImage?: unknown;
  body?: PortableTextBlock[];
  notes?: Array<{ text: string }>;
  relatedSlugs?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export const POST_QUERY = `*[
  _type == "post"
  && slug.current == $slug
][0]{_id, title, slug, publishedAt, image, body}`;

export const ESSAYS_QUERY = `*[
  _type == "essay"
  && defined(slug.current)
]|order(publicationDate desc)[0...30]{
  _id,
  title,
  slug,
  dek,
  byline,
  publicationDate,
  readTime,
  category,
  tags,
  excerpt,
  pullQuote
}`;

export const ESSAY_QUERY = `*[
  _type == "essay"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  dek,
  byline,
  publicationDate,
  readTime,
  category,
  tags,
  excerpt,
  pullQuote,
  arabicDisplayLine,
  dateline,
  bodyPullQuote,
  marginaliaNote,
  marginaliaNoteAttribution,
  mainImage,
  body,
  notes,
  relatedSlugs,
  seo
}`;

const options = { next: { revalidate: 30 } };

export function getSanityPosts() {
  return client.fetch<SanityPostListItem[]>(POSTS_QUERY, {}, options);
}

export function getSanityPost(slug: string) {
  return client.fetch<SanityPost | null>(POST_QUERY, { slug }, options);
}

export function getSanityEssays() {
  return client.fetch<SanityEssayListItem[]>(ESSAYS_QUERY, {}, options);
}

export function getSanityEssay(slug: string) {
  return client.fetch<SanityEssay | null>(ESSAY_QUERY, { slug }, options);
}
