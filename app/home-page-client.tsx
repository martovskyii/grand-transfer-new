"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import desktopHero from "../img/general_screen.png";
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
  HeaderPhoneLink,
  LanguageSwitcher,
  SiteFooter,
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
import { JsonLd } from "../components/json-ld";
import { buildFaqSchema, buildHowToSchema } from "../lib/structured-data";

type IconProps = {
  className?: string;
};

type HeroBenefit = {
  title: string;
  description: string;
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
  duration: string | null;
};

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

const popularHomepageRouteSlugs = new Set([
  "odesa-kyshyniv",
  "odessa-kishinev",
  "kyiv-kyshyniv",
  "kiev-kishinev",
  "dnipro-kyshyniv",
  "dnepr-kishinev",
  "lviv-kyshyniv",
  "lvov-kishinev",
  "kharkiv-kyshyniv",
  "kharkov-kishinev",
  "kyiv-warsaw",
  "kiev-varshava",
  "lviv-warsaw",
  "lvov-varshava",
  "odesa-iasi",
  "odessa-yassy"
]);

// Business-priority order for homepage route cards, by destination city.
// Each tier lists the city name across UA / RU / EN spellings.
const routeDestinationPriorityTiers: string[][] = [
  ["кишинів", "кишинёв", "кишинев", "chisinau", "kishinev", "kyshyniv"],
  ["варшава", "warsaw", "warszawa", "varshava"],
  ["київ", "киев", "kyiv", "kiev"]
];

function getRouteDestinationPriority(toCity: string | null) {
  const normalized = (toCity || "").trim().toLowerCase();

  if (!normalized) {
    return routeDestinationPriorityTiers.length;
  }

  const tierIndex = routeDestinationPriorityTiers.findIndex((tier) =>
    tier.includes(normalized)
  );

  return tierIndex === -1 ? routeDestinationPriorityTiers.length : tierIndex;
}

type HomePageClientProps = {
  initialHomepageRoutes: HomepageRoute[];
  currentLanguage?: "ua" | "ru" | "en";
  routeLanguage?: "ua" | "ru";
  routeHrefPrefix?: "" | "/ru";
};

export default function HomePageClient({
  initialHomepageRoutes,
  currentLanguage = "ua",
  routeLanguage = "ua",
  routeHrefPrefix = ""
}: HomePageClientProps) {
  const isRu = currentLanguage === "ru";
  const isEn = currentLanguage === "en";
  const homeHref = currentLanguage === "ru" ? "/ru" : "/";
  const directionsHref = currentLanguage === "ru" ? "/ru#directions" : "/#directions";
  const ui = {
    navHome: isRu ? "ГЛАВНАЯ" : "ГОЛОВНА",
    navDirections: isRu ? "НАПРАВЛЕНИЯ" : "НАПРЯМКИ",
    navFleet: isRu ? "АВТОПАРК" : "АВТОПАРК",
    navContacts: isRu ? "КОНТАКТЫ" : "КОНТАКТИ",
    navAbout: isRu ? "О НАС" : "ПРО НАС",
    navBlog: isRu ? "БЛОГ" : "БЛОГ",
    order: isRu ? "ЗАКАЗАТЬ" : "ЗАМОВИТИ",
    openMenu: isRu ? "Открыть меню" : "Відкрити меню",
    closeMenu: isRu ? "Закрыть меню" : "Закрити меню",
    heroTitle: isEn
      ? "VIP transfers Ukraine — Moldova — Poland"
      : isRu
      ? "VIP трансферы Украина — Молдова — Польша"
      : "VIP трансфери Україна — Молдова — Польща",
    heroSubtitle: isEn
      ? "Private trips Odesa, Kyiv, Dnipro, Kharkiv, Lviv — Chisinau without shared rides"
      : isRu
      ? "Частные поездки Одесса, Киев, Днепр, Харьков, Львов — Кишинёв без попутчиков"
      : "Приватні поїздки Одеса, Київ, Дніпро, Харків, Львів — Кишинів без попутників",
    heroDescription: isEn
      ? "Premium vehicles, border assistance, 24/7 pickup"
      : isRu
      ? "Премиальные авто, помощь на границе, подача 24/7"
      : "Преміальні авто, допомога на кордоні, подача 24/7",
    heroOrder: isEn ? "ORDER TRANSFER" : isRu ? "ЗАКАЗАТЬ ТРАНСФЕР" : "ЗАМОВИТИ ТРАНСФЕР",
    telegram: isEn ? "WRITE IN TELEGRAM" : isRu ? "НАПИСАТЬ В TELEGRAM" : "НАПИСАТИ В TELEGRAM",
    mainDirectionsEyebrow: isEn ? "MAIN ROUTES" : isRu ? "ОСНОВНЫЕ НАПРАВЛЕНИЯ" : "ОСНОВНІ НАПРЯМКИ",
    mainDirectionsTitle: isEn
      ? "Routes between Ukraine, Moldova and Poland"
      : isRu
      ? "Маршруты между Украиной, Молдовой и Польшей"
      : "Маршрути між Україною, Молдовою та Польщею",
    mainDirectionsText: isEn
      ? "Comfortable direct trips in premium vehicles across the most popular routes."
      : isRu
      ? "Комфортные поездки без пересадок на премиальных автомобилях по самым популярным направлениям."
      : "Комфортні поїздки без пересадок на преміальних автомобілях по найпопулярніших напрямках.",
    mainDirectionsCta: isEn
      ? "View all routes"
      : isRu
      ? "Посмотреть все направления"
      : "Переглянути всі напрямки",
    allDirectionsEyebrow: isEn ? "ALL ROUTES" : isRu ? "ВСЕ НАПРАВЛЕНИЯ" : "ВСІ НАПРЯМКИ",
    chooseRoute: isEn ? "Choose a route" : isRu ? "Выберите маршрут" : "Оберіть маршрут",
    chooseCity: isEn
      ? "Choose a pickup city and view available routes."
      : isRu
      ? "Выберите город подачи и посмотрите доступные маршруты."
      : "Виберіть місто подачі та перегляньте доступні маршрути.",
    routesFromCity: isEn ? "Routes from" : isRu ? "Маршруты из города" : "Маршрути з міста",
    loadingRoutes: isEn ? "Loading routes..." : isRu ? "Загружаем маршруты..." : "Завантажуємо маршрути...",
    noRoutes: isEn
      ? "Routes for this city will appear soon."
      : isRu
      ? "Маршруты для этого города скоро появятся."
      : "Маршрути для цього міста скоро з’являться.",
    showAllRoutes: isEn ? "Show all routes" : isRu ? "Показать все направления" : "Показати всі напрямки",
    showAllRoutesText: isEn
      ? "More routes across Ukraine and Europe"
      : isRu
      ? "Больше маршрутов по Украине и Европе"
      : "Більше маршрутів по Україні та Європі",
    showMore: isEn ? "Show more" : isRu ? "Показать больше" : "Показати більше",
    collapse: isEn ? "Collapse" : isRu ? "Свернуть" : "Згорнути",
    fromPrefix: isEn ? "from" : isRu ? "от" : "від",
    onRequest: isEn ? "on request" : isRu ? "по запросу" : "за запитом",
    serviceEyebrow: isRu ? "ЧАСТНЫЙ VIP ТРАНСФЕР" : "ПРИВАТНИЙ VIP ТРАНСФЕР",
    serviceTitle: isRu ? "Премиальный сервис\nна каждом этапе" : "Преміальний сервіс\nна кожному етапі",
    serviceText: isRu
      ? "Мы продумали каждую деталь вашей поездки, чтобы вы чувствовали комфорт и уверенность."
      : "Ми подбали про кожну деталь вашої подорожі, щоб ви відчували комфорт та впевненість.",
    howEyebrow: isRu ? "КАК ЭТО РАБОТАЕТ" : "ЯК ЦЕ ПРАЦЮЄ",
    howTitle: isRu ? "Как это работает" : "Як це працює",
    bookingEyebrow: isRu ? "ЗАЯВКА" : "ЗАЯВКА",
    bookingTitle: isRu ? "Забронировать трансфер" : "Забронювати трансфер",
    bookingText: isRu
      ? "Мы свяжемся с вами, уточним маршрут, авто и финальную стоимость поездки."
      : "Ми зв'яжемося з вами, уточнимо маршрут, авто та фінальну вартість поїздки.",
    name: isRu ? "Имя" : "Ім’я",
    yourName: isRu ? "Имя" : "Ім'я",
    phone: isRu ? "Телефон" : "Телефон",
    yourPhone: isRu ? "Ваш телефон" : "Ваш телефон",
    from: isRu ? "Откуда" : "Звідки",
    to: isRu ? "Куда" : "Куди",
    date: isRu ? "Дата поездки" : "Дата поїздки",
    chooseDate: isRu ? "Выберите дату" : "Оберіть дату",
    passengers: isRu ? "Количество пассажиров" : "Кількість пасажирів",
    carClass: isRu ? "Класс авто" : "Клас авто",
    comment: isRu ? "Комментарий" : "Коментар",
    bookTransfer: isRu ? "ЗАБРОНИРОВАТЬ ТРАНСФЕР" : "Забронювати трансфер",
    faqTitle: isRu ? "Частые вопросы" : "Поширені питання",
    faqCta: isRu ? "Не нашли ответ?" : "Не знайшли відповідь?",
    telegramSentence: isRu ? "Написать в Telegram" : "Написати в Telegram",
    call: isRu ? "Позвонить" : "Зателефонувати",
    reviewSeoTitle: isRu ? "Популярные запросы клиентов" : "Популярні запити клієнтів",
    reviewSeoIntro: isRu
      ? "Популярные запросы клиентов в Google:"
      : "Популярні запити клієнтів у Google:",
    blogEyebrow: isRu ? "БЛОГ" : "БЛОГ",
    blogTitle: isRu ? "Полезный блог" : "Корисний блог",
    blogText: isRu
      ? "Советы для поездок, маршруты и полезная информация для клиентов."
      : "Поради для поїздок, маршрути та корисна інформація для клієнтів.",
    mainRouteEyebrow: isRu ? "ОСНОВНОЙ МАРШРУТ" : "ОСНОВНИЙ МАРШРУТ",
    read: isRu ? "Читать" : "Читати",
    infoEyebrow: isRu ? "ИНФОРМАЦИЯ" : "ІНФОРМАЦІЯ",
    infoTitle: isRu
      ? "VIP трансферы Украина — Молдова — Польша"
      : "VIP трансфери Україна — Молдова — Польща",
    footerDescription: isRu
      ? "Премиальные международные трансферы между Украиной, Молдовой и Польшей для частных, бизнес- и VIP-клиентов."
      : "Преміальні міжнародні трансфери між Україною, Молдовою та Польщею для приватних, бізнес- та VIP-клієнтів.",
    footerCtaTitle: isRu ? "Нужен трансфер сегодня?" : "Потрібен трансфер сьогодні?",
    footerCtaText: isRu
      ? "Напишите нам в Telegram или позвоните — подберём авто под ваш маршрут и время выезда."
      : "Напишіть нам у Telegram або зателефонуйте — підберемо авто під ваш маршрут і час виїзду.",
    footerServiceTitle: isRu
      ? "VIP трансферы Украина — Молдова — Польша"
      : "VIP трансфери Україна — Молдова — Польща",
    footerServiceTags: "Airport transfer · Business transfer · Private transfer",
    footerCompany: isRu ? "Компания" : "Компанія",
    footerContacts: isRu ? "Контакты" : "Контакти",
    footerLanguages: isRu ? "Языки" : "Мови",
    footerHome: isRu ? "Главная" : "Головна",
    footerDirections: isRu ? "Направления" : "Напрямки",
    footerAllDirections: isRu ? "Все направления" : "Усі напрямки",
    footerFleet: isRu ? "Автопарк" : "Автопарк",
    footerContactsLink: isRu ? "Контакты" : "Контакти",
    footerAbout: isRu ? "О нас" : "Про нас",
    footerCopyright: isRu
      ? "© 2026 Grand Transfer. Все права защищены."
      : "© 2026 Grand Transfer. Усі права захищені.",
    callCompact: isRu ? "Позвонить" : "Подзвонити",
    successEyebrow: isRu ? "Заявка отправлена" : "Заявку надіслано",
    successTitle: isRu ? "Спасибо за заявку" : "Дякуємо за заявку",
    successBody: isRu
      ? "Спасибо! Мы скоро свяжемся с вами."
      : "Дякуємо! Ми скоро зв'яжемося з вами.",
    successNote: isRu
      ? "Если вопрос срочный — нажмите «Позвонить сейчас»."
      : "Якщо питання термінове — натисніть “Подзвонити зараз”.",
    successCallButton: isRu ? "Позвонить сейчас" : "Подзвонити зараз",
    popularBadge: isEn ? "TOP" : isRu ? "ТОП" : "ТОП"
  };
  const heroBenefits: HeroBenefit[] = isEn
    ? [
        { title: "Vehicle on demand", description: "24/7", Icon: CarIcon },
        { title: "No prepayment", description: "Pay after the ride", Icon: CardShieldIcon },
        { title: "Airport waiting", description: "Included", Icon: AirportWaitIcon },
        { title: "Flight tracking", description: "Complimentary", Icon: RadarIcon }
      ]
    : isRu
      ? [
          { title: "Подача авто", description: "24/7", Icon: CarIcon },
          { title: "Без предоплаты", description: "Оплата после поездки", Icon: CardShieldIcon },
          { title: "Ожидание в аэропорту", description: "Включено", Icon: AirportWaitIcon },
          { title: "Отслеживание рейса", description: "Бесплатно", Icon: RadarIcon }
        ]
      : [
          { title: "Подача авто", description: "24/7", Icon: CarIcon },
          { title: "Без передоплати", description: "Оплата після поїздки", Icon: CardShieldIcon },
          { title: "Очікування в аеропорту", description: "Включено", Icon: AirportWaitIcon },
          { title: "Відстеження рейсу", description: "Безкоштовно", Icon: RadarIcon }
        ];
  const navItems: NavItem[] = [
    { label: ui.navHome, href: homeHref },
    { label: ui.navDirections, href: directionsHref },
    { label: ui.navFleet, href: "/avtopark" },
    { label: ui.navContacts, href: "/kontakty" },
    { label: ui.navAbout, href: "/pro-kompaniiu" },
    { label: ui.navBlog, href: "/blog" }
  ];
  const mainRoutesHref = isRu ? "/ru/routes" : "/routes";
  const primaryRouteCityLabels = isEn
    ? ["Odesa", "Kyiv", "Chisinau", "Dnipro", "Krakow", "Lviv", "Warsaw", "Iasi"]
    : isRu
      ? ["Одесса", "Киев", "Кишинёв", "Кишинев", "Днепр", "Краков", "Львов", "Варшава", "Яссы"]
      : ["Одеса", "Київ", "Кишинів", "Дніпро", "Краків", "Львів", "Варшава", "Ясси"];
  const allRoutesTrustItems: HeroBenefit[] = isEn
    ? [
        { title: "Comfort cars", description: "Premium class", Icon: CarIcon },
        { title: "Experienced drivers", description: "Professional service", Icon: ConciergeIcon },
        { title: "Safe and reliable", description: "Your safety is our priority", Icon: ShieldIcon }
      ]
    : isRu
      ? [
          { title: "Комфортные авто", description: "Премиум класса", Icon: CarIcon },
          { title: "Опытные водители", description: "Профессиональный сервис", Icon: ConciergeIcon },
          { title: "Безопасно и надежно", description: "Ваша безопасность — наш приоритет", Icon: ShieldIcon }
        ]
      : [
          { title: "Комфортні авто", description: "Преміум класу", Icon: CarIcon },
          { title: "Досвідчені водії", description: "Професійний сервіс", Icon: ConciergeIcon },
          { title: "Безпечно та надійно", description: "Ваша безпека — наш пріоритет", Icon: ShieldIcon }
        ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const preferredRouteCityOrderLocalized = isRu
    ? [
        "Киев",
        "Одесса",
        "Кишинёв",
        "Кишинев",
        "Днепр",
        "Краков",
        "Львов",
        "Варшава",
        "Яссы",
        "Будапешт",
        "Винница",
        "Житомир",
        "Запорожье",
        "Ивано-Франковск",
        "Кропивницкий",
        "Луцк",
        "Николаев",
        "Полтава",
        "Ровно",
        "Сумы",
        "Тернополь",
        "Ужгород",
        "Харьков",
        "Хмельницкий",
        "Черкассы",
        "Черновцы",
        "Чернигов"
      ]
    : preferredRouteCityOrder;
  const defaultPrimaryCity = isRu ? "Одесса" : "Одеса";
  const defaultRouteCity = initialHomepageRoutes.some((route) => route.from_city === defaultPrimaryCity)
    ? defaultPrimaryCity
    : initialHomepageRoutes.find((route) => route.from_city)?.from_city || defaultPrimaryCity;
  const [activeRouteCity, setActiveRouteCity] = useState<string>(defaultRouteCity);
  const [showMoreRoutesFromCity, setShowMoreRoutesFromCity] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [homepageRoutes, setHomepageRoutes] = useState<HomepageRoute[]>(initialHomepageRoutes);
  const [routesLoaded, setRoutesLoaded] = useState(initialHomepageRoutes.length > 0);
  const homeFinalForm = useTransferForm({
    formName: "homepage_booking_form",
    pageType: "home",
    route: null,
    language: isRu ? "ru" : "ua",
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
        .select("slug, from_city, to_city, price_from, duration")
        .eq("is_active", true)
        .eq("lang", routeLanguage)
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
  }, [routeLanguage]);

  const routeCities = Array.from(
    new Set(
      homepageRoutes
        .map((route) => (typeof route.from_city === "string" ? route.from_city.trim() : ""))
        .filter(Boolean)
    )
  ).sort((left, right) => {
    const leftPriority = preferredRouteCityOrderLocalized.indexOf(left);
    const rightPriority = preferredRouteCityOrderLocalized.indexOf(right);

    if (leftPriority !== -1 && rightPriority !== -1) {
      return leftPriority - rightPriority;
    }

    if (leftPriority !== -1) {
      return -1;
    }

    if (rightPriority !== -1) {
      return 1;
    }

    return left.localeCompare(right, isRu ? "ru" : "uk");
  });

  useEffect(() => {
    if (routeCities.length > 0 && !routeCities.includes(activeRouteCity)) {
      setActiveRouteCity(routeCities.includes(defaultPrimaryCity) ? defaultPrimaryCity : routeCities[0]);
    }
  }, [activeRouteCity, routeCities, defaultPrimaryCity]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  // Issue #5: collapse the per-city route list whenever the active city changes.
  useEffect(() => {
    setShowMoreRoutesFromCity(false);
  }, [activeRouteCity]);

  const buildRouteHref = (slug: string) => `${routeHrefPrefix}/${slug}`;
  const primaryRouteCities = primaryRouteCityLabels.filter((city) => routeCities.includes(city));
  const orderedRouteCities = [
    ...primaryRouteCities,
    ...routeCities.filter((city) => !primaryRouteCities.includes(city))
  ];
  const activeRoutes = homepageRoutes.filter(
    (route) => route.from_city === activeRouteCity && route.to_city
  );
  // Issue #2: prioritise destinations Chisinau → Warsaw → Kyiv, then alphabetical.
  const sortedActiveRoutes = [...activeRoutes].sort((left, right) => {
    const leftPriority = getRouteDestinationPriority(left.to_city);
    const rightPriority = getRouteDestinationPriority(right.to_city);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return (left.to_city || "").localeCompare(
      right.to_city || "",
      isRu ? "ru" : "uk"
    );
  });
  // Issue #3: show 9 cards on desktop / 5 on mobile, expandable to every route.
  const initialRouteLimit = isMobileViewport ? 5 : 9;
  const hasMoreRoutes = sortedActiveRoutes.length > initialRouteLimit;
  const visibleRoutes = showMoreRoutesFromCity
    ? sortedActiveRoutes
    : sortedActiveRoutes.slice(0, initialRouteLimit);
  const highlightedRouteLabels = sortedActiveRoutes
    .slice(0, Math.min(3, sortedActiveRoutes.length))
    .map((route) => `${route.from_city} → ${route.to_city}`);
  const serviceCardsLocalized = isRu
    ? [
        { title: "VIP комфорт", lines: ["Премиальные авто", "и тишина в дороге."], Icon: SeatIcon },
        { title: "Пунктуальность", lines: ["Подача авто", "без задержек."], Icon: ClockIcon },
        { title: "Безопасность", lines: ["Опытные водители", "и контроль качества."], Icon: ShieldIcon },
        { title: "Индивидуальный подход", lines: ["Маршрут и подача", "под ваш график."], Icon: ConciergeIcon },
        { title: "Помощь с багажом", lines: ["Помощь с багажом", "и встреча на месте."], Icon: LuggageIcon },
        { title: "Сервис 24/7", lines: ["Поддержка и подача", "в любое время."], Icon: SupportIcon }
      ]
    : serviceCards;
  const processStepsLocalized = isRu
    ? [
        { number: "01", title: "Оставляете заявку", description: "Отправляете основные детали поездки." },
        { number: "02", title: "Согласовываем маршрут и авто", description: "Подбираем класс авто и время подачи." },
        { number: "03", title: "Водитель прибывает вовремя", description: "Подача без задержек и лишнего ожидания." },
        { number: "04", title: "Комфортная поездка до пункта назначения", description: "Спокойный трансфер под ваш график." }
      ]
    : processSteps;
  const faqItemsLocalized = isRu
    ? [
        {
          question: "Сколько стоит трансфер Одесса — Кишинёв?",
          answer:
            "Ориентировочная стоимость стартует от €170. Финальная цена зависит от даты, класса авто, времени выезда и индивидуальных пожеланий."
        },
        {
          question: "Сколько стоит трансфер Киев — Кишинёв?",
          answer:
            "Ориентировочная стоимость стартует от €500. Финальная цена зависит от маршрута, класса авто, количества пассажиров и формата поездки."
        },
        {
          question: "Помогает ли водитель на границе?",
          answer:
            "Да, водитель сопровождает вас по маршруту, помогает сориентироваться и подсказывает ключевые этапы прохождения границы."
        },
        {
          question: "Доступны ли поездки 24/7?",
          answer:
            "Да, трансфер доступен в любое время — ранний выезд, ночная подача или индивидуальный график."
        }
      ]
    : faqItems;
  const reviewsSeoRoutesLocalized = isRu
    ? [
        "трансфер Одесса — Кишинёв",
        "трансфер Киев — Кишинёв",
        "трансфер Днепр — Кишинёв",
        "трансфер Харьков — Кишинёв",
        "трансфер Львов — Кишинёв"
      ]
    : reviewsSeoRoutes;
  const featuredArticleLocalized = isRu
    ? {
        ...featuredArticle,
        title: "Трансфер Одесса — Кишинёв: как быстро и комфортно добраться",
        description:
          "Коротко о маршруте, стоимости, времени в пути и преимуществах частного трансфера."
      }
    : featuredArticle;
  const passengerOptionsLocalized = isRu
    ? ["1 пассажир", "2 пассажира", "3 пассажира", "4 пассажира", "5+ пассажиров"]
    : passengerOptions;
  const carClassesLocalized = isRu
    ? ["Комфорт", "Бизнес", "Премиум", "Минивэн"]
    : carClasses;
  const faqMidpointLocalized = Math.ceil(faqItemsLocalized.length / 2);
  const faqColumns = [
    faqItemsLocalized.slice(0, faqMidpointLocalized),
    faqItemsLocalized.slice(faqMidpointLocalized)
  ];
  const homeStructuredData = [
    buildFaqSchema(faqItemsLocalized),
    buildHowToSchema(
      ui.howTitle,
      processStepsLocalized.map((step) => ({
        name: step.title,
        text: step.description
      }))
    )
  ];

  function isPopularHomepageRoute(slug: string | null) {
    return typeof slug === "string" && popularHomepageRouteSlugs.has(slug);
  }

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
      <JsonLd data={homeStructuredData} />
      <main className="relative overflow-hidden pb-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(216,185,130,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[22rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(29,42,31,0.42),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[52rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,185,130,0.08),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-[1536px] px-4 pt-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <header className="header-shell relative z-30 rounded-[24px] px-[18px] py-3 sm:px-5 md:rounded-[30px] md:px-7 lg:px-[34px]">
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_1fr_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_1fr_310px]">
              <Link href={homeHref} className="header-brand block">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="luxury-logo-subtitle">{isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"}</div>
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
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  links={{ ua: "/", ru: "/ru" }}
                />
                <a
                  href="#booking-form"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "home"
                    })
                  }
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-6 text-[0.75rem] font-bold uppercase tracking-[0.09em] xl:h-12 xl:px-7 xl:text-[0.78rem] xl:tracking-[0.11em]"
                >
                  {ui.order}
                </a>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-drawer"
                  aria-label={ui.openMenu}
                  onClick={() => setMenuOpen(true)}
                  className="burger-button inline-flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <BurgerIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mt-3 md:mt-4">
            <div className="hero-shell hero-shell-home relative overflow-hidden rounded-[28px] md:rounded-[30px]">
              <div className="absolute inset-0">
                <Image
                  src={desktopHero}
                  alt="Автомобіль Grand Transfer для міжнародного VIP трансферу"
                  priority
                  fill
                  className="hidden object-cover object-[82%_center] md:block lg:object-[76%_center] xl:object-[70%_center]"
                  sizes="100vw"
                />
                <Image
                  src={mobileHero}
                  alt="Автомобіль Grand Transfer для міжнародного VIP трансферу"
                  priority
                  fill
                  className="object-cover object-bottom md:hidden"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,0.2)_0%,rgba(5,7,6,0.48)_100%)] md:bg-[linear-gradient(92deg,rgba(4,6,5,0.95)_0%,rgba(4,6,5,0.84)_28%,rgba(4,6,5,0.46)_58%,rgba(4,6,5,0.05)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,42,31,0.28),transparent_34%),linear-gradient(180deg,rgba(6,8,7,0.1)_0%,rgba(6,8,7,0.52)_100%)] md:bg-[radial-gradient(circle_at_16%_18%,rgba(29,42,31,0.26),transparent_34%),radial-gradient(circle_at_82%_44%,rgba(216,185,130,0.16),transparent_24%),linear-gradient(180deg,rgba(6,8,7,0.03)_0%,rgba(6,8,7,0.28)_100%)]" />
              </div>

              <div className="relative z-10 flex min-h-[560px] flex-col justify-center px-5 py-8 sm:px-6 sm:py-10 md:min-h-[540px] md:px-[3.8rem] md:py-[3.3rem] lg:min-h-[560px] lg:px-[4.3rem] lg:py-[3.55rem] xl:min-h-[590px] xl:px-[4.8rem] xl:py-[3.8rem]">
                <div className="max-w-[50rem]">
                  <h1 className="headline-lux mt-1.5 max-w-[46rem] text-[clamp(2.2rem,10vw,2.9rem)] font-medium leading-[1.01] tracking-[-0.038em] text-[var(--text)] md:text-[clamp(2.85rem,4.15vw,4.15rem)] md:leading-[0.99]">
                    {ui.heroTitle}
                  </h1>
                  <p className="mt-4 max-w-[32rem] text-[0.98rem] leading-[1.8] text-[var(--muted)] md:text-[1.03rem]">
                    {ui.heroSubtitle}
                  </p>
                  <p className="mt-3.5 max-w-[30rem] text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)] md:text-[0.86rem]">
                    {ui.heroDescription}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:gap-3">
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
                      {ui.heroOrder}
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
                      {ui.telegram}
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="relative z-20 -mt-4 md:-mt-5 xl:-mt-6">
            <div className="hero-benefits-shell rounded-[24px] px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5">
              <div className="hero-benefits-grid grid sm:grid-cols-2 xl:grid-cols-4">
                {heroBenefits.map(({ title, description, Icon }) => (
                  <article key={`${title}-${description}`} className="hero-benefit-item">
                    <span className="hero-benefit-icon">
                      <Icon className="h-[16px] w-[16px] text-[var(--champagne)]" />
                    </span>
                    <div className="min-w-0">
                      <p className="hero-benefit-title">{title}</p>
                      <p className="hero-benefit-description">{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="routes-network-wide"
            className="relative z-10 mt-7 md:mt-9 xl:mt-11"
          >
            <div className="routes-wide-panel relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] px-5 py-8 sm:px-7 md:px-10 md:py-10 lg:min-h-[480px] lg:px-14 lg:py-12 xl:min-h-[500px] xl:px-[3.5rem]">
              <Image
                src={mapsNewImage}
                alt={isRu
                  ? "Карта направлений между Украиной, Молдовой и Польшей"
                  : "Карта напрямків між Україною, Молдовою та Польщею"}
                fill
                className="object-cover object-[66%_center] md:object-[68%_center] lg:object-[68%_center] xl:object-[72%_center]"
                sizes="100vw"
              />
              <div className="routes-wide-overlay-primary absolute inset-0" />
              <div className="routes-wide-overlay-secondary absolute inset-0" />
              <div className="routes-wide-overlay-vignette absolute inset-0" />

              <div id="popular-routes" className="relative z-10 flex max-w-[30rem] flex-1 flex-col justify-center">
                <p className="mb-6 text-[0.75rem] font-bold uppercase tracking-[0.26em] text-[var(--champagne)]">
                  {ui.mainDirectionsEyebrow}
                </p>
                <h2 className="section-title-lux text-[2.45rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:text-[2.95rem] lg:text-[3.15rem] xl:text-[3.45rem]">
                  {ui.mainDirectionsTitle}
                </h2>
                <p className="mt-6 max-w-[25rem] text-[1rem] leading-[1.75] text-[var(--muted)]">
                  {ui.mainDirectionsText}
                </p>
                <div className="mt-8">
                  <Link
                    href={mainRoutesHref}
                    onClick={() =>
                      trackCtaClick({
                        ctaType: "route_link",
                        location: "main_directions",
                        pageType: "home",
                        target: mainRoutesHref
                      })
                    }
                    className="button-gold inline-flex h-12 items-center justify-center rounded-full px-6 text-[0.76rem] font-bold uppercase tracking-[0.1em] md:h-13 md:px-7 md:text-[0.78rem]"
                  >
                    {ui.mainDirectionsCta}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section
            id="directions"
            className="relative z-10 mt-24 md:mt-28 xl:mt-32"
          >
            <div className="all-routes-shell rounded-[30px] px-4 py-5 sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-12">
              <div className="all-routes-hero">
                <div className="all-routes-copy">
                  <p className="all-routes-eyebrow">
                    <PlaneMiniIcon className="h-[15px] w-[15px]" />
                    <span>{ui.allDirectionsEyebrow}</span>
                  </p>
                  <h2 className="all-routes-title">
                    {ui.chooseRoute}
                  </h2>
                  <p className="all-routes-subtitle">
                    {ui.chooseCity}
                  </p>
                </div>

                <div className="all-routes-visual" aria-hidden="true">
                  <Image
                    src={desktopHero}
                    alt=""
                    fill
                    className="object-cover object-[70%_center]"
                    sizes="(max-width: 767px) 100vw, 44vw"
                  />
                  <div className="all-routes-visual-overlay" />
                  <div className="all-routes-map-line all-routes-map-line-one" />
                  <div className="all-routes-map-line all-routes-map-line-two" />
                  <span className="all-routes-location-pin">
                    <MapPinStrokeIcon className="h-[24px] w-[24px]" />
                  </span>
                </div>
              </div>

              <div className="routes-tabs-row all-routes-tabs mt-7">
                {orderedRouteCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setActiveRouteCity(city)}
                    className={`routes-tab ${activeRouteCity === city ? "is-active" : ""}`}
                  >
                    <MapPinStrokeIcon className="routes-tab-icon" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>

              <div className="all-routes-list-shell mt-8">
                <div className="all-routes-list-header">
                  <div className="all-routes-list-title-wrap">
                    <span className="all-routes-list-icon">
                      <RouteStrokeIcon className="h-[22px] w-[22px]" />
                    </span>
                    <h3 className="all-routes-list-title">
                      {ui.routesFromCity} {activeRouteCity}
                    </h3>
                  </div>
                </div>

                {!routesLoaded ? (
                  <p className="all-routes-state-text">
                    {ui.loadingRoutes}
                  </p>
                ) : visibleRoutes.length === 0 ? (
                  <p className="all-routes-state-text">
                    {ui.noRoutes}
                  </p>
                ) : (
                  <div className="all-routes-cards-grid">
                    {visibleRoutes.map((route) => {
                      const routeLabel = `${route.from_city} → ${route.to_city}`;
                      const routePriceValue =
                        route.price_from != null ? `€${route.price_from}` : ui.onRequest;
                      const routeDuration = route.duration?.trim() || null;
                      const isPopular = isPopularHomepageRoute(route.slug);
                      const cardClassName = `all-route-card all-route-card-item ${
                        highlightedRouteLabels.includes(routeLabel) ? "is-highlighted" : ""
                      }`;

                      const cardContent = (
                        <>
                          {isPopular ? (
                            <span className="all-route-badge">{ui.popularBadge}</span>
                          ) : null}
                          <span className="all-route-card-icon">
                            <MapPinStrokeIcon className="h-[23px] w-[23px]" />
                          </span>
                          <span className="all-route-card-main">
                            <span className="all-route-card-title">{routeLabel}</span>
                            {routeDuration ? (
                              <span className="all-route-card-duration">
                                <ClockIcon className="h-[13px] w-[13px]" />
                                <span>{routeDuration}</span>
                              </span>
                            ) : null}
                          </span>
                          <span className="all-route-card-price-wrap">
                            {route.price_from != null ? (
                              <span className="all-route-card-price-prefix">{ui.fromPrefix}</span>
                            ) : null}
                            <span className="all-route-card-price">{routePriceValue}</span>
                          </span>
                          <span className="all-route-card-arrow" aria-hidden="true">
                            <ArrowUpRightIcon className="h-[18px] w-[18px]" />
                          </span>
                        </>
                      );

                      if (!route.slug) {
                        return (
                          <div key={routeLabel} className={`${cardClassName} opacity-70`}>
                            {cardContent}
                          </div>
                        );
                      }

                      return (
                        <a
                          key={route.slug}
                          href={buildRouteHref(route.slug)}
                          aria-label={routeLabel}
                          onClick={() =>
                            trackRouteClick({
                              route: formatRouteId(routeLabel),
                              sourceBlock: "all_routes",
                              pageType: "home"
                            })
                          }
                          className={cardClassName}
                        >
                          {cardContent}
                        </a>
                      );
                    })}

                    {hasMoreRoutes ? (
                      <button
                        type="button"
                        onClick={() => setShowMoreRoutesFromCity((current) => !current)}
                        className="all-routes-showmore"
                        aria-expanded={showMoreRoutesFromCity}
                      >
                        <span className="all-routes-showmore-label">
                          {showMoreRoutesFromCity ? ui.collapse : ui.showMore}
                        </span>
                        <span className="all-routes-showmore-icon" aria-hidden="true">
                          <ChevronDownIcon className="h-[16px] w-[16px]" />
                        </span>
                      </button>
                    ) : null}

                    <Link
                      href={mainRoutesHref}
                      onClick={() =>
                        trackCtaClick({
                          ctaType: "route_link",
                          location: "all_routes",
                          pageType: "home",
                          target: mainRoutesHref
                        })
                      }
                      className="all-routes-cta-card"
                    >
                      <span className="all-routes-cta-icon">
                        <GlobeIcon className="h-[28px] w-[28px]" />
                      </span>
                      <span className="all-routes-cta-copy">
                        <span className="all-routes-cta-title">{ui.showAllRoutes}</span>
                        <span className="all-routes-cta-text">{ui.showAllRoutesText}</span>
                      </span>
                      <span className="all-routes-cta-arrow" aria-hidden="true">
                        <ArrowUpRightIcon className="h-[22px] w-[22px]" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="all-routes-trust-strip mt-7">
                {allRoutesTrustItems.map(({ title, description, Icon }) => (
                  <div key={title} className="all-routes-trust-item">
                    <Icon className="all-routes-trust-icon" />
                    <span>
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="service" className="relative z-10 mt-24 md:mt-28 xl:mt-32">
            <div
              className="service-section-panel relative flex min-h-[780px] flex-col overflow-hidden rounded-[32px] px-5 py-10 sm:px-7 md:px-10 md:py-14 xl:min-h-[760px] xl:px-10 xl:py-24"
              style={{ backgroundImage: `url(${serviceImage.src})` }}
            >
              <div className="service-section-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[32.5rem]">
                <p className="eyebrow-lux opacity-80">{ui.serviceEyebrow}</p>
                <h2 className="section-title-lux mt-4 text-[2.25rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-[2.7rem] lg:text-[3.4rem]">
                  {ui.serviceTitle.split("\n")[0]}
                  <br />
                  {ui.serviceTitle.split("\n")[1]}
                </h2>
                <p className="mt-5 max-w-[32.5rem] text-[0.98rem] leading-[1.9] text-[var(--muted)] md:text-[1.04rem]">
                  {ui.serviceText}
                </p>
              </div>

              <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 xl:mt-auto xl:grid-cols-6 xl:gap-4">
                {serviceCardsLocalized.map(({ title, lines, Icon }) => (
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
              <p className="eyebrow-lux">{ui.howEyebrow}</p>
              <h2 className="section-title-lux mt-4 text-[2.28rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.9rem] lg:text-[3.2rem]">
                {ui.howTitle}
              </h2>
            </div>

            <div className="how-shell mt-10 rounded-[30px] px-5 py-8 sm:px-7 md:px-9 lg:px-12 lg:py-12">
              <div className="how-grid">
                {processStepsLocalized.map(({ number, title, description }) => (
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
                <p className="eyebrow-lux">{ui.bookingEyebrow}</p>
                <h2 className="booking-heading-lux mt-4 text-[2.3rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] md:text-[2.95rem] lg:text-[3.2rem]">
                  {ui.bookingTitle}
                </h2>
                <p className="mt-5 text-[0.98rem] leading-[1.85] text-[var(--muted)]">
                  {ui.bookingText}
                </p>
              </div>

              <div className="panel-form mt-8 rounded-[28px] p-4 sm:p-5 md:mt-10 md:p-6 lg:mt-0">
                <form
                  noValidate
                  onSubmit={homeFinalForm.handleSubmit}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <TextField
                    label={ui.name}
                    name="full_name"
                    value={homeFinalForm.values.fullName}
                    onChange={homeFinalForm.handleTextChange("fullName")}
                    placeholder={ui.yourName}
                    autoComplete="name"
                    error={homeFinalForm.errors.fullName}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <PhoneField
                    label={ui.phone}
                    phoneValue={homeFinalForm.phoneDisplayValue}
                    phonePlaceholder={ui.yourPhone}
                    phoneMaxLength={homeFinalForm.phoneMaxLength}
                    onPhoneChange={homeFinalForm.handlePhoneNumberChange}
                    error={homeFinalForm.errors.phone}
                    inputClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label={ui.from}
                    name="from_city"
                    value={homeFinalForm.values.fromCity}
                    onChange={homeFinalForm.handleTextChange("fromCity")}
                    placeholder={ui.from}
                    error={homeFinalForm.errors.fromCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label={ui.to}
                    name="to_city"
                    value={homeFinalForm.values.toCity}
                    onChange={homeFinalForm.handleTextChange("toCity")}
                    placeholder={ui.to}
                    error={homeFinalForm.errors.toCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <DateField
                    label={ui.date}
                    name="travel_date"
                    value={homeFinalForm.values.travelDate}
                    onChange={homeFinalForm.handleTextChange("travelDate")}
                    min={homeFinalForm.today}
                    error={homeFinalForm.errors.travelDate}
                    placeholderText={ui.chooseDate}
                    locale={isRu ? "ru-RU" : "uk-UA"}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <SelectField
                    label={ui.passengers}
                    name="passengers"
                    value={homeFinalForm.values.passengers}
                    onChange={homeFinalForm.handleTextChange("passengers")}
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    <option value="">{ui.passengers}</option>
                    {passengerOptionsLocalized.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    label={ui.carClass}
                    name="car_class"
                    value={homeFinalForm.values.carClass}
                    onChange={homeFinalForm.handleTextChange("carClass")}
                    wrapperClassName="md:col-span-2"
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    {carClassesLocalized.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                  <TextAreaField
                    label={ui.comment}
                    name="comment"
                    value={homeFinalForm.values.comment}
                    onChange={homeFinalForm.handleTextChange("comment")}
                    placeholder={ui.comment}
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
                    {ui.bookTransfer}
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
                {ui.faqTitle}
              </h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {faqColumns.map((column, columnIndex) => (
                <div key={`faq-column-${columnIndex}`} className="space-y-3">
                  {column.map(({ question, answer }, itemIndex) => {
                    const index = columnIndex * faqMidpointLocalized + itemIndex;
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
                {ui.faqCta}
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
                  {ui.telegramSentence}
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
                  {ui.call}
                </a>
              </div>
            </div>
          </section>

          <ReviewsSection
            location="homepage"
            className="mt-12 md:mt-16 xl:mt-20"
            language={isRu ? "ru" : "ua"}
          />
          <div className="mt-5 rounded-[24px] border border-[rgba(216,185,130,0.1)] bg-[rgba(10,13,11,0.34)] px-5 py-5 sm:px-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--champagne)]">
              {ui.reviewSeoTitle}
            </p>
            <p className="mt-2 text-[0.88rem] leading-[1.7] text-[rgba(183,178,168,0.8)]">
              {ui.reviewSeoIntro}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {reviewsSeoRoutesLocalized.map((item) => (
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
              <p className="eyebrow-lux">{ui.blogEyebrow}</p>
              <h2 className="section-title-lux mt-4 text-[2.05rem] font-medium leading-[1.06] tracking-[-0.04em] text-[var(--text)] md:text-[2.55rem] lg:text-[2.9rem]">
                {ui.blogTitle}
              </h2>
              <p className="mt-4 max-w-[36rem] text-[0.97rem] leading-[1.8] text-[var(--muted)]">
                {ui.blogText}
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
                <p className="eyebrow-lux">{ui.mainRouteEyebrow}</p>
                <h3 className="section-title-lux mt-4 text-[1.95rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.25rem]">
                  {featuredArticleLocalized.title}
                </h3>
                <p className="mt-4 max-w-[32rem] text-[0.96rem] leading-[1.8] text-[var(--muted)]">
                  {featuredArticleLocalized.description}
                </p>
                <Link
                  href={featuredArticleLocalized.href}
                  className="button-outline mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
                >
                  {ui.read}
                </Link>
              </div>
            </article>
          </section>

          <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
            <div className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8 lg:px-12">
              <p className="eyebrow-lux">{ui.infoEyebrow}</p>
              <h2 className="section-title-lux mt-4 text-[2.05rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.45rem]">
                {ui.infoTitle}
              </h2>
              <div className="mt-5 max-w-[58rem] space-y-4 text-[0.96rem] leading-[1.85] text-[var(--muted)]">
                {isRu ? (
                  <>
                    <p>
                      Grand Transfer организует частные VIP трансферы между
                      Украиной, Молдовой и Польшей для частных клиентов,
                      семейных поездок и бизнес-маршрутов. Чаще всего клиенты
                      заказывают трансфер Одесса Кишинёв, трансфер Киев
                      Кишинёв, трансфер Днепр Кишинёв, трансфер Харьков
                      Кишинёв и трансфер Львов Кишинёв, а также международные
                      поездки в Варшаву, Бухарест и Яссы.
                    </p>
                    <p>
                      Мы работаем с индивидуальной подачей авто, частным
                      водителем, помощью на границе и маршрутом без
                      попутчиков. Вы можете заказать трансфер в город,
                      аэропорт, отель, на вокзал или по любому адресу по
                      предварительному согласованию. Для клиентов, которым
                      нужен VIP трансфер Украина Европа, мы согласовываем
                      маршрут, время подачи и класс авто под индивидуальный
                      запрос.
                    </p>
                    <p>
                      Финальная стоимость зависит от маршрута, класса авто,
                      даты выезда, количества пассажиров, багажа и
                      дополнительных остановок. Чтобы уточнить цену, оставьте
                      заявку на сайте или напишите в Telegram.
                    </p>
                    <p>
                      Мы обслуживаем как частные поездки, так и трансферы для
                      бизнес-клиентов и партнёров.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter pageType="home" currentLanguage={currentLanguage} />

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label={ui.closeMenu}
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
              <div className="luxury-logo-subtitle mt-2">{isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"}</div>
            </div>
            <button
              type="button"
              aria-label={ui.closeMenu}
              onClick={() => setMenuOpen(false)}
              className="burger-button inline-flex h-11 w-11 items-center justify-center rounded-full"
            >
              <CloseIcon className="h-[15px] w-[15px]" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-5">
            {navItems.map(({ label, href }) => (
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

          <LanguageSwitcher
            className="mt-8 self-start"
            currentLanguage={currentLanguage}
            links={{ ua: "/", ru: "/ru" }}
          />

          <div className="mt-auto space-y-5 pt-10">
                <HeaderPhoneLink
                  pageType="home"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  compactLabel={ui.callCompact}
                  className="inline-flex"
                />
            <a
              href="#booking-form"
              onClick={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "home"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              {ui.order}
            </a>
          </div>
        </aside>
      </div>

      <SuccessPopup
        open={homeFinalForm.isSuccessOpen}
        onClose={homeFinalForm.closeSuccessModal}
        pageType="home"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
        eyebrowText={ui.successEyebrow}
        titleText={ui.successTitle}
        bodyText={ui.successBody}
        noteText={ui.successNote}
        callButtonText={ui.successCallButton}
        closeButtonText={isRu ? "Закрыть" : "Закрити"}
        closeOverlayLabel={isRu ? "Закрыть сообщение" : "Закрити повідомлення"}
        closeButtonLabel={isRu ? "Закрыть" : "Закрити"}
      />
      <FloatingContactWidget
        pageType="home"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
    </>
  );
}

function PlaneMiniIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m3.8 13.1 16.4-8.2-4.8 15.2-3.3-6.1-6.4 2.9-1.9-3.8Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <path
        d="m12.1 14 8.1-9.1"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M4 12h16M12 3.8c2.1 2.1 3.1 4.8 3.1 8.2s-1 6.1-3.1 8.2c-2.1-2.1-3.1-4.8-3.1-8.2S9.9 5.9 12 3.8Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function ChevronDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6 9.5 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
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

function CardShieldIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.5"
        y="6"
        width="17"
        height="11.5"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M3.8 9.6h16.4M8 14.15h3.3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M17.05 17.9c1.9-.42 3.25-2.2 3.25-4.18V11.9l-3.25-1.3-3.25 1.3v1.82c0 1.98 1.36 3.76 3.25 4.18Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AirportWaitIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18.5h16M7.4 15.1h9.2M12 6.1v9M9.1 8.8 12 6.1l2.9 2.7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 12.3h2.25m7.3 0h2.35"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RadarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 12 17.2 8.8M12 4.5v1.7M19.5 12h-1.7M12 17.8v1.7M6.2 12H4.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <circle cx="17.2" cy="8.8" r="1" fill="currentColor" />
    </svg>
  );
}
