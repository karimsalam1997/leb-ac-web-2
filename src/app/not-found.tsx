import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell activePath="">
      <section className="paper-frame not-found-page pt-5 pb-12">
        <div className="not-found-inner editorial-rule">
          <div>
            <div className="article-kicker">404</div>
            <h1 className="display-title text-[4.5rem] leading-none">
              This page has no address.
            </h1>
            <p className="mt-4 max-w-xl text-[1.25rem] leading-7 text-[var(--ink-soft)]">
              The route is missing, renamed, or waiting for an editor to give
              it a proper place in the archive.
            </p>
          </div>
          <div className="not-found-actions">
            <Link href="/essays" className="read-link">
              Essays <span className="link-arrow">-&gt;</span>
            </Link>
            <Link href="/topics" className="read-link">
              Topics <span className="link-arrow">-&gt;</span>
            </Link>
            <Link href="/" className="read-link">
              Home <span className="link-arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
