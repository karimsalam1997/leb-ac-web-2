import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/lib/seo";
import { urlFor } from "@/sanity/image";
import { getSanityPost } from "@/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSanityPost(slug);

  if (!post) {
    return { title: "Post Not Found / Lebanese Academic" };
  }

  return buildPageMetadata({
    title: post.title,
    description: "A Sanity-published post on Lebanese Academic.",
    path: `/posts/${post.slug.current}`,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getSanityPost(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.image ? urlFor(post.image)?.width(1400).height(760).url() : null;

  return (
    <SiteShell activePath="/posts">
      <article className="paper-frame sanity-post-page">
        <Link href="/posts" className="read-link">
          <span className="link-arrow">&lt;-</span> Back to posts
        </Link>

        <header className="sanity-post-article-header editorial-rule">
          <div className="editorial-kicker">Sanity CMS</div>
          <h1 className="display-title">{post.title}</h1>
          <div className="dense-meta">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </header>

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            width={1400}
            height={760}
            className="sanity-post-hero-image"
            sizes="(min-width: 1024px) 960px, 100vw"
          />
        ) : null}

        <div className="body-copy sanity-post-body">
          {post.body?.length ? (
            <PortableText value={post.body} />
          ) : (
            <p>This post has no body yet.</p>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
