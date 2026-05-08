"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { HeaderPhoneLink, LanguageSwitcher } from "./site-ui";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BlogStaticShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

const blogNavItems = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТИ", href: "/kontakty" },
  { label: "ПРО НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

const blogFooterLinks = [
  { label: "Головна", href: "/" },
  { label: "Напрямки", href: "/#directions" },
  { label: "Усі напрямки", href: "/routes" },
  { label: "Автопарк", href: "/avtopark" },
  { label: "Контакти", href: "/kontakty" },
  { label: "Про нас", href: "/pro-kompaniiu" },
  { label: "Блог", href: "/blog" }
];

const phoneNumber = "+38 063 824 3223";
const phoneHref = "+380638243223";

function desktopNavLinkClasses(isActive = false) {
  return [
    "relative text-[0.71rem] font-bold uppercase tracking-[0.14em] transition duration-200 xl:text-[0.76rem]",
    isActive
      ? "text-[var(--soft-gold)] after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-[1.5px] after:rounded-full after:bg-[linear-gradient(90deg,rgba(216,185,130,0.18),rgba(234,214,172,0.88),rgba(216,185,130,0.18))]"
      : "text-[rgba(247,243,234,0.8)] hover:text-[var(--soft-gold)]"
  ].join(" ");
}

function mobileNavLinkClasses(isActive = false) {
  return [
    "text-[0.92rem] font-medium uppercase tracking-[0.24em] transition",
    isActive
      ? "text-[var(--soft-gold)]"
      : "text-[rgba(247,243,234,0.88)] hover:text-[var(--soft-gold)]"
  ].join(" ");
}

export function BlogStaticShell({
  eyebrow,
  title,
  subtitle,
  children,
  breadcrumbs
}: BlogStaticShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : originalBodyOverflow;
    document.documentElement.style.overflow = menuOpen
      ? "hidden"
      : originalHtmlOverflow;

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <main className="relative overflow-hidden pb-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(216,185,130,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[22rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(29,42,31,0.42),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[52rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,185,130,0.08),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-[1536px] px-4 pt-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <header className="header-shell relative z-30 rounded-[24px] px-[18px] py-3 sm:px-5 md:rounded-[30px] md:px-7 lg:px-[34px]">
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_1fr_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_1fr_310px]">
              <Link href="/" className="header-brand block">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="luxury-logo-subtitle">VIP СЕРВІС</div>
              </Link>

              <nav className="hidden items-center justify-self-center lg:flex lg:gap-2.5 xl:gap-4">
                {blogNavItems.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={desktopNavLinkClasses(
                      href === "/blog" && (pathname === "/blog" || pathname.startsWith("/blog/"))
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center justify-self-end lg:flex lg:gap-2.5 xl:gap-3.5">
                <HeaderPhoneLink
                  pageType="about"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  iconOnly
                  className="hidden lg:inline-flex"
                />
                <LanguageSwitcher />
                <Link
                  href="/#booking"
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-6 text-[0.75rem] font-bold uppercase tracking-[0.09em] xl:h-12 xl:px-7 xl:text-[0.78rem] xl:tracking-[0.11em]"
                >
                  ЗАМОВИТИ
                </Link>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="blog-mobile-drawer"
                  aria-label="Відкрити меню"
                  onClick={() => setMenuOpen(true)}
                  className="burger-button inline-flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <BurgerIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mt-6 md:mt-7">
            <div className="panel-soft rounded-[32px] px-5 py-8 sm:px-7 md:px-10 md:py-10 lg:px-12 lg:py-12">
              {breadcrumbs?.length ? (
                <nav
                  aria-label="breadcrumbs"
                  className="mb-5 flex flex-wrap items-center gap-2 text-[0.78rem] text-[rgba(183,178,168,0.82)]"
                >
                  {breadcrumbs.map((item, index) => (
                    <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="transition hover:text-[var(--soft-gold)]"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-[rgba(247,243,234,0.9)]">{item.label}</span>
                      )}
                      {index < breadcrumbs.length - 1 ? (
                        <span className="text-[rgba(216,185,130,0.42)]">→</span>
                      ) : null}
                    </span>
                  ))}
                </nav>
              ) : null}

              <p className="eyebrow-lux">{eyebrow}</p>
              <h1 className="section-title-lux mt-4 max-w-[52rem] text-[2.3rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.95rem] lg:text-[3.35rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-[44rem] text-[0.98rem] leading-[1.85] text-[var(--muted)] md:text-[1.03rem]">
                {subtitle}
              </p>
            </div>
          </section>

          {children}
        </div>
      </main>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Закрити меню"
          onClick={() => setMenuOpen(false)}
          className={`mobile-drawer-overlay ${menuOpen ? "is-open" : ""}`}
        />

        <aside
          id="blog-mobile-drawer"
          className={`drawer-shell mobile-drawer fixed right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col rounded-l-[32px] px-6 pb-8 pt-6 ${
            menuOpen ? "is-open" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="header-brand">
              <div className="luxury-logo-title text-[1rem] leading-none">
                GRAND TRANSFER
              </div>
              <div className="luxury-logo-subtitle mt-2">VIP СЕРВІС</div>
            </div>
            <button
              type="button"
              aria-label="Закрити меню"
              onClick={() => setMenuOpen(false)}
              className="burger-button inline-flex h-11 w-11 items-center justify-center rounded-full"
            >
              <CloseIcon className="h-[15px] w-[15px]" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-5">
            {blogNavItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClasses(
                  href === "/blog" && (pathname === "/blog" || pathname.startsWith("/blog/"))
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher className="mt-8 self-start" />

          <div className="mt-auto space-y-5 pt-10">
            <HeaderPhoneLink
              pageType="about"
              phoneHref={phoneHref}
              phoneLabel={phoneNumber}
              compactLabel="Подзвонити"
              className="inline-flex"
            />
            <Link
              href="/#booking"
              onClick={() => setMenuOpen(false)}
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              ЗАМОВИТИ
            </Link>
          </div>
        </aside>
      </div>

      <footer
        id="contacts"
        className="relative border-t border-[rgba(216,185,130,0.08)] pb-10 pt-14 md:pb-12 md:pt-16"
      >
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <div className="footer-shell rounded-[30px] px-5 py-8 sm:px-7 md:px-10 md:py-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] lg:gap-8">
              <div className="max-w-[23rem]">
                <div className="footer-brand">
                  <div className="luxury-logo-title">GRAND TRANSFER</div>
                  <div className="footer-logo-subtitle">VIP СЕРВІС</div>
                </div>
                <p className="mt-6 text-[0.95rem] leading-[1.8] text-[var(--muted)]">
                  Преміальні міжнародні трансфери між Україною, Молдовою та
                  Польщею для приватних, бізнес- та VIP-клієнтів.
                </p>
              </div>

              <div>
                <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  Компанія
                </h3>
                <div className="mt-5 flex flex-col gap-3 text-[0.95rem] text-[rgba(247,243,234,0.86)]">
                  {blogFooterLinks.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="transition hover:text-[var(--soft-gold)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  Контакти
                </h3>
                <div className="mt-5 flex flex-col gap-3 text-[0.95rem] text-[rgba(247,243,234,0.86)]">
                  <a href={`tel:${phoneHref}`} className="transition hover:text-[var(--soft-gold)]">
                    {phoneNumber}
                  </a>
                  <a
                    href="https://t.me/grand_transfer_com"
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    Telegram
                  </a>
                  <a href="#" className="transition hover:text-[var(--soft-gold)]">
                    WhatsApp
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  Мови
                </h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {["UA", "RU", "EN"].map((language) => (
                    <span
                      key={language}
                      className={`language-pill ${language === "UA" ? "is-active" : ""}`}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-[rgba(216,185,130,0.08)] pt-5 text-[0.83rem] text-[rgba(183,178,168,0.78)]">
              © 2026 Grand Transfer. Усі права захищені.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function BurgerIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M10 17h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
