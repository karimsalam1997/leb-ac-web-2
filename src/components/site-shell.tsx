import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { AtSign, Mail, Send } from "lucide-react";

const navItems = [
  { href: "/essays", label: "Essays", arabic: "مقالات" },
  { href: "/letters", label: "Letters", arabic: "رسائل" },
  { href: "/notebook", label: "Notebook", arabic: "دفتر الملاحظات" },
  { href: "/#archive", label: "Archive", arabic: "الأرشيف" },
  { href: "/submit", label: "Submit", arabic: "أرسل كتابة" },
];


export function SiteShell({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="page-shell">
      <div className="left-rail">
        <div className="rail-label">Lebanese Academic / الأكاديمي اللبناني</div>
      </div>
      <div className="right-rail">
        <div className="rail-label">A record. A witness. A school.</div>
      </div>
      <div className="press-topline">
        <div className="paper-frame press-topline-inner">
          <span>A record. A witness. A school.</span>
          <span className="arabic">سجل · شهادة · مدرسة</span>
          <span className="press-topline-right">Beirut — Levant — Diaspora</span>
          <span className="arabic">بيروت — الشام — المغترب</span>
        </div>
      </div>

      <header className="paper-frame masthead-frame">
        <div className="masthead">
          <Link href="/" className="brand-lockup" aria-label="Lebanese Academic home">
            <HeaderBrand />
          </Link>

          <div className="masthead-divider" />

          <div className="masthead-statement">
            <p>Publishing writing that decodes power and preserves memory.</p>
            <p className="arabic">نشر الكتابة التي تفكك السلطة وتصون الذاكرة.</p>
          </div>

          <div className="site-actions">
            <Link href="/submit" className="header-submit-action">
              Submit
            </Link>
            <Link href="/letters" className="language-pill arabic">
              عربي
            </Link>
          </div>
        </div>

        <div className="nav-bar">
          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="top-nav-link"
                data-active={
                  item.href === "/"
                    ? activePath === "/"
                    : activePath.startsWith(item.href)
                }
              >
                <span>{item.label}</span>
                <span className="arabic">{item.arabic}</span>
              </Link>
            ))}
          </nav>
          <div className="beirut-stamp">
            Beirut
            <span>1975</span>
          </div>
        </div>
      </header>
      <main>{children}</main>
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
              <div>A record. A witness. A school.</div>
              <div className="arabic">سجل · شهادة · مدرسة</div>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/essays">Manifesto</Link>
            <Link href="/essays">Editorial Principles</Link>
            <Link href="/submit">Submissions</Link>
            <Link href="/submit">Guidelines</Link>
            <Link href="/submit">Contact</Link>
          </nav>
          <div className="footer-social">
            <AtSign size={19} strokeWidth={1.5} />
            <Send size={18} strokeWidth={1.5} />
            <Mail size={19} strokeWidth={1.5} />
          </div>
          <div className="footer-credit">
            © 2026 Lebanese Academic
            <br />
            Published with care.
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
