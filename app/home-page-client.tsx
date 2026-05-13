"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import desktopHero from "../img/desktop.png";
import mobileHero from "../img/mob.png";
import serviceImage from "../img/3-screen.png";
import mapsNewImage from "../img/maps_new.png";
import {
  DateField,
  PhoneField,
  SelectField,
  TextAreaField,
  TextField
} from "../components/lux-form-fields";
import {
  FloatingContactWidget,
  FooterContactLinks,
  HeaderPhoneLink,
  LanguageSwitcher,
  SuccessPopup
} from "../components/site-ui";
import { ReviewsSection } from "../components/reviews-section";
import {
  formatRouteId,
  trackCtaClick,
  trackFaqOpen,
  trackMessengerClick,
  trackPhoneClick,
  trackRouteClick,
  trackSocialClick
} from "../lib/tracking";
import { supabase } from "../lib/supabase";
import { useTransferForm } from "../lib/use-transfer-form";
import { TELEGRAM_URL } from "../lib/contact-links";

type IconProps = {
  className?: string;
};

type FeatureChip = {
  label: string;
  Icon: ComponentType<IconProps>;
};

type ServiceCard = {
  title: string;
  lines: string[];
  Icon: ComponentType<IconProps>;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type NavItem = {
  label: string;
  href: string;
};

export type HomepageRoute = {
  slug: string | null;
  from_city: string | null;
  to_city: string | null;
  price_from: number | null;
};

type RouteGroupItem = {
  fromCity: string;
  toCity: string;
};

const navItems: NavItem[] = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТИ", href: "/kontakty" },
  { label: "ПРО НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

const mobileNavItems = navItems;

const featureChips: FeatureChip[] = [
  { label: "Приватний трансфер без попутників", Icon: CarIcon },
  { label: "Подача 24/7", Icon: ClockIcon },
  { label: "Допомога на кордоні", Icon: ShieldIcon },
  { label: "Маршрути від €99", Icon: GemIcon }
];

const phoneNumber = "+38 063 824 3223";
const phoneHref = "+380638243223";

const serviceCards: ServiceCard[] = [
  {
    title: "VIP комфорт",
    lines: ["Преміальні авто", "та тиша в дорозі."],
    Icon: SeatIcon
  },
  {
    title: "Пунктуальність",
    lines: ["Подача авто", "без затримок."],
    Icon: ClockIcon
  },
  {
    title: "Безпека",
    lines: ["Досвідчені водії", "та контроль якості."],
    Icon: ShieldIcon
  },
  {
    title: "Індивідуальний підхід",
    lines: ["Маршрут і подача", "під ваш графік."],
    Icon: ConciergeIcon
  },
  {
    title: "Допомога з багажем",
    lines: ["Допомога з багажем", "і зустріч на місці."],
    Icon: LuggageIcon
  },
  {
    title: "Сервіс 24/7",
    lines: ["Підтримка та подача", "у будь-який час."],
    Icon: SupportIcon
  }
];

const routeGroups: { title: string; routes: RouteGroupItem[] }[] = [
  {
    title: "Україна → Молдова",
    routes: [
      { fromCity: "Одеса", toCity: "Кишинів" },
      { fromCity: "Київ", toCity: "Кишинів" },
      { fromCity: "Дніпро", toCity: "Кишинів" }
    ]
  },
  {
    title: "Україна → Польща",
    routes: [
      { fromCity: "Київ", toCity: "Варшава" },
      { fromCity: "Львів", toCity: "Варшава" },
      { fromCity: "Дніпро", toCity: "Варшава" }
    ]
  },
  {
    title: "Україна → Румунія",
    routes: [
      { fromCity: "Одеса", toCity: "Бухарест" },
      { fromCity: "Київ", toCity: "Бухарест" },
      { fromCity: "Одеса", toCity: "Ясси" }
    ]
  }
];

const preferredRouteCityOrder = [
  "Київ",
  "Одеса",
  "Кишинів",
  "Дніпро",
  "Краків",
  "Львів",
  "Варшава",
  "Ясси",
  "Будапешт",
  "Вінниця",
  "Житомир",
  "Запоріжжя",
  "Івано-Франківськ",
  "Кропивницький",
  "Луцьк",
  "Миколаїв",
  "Полтава",
  "Рівне",
  "Суми",
  "Тернопіль",
  "Ужгород",
  "Харків",
  "Хмельницький",
  "Черкаси",
  "Чернівці",
  "Чернігів"
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Залишаєте заявку",
    description: "Надсилаєте основні деталі поїздки."
  },
  {
    number: "02",
    title: "Узгоджуємо маршрут і авто",
    description: "Підбираємо клас авто та час подачі."
  },
  {
    number: "03",
    title: "Водій прибуває вчасно",
    description: "Подача без затримок і зайвого очікування."
  },
  {
    number: "04",
    title: "Комфортна поїздка до пункту призначення",
    description: "Спокійний трансфер під ваш графік."
  }
];

const faqItems: FaqItem[] = [
  {
    question: "Скільки коштує трансфер Одеса — Кишинів?",
    answer:
      "Орієнтовна вартість стартує від €170. Фінальна ціна залежить від дати, класу авто, часу виїзду та індивідуальних побажань."
  },
  {
    question: "Скільки коштує трансфер Київ — Кишинів?",
    answer:
      "Орієнтовна вартість стартує від €500. Фінальна ціна залежить від маршруту, класу авто, кількості пасажирів та формату поїздки."
  },
  {
    question: "Чи допомагає водій на кордоні?",
    answer:
      "Так, водій супроводжує вас по маршруту, допомагає зорієнтуватися та підказує ключові етапи проходження кордону."
  },
  {
    question: "Чи доступні поїздки 24/7?",
    answer:
      "Так, трансфер доступний у будь-який час — ранній виїзд, нічна подача або індивідуальний графік."
  }
];

const footerLinks = [
  { label: "Головна", href: "/" },
  { label: "Напрямки", href: "/#directions" },
  { label: "Усі напрямки", href: "/routes" },
  { label: "Автопарк", href: "/avtopark" },
  { label: "Контакти", href: "/kontakty" },
  { label: "Про нас", href: "/pro-kompaniiu" },
  { label: "Блог", href: "/blog" }
];

const reviewsSeoRoutes = [
  "трансфер Одеса — Кишинів",
  "трансфер Київ — Кишинів",
  "трансфер Дніпро — Кишинів",
  "трансфер Харків — Кишинів",
  "трансфер Львів — Кишинів"
];

const featuredArticle = {
  href: "/blog/odesa-kyshyniv-transfer",
  title: "Трансфер Одеса — Кишинів: як швидко та комфортно дістатися",
  description:
    "Коротко про маршрут, вартість, час у дорозі та переваги приватного трансферу."
};

const passengerOptions = [
  "1 пасажир",
  "2 пасажири",
  "3 пасажири",
  "4 пасажири",
  "5+ пасажирів"
];

const carClasses = ["Комфорт", "Бізнес", "Преміум", "Мінівен"];

type HomePageClientProps = {
  initialHomepageRoutes: HomepageRoute[];
};

export default function HomePageClient({ initialHomepageRoutes }: HomePageClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const defaultRouteCity = initialHomepageRoutes.some((route) => route.from_city === "Одеса")
    ? "Одеса"
    : initialHomepageRoutes.find((route) => route.from_city)?.from_city || "Одеса";
  const [activeRouteCity, setActiveRouteCity] = useState<string>(defaultRouteCity);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [homepageRoutes, setHomepageRoutes] = useState<HomepageRoute[]>(initialHomepageRoutes);
  const [routesLoaded, setRoutesLoaded] = useState(initialHomepageRoutes.length > 0);
  const homeHeroForm = useTransferForm({
    formName: "homepage_quick_form",
    pageType: "home",
    route: null
  });
  const homeFinalForm = useTransferForm({
    formName: "homepage_booking_form",
    pageType: "home",
    route: null,
    requireDate: true,
    initialValues: {
      carClass: "Комфорт"
    }
  });

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

  useEffect(() => {
    setShowAllRoutes(false);
  }, [activeRouteCity]);

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageRoutes() {
      if (!supabase) {
        if (isMounted) {
          setRoutesLoaded(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("routes")
        .select("slug, from_city, to_city, price_from")
        .eq("is_active", true)
        .eq("lang", "ua")
        .order("from_city", { ascending: true })
        .order("to_city", { ascending: true });

      if (!isMounted) {
        return;
      }

      if (error || !data) {
        setRoutesLoaded(true);
        return;
      }

      setHomepageRoutes(data as HomepageRoute[]);
      setRoutesLoaded(true);
    }

    void loadHomepageRoutes();

    return () => {
      isMounted = false;
    };
  }, []);

  const routeCities = Array.from(
    new Set(
      homepageRoutes
        .map((route) => (typeof route.from_city === "string" ? route.from_city.trim() : ""))
        .filter(Boolean)
    )
  ).sort((left, right) => {
    const leftPriority = preferredRouteCityOrder.indexOf(left);
    const rightPriority = preferredRouteCityOrder.indexOf(right);

    if (leftPriority !== -1 && rightPriority !== -1) {
      return leftPriority - rightPriority;
    }

    if (leftPriority !== -1) {
      return -1;
    }

    if (rightPriority !== -1) {
      return 1;
    }

    return left.localeCompare(right, "uk");
  });

  useEffect(() => {
    if (routeCities.length > 0 && !routeCities.includes(activeRouteCity)) {
      setActiveRouteCity(routeCities.includes("Одеса") ? "Одеса" : routeCities[0]);
    }
  }, [activeRouteCity, routeCities]);

  const routeLookup = new Map<string, HomepageRoute>();

  homepageRoutes.forEach((route) => {
    if (route.slug && route.from_city && route.to_city) {
      routeLookup.set(`${route.from_city}__${route.to_city}`, route);
    }
  });
  const visibleRouteLimit = 10;
  const activeRoutes = homepageRoutes.filter(
    (route) => route.from_city === activeRouteCity && route.to_city
  );
  const visibleRoutes = showAllRoutes
    ? activeRoutes
    : activeRoutes.slice(0, visibleRouteLimit);
  const hasMoreRoutes = activeRoutes.length > visibleRouteLimit;
  const highlightedRouteLabels = activeRoutes
    .slice(0, Math.min(3, activeRoutes.length))
    .map((route) => `${route.from_city} → ${route.to_city}`);
  const faqMidpoint = Math.ceil(faqItems.length / 2);
  const faqColumns = [faqItems.slice(0, faqMidpoint), faqItems.slice(faqMidpoint)];

  function handleHomeFaqToggle(index: number, question: string) {
    setOpenFaqIndex((current) => {
      if (current === index) {
        return null;
      }

      trackFaqOpen({ question, pageType: "home" });
      return index;
    });
  }

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
                {navItems.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-[0.69rem] font-bold uppercase tracking-[0.13em] text-[rgba(247,243,234,0.8)] transition duration-200 hover:text-[var(--soft-gold)] xl:text-[0.75rem]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center justify-self-end lg:flex lg:gap-2.5 xl:gap-3.5">
                <HeaderPhoneLink
                  pageType="home"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  iconOnly
                  className="hidden lg:inline-flex"
                />
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "home"
                    })
                  }
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-6 text-[0.75rem] font-bold uppercase tracking-[0.09em] xl:h-12 xl:px-7 xl:text-[0.78rem] xl:tracking-[0.11em]"
                >
                  ЗАМОВИТИ
                </button>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-drawer"
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
            <div className="hero-shell panel-soft relative overflow-hidden rounded-[32px]">
              <div className="absolute inset-0">
                <Image
                  src={desktopHero}
                  alt=""
                  priority
                  fill
                  className="hidden object-cover object-right md:block"
                  sizes="100vw"
                />
                <Image
                  src={mobileHero}
                  alt=""
                  priority
                  fill
                  className="object-cover object-bottom md:hidden"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,0.22)_0%,rgba(5,7,6,0.5)_100%)] md:bg-[linear-gradient(92deg,rgba(4,6,5,0.98)_0%,rgba(4,6,5,0.88)_32%,rgba(4,6,5,0.58)_60%,rgba(4,6,5,0.16)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,42,31,0.32),transparent_34%),linear-gradient(180deg,rgba(6,8,7,0.12)_0%,rgba(6,8,7,0.56)_100%)] md:bg-[radial-gradient(circle_at_14%_20%,rgba(29,42,31,0.32),transparent_34%),linear-gradient(180deg,rgba(6,8,7,0.06)_0%,rgba(6,8,7,0.34)_100%)]" />
              </div>

              <div className="relative z-10 flex min-h-[780px] flex-col px-5 pb-5 pt-10 sm:px-6 sm:pt-12 md:min-h-[650px] md:px-[4.5rem] md:pb-6 md:pt-[4.2rem] lg:px-[5rem] lg:pb-7 lg:pt-[4.5rem] xl:px-[5.5rem]">
                <div className="max-w-[56rem] md:mt-3 lg:mt-4">
                  <h1 className="headline-lux mt-2 max-w-[56rem] text-[clamp(2.375rem,11vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[var(--text)] md:text-[clamp(3.25rem,5vw,4.75rem)] md:leading-[1.02]">
                    VIP трансфери Україна — Молдова — Польща
                  </h1>
                  <p className="mt-5 max-w-[36rem] text-[1rem] leading-[1.9] text-[var(--muted)] md:text-[1.08rem]">
                    Приватні поїздки Одеса, Київ, Дніпро, Харків, Львів —
                    Кишинів без попутників
                  </p>
                  <p className="mt-4 max-w-[34rem] text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)] md:text-[0.9rem]">
                    Преміальні авто, допомога на кордоні, подача 24/7
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:gap-3.5">
                    <a
                      href="#booking-form"
                      onClick={() =>
                        trackCtaClick({
                          ctaType: "order",
                          location: "hero",
                          pageType: "home"
                        })
                      }
                      className="button-gold cta-border-shine inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em] sm:w-auto md:text-[0.8rem] lg:tracking-[0.12em]"
                    >
                      ЗАМОВИТИ ТРАНСФЕР
                    </a>
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackMessengerClick({
                          messenger: "telegram",
                          location: "hero",
                          pageType: "home"
                        });
                        trackCtaClick({
                          ctaType: "telegram",
                          location: "hero",
                          pageType: "home"
                        });
                      }}
                      className="button-outline inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-6 text-[0.76rem] font-bold uppercase tracking-[0.1em] sm:w-auto md:text-[0.8rem] lg:tracking-[0.12em]"
                    >
                      <TelegramIcon className="h-[15px] w-[15px]" />
                      НАПИСАТИ В TELEGRAM
                    </a>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2.5 lg:flex-nowrap lg:gap-2">
                    {featureChips.map(({ label, Icon }) => (
                      <div
                        key={label}
                        className="hero-chip chip-compact inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgba(247,243,234,0.9)] lg:px-3 xl:px-3.5"
                      >
                        <Icon className="h-[13px] w-[13px] text-[rgba(208,184,136,0.82)]" />
                        <span className="whitespace-nowrap">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="quick-form" className="mt-auto pt-8 md:pt-12">
                  <div className="panel-form rounded-[24px] p-3 md:rounded-[28px] md:p-[1.05rem]">
                    <div className="mb-3.5 px-1 md:mb-4">
                      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[rgba(247,243,234,0.92)]">
                        Швидке замовлення
                      </p>
                      <p className="mt-1.5 max-w-[26rem] text-[0.9rem] leading-[1.6] text-[var(--muted)]">
                        Залиште контакт — ми уточнимо маршрут і вартість поїздки.
                      </p>
                    </div>
                    <form
                      noValidate
                      onSubmit={homeHeroForm.handleSubmit}
                      className="grid gap-3 md:grid-cols-[1.05fr_1.05fr_1fr_1fr_auto]"
                    >
                      <TextField
                        label="Ім’я"
                        name="full_name"
                        value={homeHeroForm.values.fullName}
                        onChange={homeHeroForm.handleTextChange("fullName")}
                        placeholder="Ваше ім’я"
                        autoComplete="name"
                        error={homeHeroForm.errors.fullName}
                        fieldClassName="h-[58px] rounded-[17px] px-4 text-[0.94rem]"
                      />
                      <PhoneField
                        label="Телефон"
                        phoneValue={homeHeroForm.phoneDisplayValue}
                        phonePlaceholder="Ваш телефон"
                        phoneMaxLength={homeHeroForm.phoneMaxLength}
                        onPhoneChange={homeHeroForm.handlePhoneNumberChange}
                        error={homeHeroForm.errors.phone}
                        inputClassName="h-[58px] rounded-[17px] px-4 text-[0.94rem]"
                      />
                      <TextField
                        label="Звідки"
                        name="from_city"
                        value={homeHeroForm.values.fromCity}
                        onChange={homeHeroForm.handleTextChange("fromCity")}
                        placeholder="Звідки"
                        error={homeHeroForm.errors.fromCity}
                        fieldClassName="h-[58px] rounded-[17px] px-4 text-[0.94rem]"
                      />
                      <TextField
                        label="Куди"
                        name="to_city"
                        value={homeHeroForm.values.toCity}
                        onChange={homeHeroForm.handleTextChange("toCity")}
                        placeholder="Куди"
                        error={homeHeroForm.errors.toCity}
                        fieldClassName="h-[58px] rounded-[17px] px-4 text-[0.94rem]"
                      />
                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={homeHeroForm.isSubmitting}
                          onClick={() =>
                            trackCtaClick({
                              ctaType: "order",
                              location: "hero",
                              pageType: "home"
                            })
                          }
                          className="button-gold inline-flex h-[58px] w-full items-center justify-center rounded-[17px] px-8 text-[0.76rem] font-bold uppercase tracking-[0.1em] md:text-[0.8rem] lg:tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          ЗАМОВИТИ
                        </button>
                      </div>
                      {homeHeroForm.submitError ? (
                        <p className="field-error md:col-span-5">{homeHeroForm.submitError}</p>
                      ) : null}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="routes-network-wide"
            className="relative z-10 mt-10 md:mt-12 xl:mt-14"
          >
            <div className="routes-wide-panel relative flex min-h-[760px] flex-col overflow-hidden rounded-[32px] px-5 py-8 sm:px-7 md:px-10 md:py-12 lg:min-h-[560px] lg:px-14 lg:py-16 xl:min-h-[580px] xl:px-[3.5rem]">
              <Image
                src={mapsNewImage}
                alt="Карта напрямків між Україною, Молдовою та Польщею"
                fill
                className="object-cover object-[66%_center] md:object-[68%_center] lg:object-[68%_center] xl:object-[72%_center]"
                sizes="100vw"
              />
              <div className="routes-wide-overlay-primary absolute inset-0" />
              <div className="routes-wide-overlay-secondary absolute inset-0" />
              <div className="routes-wide-overlay-vignette absolute inset-0" />

              <div id="popular-routes" className="relative z-10 max-w-[27.5rem]">
                <p className="mb-6 text-[0.75rem] font-bold uppercase tracking-[0.26em] text-[var(--champagne)]">
                  ОСНОВНІ НАПРЯМКИ
                </p>
                <h2 className="section-title-lux text-[2.45rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:text-[2.95rem] lg:text-[3.15rem] xl:text-[3.45rem]">
                  Маршрути між Україною,
                  <br />
                  Молдовою та <span className="text-[var(--champagne)]">Польщею</span>
                </h2>
                <p className="mt-6 max-w-[24.5rem] text-[1rem] leading-[1.7] text-[var(--muted)]">
                  Працюємо з приватними трансферами з Одеси, Києва, Дніпра,
                  Харкова та Львова до Кишинева, Варшави, Бухареста та інших
                  міст.
                </p>
                <p className="mt-4 max-w-[24.5rem] text-[0.95rem] leading-[1.7] text-[var(--muted)]">
                  Кожен маршрут доступний з приватним водієм, без попутників та
                  з подачею під ваш графік.
                </p>
              </div>

              <div className="relative z-10 mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-auto lg:max-w-[58rem] lg:grid-cols-3 lg:gap-4">
                {routeGroups.map(({ title, routes }) => (
                  <article key={title} className="routes-wide-stat">
                    <div className="routes-wide-stat-icon">
                      <MapPinStrokeIcon className="h-[18px] w-[18px] text-[var(--champagne)]" />
                    </div>
                    <div className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--champagne)]">
                      {title}
                    </div>
                    <div className="mt-3 grid gap-2 text-[0.92rem] leading-[1.65] text-[var(--text)]">
                      {routes.map(({ fromCity, toCity }) => {
                        const routeKey = `${fromCity}__${toCity}`;
                        const routeMatch = routeLookup.get(routeKey);
                        const label = `${fromCity} — ${toCity}`;

                        if (!routeMatch?.slug) {
                          return (
                            <div
                              key={label}
                              className="inline-flex items-center justify-between gap-3 rounded-[14px] border border-[rgba(216,185,130,0.08)] bg-[rgba(10,13,11,0.14)] px-3 py-2 text-left text-[rgba(247,243,234,0.6)]"
                            >
                              <span>{label}</span>
                              <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[rgba(216,185,130,0.34)]" />
                            </div>
                          );
                        }

                        const href = `/${routeMatch.slug}`;

                        return (
                          <Link
                            key={label}
                            href={href}
                            onClick={() =>
                              trackCtaClick({
                                ctaType: "route_link",
                                location: "main_directions",
                                pageType: "home",
                                target: href
                              })
                            }
                            className="group inline-flex items-center justify-between gap-3 rounded-[14px] border border-[rgba(216,185,130,0.08)] bg-[rgba(10,13,11,0.2)] px-3 py-2 text-left transition duration-200 hover:border-[rgba(216,185,130,0.2)] hover:bg-[rgba(216,185,130,0.05)] hover:text-[var(--soft-gold)]"
                          >
                            <span>{label}</span>
                            <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[rgba(216,185,130,0.72)] transition duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:text-[var(--soft-gold)]" />
                          </Link>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="directions"
            className="relative z-10 mt-24 md:mt-28 xl:mt-32"
          >
            <div className="all-routes-shell rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-8 lg:px-12 lg:py-10">
              <div className="max-w-[44rem]">
                <p className="eyebrow-lux">ВСІ НАПРЯМКИ</p>
                <h2 className="section-title-lux mt-4 text-[2.05rem] font-medium leading-[1.06] tracking-[-0.04em] text-[var(--text)] md:text-[2.55rem] lg:text-[2.9rem]">
                  Обрати маршрут
                </h2>
                <p className="mt-4 max-w-[42rem] text-[0.97rem] leading-[1.8] text-[var(--muted)]">
                  Оберіть місто подачі, щоб переглянути доступні маршрути.
                </p>
              </div>

              <div className="routes-tabs-row mt-7 flex gap-2.5 overflow-x-auto pb-1">
                {routeCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setActiveRouteCity(city)}
                    className={`routes-tab ${activeRouteCity === city ? "is-active" : ""}`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-[0.82rem] leading-[1.7] text-[rgba(183,178,168,0.72)]">
                Натисніть на маршрут, щоб переглянути деталі
              </p>

              <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <p className="md:col-span-2 xl:col-span-3 text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[var(--champagne)]">
                  Маршрути з міста {activeRouteCity}:
                </p>
                {!routesLoaded ? (
                  <p className="md:col-span-2 xl:col-span-3 text-[0.94rem] leading-[1.7] text-[rgba(183,178,168,0.72)]">
                    Завантажуємо маршрути...
                  </p>
                ) : visibleRoutes.length === 0 ? (
                  <p className="md:col-span-2 xl:col-span-3 text-[0.94rem] leading-[1.7] text-[rgba(183,178,168,0.72)]">
                    Маршрути для цього міста скоро з’являться.
                  </p>
                ) : (
                  visibleRoutes.map((route) => {
                    const routeLabel = `${route.from_city} → ${route.to_city}`;
                    const routePrice =
                      route.price_from != null
                        ? `від €${route.price_from}`
                        : "за запитом";

                    if (!route.slug) {
                      return (
                        <div
                          key={routeLabel}
                          className={`all-route-chip flex items-center justify-between gap-3 opacity-70 ${
                            highlightedRouteLabels.includes(routeLabel)
                              ? "is-highlighted"
                              : ""
                          }`}
                        >
                          <span className="min-w-0">{routeLabel}</span>
                          <span className="shrink-0 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--champagne)]">
                            {routePrice}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <a
                        key={route.slug}
                        href={`/${route.slug}`}
                        onClick={() =>
                          trackRouteClick({
                            route: formatRouteId(routeLabel),
                            sourceBlock: "all_routes",
                            pageType: "home"
                          })
                        }
                        className={`all-route-chip flex items-center justify-between gap-3 ${
                          highlightedRouteLabels.includes(routeLabel)
                            ? "is-highlighted"
                            : ""
                        }`}
                      >
                        <span className="min-w-0">{routeLabel}</span>
                        <span className="shrink-0 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--champagne)]">
                          {routePrice}
                        </span>
                      </a>
                    );
                  })
                )}
              </div>

              {hasMoreRoutes ? (
                <button
                  type="button"
                  onClick={() => setShowAllRoutes((current) => !current)}
                  className="button-outline mt-7 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
                >
                  {showAllRoutes ? "Згорнути" : "Показати всі напрямки"}
                </button>
              ) : null}
            </div>
          </section>

          <section id="service" className="relative z-10 mt-24 md:mt-28 xl:mt-32">
            <div
              className="service-section-panel relative flex min-h-[780px] flex-col overflow-hidden rounded-[32px] px-5 py-10 sm:px-7 md:px-10 md:py-14 xl:min-h-[760px] xl:px-10 xl:py-24"
              style={{ backgroundImage: `url(${serviceImage.src})` }}
            >
              <div className="service-section-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[32.5rem]">
                <p className="eyebrow-lux opacity-80">ПРИВАТНИЙ VIP ТРАНСФЕР</p>
                <h2 className="section-title-lux mt-4 text-[2.25rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-[2.7rem] lg:text-[3.4rem]">
                  Преміальний сервіс
                  <br />
                  на кожному етапі
                </h2>
                <p className="mt-5 max-w-[32.5rem] text-[0.98rem] leading-[1.9] text-[var(--muted)] md:text-[1.04rem]">
                  Ми подбали про кожну деталь вашої подорожі,
                  <br className="hidden sm:block" /> щоб ви відчували комфорт та
                  впевненість.
                </p>
              </div>

              <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 xl:mt-auto xl:grid-cols-6 xl:gap-4">
                {serviceCards.map(({ title, lines, Icon }) => (
                  <article key={title} className="service-card">
                    <div className="service-icon-ring mx-auto">
                      <Icon className="h-5 w-5 text-[var(--champagne)]" />
                    </div>
                    <h3 className="mt-4 text-[0.98rem] font-semibold leading-[1.25] text-[var(--text)]">
                      {title}
                    </h3>
                    <p className="mt-3 text-[0.88rem] leading-[1.65] text-[var(--muted)]">
                      {lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="how-it-works"
            className="relative z-10 mt-24 md:mt-28 xl:mt-32"
          >
            <div className="max-w-[28rem]">
              <p className="eyebrow-lux">ЯК ЦЕ ПРАЦЮЄ</p>
              <h2 className="section-title-lux mt-4 text-[2.28rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.9rem] lg:text-[3.2rem]">
                Як це працює
              </h2>
            </div>

            <div className="how-shell mt-10 rounded-[30px] px-5 py-8 sm:px-7 md:px-9 lg:px-12 lg:py-12">
              <div className="how-grid">
                {processSteps.map(({ number, title, description }) => (
                  <article key={number} className="how-step">
                    <span className="how-step-dot" aria-hidden="true" />
                    <div className="how-step-number">{number}</div>
                    <h3 className="mt-4 text-[0.84rem] font-semibold uppercase leading-[1.55] tracking-[0.18em] text-[rgba(247,243,234,0.9)]">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-[16rem] text-[0.94rem] leading-[1.75] text-[var(--muted)]">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="booking" className="relative z-10 mt-24 md:mt-28 xl:mt-32">
            <span
              id="booking-form"
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 md:-top-32"
            />
            <div className="booking-shell rounded-[32px] px-5 py-6 sm:px-7 md:px-9 md:py-9 lg:grid lg:grid-cols-[0.4fr_0.6fr] lg:gap-10 lg:px-12 lg:py-12">
              <div className="max-w-[24rem]">
                <p className="eyebrow-lux">ЗАЯВКА</p>
                <h2 className="booking-heading-lux mt-4 text-[2.3rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] md:text-[2.95rem] lg:text-[3.2rem]">
                  Забронювати трансфер
                </h2>
                <p className="mt-5 text-[0.98rem] leading-[1.85] text-[var(--muted)]">
                  Ми зв&apos;яжемося з вами, уточнимо маршрут, авто та фінальну
                  вартість поїздки.
                </p>
              </div>

              <div className="panel-form mt-8 rounded-[28px] p-4 sm:p-5 md:mt-10 md:p-6 lg:mt-0">
                <form
                  noValidate
                  onSubmit={homeFinalForm.handleSubmit}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <TextField
                    label="Ім’я"
                    name="full_name"
                    value={homeFinalForm.values.fullName}
                    onChange={homeFinalForm.handleTextChange("fullName")}
                    placeholder="Ім'я"
                    autoComplete="name"
                    error={homeFinalForm.errors.fullName}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <PhoneField
                    label="Телефон"
                    phoneValue={homeFinalForm.phoneDisplayValue}
                    phonePlaceholder="Ваш телефон"
                    phoneMaxLength={homeFinalForm.phoneMaxLength}
                    onPhoneChange={homeFinalForm.handlePhoneNumberChange}
                    error={homeFinalForm.errors.phone}
                    inputClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label="Звідки"
                    name="from_city"
                    value={homeFinalForm.values.fromCity}
                    onChange={homeFinalForm.handleTextChange("fromCity")}
                    placeholder="Звідки"
                    error={homeFinalForm.errors.fromCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label="Куди"
                    name="to_city"
                    value={homeFinalForm.values.toCity}
                    onChange={homeFinalForm.handleTextChange("toCity")}
                    placeholder="Куди"
                    error={homeFinalForm.errors.toCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <DateField
                    label="Дата поїздки"
                    name="travel_date"
                    value={homeFinalForm.values.travelDate}
                    onChange={homeFinalForm.handleTextChange("travelDate")}
                    min={homeFinalForm.today}
                    error={homeFinalForm.errors.travelDate}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <SelectField
                    label="Кількість пасажирів"
                    name="passengers"
                    value={homeFinalForm.values.passengers}
                    onChange={homeFinalForm.handleTextChange("passengers")}
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    <option value="">Кількість пасажирів</option>
                    {passengerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    label="Клас авто"
                    name="car_class"
                    value={homeFinalForm.values.carClass}
                    onChange={homeFinalForm.handleTextChange("carClass")}
                    wrapperClassName="md:col-span-2"
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    {carClasses.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                  <TextAreaField
                    label="Коментар"
                    name="comment"
                    value={homeFinalForm.values.comment}
                    onChange={homeFinalForm.handleTextChange("comment")}
                    placeholder="Коментар"
                    wrapperClassName="md:col-span-2"
                    fieldClassName="min-h-[148px] rounded-[16px] px-4 py-4 text-[0.95rem]"
                  />
                                    {homeFinalForm.submitError ? (
                    <p className="field-error md:col-span-2">{homeFinalForm.submitError}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={homeFinalForm.isSubmitting}
                    onClick={() =>
                      trackCtaClick({
                        ctaType: "order",
                        location: "final_form",
                        pageType: "home"
                      })
                    }
                    className="button-gold md:col-span-2 inline-flex h-14 items-center justify-center rounded-[16px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] lg:tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Забронювати трансфер
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* TODO:
          Create separate /faq page later
          Move extended questions there (10–20 questions)
          Keep homepage FAQ short (4 questions)
          Link from homepage to /faq when ready */}
          <section id="faq" className="relative z-10 mt-24 md:mt-28 xl:mt-32">
            <div className="max-w-[33rem]">
              <p className="eyebrow-lux">FAQ</p>
              <h2 className="section-title-lux mt-4 text-[2.28rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.95rem] lg:text-[3.2rem]">
                Поширені питання
              </h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {faqColumns.map((column, columnIndex) => (
                <div key={`faq-column-${columnIndex}`} className="space-y-3">
                  {column.map(({ question, answer }, itemIndex) => {
                    const index = columnIndex * faqMidpoint + itemIndex;
                    const isOpen = openFaqIndex === index;

                    return (
                      <article
                        key={question}
                        className={`faq-item ${isOpen ? "is-open" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleHomeFaqToggle(index, question)}
                          className="faq-toggle"
                          aria-expanded={isOpen}
                        >
                          <span className="faq-question pr-4 text-left text-[0.82rem] font-semibold uppercase leading-[1.55] tracking-[0.16em] text-[rgba(247,243,234,0.92)] md:text-[0.88rem]">
                            {question}
                          </span>
                          <span className="faq-icon" aria-hidden="true">
                            <span className="faq-icon-line faq-icon-line-horizontal" />
                            <span
                              className={`faq-icon-line faq-icon-line-vertical ${
                                isOpen ? "opacity-0" : ""
                              }`}
                            />
                          </span>
                        </button>
                        <div className={`faq-answer ${isOpen ? "is-open" : ""}`}>
                          <div className="faq-answer-inner">
                            <p className="max-w-[58rem] text-[0.96rem] leading-[1.8] text-[var(--muted)]">
                              {answer}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <p className="text-[0.96rem] leading-[1.8] text-[var(--muted)]">
                Не знайшли відповідь?
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackMessengerClick({
                      messenger: "telegram",
                      location: "faq",
                      pageType: "home"
                    });
                    trackCtaClick({
                      ctaType: "telegram",
                      location: "faq",
                      pageType: "home"
                    });
                  }}
                  className="button-outline inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
                >
                  Написати в Telegram
                </a>
                <a
                  href="tel:+380638243223"
                  onClick={() => {
                    trackPhoneClick({
                      phone: phoneHref,
                      location: "faq",
                      pageType: "home"
                    });
                    trackCtaClick({
                      ctaType: "phone",
                      location: "faq",
                      pageType: "home"
                    });
                  }}
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
                >
                  Зателефонувати
                </a>
              </div>
            </div>
          </section>

          <ReviewsSection
            location="homepage"
            className="mt-12 md:mt-16 xl:mt-20"
          />
          <div className="mt-5 rounded-[24px] border border-[rgba(216,185,130,0.1)] bg-[rgba(10,13,11,0.34)] px-5 py-5 sm:px-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--champagne)]">
              Популярні запити клієнтів
            </p>
            <p className="mt-2 text-[0.88rem] leading-[1.7] text-[rgba(183,178,168,0.8)]">
              Популярні запити клієнтів у Google:
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {reviewsSeoRoutes.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full border border-[rgba(216,185,130,0.14)] bg-[rgba(216,185,130,0.04)] px-3.5 py-2 text-[0.78rem] leading-none text-[rgba(183,178,168,0.86)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
            <div className="max-w-[38rem]">
              <p className="eyebrow-lux">БЛОГ</p>
              <h2 className="section-title-lux mt-4 text-[2.05rem] font-medium leading-[1.06] tracking-[-0.04em] text-[var(--text)] md:text-[2.55rem] lg:text-[2.9rem]">
                Корисний блог
              </h2>
              <p className="mt-4 max-w-[36rem] text-[0.97rem] leading-[1.8] text-[var(--muted)]">
                Поради для поїздок, маршрути та корисна інформація для клієнтів.
              </p>
            </div>

            <article className="panel-soft mt-8 overflow-hidden rounded-[30px] md:grid md:grid-cols-[0.42fr_0.58fr]">
              <div className="relative min-h-[220px]">
                <Image
                  src={desktopHero}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.1)_0%,rgba(7,9,8,0.78)_100%)]" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <p className="eyebrow-lux">ОСНОВНИЙ МАРШРУТ</p>
                <h3 className="section-title-lux mt-4 text-[1.95rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.25rem]">
                  {featuredArticle.title}
                </h3>
                <p className="mt-4 max-w-[32rem] text-[0.96rem] leading-[1.8] text-[var(--muted)]">
                  {featuredArticle.description}
                </p>
                <Link
                  href={featuredArticle.href}
                  className="button-outline mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
                >
                  Читати
                </Link>
              </div>
            </article>
          </section>

          <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
            <div className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8 lg:px-12">
              <p className="eyebrow-lux">ІНФОРМАЦІЯ</p>
              <h2 className="section-title-lux mt-4 text-[2.05rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.45rem]">
                VIP трансфери Україна — Молдова — Польща
              </h2>
              <div className="mt-5 max-w-[58rem] space-y-4 text-[0.96rem] leading-[1.85] text-[var(--muted)]">
                <p>
                  Grand Transfer організовує приватні VIP трансфери між
                  Україною, Молдовою та Польщею для приватних клієнтів,
                  сімейних поїздок і бізнес-маршрутів. Найчастіше клієнти
                  замовляють трансфер Одеса Кишинів, трансфер Київ Кишинів,
                  трансфер Дніпро Кишинів, трансфер Харків Кишинів і трансфер
                  Львів Кишинів, а також міжнародні поїздки до Варшави,
                  Бухареста та Ясс.
                </p>
                <p>
                  Ми працюємо з індивідуальною подачею авто, приватним водієм,
                  допомогою на кордоні та маршрутом без попутників. Ви можете
                  замовити трансфер до міста, аеропорту, готелю, вокзалу або
                  будь-якої адреси за попереднім погодженням. Для клієнтів, яким
                  потрібен VIP трансфер Україна Європа, ми погоджуємо маршрут,
                  час подачі та клас авто під індивідуальний запит.
                </p>
                <p>
                  Фінальна вартість залежить від маршруту, класу авто, дати
                  виїзду, кількості пасажирів, багажу та додаткових зупинок.
                  Щоб уточнити ціну, залиште заявку на сайті або напишіть у
                  Telegram.
                </p>
                <p>
                  Ми обслуговуємо як приватні поїздки, так і трансфери для
                  бізнес-клієнтів та партнерів.
                </p>
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
                <FooterContactLinks pageType="home" />
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
          id="mobile-drawer"
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
            {mobileNavItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-[0.92rem] font-medium uppercase tracking-[0.24em] text-[rgba(247,243,234,0.88)] transition hover:text-[var(--soft-gold)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher className="mt-8 self-start" />

          <div className="mt-auto space-y-5 pt-10">
                <HeaderPhoneLink
                  pageType="home"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  compactLabel="Подзвонити"
                  className="inline-flex"
                />
            <button
              type="button"
              onClick={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "home"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              ЗАМОВИТИ
            </button>
          </div>
        </aside>
      </div>

      <SuccessPopup
        open={homeHeroForm.isSuccessOpen}
        onClose={homeHeroForm.closeSuccessModal}
        pageType="home"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
      <SuccessPopup
        open={homeFinalForm.isSuccessOpen}
        onClose={homeFinalForm.closeSuccessModal}
        pageType="home"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
      <FloatingContactWidget
        pageType="home"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
    </>
  );
}

function TelegramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.47 4.38 3.92 10.7c-1.13.45-1.12 1.08-.2 1.36l4.24 1.32 1.63 5.09c.2.62.1.86.77.86.52 0 .75-.24 1.04-.53l2.06-2 4.29 3.16c.79.44 1.35.21 1.55-.73l2.82-13.3c.29-1.15-.44-1.67-1.25-1.31Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m8.52 13.1 9.63-6.1M9.36 18.47l1.42-4.82"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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

function ClockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 7.8v4.7l3.2 1.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function GemIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4.5h10l3 4.3L12 19.5 4 8.8 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.5 12 19.5 17 4.5M4.35 8.8h15.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function ConciergeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M5.5 18.5c1.4-2.9 3.7-4.4 6.5-4.4s5.1 1.5 6.5 4.4M12 4.3V2.8m4.7 2.2 1.05-1.05M7.25 5l-1.02-1.02"
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

function MapPinStrokeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 20.2c3.6-4.16 5.4-7.35 5.4-9.58A5.4 5.4 0 1 0 6.6 10.62c0 2.23 1.8 5.42 5.4 9.58Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.6" r="1.9" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

function RouteStrokeIcon({ className = "h-4 w-4" }: IconProps) {
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

function ArrowUpRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 16 16 8M10 8h6v6"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckStrokeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.6 18 6v4.82c0 3.62-2.5 6.95-6 7.72-3.5-.77-6-4.1-6-7.72V6l6-2.4Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="m9.25 11.95 1.7 1.7 3.8-4.1"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
