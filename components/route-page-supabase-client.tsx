"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import routeHeroDesktop from "../img/main-2-screen-desk.png";
import routeHeroMobile from "../img/main-2-screen-mob.png";
import airportImage from "../img/airport.png";
import comfortCarImage from "../img/class-1.png";
import businessCarImage from "../img/class-2.png";
import premiumCarImage from "../img/class-3.png";
import minivanCarImage from "../img/class-4.png";
import routeInfoFallbackImage from "../img/route-map-fallback-2.png";
import {
  DateField,
  PhoneField,
  SelectField,
  TextAreaField,
  TextField
} from "./lux-form-fields";
import type { CarClassCardData } from "./car-classes-grid";
import { ReviewsSection } from "./reviews-section";
import { TELEGRAM_URL } from "../lib/contact-links";
import {
  FloatingContactWidget,
  FooterContactLinks,
  HeaderPhoneLink,
  LanguageSwitcher,
  SuccessPopup
} from "./site-ui";
import type {
  RouteLanguage,
  RouteLanguageLinks,
  DynamicRelatedRoute,
  DynamicRouteReview
} from "../lib/route-page-data";
import {
  formatRouteId,
  trackCarImageOpen,
  trackCtaClick,
  trackFaqOpen,
  trackMessengerClick,
  trackPhoneClick,
  trackRouteClick,
  trackSocialClick
} from "../lib/tracking";
import { useTransferForm } from "../lib/use-transfer-form";

type IconProps = {
  className?: string;
};

type BenefitItem = {
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
};

type RouteDetail = {
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
};

type TripStep = {
  number: string;
  title: string;
  description: string;
};

type RouteFaqItem = {
  question: string;
  answer: string;
};

type RouteFaqTemplate = {
  question: string;
  answer?: string;
};

type SimilarRoute = {
  title: string;
  price: string;
  duration: string | null;
  href: string;
  isOriginMatch: boolean;
};

export interface DynamicRouteData {
  slug: string;
  from_city: string | null;
  to_city: string | null;
  route_image_url: string | null;
  price_from: number | null;
  price_business: number | null;
  price_premium: number | null;
  price_minivan: number | null;
  duration: string | null;
  h1: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_text: string | null;
  lang: string | null;
  translation_group: string | null;
  is_active: boolean | null;
}

type RoutePageSupabaseClientProps = {
  routeData: DynamicRouteData;
  routeReviews?: DynamicRouteReview[];
  relatedRoutes?: DynamicRelatedRoute[];
  currentLanguage?: RouteLanguage;
  languageLinks?: RouteLanguageLinks;
};

const phoneNumber = "+38 063 824 3223";
const phoneHref = "+380638243223";

const benefitItems: BenefitItem[] = [
  {
    title: "Приватний водій",
    description: "Індивідуальний трансфер без попутників",
    Icon: PassengerIcon
  },
  {
    title: "Допомога на кордоні",
    description: "Супровід та підказки на ключовому етапі",
    Icon: ShieldCheckIcon
  },
  {
    title: "Трансфер в аеропорт",
    description: "Доставка в аеропорт Кишинева та у місто",
    Icon: PlaneIcon
  },
  {
    title: "24/7 подача",
    description: "Авто доступне цілодобово, без вихідних",
    Icon: ClockIcon
  },
  {
    title: "Преміальні авто",
    description: "Комфортні авто бізнес та преміум класу",
    Icon: CarIcon
  }
];

const routeDetails: RouteDetail[] = [
  {
    title: "Звідки забираємо",
    description:
      "Подача авто з готелю, ЖК, вокзалу або аеропорту в Одесі.",
    Icon: MapPinIcon
  },
  {
    title: "Куди доставляємо",
    description:
      "Будь-яка адреса в Кишиневі, центр міста або трансфер в аеропорт Кишинева.",
    Icon: TargetIcon
  },
  {
    title: "Можливі зупинки",
    description: "Кава, обід, заправка або інші зупинки, якщо маршрут Одеса — Кишинів потребує додаткового комфорту.",
    Icon: StopIcon
  },
  {
    title: "Індивідуальний графік",
    description: "Виїзд у зручний для вас час, навіть вночі, з подачею авто під ваш графік.",
    Icon: ScheduleIcon
  }
];

const pricingFactors = [
  "Клас авто",
  "Дата та час виїзду",
  "Кількість пасажирів",
  "Кількість багажу",
  "Додаткові зупинки та очікування"
];

const carClassCardTemplates: Omit<CarClassCardData, "price">[] = [
  {
    title: "Комфорт",
    description: "Зручний салон для індивідуальних поїздок.",
    image: comfortCarImage,
    models: ["VW Passat", "Skoda Octavia", "Sonata", "Kia Optima"],
    seats: "3",
    luggage: "2–3",
    climate: "Клімат-контроль"
  },
  {
    title: "Бізнес",
    description: "Підвищений рівень тиші та простору.",
    image: businessCarImage,
    models: ["Toyota Camry", "Nissan Teana", "Skoda Superb", "VW Passat B8"],
    seats: "3",
    luggage: "2–3",
    climate: "Клімат-контроль"
  },
  {
    title: "Преміум",
    description: "Представницький клас і максимальний комфорт.",
    image: premiumCarImage,
    models: ["S-class", "Audi A8", "BMW 7-series", "Lexus LS"],
    seats: "3",
    luggage: "3–4",
    climate: "Клімат-контроль"
  },
  {
    title: "Мінівен",
    description: "Для кількох пасажирів і багажу.",
    image: minivanCarImage,
    models: ["Mercedes Vito", "VW Caravelle", "Opel Vivaro", "Hyundai H-1"],
    seats: "7",
    luggage: "6–8",
    climate: "Клімат-контроль"
  }
];

const tripSteps: TripStep[] = [
  {
    number: "01",
    title: "Заявка",
    description: "Ви залишаєте заявку на сайті або в месенджері."
  },
  {
    number: "02",
    title: "Підтвердження",
    description: "Узгоджуємо маршрут, клас авто та час подачі."
  },
  {
    number: "03",
    title: "Подача в Одесі",
    description: "Водій прибуває вчасно на обрану адресу."
  },
  {
    number: "04",
    title: "Дорога / кордон",
    description: "Комфортна поїздка, допомога на кордоні."
  },
  {
    number: "05",
    title: "Прибуття в Кишинів",
    description: "Доставка до вашої адреси або аеропорту."
  }
];

const airportFeatures = [
  "Подача з урахуванням часу на кордон та трафік",
  "Допомога з багажем",
  "Розрахунок часу під ваш рейс",
  "Виїзд у будь-який час доби"
];

const routeFaqItemsBase: RouteFaqTemplate[] = [
  {
    question: "Скільки коштує трансфер Одеса — Кишинів?"
  },
  {
    question: "Скільки часу займає дорога?",
    answer:
      "У середньому маршрут Одеса — Кишинів займає близько 3–4 годин, залежно від трафіку, погодних умов та часу проходження кордону."
  },
  {
    question: "Чи можна їхати в аеропорт Кишинева?",
    answer:
      "Так, маршрут доступний як до міста, так і безпосередньо до аеропорту Кишинева з розрахунком часу під ваш рейс."
  },
  {
    question: "Чи допомагає водій на кордоні?",
    answer:
      "Водій супроводжує вас на ключових етапах маршруту, допомагає зорієнтуватися та підказує організаційні моменти, щоб поїздка до Кишинева з Одеси проходила спокійно та без зайвого стресу."
  },
  {
    question: "Чи доступна нічна подача?",
    answer:
      "Так, ми організовуємо ранні, вечірні та нічні виїзди залежно від вашого графіка."
  },
  {
    question: "Чи є трансфер Одеса — Кишинів без попутників?",
    answer:
      "Так, всі поїздки виконуються у форматі приватного трансферу без попутників з індивідуальною подачею авто."
  }
];

const passengerOptions = [
  "1 пасажир",
  "2 пасажири",
  "3 пасажири",
  "4 пасажири",
  "5+ пасажирів"
];

const carClassOptions = ["Комфорт", "Бізнес", "Преміум", "Мінівен"];

const carClassTrackingKeyByTitle: Record<string, "comfort" | "business" | "premium" | "minivan"> = {
  "Комфорт": "comfort",
  "Бізнес": "business",
  "Преміум": "premium",
  "Мінівен": "minivan",
  "Бизнес": "business",
  "Премиум": "premium",
  "Минивэн": "minivan"
};

export default function RoutePageSupabaseClient({
  routeData,
  routeReviews = [],
  relatedRoutes = [],
  currentLanguage = "ua",
  languageLinks
}: RoutePageSupabaseClientProps) {
  const isRu = routeData.lang === "ru" || currentLanguage === "ru";
  const homeHref = currentLanguage === "ru" ? "/ru" : "/";
  const directionsHref = currentLanguage === "ru" ? "/ru#directions" : "/#directions";
  const routeHrefPrefix = currentLanguage === "ru" ? "/ru" : "";
  const ui = {
    navHome: isRu ? "ГЛАВНАЯ" : "ГОЛОВНА",
    navDirections: isRu ? "НАПРАВЛЕНИЯ" : "НАПРЯМКИ",
    navFleet: isRu ? "АВТОПАРК" : "АВТОПАРК",
    navContacts: isRu ? "КОНТАКТЫ" : "КОНТАКТИ",
    navAbout: isRu ? "О НАС" : "ПРО НАС",
    navBlog: isRu ? "БЛОГ" : "БЛОГ",
    breadcrumbHome: isRu ? "Главная" : "Головна",
    breadcrumbDirections: isRu ? "Направления" : "Напрямки",
    heroEyebrow: "VIP ТРАНСФЕР",
    heroOrder: isRu ? "ЗАКАЗАТЬ ТРАНСФЕР" : "ЗАМОВИТИ ТРАНСФЕР",
    telegram: isRu ? "НАПИСАТЬ В TELEGRAM" : "НАПИСАТИ В TELEGRAM",
    quickRequest: isRu ? "БЫСТРАЯ ЗАЯВКА" : "ШВИДКА ЗАЯВКА",
    quickCallback: isRu
      ? "Мы свяжемся с вами в течение 5 минут"
      : "Ми зв'яжемося з вами протягом 5 хвилин",
    name: isRu ? "Имя" : "Ім’я",
    yourName: isRu ? "Ваше имя" : "Ваше ім’я",
    phone: isRu ? "Телефон" : "Телефон",
    yourPhone: isRu ? "Ваш телефон" : "Ваш телефон",
    from: isRu ? "Откуда" : "Звідки",
    to: isRu ? "Куда" : "Куди",
    order: isRu ? "ЗАКАЗАТЬ" : "ЗАМОВИТИ",
    pricingEyebrow: isRu ? "СТОИМОСТЬ И ЧТО ВЛИЯЕТ НА ЦЕНУ" : "ВАРТІСТЬ ТА ЩО ВПЛИВАЄ НА ЦІНУ",
    fixedPrice: isRu ? "Фиксированная цена" : "Фіксована ціна",
    duration: isRu ? "Время в пути" : "Час у дорозі",
    fromPrefix: isRu ? "от" : "від",
    basePrice: isRu ? "Базовая стоимость маршрута" : "Базова вартість маршруту",
    factorsTitle: isRu ? "ЧТО ВЛИЯЕТ НА ЦЕНУ" : "ЩО ВПЛИВАЄ НА ЦІНУ",
    availabilityNote: isRu
      ? "Модели авто могут отличаться в зависимости от доступности. Точный класс и авто согласовываются перед поездкой."
      : "Моделі авто можуть відрізнятися залежно від доступності. Точний клас і авто узгоджуються перед поїздкою.",
    orderTransfer: isRu ? "Заказать трансфер" : "Замовити трансфер",
    carClassesEyebrow: isRu ? "КЛАССЫ АВТО" : "КЛАСИ АВТО",
    stepEyebrow: isRu ? "КАК ПРОХОДИТ ПОЕЗДКА" : "ЯК ПРОХОДИТЬ ПОЇЗДКА",
    routeInfoEyebrow: isRu ? "ИНФОРМАЦИЯ О МАРШРУТЕ" : "ІНФОРМАЦІЯ ПРО МАРШРУТ",
    seeAlso: isRu ? "Смотрите также:" : "Дивіться також:",
    airportEyebrow: isRu ? "ТРАНСФЕР В АЭРОПОРТ КИШИНЁВА" : "ТРАНСФЕР В АЕРОПОРТ КИШИНЕВА",
    faqEyebrow: isRu ? "ЧАСТЫЕ ВОПРОСЫ" : "ПОШИРЕНІ ПИТАННЯ",
    bookingEyebrow: isRu ? "ЗАБРОНИРОВАТЬ ТРАНСФЕР" : "ЗАБРОНЮВАТИ ТРАНСФЕР",
    bookingTitle: isRu ? "Забронировать трансфер" : "Забронювати трансфер",
    bookingText: isRu
      ? "Мы свяжемся с вами, уточним маршрут, авто и финальную стоимость поездки."
      : "Ми зв'яжемося з вами, уточнимо маршрут, авто та фінальну вартість поїздки.",
    date: isRu ? "Дата поездки" : "Дата поїздки",
    passengers: isRu ? "Количество пассажиров" : "Кількість пасажирів",
    passengersPlaceholder: isRu ? "Количество пассажиров" : "Кількість пасажирів",
    carClass: isRu ? "Класс авто" : "Клас авто",
    comment: isRu ? "Комментарий" : "Коментар",
    bookTransfer: isRu ? "ЗАБРОНИРОВАТЬ ТРАНСФЕР" : "ЗАБРОНЮВАТИ ТРАНСФЕР",
    seoEyebrowPrefix: isRu ? "ИНФОРМАЦИЯ О ТРАНСФЕРЕ" : "ІНФОРМАЦІЯ ПРО ТРАНСФЕР",
    relatedEyebrow: isRu ? "ПОХОЖИЕ НАПРАВЛЕНИЯ" : "СХОЖІ НАПРЯМКИ",
    relatedTitlePrefix: isRu ? "Похожие маршруты из" : "Схожі маршрути з",
    relatedSubtitlePrefix: isRu
      ? "Другие популярные направления с подачей из"
      : "Інші популярні напрямки з подачею з",
    relatedCta: isRu ? "Подробнее" : "Детальніше",
    footerCompany: isRu ? "Компания" : "Компанія",
    footerContacts: isRu ? "Контакты" : "Контакти",
    footerLanguages: isRu ? "Языки" : "Мови",
    footerDescription: isRu
      ? "Премиальные международные трансферы между Украиной, Молдовой и Польшей для частных, бизнес- и VIP-клиентов."
      : "Преміальні міжнародні трансфери між Україною, Молдовою та Польщею для приватних, бізнес- та VIP-клієнтів.",
    footerHome: isRu ? "Главная" : "Головна",
    footerDirections: isRu ? "Направления" : "Напрямки",
    footerAllDirections: isRu ? "Все направления" : "Усі напрямки",
    footerFleet: isRu ? "Автопарк" : "Автопарк",
    footerContactsLink: isRu ? "Контакты" : "Контакти",
    footerAbout: isRu ? "О нас" : "Про нас",
    footerBlog: isRu ? "Блог" : "Блог",
    footerCopyright: isRu
      ? "© 2026 Grand Transfer. Все права защищены."
      : "© 2026 Grand Transfer. Усі права захищені.",
    openMenu: isRu ? "Открыть меню" : "Відкрити меню",
    closeMenu: isRu ? "Закрыть меню" : "Закрити меню",
    openCarImage: isRu ? "Открыть изображение авто" : "Відкрити зображення авто",
    closeCarImage: isRu ? "Закрыть изображение авто" : "Закрити зображення авто",
    close: isRu ? "Закрыть" : "Закрити",
    carClassModal: isRu ? "КЛАСС АВТО" : "КЛАС АВТО",
    callNow: isRu ? "Позвонить" : "Подзвонити",
    successEyebrow: isRu ? "Заявка отправлена" : "Заявку надіслано",
    successTitle: isRu ? "Спасибо за заявку" : "Дякуємо за заявку",
    successBody: isRu
      ? "Спасибо! Мы скоро свяжемся с вами."
      : "Дякуємо! Ми скоро зв'яжемося з вами.",
    successNote: isRu
      ? "Если вопрос срочный — нажмите «Позвонить сейчас»."
      : "Якщо питання термінове — натисніть “Подзвонити зараз”.",
    successCallButton: isRu ? "Позвонить сейчас" : "Подзвонити зараз",
    chooseDate: isRu ? "Выберите дату" : "Оберіть дату",
    onRequest: isRu ? "по запросу" : "за запитом",
    passengersShort: "пас.",
    luggageShort: isRu ? "багаж" : "багаж"
  };
  const navItems = [
    { label: ui.navHome, href: homeHref },
    { label: ui.navDirections, href: directionsHref },
    { label: ui.navFleet, href: "/avtopark" },
    { label: ui.navContacts, href: "/kontakty" },
    { label: ui.navAbout, href: "/pro-kompaniiu" },
    { label: ui.navBlog, href: "/blog" }
  ];
  const footerLinks = [
    { label: ui.footerHome, href: homeHref },
    { label: ui.footerDirections, href: directionsHref },
    { label: ui.footerAllDirections, href: "/routes" },
    { label: ui.footerFleet, href: "/avtopark" },
    { label: ui.footerContactsLink, href: "/kontakty" },
    { label: ui.footerAbout, href: "/pro-kompaniiu" },
    { label: ui.footerBlog, href: "/blog" }
  ];
  const priceFrom = routeData.price_from ?? 170;
  const priceBusiness = routeData.price_business ?? 220;
  const pricePremium = routeData.price_premium ?? 300;
  const priceMinivan = routeData.price_minivan ?? 260;
  const routeSlug = routeData.slug;
  const fromCity = routeData.from_city || (isRu ? "Город выезда" : "Місто виїзду");
  const toCity = routeData.to_city || (isRu ? "Город прибытия" : "Місто прибуття");
  const routeLabel = `${fromCity} — ${toCity}`;
  const routeH1 = (routeData.h1 || routeLabel).replace(/\s*\([^)]*\)\s*$/, "").trim();
  const routeInfoBackground =
    typeof routeData.route_image_url === "string" &&
    routeData.route_image_url.trim().length > 0
      ? routeData.route_image_url.trim()
      : routeInfoFallbackImage.src;
  const routeDescription = routeData.description || "";
  const routeSubtitle = /приватний\s+vip\s+трансфер/i.test(routeDescription)
    || /частный\s+vip\s+трансфер/i.test(routeDescription)
    ? routeDescription
      : routeDescription
      ? `${isRu ? "Частный VIP трансфер." : "Приватний VIP трансфер."} ${routeDescription}`
      : isRu ? "Частный VIP трансфер." : "Приватний VIP трансфер.";
  const routePriceDisplay = `€${priceFrom}`;
  const routeBusinessPriceDisplay = `€${priceBusiness}`;
  const routePremiumPriceDisplay = `€${pricePremium}`;
  const routeMinivanPriceDisplay = `€${priceMinivan}`;
  const routeDurationDisplay = routeData.duration || (isRu ? "Уточняется" : "Уточнюється");
  const routeSeoParagraphsBase = (routeData.seo_text || "")
    .split(/\n{2,}|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const routeSeoParagraphs = (
    routeSeoParagraphsBase.length > 0 ? routeSeoParagraphsBase : [routeDescription]
  ).filter(Boolean);
  const routeFinalSeoSentence = isRu
    ? `Заказать трансфер ${routeLabel} можно в любое время через сайт или Telegram. Мы подберём авто, согласуем маршрут и обеспечим комфортную поездку без попутчиков с индивидуальной подачей под ваш график.`
    : `Замовити трансфер ${routeLabel} можна у будь-який час через сайт або Telegram. Ми підберемо авто, узгодимо маршрут і забезпечимо комфортну поїздку без попутників з індивідуальною подачею під ваш графік.`;
  if (routeSeoParagraphs.length > 0) {
    routeSeoParagraphs[routeSeoParagraphs.length - 1] =
      `${routeSeoParagraphs[routeSeoParagraphs.length - 1]} ${routeFinalSeoSentence}`.trim();
  } else {
    routeSeoParagraphs.push(routeFinalSeoSentence);
  }
  const benefitItemsLocalized: BenefitItem[] = isRu
    ? [
        {
          title: "Частный водитель",
          description: "Индивидуальный трансфер без попутчиков",
          Icon: PassengerIcon
        },
        {
          title: "Помощь на границе",
          description: "Сопровождение и подсказки на ключевом этапе",
          Icon: ShieldCheckIcon
        },
        {
          title: "Трансфер в аэропорт",
          description: "Доставка в аэропорт Кишинёва и в город",
          Icon: PlaneIcon
        },
        {
          title: "Подача 24/7",
          description: "Авто доступно круглосуточно, без выходных",
          Icon: ClockIcon
        },
        {
          title: "Премиальные авто",
          description: "Комфортные авто бизнес и премиум класса",
          Icon: CarIcon
        }
      ]
    : benefitItems;
  const routeDetailsLocalized: RouteDetail[] = isRu
    ? [
        {
          title: "Откуда забираем",
          description: `Подача авто из отеля, ЖК, вокзала или аэропорта в ${fromCity}.`,
          Icon: MapPinIcon
        },
        {
          title: "Куда доставляем",
          description: `Любой адрес в ${toCity}, центр города или трансфер в аэропорт.`,
          Icon: TargetIcon
        },
        {
          title: "Возможные остановки",
          description: `Кофе, обед, заправка или другие остановки, если маршрут ${routeLabel} требует дополнительного комфорта.`,
          Icon: StopIcon
        },
        {
          title: "Индивидуальный график",
          description: "Выезд в удобное для вас время, даже ночью, с подачей авто под ваш график.",
          Icon: ScheduleIcon
        }
      ]
    : routeDetails;
  const pricingFactorsLocalized = isRu
    ? [
        "Класс авто",
        "Дата и время выезда",
        "Количество пассажиров",
        "Количество багажа",
        "Дополнительные остановки и ожидание"
      ]
    : pricingFactors;
  const carClassCards: CarClassCardData[] = carClassCardTemplates.map((card) => ({
    ...card,
    title:
      isRu && card.title === "Бізнес"
        ? "Бизнес"
        : isRu && card.title === "Преміум"
          ? "Премиум"
          : isRu && card.title === "Мінівен"
            ? "Минивэн"
            : card.title,
    description:
      card.title === "Комфорт"
        ? isRu
          ? "Удобный салон для индивидуальных поездок."
          : "Зручний салон для індивідуальних поїздок."
        : card.title === "Бізнес"
          ? isRu
            ? "Повышенный уровень тишины и пространства."
            : "Підвищений рівень тиші та простору."
          : card.title === "Преміум"
            ? isRu
              ? "Представительский класс и максимальный комфорт."
              : "Представницький клас і максимальний комфорт."
            : isRu
              ? "Для нескольких пассажиров и багажа."
              : "Для кількох пасажирів і багажу.",
    climate: isRu ? "Климат-контроль" : "Клімат-контроль",
    price:
      card.title === "Комфорт"
        ? routePriceDisplay
        : card.title === "Бізнес"
          ? routeBusinessPriceDisplay
          : card.title === "Преміум"
            ? routePremiumPriceDisplay
            : routeMinivanPriceDisplay
  }));
  const tripStepsLocalized: TripStep[] = isRu
    ? [
        {
          number: "01",
          title: "Заявка",
          description: "Вы оставляете заявку на сайте или в мессенджере."
        },
        {
          number: "02",
          title: "Подтверждение",
          description: "Согласовываем маршрут, класс авто и время подачи."
        },
        {
          number: "03",
          title: `Подача в ${fromCity}`,
          description: "Водитель прибывает вовремя по выбранному адресу."
        },
        {
          number: "04",
          title: "Дорога / граница",
          description: "Комфортная поездка, помощь на границе."
        },
        {
          number: "05",
          title: `Прибытие в ${toCity}`,
          description: "Доставка по вашему адресу или в аэропорт."
        }
      ]
    : tripSteps;
  const airportFeaturesLocalized = isRu
    ? [
        "Подача с учётом времени на границу и трафик",
        "Помощь с багажом",
        "Расчёт времени под ваш рейс",
        "Выезд в любое время суток"
      ]
    : airportFeatures;
  const routeFaqItems: RouteFaqItem[] = isRu
    ? [
        {
          question: "Сколько стоит трансфер Одесса — Кишинёв?",
          answer: `Ориентировочная стоимость трансфера Одесса Кишинёв стартует от €${priceFrom}. Финальная цена зависит от класса авто, времени выезда, багажа и индивидуальных пожеланий.`
        },
        {
          question: "Сколько времени занимает дорога?",
          answer: `В среднем маршрут ${routeLabel} занимает около 3–4 часов в зависимости от трафика, погодных условий и времени прохождения границы.`
        },
        {
          question: "Можно ли поехать в аэропорт Кишинёва?",
          answer: "Да, маршрут доступен как до города, так и напрямую до аэропорта Кишинёва с расчётом времени под ваш рейс."
        },
        {
          question: "Помогает ли водитель на границе?",
          answer: `Водитель сопровождает вас на ключевых этапах маршрута, помогает сориентироваться и подсказывает организационные моменты, чтобы поездка в ${toCity} из ${fromCity} проходила спокойно и без лишнего стресса.`
        },
        {
          question: "Доступна ли ночная подача?",
          answer: "Да, мы организовываем ранние, вечерние и ночные выезды в зависимости от вашего графика."
        },
        {
          question: `Есть ли трансфер ${routeLabel} без попутчиков?`,
          answer: "Да, все поездки выполняются в формате частного трансфера без попутчиков с индивидуальной подачей авто."
        }
      ]
    : routeFaqItemsBase.map((item) => {
        if (item.question === "Скільки коштує трансфер Одеса — Кишинів?") {
          return {
            question: item.question,
            answer: `Орієнтовна вартість трансферу Одеса Кишинів стартує від €${priceFrom}. Фінальна ціна залежить від класу авто, часу виїзду, багажу та індивідуальних побажань.`
          };
        }

        return {
          question: item.question,
          answer: item.answer || ""
        };
      });
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCarCard, setSelectedCarCard] = useState<CarClassCardData | null>(null);
  const routeHeroForm = useTransferForm({
    formName: "route_quick_form",
    pageType: "route",
    route: routeSlug,
    language: isRu ? "ru" : "ua",
    initialValues: {
      fromCity,
      toCity
    }
  });
  const routeFinalForm = useTransferForm({
    formName: "route_booking_form",
    pageType: "route",
    route: routeSlug,
    language: isRu ? "ru" : "ua",
    requireDate: true,
    initialValues: {
      carClass: "Комфорт",
      fromCity,
      toCity
    }
  });
  const routeFaqSplitIndex = Math.ceil(routeFaqItems.length / 2);
  const routeFaqColumns = [
    routeFaqItems.slice(0, routeFaqSplitIndex),
    routeFaqItems.slice(routeFaqSplitIndex)
  ];
  const passengerOptionsLocalized = isRu
    ? [
        { value: "1 пасажир", label: "1 пассажир" },
        { value: "2 пасажири", label: "2 пассажира" },
        { value: "3 пасажири", label: "3 пассажира" },
        { value: "4 пасажири", label: "4 пассажира" },
        { value: "5+ пасажирів", label: "5+ пассажиров" }
      ]
    : passengerOptions.map((option) => ({ value: option, label: option }));
  const carClassOptionsLocalized = isRu
    ? [
        { value: "Комфорт", label: "Комфорт" },
        { value: "Бізнес", label: "Бизнес" },
        { value: "Преміум", label: "Премиум" },
        { value: "Мінівен", label: "Минивэн" }
      ]
    : carClassOptions.map((option) => ({ value: option, label: option }));
  const additionalRouteLinks = isRu
    ? [
        { href: "/ru/odessa-yassy", label: "трансфер Одесса — Яссы" },
        { href: "/ru/odessa-bucharest", label: "трансфер Одесса — Бухарест" }
      ]
    : [
        { href: "/odesa-iasi", label: "трансфер Одеса — Ясси" },
        { href: "/odesa-bucharest", label: "трансфер Одеса — Бухарест" }
      ];
  const relatedRouteCards: SimilarRoute[] = relatedRoutes
    .filter((route) => route.slug && route.from_city && route.to_city)
    .map((route) => ({
      title: `${route.from_city} → ${route.to_city}`,
      price:
        route.price_from != null
          ? `${ui.fromPrefix} €${route.price_from}`
          : ui.onRequest,
      duration: route.duration ?? null,
      href: `${routeHrefPrefix}/${route.slug}`,
      isOriginMatch: Boolean(fromCity && route.from_city === fromCity)
    }));
  const sourceCityLabel = getSourceCityLabel(fromCity, currentLanguage);

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
      pageType: "route",
      route: routeSlug,
      carClass: carClassTrackingKeyByTitle[card.title]
    });
  }

  function handleRouteFaqToggle(index: number, question: string) {
    setOpenFaqIndex((current) => {
      if (current === index) {
        return null;
      }

      trackFaqOpen({ question, pageType: "route" });
      return index;
    });
  }

  return (
    <>
      <main className="relative overflow-hidden pb-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(216,185,130,0.16),transparent_42%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[20rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(29,42,31,0.36),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[42rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,185,130,0.08),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-[1536px] px-4 pt-4 sm:px-6 md:px-8 md:pt-5 lg:px-10 xl:px-12 2xl:px-14">
          <header className="header-shell relative z-30 rounded-[24px] px-[18px] py-3 sm:px-5 md:rounded-[30px] md:px-7 lg:px-[34px]">
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_1fr_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_1fr_310px]">
              <Link href={homeHref} className="header-brand block">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="luxury-logo-subtitle">{isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"}</div>
              </Link>

              <nav className="hidden items-center justify-self-center lg:flex lg:gap-3 xl:gap-5">
                {navItems.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-[0.71rem] font-bold uppercase tracking-[0.14em] text-[rgba(247,243,234,0.8)] transition duration-200 hover:text-[var(--soft-gold)] xl:text-[0.76rem]"
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
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  links={{
                    ua: languageLinks?.ua || "/",
                    ru: languageLinks?.ru || "/ru"
                  }}
                />
                <a
                  href="#route-booking-final"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "route",
                      target: "route-booking-final"
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
                  aria-controls="mobile-drawer-route"
                  aria-label={ui.openMenu}
                  onClick={() => setMenuOpen(true)}
                  className="burger-button inline-flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <BurgerIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mt-4 md:mt-6">
            <div className="route-hero-shell hero-shell panel-soft relative overflow-hidden rounded-[32px]">
              <div className="absolute inset-0">
                <Image
                  src={routeHeroDesktop}
                  alt=""
                  priority
                  fill
                  className="hidden object-cover object-[68%_center] md:block"
                  sizes="100vw"
                />
                <Image
                  src={routeHeroMobile}
                  alt=""
                  priority
                  fill
                  className="object-cover object-bottom md:hidden"
                  sizes="100vw"
                />
                <div className="route-hero-overlay-primary absolute inset-0" />
                <div className="route-hero-overlay-secondary absolute inset-0" />
              </div>

              <div className="relative z-10 grid gap-8 px-5 pb-5 pt-8 sm:px-6 sm:pt-10 md:min-h-[640px] md:px-[3.25rem] md:pb-8 md:pt-[3.25rem] lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-12 lg:px-[4rem] lg:pb-[3.5rem] lg:pt-[3.5rem] xl:min-h-[650px] xl:px-[4.4rem]">
                <div className="max-w-[39rem]">
                  <div className="route-breadcrumb text-[0.7rem] uppercase tracking-[0.24em] text-[rgba(216,185,130,0.78)]">
                    <Link href={homeHref} className="transition hover:text-[var(--soft-gold)]">
                      {ui.breadcrumbHome}
                    </Link>
                    <span className="mx-2 text-[rgba(183,178,168,0.6)]">&gt;</span>
                    <Link
                      href={directionsHref}
                      className="transition hover:text-[var(--soft-gold)]"
                    >
                      {ui.breadcrumbDirections}
                    </Link>
                    <span className="mx-2 text-[rgba(183,178,168,0.6)]">&gt;</span>
                    <span className="text-[rgba(247,243,234,0.82)]">{routeLabel}</span>
                  </div>

                  <p className="eyebrow-lux mt-6">VIP ТРАНСФЕР</p>
                  <h1 className="headline-lux mt-5 text-[2.75rem] font-medium leading-[1.01] tracking-[-0.04em] text-[var(--text)] sm:text-[3.25rem] md:text-[4.05rem] lg:text-[4.45rem] xl:text-[4.8rem]">
                    {routeH1}
                  </h1>
                  <p className="mt-6 max-w-[32.5rem] text-[1rem] leading-[1.72] text-[var(--muted)] md:text-[1.04rem]">
                    {routeSubtitle}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <div className="route-stat-card">
                      <span className="route-stat-value">{ui.fromPrefix} {routePriceDisplay}</span>
                      <span className="route-stat-label">{ui.fixedPrice}</span>
                    </div>
                    <div className="route-stat-card">
                      <span className="route-stat-value">{routeDurationDisplay}</span>
                      <span className="route-stat-label">{ui.duration}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:gap-3.5">
                    <a
                      href="#route-booking-final"
                      onClick={() =>
                        trackCtaClick({
                          ctaType: "order",
                          location: "route_hero",
                          pageType: "route",
                          target: "route-booking-final"
                        })
                      }
                      className="button-gold cta-border-shine inline-flex h-14 w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em] sm:w-auto md:text-[0.8rem] lg:tracking-[0.12em]"
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
                          pageType: "route"
                        });
                        trackCtaClick({
                          ctaType: "telegram",
                          location: "hero",
                          pageType: "route"
                        });
                      }}
                      className="button-outline inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full px-6 text-[0.76rem] font-bold uppercase tracking-[0.1em] sm:w-auto md:text-[0.8rem] lg:tracking-[0.12em]"
                    >
                      <TelegramIcon className="h-[15px] w-[15px]" />
                      {ui.telegram}
                    </a>
                  </div>
                </div>

                <div className="panel-form route-quick-card rounded-[22px] p-4 sm:p-5 md:p-6 lg:justify-self-end lg:self-center lg:p-7">
                  <p className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                    {ui.quickRequest}
                  </p>
                  <h2 className="mt-4 text-[1.45rem] font-semibold leading-[1.15] text-[var(--text)]">
                    {ui.quickCallback}
                  </h2>

                  <form
                    noValidate
                    onSubmit={routeHeroForm.handleSubmit}
                    className="mt-6 grid gap-3"
                  >
                    <TextField
                      label={ui.name}
                      name="full_name"
                      value={routeHeroForm.values.fullName}
                      onChange={routeHeroForm.handleTextChange("fullName")}
                      placeholder={ui.yourName}
                      autoComplete="name"
                      error={routeHeroForm.errors.fullName}
                      fieldClassName="h-14 rounded-[16px] px-4 text-[0.95rem]"
                    />
                    <PhoneField
                      label={ui.phone}
                      phoneValue={routeHeroForm.phoneDisplayValue}
                      phonePlaceholder={ui.yourPhone}
                      phoneMaxLength={routeHeroForm.phoneMaxLength}
                      onPhoneChange={routeHeroForm.handlePhoneNumberChange}
                      error={routeHeroForm.errors.phone}
                      inputClassName="h-14 rounded-[16px] px-4 text-[0.95rem]"
                    />
                    <TextField
                      label={ui.from}
                      name="from_city"
                      value={routeHeroForm.values.fromCity}
                      onChange={routeHeroForm.handleTextChange("fromCity")}
                      placeholder={fromCity}
                      error={routeHeroForm.errors.fromCity}
                      fieldClassName="h-14 rounded-[16px] px-4 text-[0.95rem]"
                    />
                    <TextField
                      label={ui.to}
                      name="to_city"
                      value={routeHeroForm.values.toCity}
                      onChange={routeHeroForm.handleTextChange("toCity")}
                      placeholder={toCity}
                      error={routeHeroForm.errors.toCity}
                      fieldClassName="h-14 rounded-[16px] px-4 text-[0.95rem]"
                    />
                    <button
                      type="submit"
                      disabled={routeHeroForm.isSubmitting}
                      onClick={() =>
                        trackCtaClick({
                          ctaType: "order",
                          location: "hero",
                          pageType: "route"
                        })
                      }
                      className="button-gold mt-1 inline-flex h-14 w-full items-center justify-center rounded-[16px] px-8 text-[0.76rem] font-bold uppercase tracking-[0.1em] md:text-[0.8rem] lg:tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {ui.order}
                    </button>
                    {routeHeroForm.submitError ? (
                      <p className="field-error">{routeHeroForm.submitError}</p>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16 xl:mt-20">
            <div className="route-pricing-shell rounded-[28px] px-5 py-7 sm:px-7 md:px-9 lg:px-10 lg:py-9">
              <div className="grid gap-7 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:items-stretch lg:gap-8 xl:gap-10">
                <div className="flex flex-col lg:min-h-full">
                  <p className="eyebrow-lux">{ui.pricingEyebrow}</p>

                  <div className="mt-3.5 flex flex-col gap-5 lg:mt-4 lg:min-h-0 lg:flex-1 lg:justify-between">
                    <div className="route-pricing-content grid w-full gap-5 xl:my-auto xl:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] xl:items-center xl:gap-6">
                      <div>
                        <div className="route-price-highlight">
                          <div className="route-price-prefix">{ui.fromPrefix}</div>
                          <div className="route-price-value">{routePriceDisplay}</div>
                          <div className="route-price-caption">
                            {ui.basePrice}
                          </div>
                        </div>
                      </div>

                      <div className="xl:self-center">
                        <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                          {ui.factorsTitle}
                        </h2>
                        <div className="mt-4 space-y-4">
                          {pricingFactorsLocalized.map((factor) => (
                            <div key={factor} className="route-factor-item">
                              <span className="route-factor-dot" aria-hidden="true" />
                              <span className="text-[0.96rem] leading-[1.48] text-[rgba(247,243,234,0.78)]">
                                {factor}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 max-w-[32rem] text-[0.76rem] leading-[1.6] text-[rgba(183,178,168,0.76)]">
                          {ui.availabilityNote}
                        </p>
                      </div>
                    </div>

                    <div className="xl:grid xl:grid-cols-[minmax(0,12.75rem)_minmax(0,1fr)] xl:items-end">
                      <a
                        href="#route-booking-final"
                        onClick={() =>
                          trackCtaClick({
                            ctaType: "order",
                            location: "pricing",
                            pageType: "route",
                            target: "route-booking-final"
                          })
                        }
                        className="button-gold inline-flex h-[50px] w-full max-w-full items-center justify-center self-start rounded-[10px] px-7 text-[0.74rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap sm:w-auto md:px-8 md:text-[0.78rem] lg:tracking-[0.12em]"
                      >
                        {ui.orderTransfer}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:pl-1">
                  <p className="eyebrow-lux">{ui.carClassesEyebrow}</p>
                  <div className="mt-4 grid grid-cols-1 gap-2.5 min-[460px]:grid-cols-2 lg:grid-cols-4">
                    {carClassCards.map((card) => (
                      <article key={card.title} className="route-inline-class-card">
                        <div className="route-inline-class-top">
                          <span className="route-inline-class-icon">
                            {card.title === "Комфорт" ? (
                              <ShieldClassIcon className="h-[20px] w-[20px]" />
                            ) : card.title === "Бізнес" || card.title === "Бизнес" ? (
                              <BriefcaseClassIcon className="h-[20px] w-[20px]" />
                            ) : card.title === "Преміум" || card.title === "Премиум" ? (
                              <StarClassIcon className="h-[20px] w-[20px]" />
                            ) : (
                              <GroupClassIcon className="h-[20px] w-[20px]" />
                            )}
                          </span>
                          <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[var(--text)]">
                            {card.title}
                          </h3>
                          <p className="route-inline-class-copy">{card.description}</p>
                          <div className="route-inline-class-models mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[0.68rem] leading-[1.35] text-[rgba(247,243,234,0.74)]">
                            {card.models.map((model) => (
                              <span key={model}>{model}</span>
                            ))}
                          </div>
                        </div>

                        <div className="route-inline-class-image-zone">
                          <button
                            type="button"
                            onClick={() => handleCarImageOpen(card)}
                            className="route-inline-class-image"
                            aria-label={`${ui.openCarImage} ${card.title}`}
                          >
                            <Image
                              src={card.image}
                              alt={card.title}
                              className="route-inline-class-image-el"
                              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 18vw"
                            />
                          </button>
                        </div>

                        <div className="route-inline-class-specs">
                          <span className="route-inline-class-chip">
                            <PassengerIcon className="h-[17px] w-[17px]" />
                            <span>{card.seats} {ui.passengersShort}</span>
                          </span>
                          <span className="route-inline-class-chip">
                            <LuggageMiniIcon className="h-[17px] w-[17px]" />
                            <span>{card.luggage} {ui.luggageShort}</span>
                          </span>
                          <span className="route-inline-class-chip route-inline-class-chip--wide">
                            <ClimateMiniIcon className="h-[17px] w-[17px]" />
                            <span>{card.climate}</span>
                          </span>
                        </div>

                        <div className="route-inline-class-price">
                          <span className="route-inline-class-price-prefix">{ui.fromPrefix}</span>
                          <span className="route-inline-class-price-value">{card.price}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[32rem]">
              <p className="eyebrow-lux">{ui.stepEyebrow}</p>
            </div>

            <div className="route-steps-shell mt-8 rounded-[28px] px-5 py-8 sm:px-7 md:px-9 lg:px-10 lg:py-10">
              <div className="route-steps-grid">
                {tripStepsLocalized.map(({ number, title, description }) => (
                  <article key={number} className="route-step-card">
                    <span className="route-step-dot" aria-hidden="true" />
                    <div className="route-step-number">{number}</div>
                    <h2 className="mt-4 text-[0.86rem] font-semibold uppercase leading-[1.5] tracking-[0.18em] text-[rgba(247,243,234,0.9)]">
                      {title}
                    </h2>
                    <p className="mt-3 text-[0.9rem] leading-[1.72] text-[var(--muted)]">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div
              className="route-info-shell relative overflow-hidden rounded-[30px] px-5 py-8 sm:px-7 md:px-8 lg:min-h-[450px] lg:px-12 lg:py-12"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${routeInfoBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            >

              <div className="route-info-content relative z-10 max-w-[29rem] lg:max-w-[30rem]">
                <p className="eyebrow-lux">{ui.routeInfoEyebrow}</p>
                <p className="mt-4 max-w-[28rem] text-[0.92rem] leading-[1.72] text-[var(--muted)]">
                  {isRu
                    ? `Маршрут ${routeLabel} подходит для частных клиентов, бизнес-поездок и трансферов в аэропорт Кишинёва. При необходимости доступен индивидуальный водитель ${fromCity} ${toCity} с подачей авто под ваш график.`
                    : `Маршрут ${routeLabel} підходить для приватних клієнтів, бізнес-поїздок та трансферів в аеропорт Кишинева. За потреби доступний індивідуальний водій ${fromCity} ${toCity} з подачею авто під ваш графік.`}
                </p>
                <div className="mt-6 space-y-5">
                  {routeDetailsLocalized.map(({ title, description, Icon }) => (
                    <div key={title} className="route-info-item">
                      <div className="route-info-item-icon">
                        <Icon className="h-[18px] w-[18px] text-[var(--champagne)]" />
                      </div>
                      <div>
                        <h3 className="text-[0.98rem] font-semibold leading-[1.3] text-[var(--text)]">
                          {title}
                        </h3>
                        <p className="mt-2 text-[0.9rem] leading-[1.72] text-[var(--muted)]">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 max-w-[29rem] text-[0.9rem] leading-[1.72] text-[var(--muted)]">
                  {isRu
                    ? `Маршрут ${routeLabel} проходит через пограничные пункты с учётом трафика и времени прохождения границы. Водитель подбирает оптимальный путь для быстрой и комфортной поездки.`
                    : `Маршрут ${routeLabel} проходить через прикордонні пункти з урахуванням трафіку та часу проходження кордону. Водій підбирає оптимальний шлях для швидкої та комфортної поїздки.`}
                </p>
                <p className="mt-4 text-[0.84rem] leading-[1.7] text-[rgba(183,178,168,0.84)]">
                  {ui.seeAlso}{" "}
                  <Link
                    href={additionalRouteLinks[0].href}
                    className="text-[var(--soft-gold)] transition hover:text-[var(--champagne)]"
                  >
                    {additionalRouteLinks[0].label}
                  </Link>
                  {isRu ? " и " : " та "}
                  <Link
                    href={additionalRouteLinks[1].href}
                    className="text-[var(--soft-gold)] transition hover:text-[var(--champagne)]"
                  >
                    {additionalRouteLinks[1].label}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="route-benefits-strip rounded-[24px] px-4 py-3.5 sm:px-5 md:px-6 md:py-4 lg:px-7 lg:py-[1.125rem]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
                {benefitItemsLocalized.map(({ title, description, Icon }) => (
                  <article key={title} className="route-benefit-item">
                    <div className="route-benefit-icon">
                      <Icon className="h-[18px] w-[18px] text-[var(--champagne)]" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-[0.94rem] font-semibold leading-[1.3] text-[var(--text)]">
                        {title}
                      </h3>
                      <p className="mt-2 text-[0.84rem] leading-[1.6] text-[var(--muted)]">
                        {description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="route-airport-shell route-airport-panel relative min-h-[300px] overflow-hidden rounded-[28px] px-5 py-8 sm:px-7 md:px-9 lg:px-11 lg:py-10">
              <Image
                src={airportImage}
                alt={isRu ? "Трансфер в аэропорт Кишинёва" : "Трансфер в аеропорт Кишинева"}
                fill
                className="object-cover object-[72%_center] md:object-[70%_center] lg:object-right"
                sizes="100vw"
              />
              <div className="route-airport-overlay absolute inset-0" />

              <div className="relative z-10 max-w-[28.75rem]">
                <p className="eyebrow-lux">{ui.airportEyebrow}</p>
                <div className="mt-6 space-y-3.5">
                  {airportFeaturesLocalized.map((feature) => (
                    <div key={feature} className="route-factor-item">
                      <span className="route-factor-dot" aria-hidden="true" />
                      <span className="text-[0.98rem] leading-[1.7] text-[var(--muted)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <ReviewsSection
              location="route_page"
              className="mb-12 md:mb-16"
              routeLabel={routeLabel}
              routeSlug={routeSlug}
              reviews={routeReviews}
              language={currentLanguage}
            />

            <div className="max-w-[32rem]">
              <p className="eyebrow-lux">{ui.faqEyebrow}</p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {routeFaqColumns.map((column, columnIndex) => (
                <div key={`route-faq-column-${columnIndex}`} className="space-y-3">
                  {column.map(({ question, answer }, itemIndex) => {
                    const index = routeFaqItems.findIndex(
                      (item) => item.question === question
                    );
                    const isOpen = openFaqIndex === index;

                    return (
                      <article
                        key={question}
                        className={`faq-item ${isOpen ? "is-open" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleRouteFaqToggle(index, question)}
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
          </section>

          <section
            id="route-booking-final"
            className="relative z-10 mt-12 scroll-mt-28 md:mt-16 md:scroll-mt-32 xl:mt-20"
          >
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
                  onSubmit={routeFinalForm.handleSubmit}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <TextField
                    label={ui.name}
                    name="full_name"
                    value={routeFinalForm.values.fullName}
                    onChange={routeFinalForm.handleTextChange("fullName")}
                    placeholder={ui.yourName}
                    autoComplete="name"
                    error={routeFinalForm.errors.fullName}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <PhoneField
                    label={ui.phone}
                    phoneValue={routeFinalForm.phoneDisplayValue}
                    phonePlaceholder={ui.yourPhone}
                    phoneMaxLength={routeFinalForm.phoneMaxLength}
                    onPhoneChange={routeFinalForm.handlePhoneNumberChange}
                    error={routeFinalForm.errors.phone}
                    inputClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label={ui.from}
                    name="from_city"
                    value={routeFinalForm.values.fromCity}
                    onChange={routeFinalForm.handleTextChange("fromCity")}
                    placeholder={fromCity}
                    error={routeFinalForm.errors.fromCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label={ui.to}
                    name="to_city"
                    value={routeFinalForm.values.toCity}
                    onChange={routeFinalForm.handleTextChange("toCity")}
                    placeholder={toCity}
                    error={routeFinalForm.errors.toCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <DateField
                    label={ui.date}
                    name="travel_date"
                    value={routeFinalForm.values.travelDate}
                    onChange={routeFinalForm.handleTextChange("travelDate")}
                    min={routeFinalForm.today}
                    error={routeFinalForm.errors.travelDate}
                    placeholderText={ui.chooseDate}
                    locale={isRu ? "ru-RU" : "uk-UA"}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <SelectField
                    label={ui.passengers}
                    name="passengers"
                    value={routeFinalForm.values.passengers}
                    onChange={routeFinalForm.handleTextChange("passengers")}
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    <option value="">{ui.passengersPlaceholder}</option>
                    {passengerOptionsLocalized.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    label={ui.carClass}
                    name="car_class"
                    value={routeFinalForm.values.carClass}
                    onChange={routeFinalForm.handleTextChange("carClass")}
                    wrapperClassName="md:col-span-2"
                    fieldClassName="h-14 rounded-[15px] px-4 pr-10 text-[0.95rem]"
                  >
                    {carClassOptionsLocalized.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                  <TextAreaField
                    label={ui.comment}
                    name="comment"
                    value={routeFinalForm.values.comment}
                    onChange={routeFinalForm.handleTextChange("comment")}
                    placeholder={ui.comment}
                    wrapperClassName="md:col-span-2"
                    fieldClassName="min-h-[148px] rounded-[16px] px-4 py-4 text-[0.95rem]"
                  />
                                    {routeFinalForm.submitError ? (
                    <p className="field-error md:col-span-2">{routeFinalForm.submitError}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={routeFinalForm.isSubmitting}
                    onClick={() =>
                      trackCtaClick({
                        ctaType: "order",
                        location: "final_form",
                        pageType: "route"
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

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8 lg:px-12">
              <p className="eyebrow-lux">{`${ui.seoEyebrowPrefix} ${routeLabel.toUpperCase()}`}</p>
              <div className="mt-5 max-w-[58rem] space-y-4 text-[0.96rem] leading-[1.85] text-[var(--muted)]">
                {routeSeoParagraphs.map((paragraph, index) => (
                  <p key={`${routeSlug}-seo-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          {relatedRouteCards.length > 0 ? (
            <section className="relative z-10 mt-12 md:mt-16">
              <div className="max-w-[34rem]">
                <p className="eyebrow-lux">{ui.relatedEyebrow}</p>
                <h2 className="section-title-lux mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.35rem]">
                  {`${ui.relatedTitlePrefix} ${sourceCityLabel}`}
                </h2>
                <p className="mt-4 text-[0.96rem] leading-[1.8] text-[var(--muted)]">
                  {`${ui.relatedSubtitlePrefix} ${sourceCityLabel}`}
                </p>
              </div>

              <div className="similar-routes-shell mt-8 rounded-[24px] p-4 sm:p-5 md:p-6">
                <div className="similar-routes-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {relatedRouteCards.map(({ title, price, duration, href, isOriginMatch }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() =>
                        trackRouteClick({
                          route: formatRouteId(title),
                          sourceBlock: "similar_routes",
                          pageType: "route"
                        })
                      }
                      className={`similar-route-card ${isOriginMatch ? "is-origin-match" : ""}`}
                    >
                      <div className="similar-route-card-top">
                        <h2 className="similar-route-card-title">{title}</h2>
                        <span className="similar-route-price">{price}</span>
                      </div>

                      {duration ? (
                        <div className="similar-route-card-meta">
                          <span className="similar-route-duration">{duration}</span>
                        </div>
                      ) : null}

                      <div className="similar-route-card-bottom">
                        <span className="similar-route-accent" />
                        <div className="similar-route-cta-wrap">
                          <span className="similar-route-cta">{ui.relatedCta}</span>
                          <span className="similar-route-arrow" aria-hidden="true">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

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
                  <div className="footer-logo-subtitle">{isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"}</div>
                </div>
                <p className="mt-6 text-[0.95rem] leading-[1.8] text-[var(--muted)]">
                  {ui.footerDescription}
                </p>
              </div>

              <div>
                <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  {ui.footerCompany}
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
                  {ui.footerContacts}
                </h3>
                <FooterContactLinks pageType="route" />
              </div>

              <div>
                <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  {ui.footerLanguages}
                </h3>
                <LanguageSwitcher
                  className="mt-5"
                  currentLanguage={currentLanguage}
                  links={{
                    ua: languageLinks?.ua || "/",
                    ru: languageLinks?.ru || "/ru"
                  }}
                />
              </div>
            </div>

            <div className="mt-10 border-t border-[rgba(216,185,130,0.08)] pt-5 text-[0.83rem] text-[rgba(183,178,168,0.78)]">
              {ui.footerCopyright}
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
          aria-label={ui.closeMenu}
          onClick={() => setMenuOpen(false)}
          className={`mobile-drawer-overlay ${menuOpen ? "is-open" : ""}`}
        />

        <aside
          id="mobile-drawer-route"
          className={`drawer-shell mobile-drawer fixed right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col rounded-l-[32px] px-6 pb-8 pt-6 ${
            menuOpen ? "is-open" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <Link href={homeHref} className="header-brand" onClick={() => setMenuOpen(false)}>
              <div className="luxury-logo-title text-[1rem] leading-none">
                GRAND TRANSFER
              </div>
              <div className="luxury-logo-subtitle mt-2">{isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"}</div>
            </Link>
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
            links={{
              ua: languageLinks?.ua || "/",
              ru: languageLinks?.ru || "/ru"
            }}
          />

          <div className="mt-auto space-y-5 pt-10">
            <HeaderPhoneLink
              pageType="route"
              phoneHref={phoneHref}
              phoneLabel={phoneNumber}
              compactLabel={ui.callNow}
              className="inline-flex"
            />
            <a
              href="#route-booking-final"
              onClick={() => setMenuOpen(false)}
              onClickCapture={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "route",
                  target: "route-booking-final"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              {ui.order}
            </a>
          </div>
        </aside>
      </div>

      {selectedCarCard ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5 lg:p-8">
          <button
            type="button"
            aria-label={ui.closeCarImage}
            onClick={() => setSelectedCarCard(null)}
            className="absolute inset-0 bg-[rgba(0,0,0,0.76)] backdrop-blur-[8px]"
          />

          <div className="relative z-10 w-full max-w-[1280px] rounded-[24px] border border-[rgba(216,185,130,0.14)] bg-[linear-gradient(180deg,rgba(12,16,13,0.92),rgba(8,11,9,0.9))] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.45)] sm:p-5 lg:p-6">
            <button
              type="button"
              aria-label={ui.close}
              onClick={() => setSelectedCarCard(null)}
              className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,185,130,0.14)] bg-[rgba(10,13,11,0.7)] text-[var(--soft-gold)] transition hover:border-[rgba(216,185,130,0.28)]"
            >
              <CloseIcon className="h-[16px] w-[16px]" />
            </button>

            <div className="mb-4 pr-10">
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-[rgba(216,185,130,0.8)]">
                {ui.carClassModal}
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

      <SuccessPopup
        open={routeHeroForm.isSuccessOpen}
        onClose={routeHeroForm.closeSuccessModal}
        pageType="route"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
        eyebrowText={ui.successEyebrow}
        titleText={ui.successTitle}
        bodyText={ui.successBody}
        noteText={ui.successNote}
        callButtonText={ui.successCallButton}
        closeButtonText={ui.close}
        closeOverlayLabel={ui.close}
        closeButtonLabel={ui.close}
      />
      <SuccessPopup
        open={routeFinalForm.isSuccessOpen}
        onClose={routeFinalForm.closeSuccessModal}
        pageType="route"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
        eyebrowText={ui.successEyebrow}
        titleText={ui.successTitle}
        bodyText={ui.successBody}
        noteText={ui.successNote}
        callButtonText={ui.successCallButton}
        closeButtonText={ui.close}
        closeOverlayLabel={ui.close}
        closeButtonLabel={ui.close}
      />
      <FloatingContactWidget
        pageType="route"
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

function getSourceCityLabel(city: string, language: RouteLanguage = "ua") {
  const cityLabelsUa: Record<string, string> = {
    "Одеса": "Одеси",
    "Київ": "Києва",
    "Дніпро": "Дніпра",
    "Харків": "Харкова",
    "Львів": "Львова",
    "Кишинів": "Кишинева"
  };
  const cityLabelsRu: Record<string, string> = {
    "Одесса": "Одессы",
    "Киев": "Киева",
    "Днепр": "Днепра",
    "Харьков": "Харькова",
    "Львов": "Львова",
    "Кишинев": "Кишинева",
    "Кишинёв": "Кишинёва",
    "Варшава": "Варшавы",
    "Краков": "Кракова",
    "Яссы": "Ясс",
    "Будапешт": "Будапешта"
  };

  return (language === "ru" ? cityLabelsRu : cityLabelsUa)[city] || city;
}

function PassengerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M6 18.4c1.35-2.9 3.45-4.35 6-4.35 2.57 0 4.67 1.45 6 4.35"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LuggageMiniIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 7V5.7A1.7 1.7 0 0 1 9.7 4h4.6A1.7 1.7 0 0 1 16 5.7V7M6 8h12a1 1 0 0 1 1 1v8.2A1.8 1.8 0 0 1 17.2 19H6.8A1.8 1.8 0 0 1 5 17.2V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClimateMiniIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.2v15.6M8.4 6.4l7.2 11.2M15.6 6.4 8.4 17.6M5.2 12h13.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ShieldClassIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.8 18 6.3v4.4c0 3.4-2.34 6.5-6 7.3-3.66-.8-6-3.9-6-7.3V6.3l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseClassIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7m-11 3h14m-13 8h12a1.5 1.5 0 0 0 1.5-1.5V8.5A1.5 1.5 0 0 0 18 7H6A1.5 1.5 0 0 0 4.5 8.5v8A1.5 1.5 0 0 0 6 18Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarClassIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m12 4 2.2 4.45 4.9.72-3.55 3.45.84 4.88L12 15.18 7.6 17.5l.84-4.88L4.9 9.17l4.9-.72L12 4Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GroupClassIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4.8 17c.75-1.85 2.12-2.9 4.2-2.9S12.45 15.15 13.2 17m1.8 0c.58-1.4 1.62-2.28 3.2-2.52"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className = "h-4 w-4" }: IconProps) {
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

function PlaneIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m10.1 13.8-4.8 4.1.95 1.2 6.1-2.7 4.45 2.7 1.08-1.08-3-4.8 3.86-4.02c.88-.92.4-2.46-.88-2.69l-1.38-.24-3.5 3.3-3.35-1.85-.95.9 2.35 2.85Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function MapPinIcon({ className = "h-4 w-4" }: IconProps) {
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

function TargetIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StopIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.4 18.2h9.2a1.6 1.6 0 0 0 1.6-1.6V9.8a1.6 1.6 0 0 0-.47-1.13l-3.4-3.4A1.6 1.6 0 0 0 13.2 4.8H7.4a1.6 1.6 0 0 0-1.6 1.6v10.2a1.6 1.6 0 0 0 1.6 1.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6M9 15h4.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScheduleIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.6 7.2V4.8m10.8 2.4V4.8M5.4 8.2h13.2a1.4 1.4 0 0 1 1.4 1.4v8a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 17.6v-8a1.4 1.4 0 0 1 1.4-1.4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 13.2h3.2l2.2-2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
