import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/lib/seo";
import { getSanityPosts } from "@/sanity/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Posts",
  description:
    "Posts published from Sanity into the Lebanese Academic website.",
  path: "/posts",
});

export default async function PostsPage() {
  const posts = await getSanityPosts();

  return (
    <SiteShell activePath="/posts">
      <section className="paper-frame sanity-posts-page">
        <header className="sanity-posts-header editorial-rule">
          <div>
            <div className="editorial-kicker">Sanity CMS</div>
            <h1 className="display-title">Posts</h1>
          </div>
          <p>
            These are documents written in Sanity and pulled into the website.
          </p>
        </header>

        {posts.length ? (
          <div className="sanity-post-list">
            {posts.map((post) => (
              <article key={post._id} className="sanity-post-card">
                <div className="dense-meta">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <h2>
                  <Link href={`/posts/${post.slug.current}`}>{post.title}</Link>
                </h2>
                <Link href={`/posts/${post.slug.current}`} className="read-link">
                  Read post <span className="link-arrow">-&gt;</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="sanity-post-empty">
            <h2>No posts published yet</h2>
            <p>
              Publish a Post in Sanity Studio, then refresh this page.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
