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
  LanguageSwitcher,
  SiteFooter
} from "../../components/site-ui";
import {
  CarClassesGrid,
  type CarClassCardData
} from "../../components/car-classes-grid";
import {
  trackCarImageOpen,
  trackCtaClick,
  trackMessengerClick,
  trackPhoneClick
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
  { label: "ÐÐÐÐÐÐÐ", href: "/" },
  { label: "ÐÐÐÐ Ð¯ÐÐÐ", href: "/#directions" },
  { label: "ÐÐÐ¢ÐÐÐÐ Ð", href: "/avtopark", isActive: true },
  { label: "ÐÐÐÐ¢ÐÐÐ¢Ð", href: "/kontakty" },
  { label: "ÐÐ Ð ÐÐÐ¡", href: "/pro-kompaniiu" },
  { label: "ÐÐÐÐ", href: "/blog" }
];

const mobileNavItems: NavItem[] = navItems;

const phoneNumber = "+38 063 824 3223";
const phoneHref = "+380638243223";

const featureRows: FeatureRow[] = [
  { text: "Ð¡ÑÑÐ°ÑÐ½Ñ Ð°Ð²ÑÐ¾ Ð½Ðµ ÑÑÐ°ÑÑÑ 3 ÑÐ¾ÐºÑÐ²", Icon: CarIcon },
  { text: "Ð ÐµÐ³ÑÐ»ÑÑÐ½Ðµ ÑÐµÑÐ½ÑÑÐ½Ðµ Ð¾Ð±ÑÐ»ÑÐ³Ð¾Ð²ÑÐ²Ð°Ð½Ð½Ñ", Icon: ServiceIcon },
  { text: "Ð§Ð¸ÑÑÐ¸Ð¹ ÑÐ° Ð´Ð¾Ð³Ð»ÑÐ½ÑÑÐ¸Ð¹ ÑÐ°Ð»Ð¾Ð½", Icon: SeatIcon },
  { text: "ÐÑÐ¾ÑÐµÑÑÐ¹Ð½Ñ ÑÐ° Ð²Ð²ÑÑÐ»Ð¸Ð²Ñ Ð²Ð¾Ð´ÑÑ", Icon: DriverIcon }
];

const carClassCards: CarClassCardData[] = [
  {
    title: "ÐÐ¾Ð¼ÑÐ¾ÑÑ",
    description: "ÐÐ´ÐµÐ°Ð»ÑÐ½Ð¸Ð¹ Ð²Ð¸Ð±ÑÑ Ð´Ð»Ñ ÑÐ¾Ð´ÐµÐ½Ð½Ð¸Ñ Ð¿Ð¾ÑÐ·Ð´Ð¾Ðº ÑÐ° Ð¿Ð¾Ð´Ð¾ÑÐ¾Ð¶ÐµÐ¹",
    image: classOneImage,
    models: ["VW Passat", "Skoda Octavia", "Sonata", "Kia Optima"],
    seats: "3",
    luggage: "2â3",
    climate: "ÐÐ»ÑÐ¼Ð°Ñ-ÐºÐ¾Ð½ÑÑÐ¾Ð»Ñ",
    price: "€170"
  },
  {
    title: "ÐÑÐ·Ð½ÐµÑ",
    description: "ÐÑÐ´Ð²Ð¸ÑÐµÐ½Ð¸Ð¹ ÑÑÐ²ÐµÐ½Ñ ÐºÐ¾Ð¼ÑÐ¾ÑÑÑ Ð´Ð»Ñ Ð´ÑÐ»Ð¾Ð²Ð¸Ñ Ð¿Ð¾ÑÐ·Ð´Ð¾Ðº",
    image: classTwoImage,
    models: ["Toyota Camry", "Nissan Teana", "Skoda Superb", "VW Passat B8"],
    seats: "3",
    luggage: "2â3",
    climate: "ÐÐ»ÑÐ¼Ð°Ñ-ÐºÐ¾Ð½ÑÑÐ¾Ð»Ñ",
    price: "€220"
  },
  {
    title: "ÐÑÐµÐ¼ÑÑÐ¼",
    description: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑÐ½Ð¸Ð¹ ÐºÐ¾Ð¼ÑÐ¾ÑÑ ÑÐ° Ð¿ÑÐµÐ´ÑÑÐ°Ð²Ð½Ð¸ÑÑÐºÐ¸Ð¹ ÐºÐ»Ð°Ñ",
    image: classThreeImage,
    models: ["S-class", "Audi A8", "BMW 7-series", "Lexus LS"],
    seats: "3",
    luggage: "3â4",
    climate: "ÐÐ»ÑÐ¼Ð°Ñ-ÐºÐ¾Ð½ÑÑÐ¾Ð»Ñ",
    price: "€300"
  },
  {
    title: "ÐÑÐ½ÑÐ²ÐµÐ½",
    description: "ÐÑÐ¾ÑÑÐ¾ÑÐ¸Ð¹ ÑÐ°Ð»Ð¾Ð½ Ð´Ð»Ñ Ð²ÐµÐ»Ð¸ÐºÐ¸Ñ ÐºÐ¾Ð¼Ð¿Ð°Ð½ÑÐ¹ ÑÐ° ÑÑÐ¼ÐµÐ¹Ð½Ð¸Ñ Ð¿Ð¾Ð´Ð¾ÑÐ¾Ð¶ÐµÐ¹",
    image: classFourImage,
    models: ["Mercedes Vito", "VW Caravelle", "Opel Vivaro", "Hyundai H-1"],
    seats: "7",
    luggage: "6â8",
    climate: "ÐÐ»ÑÐ¼Ð°Ñ-ÐºÐ¾Ð½ÑÑÐ¾Ð»Ñ",
    price: "€260"
  }
];

const tripInclusions = [
  "ÐÑÑÑÑÑÑ Ð· ÑÐ°Ð±Ð»Ð¸ÑÐºÐ¾Ñ Ð² Ð°ÐµÑÐ¾Ð¿Ð¾ÑÑÑ / Ð½Ð° Ð²Ð¾ÐºÐ·Ð°Ð»Ñ",
  "ÐÐ¾Ð¿Ð¾Ð¼Ð¾Ð³Ð° Ð· Ð±Ð°Ð³Ð°Ð¶ÐµÐ¼",
  "ÐÑÑÐºÑÐ²Ð°Ð½Ð½Ñ ÑÐµÐ¹ÑÑ Ð±ÐµÐ· Ð´Ð¾Ð¿Ð»Ð°Ñ",
  "ÐÐ¸ÑÑÑÑ ÐºÑÑÑÐ»Ð° Ð·Ð° Ð·Ð°Ð¿Ð¸ÑÐ¾Ð¼",
  "WiâFi ÑÐ° Ð·Ð°ÑÑÐ´Ð½Ñ Ð¿ÑÐ¸ÑÑÑÐ¾Ñ",
  "ÐÐ¾Ð´Ð° Ð² ÑÐ°Ð»Ð¾Ð½Ñ"
];

const carClassTrackingKeyByTitle: Record<string, "comfort" | "business" | "premium" | "minivan"> = {
  "ÐÐ¾Ð¼ÑÐ¾ÑÑ": "comfort",
  "ÐÑÐ·Ð½ÐµÑ": "business",
  "ÐÑÐµÐ¼ÑÑÐ¼": "premium",
  "ÐÑÐ½ÑÐ²ÐµÐ½": "minivan"
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
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_minmax(0,1fr)_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_minmax(0,1fr)_470px]">
              <Link href="/" className="header-brand block">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="luxury-logo-subtitle">VIP Ð¡ÐÐ ÐÐÐ¡</div>
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
                  ÐÐÐÐÐÐÐ¢Ð
                </Link>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-drawer-avtopark"
                  aria-label="ÐÑÐ´ÐºÑÐ¸ÑÐ¸ Ð¼ÐµÐ½Ñ"
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
                <p className="eyebrow-lux">ÐÐÐ¢ÐÐÐÐ Ð</p>
                <h1 className="section-title-lux mt-5 max-w-[43rem] text-[clamp(2.35rem,4.85vw,4.5rem)] font-medium not-italic leading-[1.05] tracking-[-0.038em] text-[var(--champagne)]">
                  <span className="inline-block md:whitespace-nowrap">
                    ÐÐ¾Ð¼ÑÐ¾ÑÑ Ð´Ð»Ñ&nbsp;ÐºÐ¾Ð¶Ð½Ð¾Ñ
                  </span>
                  <br />
                  Ð¿Ð¾ÑÐ·Ð´ÐºÐ¸
                </h1>
                <p className="mt-6 max-w-[34rem] text-[1rem] leading-[1.85] text-[var(--muted)] md:text-[1.08rem]">
                  Ð¡ÑÑÐ°ÑÐ½Ñ Ð°Ð²ÑÐ¾ Ð¿ÑÐµÐ¼ÑÑÐ¼-ÐºÐ»Ð°ÑÑ, ÑÐ´ÐµÐ°Ð»ÑÐ½Ð¸Ð¹ ÑÑÐ°Ð½, ÑÐ¸ÑÑÐ¾ÑÐ° ÑÐ° Ð¿Ð¾Ð²Ð½Ð¸Ð¹
                  ÐºÐ¾Ð¼ÑÐ¾ÑÑ Ð´Ð»Ñ Ð²Ð°ÑÐ¾Ñ Ð¿Ð¾Ð´Ð¾ÑÐ¾Ð¶Ñ.
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
            <p className="eyebrow-lux">ÐÐÐÐ¡Ð ÐÐÐ¢Ð</p>
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
                alt="Комфортний салон авто Grand Transfer для приватної поїздки"
                fill
                className="object-cover object-[72%_center]"
                sizes="100vw"
              />
              <div className="autopark-salon-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[34rem] px-5 py-8 sm:px-6 md:px-10 md:py-11 lg:px-12 lg:py-12">
                <p className="eyebrow-lux">Ð©Ð ÐÐ¥ÐÐÐÐ¢Ð¬ Ð£ ÐÐÐÐÐ£ ÐÐÐÐÐÐÐ£</p>
                <h2 className="section-title-lux mt-4 text-[clamp(2rem,4vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--text)]">
                  Ð¢ÑÑÐ±Ð¾ÑÐ° Ð¿ÑÐ¾ ÐºÐ¾Ð¼ÑÐ¾ÑÑ Ñ ÐºÐ¾Ð¶Ð½ÑÐ¹ Ð´ÐµÑÐ°Ð»Ñ
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
                      ÐÐµ Ð·Ð½Ð°Ð¹ÑÐ»Ð¸ Ð¿Ð¾ÑÑÑÐ±Ð½Ð¸Ð¹ Ð°Ð²ÑÐ¾Ð¼Ð¾Ð±ÑÐ»Ñ?
                    </h2>
                    <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                      ÐÐ²&apos;ÑÐ¶ÑÑÑÑÑ Ð· Ð½Ð°Ð¼Ð¸ â Ð¿ÑÐ´Ð±ÐµÑÐµÐ¼Ð¾ Ð°Ð²ÑÐ¾ Ð¿ÑÐ´ Ð²Ð°ÑÑ Ð¿Ð¾ÑÑÐµÐ±Ð¸ ÑÐ°
                      Ð±ÑÐ´Ð¶ÐµÑ.
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
                  ÐÐÐÐÐÐÐ¢Ð Ð¢Ð ÐÐÐ¡Ð¤ÐÐ 
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter pageType="fleet" currentLanguage="ua" />

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="ÐÐ°ÐºÑÐ¸ÑÐ¸ Ð¼ÐµÐ½Ñ"
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
              <div className="luxury-logo-subtitle mt-2">VIP Ð¡ÐÐ ÐÐÐ¡</div>
            </Link>
            <button
              type="button"
              aria-label="ÐÐ°ÐºÑÐ¸ÑÐ¸ Ð¼ÐµÐ½Ñ"
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
              compactLabel="ÐÐ¾Ð´Ð·Ð²Ð¾Ð½Ð¸ÑÐ¸"
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
              ÐÐÐÐÐÐÐ¢Ð
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
            aria-label="ÐÐ°ÐºÑÐ¸ÑÐ¸ Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð½Ñ Ð°Ð²ÑÐ¾"
            onClick={() => setSelectedCarCard(null)}
            className="absolute inset-0 bg-[rgba(0,0,0,0.76)] backdrop-blur-[8px]"
          />

          <div className="relative z-10 w-full max-w-[1280px] rounded-[24px] border border-[rgba(216,185,130,0.14)] bg-[linear-gradient(180deg,rgba(12,16,13,0.92),rgba(8,11,9,0.9))] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.45)] sm:p-5 lg:p-6">
            <button
              type="button"
              aria-label="ÐÐ°ÐºÑÐ¸ÑÐ¸"
              onClick={() => setSelectedCarCard(null)}
              className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,185,130,0.14)] bg-[rgba(10,13,11,0.7)] text-[var(--soft-gold)] transition hover:border-[rgba(216,185,130,0.28)]"
            >
              <CloseIcon className="h-[16px] w-[16px]" />
            </button>

            <div className="mb-4 pr-10">
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-[rgba(216,185,130,0.8)]">
                ÐÐÐÐ¡ ÐÐÐ¢Ð
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
