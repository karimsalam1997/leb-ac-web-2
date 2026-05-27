/**
 * Running header strip for the single-essay page.
 * Sits under the masthead on desktop as a quiet, non-sticky running head —
 * the unit a long-form publication uses to locate the reader inside an issue.
 *
 * Deliberate choices:
 *   - `issue` is accepted but NOT rendered: the vertical "ISSUE 01"
 *     edition-stamp on the right of the page already carries it, and
 *     printing it twice was crowding the nav.
 *   - The strip is non-sticky (see CSS): on scroll the masthead does the
 *     shrinking; the strip simply scrolls away with the article. Layered
 *     behaviour was making the nav feel pinched.
 */
export function ArticleRunningHeader({
  category,
  surname,
}: {
  /**
   * Accepted for API compatibility but intentionally NOT rendered.
   * The vertical "ISSUE 01" edition-stamp on the right of the page
   * already carries it; printing it here too crowds the nav.
   */
  issue?: string;
  category: string;
  surname: string;
}) {
  return (
    <div className="article-running-header" aria-hidden="true">
      <span className="article-running-mast">Lebanese Academic</span>
      <span className="article-running-sep">·</span>
      <span>{category}</span>
      <span className="article-running-sep">·</span>
      <span className="article-running-author">{surname}</span>
    </div>
  );
}
