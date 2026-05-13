"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import contactsHeroImage from "../../img/contacts.png";
import missionImage from "../../img/two-screen-about.png";
import fleetPreviewImage from "../../img/about-us.png";
import {
  FloatingContactWidget,
  FooterContactLinks,
  HeaderPhoneLink,
  LanguageSwitcher
} from "../../components/site-ui";
import { trackCtaClick, trackMessengerClick, trackPhoneClick, trackSocialClick } from "../../lib/tracking";

type IconProps = {
  className?: string;
};

type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type ValueCard = {
  title: string;
  text: string;
  Icon: ComponentType<IconProps>;
};

type WorkStep = {
  number: string;
  title: string;
  Icon: ComponentType<IconProps>;
};

const navItems: NavItem[] = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТИ", href: "/kontakty" },
  { label: "ПРО НАС", href: "/pro-kompaniiu", isActive: true },
  { label: "БЛОГ", href: "/blog" }
];

const mobileNavItems: NavItem[] = navItems;

const footerLinks = [
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

const values: ValueCard[] = [
  {
    title: "Безпека",
    text: "Безпека наших клієнтів є пріоритетом №1. Ми відповідаємо за кожну поїздку від початку і до кінця.",
    Icon: ShieldIcon
  },
  {
    title: "Професіоналізм",
    text: "Досвідчені водії, відмінне знання маршрутів та високий рівень сервісу у кожній деталі.",
    Icon: ServiceIcon
  },
  {
    title: "Комфорт",
    text: "Сучасний автопарк, чисті салони, клімат-контроль та все для вашого комфорту в дорозі.",
    Icon: SeatIcon
  },
  {
    title: "Довіра",
    text: "Ми цінуємо довіру наших клієнтів і робимо все, щоб ви поверталися до нас знову.",
    Icon: TrustIcon
  }
];

const workSteps: WorkStep[] = [
  { number: "01", title: "Залишаєте заявку", Icon: FormIcon },
  { number: "02", title: "Узгоджуємо деталі", Icon: MessageIcon },
  { number: "03", title: "Подача авто", Icon: CarIcon },
  { number: "04", title: "Поїздка", Icon: RouteIcon },
  { number: "05", title: "Повертаєтесь знову", Icon: RepeatIcon }
];

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

export default function ProKompaniiuPage() {
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
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(216,185,130,0.16),transparent_42%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[18rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(29,42,31,0.36),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[42rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,185,130,0.08),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-[1536px] px-4 pt-4 sm:px-6 md:px-8 md:pt-5 lg:px-10 xl:px-12 2xl:px-14">
          <header className="header-shell relative z-30 rounded-[24px] px-[18px] py-3 sm:px-5 md:rounded-[30px] md:px-7 lg:px-[34px]">
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_1fr_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_1fr_310px]">
              <Link href="/" className="header-brand block">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="luxury-logo-subtitle">VIP СЕРВІС</div>
              </Link>

              <nav className="hidden items-center justify-self-center lg:flex lg:gap-3 xl:gap-5">
                {navItems.map(({ label, href, isActive }) => (
                  <Link key={label} href={href} className={desktopNavLinkClasses(isActive)}>
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
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "about"
                    })
                  }
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-6 text-[0.75rem] font-bold uppercase tracking-[0.09em] xl:h-12 xl:px-7 xl:text-[0.78rem] xl:tracking-[0.11em]"
                >
                  ЗАМОВИТИ
                </Link>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-drawer-about"
                  aria-label="Відкрити меню"
                  onClick={() => setMenuOpen(true)}
                  className="burger-button inline-flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <BurgerIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mt-6 md:mt-8">
            <div className="hero-shell about-hero-shell relative overflow-hidden rounded-[32px]">
              <div className="absolute inset-0">
                <Image
                  src={contactsHeroImage}
                  alt=""
                  fill
                  priority
                  className="object-cover object-[72%_center] md:object-contain md:object-right-bottom"
                  sizes="100vw"
                />
                <div className="about-hero-overlay absolute inset-0" />
              </div>

              <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-6 md:min-h-[560px] md:grid-cols-[minmax(0,1fr)_420px] md:px-10 md:py-12 lg:px-12 lg:py-14">
                <div className="max-w-[40rem] self-center">
                  <p className="eyebrow-lux">ПРО КОМПАНІЮ</p>
                  <h1 className="section-title-lux mt-5 max-w-[37rem] text-[clamp(2.5rem,5vw,4.6rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#D4AF78]">
                    Комфорт, безпека та довіра
                    <br />
                    у кожній поїздці
                  </h1>
                  <p className="mt-6 max-w-[35rem] text-[1rem] leading-[1.82] text-[var(--muted)] md:text-[1.08rem]">
                    Grand Transfer — це сервіс приватних VIP трансферів між
                    Україною, Молдовою, Польщею та Румунією. Ми поєднуємо
                    преміальний рівень обслуговування, сучасний автопарк та
                    індивідуальний підхід до кожного клієнта.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <article className="about-stat-card">
                      <span className="about-stat-icon">
                        <AwardIcon className="h-[22px] w-[22px]" />
                      </span>
                      <div>
                        <div className="text-[1.55rem] font-semibold leading-none text-[var(--text)]">
                          5+ років
                        </div>
                        <div className="mt-2 text-[0.82rem] uppercase tracking-[0.18em] text-[rgba(216,185,130,0.76)]">
                          на ринку
                        </div>
                      </div>
                    </article>
                    <article className="about-stat-card">
                      <span className="about-stat-icon">
                        <ClientsIcon className="h-[22px] w-[22px]" />
                      </span>
                      <div>
                        <div className="text-[1.55rem] font-semibold leading-none text-[var(--text)]">
                          10 000+
                        </div>
                        <div className="mt-2 text-[0.82rem] uppercase tracking-[0.18em] text-[rgba(216,185,130,0.76)]">
                          задоволених клієнтів
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="hidden md:block" aria-hidden="true" />
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="map-shell about-mission-shell relative overflow-hidden rounded-[28px]">
              <Image
                src={missionImage}
                alt=""
                fill
                className="object-cover object-right"
                sizes="100vw"
              />
              <div className="about-mission-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[34rem] px-5 py-8 sm:px-6 md:px-10 md:py-11 lg:px-12 lg:py-12">
                <p className="eyebrow-lux">НАША МІСІЯ</p>
                <h2 className="section-title-lux mt-4 text-[clamp(2rem,4vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--text)]">
                  Наша місія
                </h2>
                <p className="mt-6 text-[1rem] leading-[1.86] text-[var(--muted)] md:text-[1.05rem]">
                  Ми створюємо комфортні умови для ваших подорожей, щоб дорога
                  була приємною та спокійною, а результат — перевищував
                  очікування.
                </p>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[30rem]">
              <p className="eyebrow-lux">НАШІ ЦІННОСТІ</p>
              <h2 className="section-title-lux mt-4 text-[2.24rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.9rem] lg:text-[3.15rem]">
                Наші цінності
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {values.map(({ title, text, Icon }) => (
                <article key={title} className="route-card rounded-[22px] px-5 py-6 sm:px-6">
                  <span className="about-value-icon">
                    <Icon className="h-[26px] w-[26px]" />
                  </span>
                  <h3 className="mt-5 text-[1.16rem] font-semibold tracking-[-0.02em] text-[var(--text)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[0.94rem] leading-[1.75] text-[var(--muted)]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[34rem]">
              <p className="eyebrow-lux">СУЧАСНИЙ АВТОПАРК</p>
              <h2 className="section-title-lux mt-4 text-[2.24rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.9rem] lg:text-[3.15rem]">
                Сучасний автопарк
              </h2>
              <p className="mt-5 text-[0.98rem] leading-[1.82] text-[var(--muted)] md:text-[1.03rem]">
                Ми обираємо тільки найкращі автомобілі для вашого комфорту
              </p>
            </div>

            <div className="map-shell about-fleet-shell relative mt-8 overflow-hidden rounded-[28px]">
              <Image
                src={fleetPreviewImage}
                alt="Сучасний автопарк Grand Transfer"
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="about-fleet-overlay absolute inset-0" />
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[28rem]">
              <p className="eyebrow-lux">ЯК МИ ПРАЦЮЄМО</p>
              <h2 className="section-title-lux mt-4 text-[2.24rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.9rem] lg:text-[3.15rem]">
                Як ми працюємо
              </h2>
            </div>

            <div className="route-steps-shell about-steps-shell mt-8 rounded-[28px] px-5 py-8 sm:px-7 md:px-9 lg:px-10 lg:py-10">
              <div className="about-steps-grid">
                {workSteps.map(({ number, title, Icon }) => (
                  <article key={number} className="about-step-card">
                    <span className="about-step-icon">
                      <Icon className="h-[24px] w-[24px]" />
                    </span>
                    <span className="about-step-dot" aria-hidden="true" />
                    <div className="about-step-number">{number}</div>
                    <h3 className="mt-4 text-[0.88rem] font-semibold uppercase leading-[1.5] tracking-[0.18em] text-[rgba(247,243,234,0.9)]">
                      {title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="route-card about-final-cta rounded-[26px] px-5 py-6 sm:px-6 md:px-8 md:py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex max-w-[40rem] items-start gap-4">
                  <span className="about-cta-icon">
                    <SupportIcon className="h-[30px] w-[30px]" />
                  </span>
                  <div>
                    <h2 className="section-title-lux text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--text)]">
                      Готові до комфортної поїздки?
                    </h2>
                    <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                      Зв’яжіться з нами — ми надамо професійну консультацію та
                      підберемо найкращий маршрут для вас.
                    </p>
                  </div>
                </div>

                <Link
                  href="/#booking"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "about_cta",
                      pageType: "about"
                    })
                  }
                  className="button-gold inline-flex h-[54px] w-full items-center justify-center rounded-[12px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] sm:w-auto"
                >
                  ЗАМОВИТИ ТРАНСФЕР
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

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
                  {footerLinks.map(({ label, href }) => (
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
                <FooterContactLinks pageType="about" />
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
          id="mobile-drawer-about"
          className={`drawer-shell mobile-drawer fixed right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col rounded-l-[32px] px-6 pb-8 pt-6 ${
            menuOpen ? "is-open" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <Link href="/" className="header-brand" onClick={() => setMenuOpen(false)}>
              <div className="luxury-logo-title text-[1rem] leading-none">
                GRAND TRANSFER
              </div>
              <div className="luxury-logo-subtitle mt-2">VIP СЕРВІС</div>
            </Link>
            <button
              type="button"
              aria-label="Закрити меню"
              onClick={() => setMenuOpen(false)}
              className="burger-button inline-flex h-11 w-11 items-center justify-center rounded-full"
            >
              <BurgerIcon className="h-[15px] w-[15px]" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-5">
            {mobileNavItems.map(({ label, href, isActive }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClasses(isActive)}
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
              onClickCapture={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "about"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              ЗАМОВИТИ
            </Link>
          </div>
        </aside>
      </div>

      <FloatingContactWidget
        pageType="about"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
    </>
  );
}

function BurgerIcon({ className = "h-4 w-4" }: IconProps) {
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

function CarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 13.5 6.5 8h11L20 13.5M5.5 16.5v1.5M18.5 16.5v1.5M3.5 12.5h17v4a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="15" r="1" fill="currentColor" />
      <circle cx="16.5" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function SupportIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12a7 7 0 1 1 14 0M6.2 14.2h-.7A1.5 1.5 0 0 1 4 12.7v-1.4a1.5 1.5 0 0 1 1.5-1.5h.7a1.3 1.3 0 0 1 1.3 1.3V13a1.3 1.3 0 0 1-1.3 1.2Zm11.6 0h.7a1.5 1.5 0 0 0 1.5-1.5v-1.4a1.5 1.5 0 0 0-1.5-1.5h-.7a1.3 1.3 0 0 0-1.3 1.3V13a1.3 1.3 0 0 0 1.3 1.2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 17.8c-.6.8-1.8 1.2-3.5 1.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5 18 6v4.83c0 3.6-2.49 6.91-6 7.67-3.51-.76-6-4.07-6-7.67V6l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 11.9 1.7 1.7 3.6-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.8 6.2a4.4 4.4 0 1 0-5.6 5.6l-4.4 4.4a1.2 1.2 0 0 0 1.7 1.7l4.4-4.4a4.4 4.4 0 0 0 5.6-5.6Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="m14.9 9.1 1.9-1.9M5.9 18.1l1.7-1.7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SeatIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 5.5v6.2a3.8 3.8 0 0 0 3.8 3.8H16a2.5 2.5 0 0 1 2.5 2.5V19M8 11.5H6.8A2.8 2.8 0 0 0 4 14.3V19m4-7.5 8.2.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.5a2 2 0 1 1 4 0v2a2 2 0 1 1-4 0v-2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrustIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 19.7s-6.4-4.07-8.1-7.23A4.6 4.6 0 0 1 12 7.55a4.6 4.6 0 0 1 8.1 4.92C18.4 15.63 12 19.7 12 19.7Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.6 1.6 3.4-3.6"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AwardIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="9" r="4.2" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M9.8 13.8 8 20l4-2 4 2-1.8-6.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClientsIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8.4" r="2.5" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="15.7" cy="9.6" r="2.1" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M5.6 18.1c.9-2.4 2.5-3.6 4.8-3.6s3.9 1.2 4.8 3.6M15.8 18c.4-1.2 1.2-2 2.4-2.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.4 18.2h9.2a1.6 1.6 0 0 0 1.6-1.6V9.8a1.6 1.6 0 0 0-.47-1.13l-3.4-3.4A1.6 1.6 0 0 0 13.2 4.8H7.4a1.6 1.6 0 0 0-1.6 1.6v10.2a1.6 1.6 0 0 0 1.6 1.6Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M9 10.2h6M9 13.4h6M9 16.6h4.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6.6h12a2 2 0 0 1 2 2v6.2a2 2 0 0 1-2 2H11l-4.6 3v-3H6a2 2 0 0 1-2-2V8.6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 10.2h6.8M8.6 13.3h4.8"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RouteIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="6" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="18" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M8.2 16.1c2.2-.5 4-1.57 5.45-3.02 1.14-1.14 1.95-2.52 2.4-4.08M11.55 8.55c-.82-.6-1.82-.95-2.9-.95A4.65 4.65 0 0 0 4 12.25c0 .96.3 1.84.82 2.57"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

function RepeatIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16.8 8.4H8.1A3.1 3.1 0 0 0 5 11.5m0 0 2.1-2.1M5 11.5l2.1 2.1M7.2 15.6h8.7A3.1 3.1 0 0 0 19 12.5m0 0-2.1 2.1M19 12.5l-2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
