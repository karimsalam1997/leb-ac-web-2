import "server-only";

import type { Metadata } from "next";
import type { Essay } from "@/lib/content";

export const siteName = "Lebanese Academic";
export const siteDescription =
  "A literary-political publication on Lebanon, memory, power, and public life.";
export const siteAuthor = "Karim Salam";
export const defaultOgImage = "/brand/la-primary-lockup.png";

function normalizeSiteUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return undefined;
  }
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    new URL("http://localhost:3000")
  );
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function toIsoDate(date: string) {
  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) {
    return undefined;
  }

  return new Date(timestamp).toISOString();
}

function displayTitle(title: string, absoluteTitle = false) {
  return absoluteTitle || title === siteName ? title : `${title} / ${siteName}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const metadataTitle = displayTitle(title, absoluteTitle);
  const imageUrl = absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metadataTitle,
      description,
      url,
      siteName,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: metadataTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function buildEssayMetadata({
  essay,
  path,
  image,
}: {
  essay: Essay;
  path: string;
  image: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const publishedTime = toIsoDate(essay.date);

  return {
    title: essay.title,
    description: essay.dek,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: displayTitle(essay.title),
      description: essay.dek,
      url,
      siteName,
      type: "article",
      publishedTime,
      modifiedTime: publishedTime,
      authors: [essay.byline],
      tags: essay.tags,
      images: [
        {
          url: imageUrl,
          alt: essay.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle(essay.title),
      description: essay.dek,
      images: [imageUrl],
    },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl().origin;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        logo: absoluteUrl("/brand/la-editors-mark.png"),
        description: siteDescription,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };
}

export function buildEssayJsonLd({
  essay,
  path,
  images,
}: {
  essay: Essay;
  path: string;
  images: string[];
}) {
  const siteUrl = getSiteUrl().origin;
  const pageUrl = absoluteUrl(path);
  const publishedDate = toIsoDate(essay.date);
  const imageUrls = images.length
    ? images.map((image) => absoluteUrl(image))
    : [absoluteUrl(defaultOgImage)];

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: pageUrl,
    headline: essay.title,
    description: essay.dek,
    image: imageUrls,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Person",
      name: essay.byline,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/la-editors-mark.png"),
      },
    },
    articleSection: essay.category,
    keywords: essay.tags,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };
}
