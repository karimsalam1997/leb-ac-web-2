"use client";

import Image from "next/image";
import Link from "next/link";
import { Languages, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const mobileNavItems = [
  { href: "/essays", label: "Essays" },
  { href: "/#archive", label: "Archive" },
  { href: "/#about", label: "About" },
  { href: "/submit", label: "Submit" },
];

const drawerItems = [
  { href: "/essays", label: "Essays", arabic: "مقالات" },
  { href: "/#archive", label: "Archive", arabic: "الأرشيف" },
  { href: "/#about", label: "About", arabic: "عنّا" },
  { href: "/submit", label: "Submit", arabic: "أرسل كتابة" },
  { href: "/letters", label: "Letters", arabic: "رسائل" },
  { href: "/notebook", label: "Notebook", arabic: "دفتر الملاحظات" },
  { href: "/essays", label: "Manifesto" },
  { href: "/essays", label: "Editorial Principles" },
  { href: "/submit", label: "Contact" },
];

function isActivePath(activePath: string, href: string) {
  if (href === "/essays") {
    return activePath.startsWith("/essays");
  }

  if (href === "/submit") {
    return activePath.startsWith("/submit");
  }

  if (href === "/letters") {
    return activePath.startsWith("/letters");
  }

  if (href === "/notebook") {
    return activePath.startsWith("/notebook");
  }

  return false;
}

export function MobileHeader({ activePath }: { activePath: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const drawer = drawerRef.current;
    drawer?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!activeElement || !focusable.includes(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  function closeDrawer() {
    setIsDrawerOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <header className="mobile-site-header" aria-label="Mobile site header">
      <div className="mobile-brand-bar">
        <Link href="/" className="mobile-brand-link" aria-label="Lebanese Academic home">
          <Image
            src="/brand/la-witness-glyph.png"
            alt=""
            width={42}
            height={46}
            priority
            className="mobile-brand-glyph"
            style={{ width: "clamp(32px, 9.5vw, 40px)", height: "auto" }}
          />
          <span className="mobile-wordmark">
            <span>Lebanese Academic</span>
            <span className="arabic">الأكاديمي اللبناني</span>
          </span>
        </Link>

        <div className="mobile-header-actions">
          <button className="mobile-icon-button" type="button" aria-label="Search">
            <Search size={19} strokeWidth={1.55} />
          </button>
          <button className="mobile-icon-button" type="button" aria-label="Switch language">
            <Languages size={19} strokeWidth={1.55} />
          </button>
          <button
            ref={menuButtonRef}
            className="mobile-icon-button mobile-menu-button"
            type="button"
            aria-label="Open menu"
            aria-controls="mobile-menu-drawer"
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={21} strokeWidth={1.65} />
          </button>
        </div>
      </div>

      <nav className="mobile-primary-nav" aria-label="Mobile primary navigation">
        {mobileNavItems.map((item) => {
          const isActive = isActivePath(activePath, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          data-active={isDrawerOpen}
          aria-controls="mobile-menu-drawer"
          aria-expanded={isDrawerOpen}
          onClick={() => setIsDrawerOpen(true)}
        >
          More
        </button>
      </nav>

      {isDrawerOpen ? (
        <div className="mobile-drawer-layer">
          <button
            className="mobile-drawer-scrim"
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
          />
          <div
            ref={drawerRef}
            id="mobile-menu-drawer"
            className="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            tabIndex={-1}
          >
            <div className="mobile-drawer-top">
              <div>
                <div id="mobile-menu-title" className="mobile-drawer-title">
                  Lebanese Academic
                </div>
                <div className="arabic mobile-drawer-subtitle">الأكاديمي اللبناني</div>
              </div>
              <button className="mobile-icon-button" type="button" aria-label="Close menu" onClick={closeDrawer}>
                <X size={20} strokeWidth={1.65} />
              </button>
            </div>

            <div className="mobile-drawer-statement">
              <p>Publishing writing that decodes power and preserves memory.</p>
              <p className="arabic">نشر الكتابة التي تفكك السلطة وتصون الذاكرة.</p>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Mobile menu navigation">
              {drawerItems.map((item) => {
                const isActive = isActivePath(activePath, item.href);

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    data-active={isActive}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.arabic ? <span className="arabic">{item.arabic}</span> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="mobile-drawer-footer">
              <span>Beirut — Levant — Diaspora</span>
              <span className="arabic">بيروت — الشام — المغترب</span>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
