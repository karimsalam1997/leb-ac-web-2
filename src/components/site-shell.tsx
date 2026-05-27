"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";

// Letters intentionally hidden from primary nav until /letters/[slug] ships.
// The submission funnel ("Submit") and the inline letters card on the homepage
// keep the section alive for readers without surfacing an empty mailbag.
const navItems = [
  { href: "/essays", label: "Essays", arabic: "المقالات" },
  { href: "/signal-desk", label: "Signal Desk", arabic: "غرفة الإشارات" },
  { href: "/#topics", label: "Topics", arabic: "المحاور" },
  { href: "/notebook", label: "Notebook", arabic: "الدفتر" },
  { href: "/about", label: "About", arabic: "عنّا" },
];

const mastheadShrinkOffset = 160;
const mastheadExpandOffset = 32;
const mastheadSettleDuration = 280;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== "hidden",
  );
}

export function SiteShell({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath: string;
}) {
  const [isMastheadScrolled, setIsMastheadScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mastheadFrameRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const mastheadScrolledRef = useRef(isMastheadScrolled);

  useEffect(() => {
    let animationFrame = 0;
    let resizeAnimationFrame = 0;
    let settleTimer = 0;
    let isMastheadSettling = false;

    const preserveScrollDuringMastheadResize = () => {
      const mastheadFrame = mastheadFrameRef.current;
      if (!mastheadFrame) {
        return;
      }

      if (resizeAnimationFrame) {
        window.cancelAnimationFrame(resizeAnimationFrame);
      }

      let lastHeight = mastheadFrame.getBoundingClientRect().height;
      const startedAt = window.performance.now();

      const preserveScroll = () => {
        const nextHeight = mastheadFrame.getBoundingClientRect().height;
        const heightDelta = lastHeight - nextHeight;

        if (heightDelta > 0.1) {
          window.scrollBy(0, heightDelta);
        }

        lastHeight = nextHeight;

        if (window.performance.now() - startedAt < mastheadSettleDuration + 80) {
          resizeAnimationFrame = window.requestAnimationFrame(preserveScroll);
          return;
        }

        resizeAnimationFrame = 0;
      };

      resizeAnimationFrame = window.requestAnimationFrame(preserveScroll);
    };

    const setMastheadScrolledState = (nextIsScrolled: boolean) => {
      preserveScrollDuringMastheadResize();
      mastheadScrolledRef.current = nextIsScrolled;
      setIsMastheadScrolled(nextIsScrolled);

      isMastheadSettling = true;
      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }

      settleTimer = window.setTimeout(() => {
        isMastheadSettling = false;
        updateMastheadState();
      }, mastheadSettleDuration);
    };

    const updateMastheadState = () => {
      animationFrame = 0;
      if (isMastheadSettling) {
        return;
      }

      const scrollTop = window.scrollY;

      if (!mastheadScrolledRef.current && scrollTop > mastheadShrinkOffset) {
        setMastheadScrolledState(true);
        return;
      }

      if (mastheadScrolledRef.current && scrollTop < mastheadExpandOffset) {
        setMastheadScrolledState(false);
      }
    };

    const handleScroll = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateMastheadState);
    };

    updateMastheadState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (resizeAnimationFrame) {
        window.cancelAnimationFrame(resizeAnimationFrame);
      }

      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusTo = menuButtonRef.current;
    document.body.style.overflow = "hidden";

    const focusMenu = () => {
      const panel = menuPanelRef.current;
      if (!panel) {
        return;
      }

      const firstFocusable = getFocusableElements(panel)[0];
      (menuCloseButtonRef.current ?? firstFocusable ?? panel).focus();
    };
    const focusTimers = [
      window.setTimeout(focusMenu, 0),
      window.setTimeout(focusMenu, 80),
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = menuPanelRef.current;
      if (!panel) {
        return;
      }

      const focusableElements = getFocusableElements(panel);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        firstFocusable.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      focusTimers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusTo?.focus();
    };
  }, [isMenuOpen]);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#site-content">
        Skip to content
      </a>
      <div className="left-rail">
        <div className="rail-label">Lebanese Academic / الأكاديمي اللبناني</div>
      </div>
      <div className="right-rail">
        <div className="rail-label">The country, not the crisis.</div>
      </div>
      <div className="press-topline">
        <div className="paper-frame press-topline-inner">
          <span>The country, not the crisis.</span>
          <span className="arabic">البلد، لا الأزمة.</span>
          <span className="press-topline-right">Beirut · Levant · Diaspora</span>
          <span className="arabic">بيروت · المشرق · المهجر</span>
        </div>
      </div>

      <header
        ref={mastheadFrameRef}
        className="paper-frame masthead-frame desktop-site-header"
        data-scrolled={isMastheadScrolled}
      >
        <div className="masthead">
          <Link href="/" className="brand-lockup" aria-label="Lebanese Academic home">
            <HeaderBrand />
          </Link>

          <div className="masthead-divider" />

          <div className="masthead-statement">
            <p>Publishing writing that decodes power and preserves memory.</p>
            <p className="arabic">نُصدِر كتابةً تُفكّك السلطة وتصون الذاكرة.</p>
          </div>

          <div className="site-actions">
            <Link href="/submit" className="header-submit-action">
              Submit
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="icon-button mobile-menu-button"
              aria-label="Open navigation menu"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="nav-bar">
          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="top-nav-link"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <span className="arabic">{item.arabic}</span>
                </Link>
              );
            })}
          </nav>
          <div className="beirut-stamp" title="Founded in the long shadow of 1975.">
            Beirut
            <span>1975</span>
          </div>
        </div>
      </header>
      <aside className="edition-stamp" aria-hidden="true">
        ISSUE 01
      </aside>
      <div
        className="mobile-menu-overlay"
        data-open={isMenuOpen}
        aria-hidden={!isMenuOpen}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div
          id="mobile-menu"
          ref={menuPanelRef}
          className="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
        >
          <button
            ref={menuCloseButtonRef}
            type="button"
            className="icon-button mobile-menu-close"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <nav className="mobile-menu-nav" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-menu-link"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="arabic">{item.arabic}</span>
                </Link>
              );
            })}
          </nav>
          <Link
            href="/submit"
            className="mobile-submit-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Submit a letter <span aria-hidden="true">→</span>
          </Link>
          <Image
            src="/brand/witness-glyph.png"
            alt=""
            width={116}
            height={116}
            className="mobile-menu-glyph"
            aria-hidden="true"
            style={{ height: "auto" }}
          />
        </div>
      </div>
      <MobileHeader activePath={activePath} />
      <main id="site-content">{children}</main>
      <footer className="site-footer mt-4">
        <div className="paper-frame site-footer-inner">
          <div className="footer-brand">
            <Image
              src="/brand/la-editors-mark.png"
              alt="Lebanese Academic mark"
              width={58}
              height={58}
            />
            <div>
              <div>The country, not the crisis.</div>
              <div className="arabic">البلد، لا الأزمة.</div>
              <div className="footer-anchor">
                Founded in the long shadow of 1975.
              </div>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/essays">Essays</Link>
            <Link href="/signal-desk">Signal Desk</Link>
            <Link href="/submit">Submit</Link>
            <Link href="/letters">Letters</Link>
          </nav>
          <nav className="footer-social" aria-label="Off-site channels">
            <a
              href="https://instagram.com/lebaneseacademic"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lebanese Academic on Instagram"
            >
              @lebaneseacademic
            </a>
            <a
              href="mailto:editors@lebaneseacademic.com"
              aria-label="Email the editors"
            >
              editors@lebaneseacademic.com
            </a>
          </nav>
          <div className="footer-credit">
            © 2026 Lebanese Academic
            <br />
            Published with care.
          </div>
          <div className="footer-issue-stamp dense-meta">
            ISSUE NO. 01 / MAY 2026 / BEIRUT
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeaderBrand() {
  return (
    <div className="header-brand" aria-hidden="true">
      <Image
        src="/brand/la-editors-mark.png"
        alt=""
        width={82}
        height={82}
        priority
        className="header-brand-mark"
      />
      <div className="header-brand-wordmarks">
        <div className="header-brand-english">
          <span>Lebanese</span>
          <span>Academic</span>
        </div>
        <div className="header-brand-arabic arabic">
          <span>الأكاديمي</span>
          <span>اللبناني</span>
        </div>
      </div>
    </div>
  );
}
