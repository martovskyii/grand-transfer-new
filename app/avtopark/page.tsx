"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import classOneImage from "../../img/class-1.png";
import classTwoImage from "../../img/class-2.png";
import classThreeImage from "../../img/class-3.png";
import classFourImage from "../../img/class-4.png";
import salonImage from "../../img/salon.png";
import {
  FloatingContactWidget,
  HeaderPhoneLink,
  LanguageSwitcher
} from "../../components/site-ui";
import {
  CarClassesGrid,
  type CarClassCardData
} from "../../components/car-classes-grid";
import {
  trackCarImageOpen,
  trackCtaClick,
  trackMessengerClick,
  trackPhoneClick,
  trackSocialClick
} from "../../lib/tracking";

type IconProps = {
  className?: string;
};

type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type FeatureRow = {
  text: string;
  Icon: ComponentType<IconProps>;
};

const navItems: NavItem[] = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark", isActive: true },
  { label: "КОНТАКТИ", href: "/kontakty" },
  { label: "ПРО НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

const mobileNavItems: NavItem[] = navItems;

const footerLinks = [
  { label: "Головна", href: "/" },
  { label: "Напрямки", href: "/#directions" },
  { label: "Автопарк", href: "/avtopark" },
  { label: "Контакти", href: "/kontakty" },
  { label: "Про нас", href: "/pro-kompaniiu" },
  { label: "Блог", href: "/blog" }
];

const phoneNumber = "+38 063 824 3223";
const phoneHref = "+380638243223";

const featureRows: FeatureRow[] = [
  { text: "Сучасні авто не старші 3 років", Icon: CarIcon },
  { text: "Регулярне технічне обслуговування", Icon: ServiceIcon },
  { text: "Чистий та доглянутий салон", Icon: SeatIcon },
  { text: "Професійні та ввічливі водії", Icon: DriverIcon }
];

const carClassCards: CarClassCardData[] = [
  {
    title: "Комфорт",
    description: "Ідеальний вибір для щоденних поїздок та подорожей",
    image: classOneImage,
    models: ["VW Passat", "Skoda Octavia", "Sonata", "Kia Optima"],
    seats: "3",
    luggage: "2–3",
    climate: "Клімат-контроль",
    price: "$170"
  },
  {
    title: "Бізнес",
    description: "Підвищений рівень комфорту для ділових поїздок",
    image: classTwoImage,
    models: ["Toyota Camry", "Nissan Teana", "Skoda Superb", "VW Passat B8"],
    seats: "3",
    luggage: "2–3",
    climate: "Клімат-контроль",
    price: "$220"
  },
  {
    title: "Преміум",
    description: "Максимальний комфорт та представницький клас",
    image: classThreeImage,
    models: ["S-class", "Audi A8", "BMW 7-series", "Lexus LS"],
    seats: "3",
    luggage: "3–4",
    climate: "Клімат-контроль",
    price: "$300"
  },
  {
    title: "Мінівен",
    description: "Просторий салон для великих компаній та сімейних подорожей",
    image: classFourImage,
    models: ["Mercedes Vito", "VW Caravelle", "Opel Vivaro", "Hyundai H-1"],
    seats: "7",
    luggage: "6–8",
    climate: "Клімат-контроль",
    price: "$260"
  }
];

const tripInclusions = [
  "Зустріч з табличкою в аеропорту / на вокзалі",
  "Допомога з багажем",
  "Очікування рейсу без доплат",
  "Дитячі крісла за запитом",
  "Wi‑Fi та зарядні пристрої",
  "Вода в салоні"
];

const carClassTrackingKeyByTitle: Record<string, "comfort" | "business" | "premium" | "minivan"> = {
  "Комфорт": "comfort",
  "Бізнес": "business",
  "Преміум": "premium",
  "Мінівен": "minivan"
};

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

export default function AvtoparkPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCarCard, setSelectedCarCard] = useState<CarClassCardData | null>(null);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const shouldLockScroll = menuOpen || selectedCarCard !== null;
    document.body.style.overflow = shouldLockScroll ? "hidden" : originalBodyOverflow;
    document.documentElement.style.overflow = shouldLockScroll
      ? "hidden"
      : originalHtmlOverflow;

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [menuOpen, selectedCarCard]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSelectedCarCard(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleCarImageOpen(card: CarClassCardData) {
    setSelectedCarCard(card);
    trackCarImageOpen({
      pageType: "fleet",
      route: null,
      carClass: carClassTrackingKeyByTitle[card.title]
    });
  }

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
                  <Link
                    key={label}
                    href={href}
                    className={desktopNavLinkClasses(isActive)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center justify-self-end lg:flex lg:gap-2.5 xl:gap-3.5">
                <HeaderPhoneLink
                  pageType="route"
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
                      pageType: "route"
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
                  aria-controls="mobile-drawer-avtopark"
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
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.7fr)] lg:items-start xl:gap-8">
              <div className="pt-2 md:pt-5">
                <p className="eyebrow-lux">АВТОПАРК</p>
                <h1 className="section-title-lux mt-5 max-w-[43rem] text-[clamp(2.35rem,4.85vw,4.5rem)] font-medium not-italic leading-[1.05] tracking-[-0.038em] text-[var(--champagne)]">
                  <span className="inline-block md:whitespace-nowrap">
                    Комфорт для&nbsp;кожної
                  </span>
                  <br />
                  поїздки
                </h1>
                <p className="mt-6 max-w-[34rem] text-[1rem] leading-[1.85] text-[var(--muted)] md:text-[1.08rem]">
                  Сучасні авто преміум-класу, ідеальний стан, чистота та повний
                  комфорт для вашої подорожі.
                </p>
              </div>

              <div className="route-card rounded-[24px] p-5 sm:p-6 md:rounded-[26px] md:p-8">
                <div className="space-y-4">
                  {featureRows.map(({ text, Icon }, index) => (
                    <div
                      key={text}
                      className={`flex items-center gap-4 ${
                        index !== featureRows.length - 1
                          ? "border-b border-[rgba(216,185,130,0.08)] pb-4"
                          : ""
                      }`}
                    >
                      <span className="autopark-feature-icon">
                        <Icon className="h-[21px] w-[21px]" />
                      </span>
                      <p className="flex min-h-[3rem] items-center text-[0.98rem] leading-[1.65] text-[rgba(247,243,234,0.9)]">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <p className="eyebrow-lux">КЛАСИ АВТО</p>
            <CarClassesGrid
              cards={carClassCards}
              className="mt-6"
              onImageClick={handleCarImageOpen}
            />
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="map-shell autopark-salon-shell rounded-[28px]">
              <Image
                src={salonImage}
                alt=""
                fill
                className="object-cover object-[72%_center]"
                sizes="100vw"
              />
              <div className="autopark-salon-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[34rem] px-5 py-8 sm:px-6 md:px-10 md:py-11 lg:px-12 lg:py-12">
                <p className="eyebrow-lux">ЩО ВХОДИТЬ У КОЖНУ ПОЇЗДКУ</p>
                <h2 className="section-title-lux mt-4 text-[clamp(2rem,4vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--text)]">
                  Турбота про комфорт у кожній деталі
                </h2>

                <ul className="mt-6 space-y-3.5">
                  {tripInclusions.map((item) => (
                    <li key={item} className="autopark-check-item">
                      <span className="autopark-check-icon">
                        <CheckIcon className="h-[18px] w-[18px]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-10 md:mt-14">
            <div className="route-card autopark-cta-shell rounded-[24px] px-5 py-6 sm:px-6 md:px-8 md:py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex max-w-[40rem] items-start gap-4">
                  <span className="autopark-cta-icon">
                    <CalendarIcon className="h-[28px] w-[28px]" />
                  </span>
                  <div>
                    <h2 className="section-title-lux text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--text)]">
                      Не знайшли потрібний автомобіль?
                    </h2>
                    <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                      Зв&apos;яжіться з нами — підберемо авто під ваші потреби та
                      бюджет.
                    </p>
                  </div>
                </div>

                <Link
                  href="/#booking"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "fleet_cta",
                      pageType: "route"
                    })
                  }
                  className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-[12px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] sm:w-auto"
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
                <div className="mt-5 flex flex-col gap-3 text-[0.95rem] text-[rgba(247,243,234,0.86)]">
                  <a
                    href={`tel:${phoneHref}`}
                    onClick={() =>
                      trackPhoneClick({
                        phone: phoneHref,
                        location: "footer",
                        pageType: "route"
                      })
                    }
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    {phoneNumber}
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackMessengerClick({
                        messenger: "whatsapp",
                        location: "footer",
                        pageType: "route"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackMessengerClick({
                        messenger: "telegram",
                        location: "footer",
                        pageType: "route"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    Telegram
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackSocialClick({
                        channel: "instagram",
                        location: "footer",
                        pageType: "route"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackSocialClick({
                        channel: "tiktok",
                        location: "footer",
                        pageType: "route"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    TikTok
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackSocialClick({
                        channel: "youtube",
                        location: "footer",
                        pageType: "route"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    YouTube
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
          id="mobile-drawer-avtopark"
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
              <CloseIcon className="h-[15px] w-[15px]" />
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
              pageType="route"
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
                  pageType: "route"
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
        pageType="route"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />

      {selectedCarCard ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5 lg:p-8">
          <button
            type="button"
            aria-label="Закрити зображення авто"
            onClick={() => setSelectedCarCard(null)}
            className="absolute inset-0 bg-[rgba(0,0,0,0.76)] backdrop-blur-[8px]"
          />

          <div className="relative z-10 w-full max-w-[1280px] rounded-[24px] border border-[rgba(216,185,130,0.14)] bg-[linear-gradient(180deg,rgba(12,16,13,0.92),rgba(8,11,9,0.9))] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.45)] sm:p-5 lg:p-6">
            <button
              type="button"
              aria-label="Закрити"
              onClick={() => setSelectedCarCard(null)}
              className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,185,130,0.14)] bg-[rgba(10,13,11,0.7)] text-[var(--soft-gold)] transition hover:border-[rgba(216,185,130,0.28)]"
            >
              <CloseIcon className="h-[16px] w-[16px]" />
            </button>

            <div className="mb-4 pr-10">
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-[rgba(216,185,130,0.8)]">
                КЛАС АВТО
              </p>
              <h2 className="section-title-lux mt-2 text-[2rem] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--text)] sm:text-[2.4rem]">
                {selectedCarCard.title}
              </h2>
            </div>

            <div className="car-preview-stage">
              <div className="pointer-events-none absolute bottom-5 left-1/2 h-8 w-[68%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(212,175,120,0.24),transparent_72%)] blur-[26px]" />
              <div className="car-preview-media">
                <Image
                  src={selectedCarCard.image}
                  alt={selectedCarCard.title}
                  fill
                  className="car-preview-image"
                  sizes="(max-width: 1023px) 94vw, 88vw"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
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

function CloseIcon({ className = "h-4 w-4" }: IconProps) {
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

function DriverIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M5.6 18.5c1.4-3 3.6-4.5 6.4-4.5s5 1.5 6.4 4.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PassengerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M7 18c1-2.3 2.7-3.5 5-3.5s4 1.2 5 3.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LuggageIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 7V5.6A1.6 1.6 0 0 1 9.6 4h4.8A1.6 1.6 0 0 1 16 5.6V7M6 8h12a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.5v4M15 11.5v4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClimateIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.8v16.4M8.1 6l7.8 12M15.9 6 8.1 18M4.9 12h14.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6.8 12.4 3.3 3.3 7-7.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function CalendarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="M8 3.8v3.1M16 3.8v3.1M4.8 9.6h14.4"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="m9.2 14.1 1.8 1.8 3.9-4.2"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
