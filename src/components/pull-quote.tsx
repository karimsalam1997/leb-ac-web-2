import type { ReactNode } from "react";

/**
 * Editorial pull-quote. On desktop it floats into the margin rail beside the
 * reading column; on mobile it sits inline at full body width. The
 * attribution is optional and renders below the quote in small caps.
 *
 * Usage inside an essay:
 *   <PullQuote attribution="From the essay">
 *     A letter is the unit of writing that survives the news cycle.
 *   </PullQuote>
 */
export function PullQuote({
  children,
  attribution,
  side = "right",
  className = "",
}: {
  children: ReactNode;
  attribution?: string;
  side?: "right" | "left" | "inline";
  className?: string;
}) {
  return (
    <aside
      className={`pull-quote pull-quote--${side} ${className}`.trim()}
      role="note"
    >
      <p>{children}</p>
      {attribution ? (
        <cite className="pull-quote-cite">{attribution}</cite>
      ) : null}
    </aside>
  );
}
