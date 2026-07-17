"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faViber } from "@fortawesome/free-brands-svg-icons";
import type { ChangeEvent, ComponentType, FormEvent } from "react";
import { useEffect, useState } from "react";
import contactsHeroImage from "../../img/contacts.png";
import contactsMapImage from "../../img/maps-contacts.png";
import {
  PhoneField,
  TextAreaField,
  TextField
} from "../../components/lux-form-fields";
import {
  FloatingContactWidget,
  HeaderPhoneLink,
  LanguageSwitcher,
  SiteFooter,
  SuccessPopup
} from "../../components/site-ui";
import { JsonLd } from "../../components/json-ld";
import { buildFaqSchema } from "../../lib/structured-data";
import {
  EMAIL_HREF,
  EMAIL_ADDRESS,
  PHONE_DISPLAY,
  PHONE_HREF,
  TELEGRAM_URL,
  VIBER_URL,
  WHATSAPP_URL,
} from "../../lib/contact-links";
import {
  trackCtaClick,
  trackFaqOpen,
  trackFormError,
  trackFormSubmit,
  trackFormSuccessPopupShow,
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

type ContactFeature = {
  title: string;
  subtitle: string;
  Icon: ComponentType<IconProps>;
};

type ContactMethod = {
  title: string;
  value: string;
  actionLabel: string;
  href: string;
  Icon: ComponentType<IconProps>;
  kind:
    | "phone"
    | "telegram"
    | "whatsapp"
    | "viber"
    | "email";
};

type ContactFaqItem = {
  question: string;
  answer: string;
};

type ContactFormValues = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};

type ContactFormErrors = Partial<
  Record<"fullName" | "phone" | "email" | "message", string>
>;

const navItems: NavItem[] = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТИ", href: "/kontakty", isActive: true },
  { label: "ПРО НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

const mobileNavItems: NavItem[] = navItems;

const phoneNumber = PHONE_DISPLAY;
const phoneHref = PHONE_HREF;
const formPhoneMaxLength = 15;

const contactFeatures: ContactFeature[] = [
  {
    title: "Працюємо 24/7",
    subtitle: "Без вихідних",
    Icon: ClockIcon
  },
  {
    title: "Швидка відповідь",
    subtitle: "Протягом 5 хвилин",
    Icon: FlashIcon
  }
];

const contactMethods: ContactMethod[] = [
  {
    title: "Телефон",
    value: phoneNumber,
    actionLabel: "Подзвонити",
    href: `tel:${phoneHref}`,
    Icon: PhoneIcon,
    kind: "phone"
  },
  {
    title: "Telegram",
    value: "@grand_transfer_com",
    actionLabel: "Написати",
    href: TELEGRAM_URL,
    Icon: TelegramIcon,
    kind: "telegram"
  },
  {
    title: "Viber",
    value: phoneNumber,
    actionLabel: "Відкрити",
    href: VIBER_URL,
    Icon: ViberIcon,
    kind: "viber"
  },
  {
    title: "WhatsApp",
    value: phoneNumber,
    actionLabel: "Написати",
    href: WHATSAPP_URL,
    Icon: WhatsAppIcon,
    kind: "whatsapp"
  },
  {
    title: "Email",
    value: EMAIL_ADDRESS,
    actionLabel: "Написати",
    href: EMAIL_HREF,
    Icon: MailIcon,
    kind: "email"
  }
];

const contactFaqItems: ContactFaqItem[] = [
  {
    question: "Як швидко ви відповідаєте?",
    answer:
      "Ми зазвичай відповідаємо протягом 5 хвилин у робочих месенджерах або телефоном."
  },
  {
    question: "Чи є дитячі крісла?",
    answer: "Так, дитячі крісла доступні за попереднім запитом."
  },
  {
    question: "Як можна оплатити трансфер?",
    answer:
      "Оплата узгоджується індивідуально: готівкою або іншим зручним способом після підтвердження маршруту."
  },
  {
    question: "Чи зустрічаєте ви в аеропорту / на вокзалі?",
    answer:
      "Так, водій може зустріти вас з табличкою, допомогти з багажем і провести до авто."
  },
  {
    question: "Чи можна замовити авто заздалегідь?",
    answer:
      "Так, ми рекомендуємо бронювати трансфер заздалегідь, особливо для міжнародних маршрутів."
  },
  {
    question: "Чи працюєте ви вночі?",
    answer: "Так, подача авто доступна 24/7 за попереднім погодженням."
  }
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

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, formPhoneMaxLength);
}

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function KontaktyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [values, setValues] = useState<ContactFormValues>({
    fullName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const faqColumns = [contactFaqItems.slice(0, 3), contactFaqItems.slice(3)];

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

  function handleFieldChange(field: keyof ContactFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value
      }));

      setErrors((current) => {
        if (!current[field as keyof ContactFormErrors]) {
          return current;
        }

        const nextErrors = { ...current };
        delete nextErrors[field as keyof ContactFormErrors];
        return nextErrors;
      });
    };
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = normalizePhoneNumber(event.target.value);

    setValues((current) => ({
      ...current,
      phone: nextValue
    }));

    setErrors((current) => {
      if (!current.phone) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.phone;
      return nextErrors;
    });
  }

  function handleFaqToggle(index: number, question: string) {
    setOpenFaqIndex((current) => {
      if (current === index) {
        return null;
      }

      trackFaqOpen({ question, pageType: "contacts" });
      return index;
    });
  }

  function handleMethodClick(method: ContactMethod) {
    if (method.kind === "phone") {
      trackPhoneClick({
        phone: phoneHref,
        location: "contacts_page",
        pageType: "contacts"
      });
      return;
    }

    if (method.kind === "telegram") {
      trackMessengerClick({
        messenger: "telegram",
        location: "contacts_page",
        pageType: "contacts"
      });
      return;
    }

    if (method.kind === "whatsapp") {
      trackMessengerClick({
        messenger: "whatsapp",
        location: "contacts_page",
        pageType: "contacts"
      });
      return;
    }

    if (method.kind === "viber") {
      trackMessengerClick({
        messenger: "viber",
        location: "contacts_page",
        pageType: "contacts"
      });
    }
  }

  function validateForm() {
    const nextErrors: ContactFormErrors = {};
    const normalizedPhone = normalizePhoneNumber(values.phone);

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Ім’я обов’язкове";
    }

    if (normalizedPhone.length < 8 || normalizedPhone.length > 15) {
      nextErrors.phone = "Введіть коректний номер телефону";
    }

    if (values.email.trim() && !validateEmail(values.email.trim())) {
      nextErrors.email = "Введіть коректний email";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Вкажіть повідомлення";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const errorFields: string[] = [];

      if (nextErrors.fullName) errorFields.push("name");
      if (nextErrors.phone) errorFields.push("phone");
      if (nextErrors.email) errorFields.push("email");
      if (nextErrors.message) errorFields.push("message");

      trackFormError({
        formName: "contacts_form",
        pageType: "contacts",
        route: null,
        fromCity: "",
        toCity: "",
        phoneEntered: normalizedPhone.length > 0,
        errorFields
      });

      return false;
    }

    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const normalizedPhone = normalizePhoneNumber(values.phone);

    trackFormSubmit({
      formName: "contacts_form",
      pageType: "contacts",
      route: null,
      fromCity: "",
      toCity: "",
      phoneFull: normalizedPhone,
      phoneEntered: true,
      selectedDate: null,
      daysUntilTrip: null
    });
    trackFormSuccessPopupShow({
      formName: "contacts_form",
      pageType: "contacts",
      route: null
    });

    setIsSuccessOpen(true);
    setValues({
      fullName: "",
      phone: "",
      email: "",
      message: ""
    });
    setErrors({});
  }

  return (
    <>
      <JsonLd data={buildFaqSchema(contactFaqItems)} />
      <main className="relative overflow-hidden pb-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(216,185,130,0.16),transparent_42%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[18rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(29,42,31,0.36),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[42rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,185,130,0.08),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-[1536px] px-4 pt-4 sm:px-6 md:px-8 md:pt-5 lg:px-10 xl:px-12 2xl:px-14">
          <header className="header-shell relative z-30 rounded-[24px] px-[18px] py-3 sm:px-5 md:rounded-[30px] md:px-7 lg:px-[34px]">
            <div className="flex min-h-[72px] items-center justify-between gap-3 md:min-h-[74px] lg:grid lg:min-h-[88px] lg:grid-cols-[190px_minmax(0,1fr)_300px] lg:justify-normal lg:gap-4 xl:grid-cols-[202px_minmax(0,1fr)_470px]">
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
                  pageType="contacts"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  iconOnly
                  className="hidden lg:inline-flex"
                />
                <LanguageSwitcher />
                <a
                  href="#contacts-form"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "contacts"
                    })
                  }
                  className="button-gold inline-flex h-11 items-center justify-center rounded-full px-6 text-[0.75rem] font-bold uppercase tracking-[0.09em] xl:h-12 xl:px-7 xl:text-[0.78rem] xl:tracking-[0.11em]"
                >
                  ЗАМОВИТИ
                </a>
              </div>

              <div className="flex items-center justify-end lg:hidden">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-drawer-kontakty"
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
            <div className="hero-shell contacts-hero-shell relative overflow-hidden rounded-[32px]">
              <div className="absolute inset-0">
                <Image
                  src={contactsHeroImage}
                  alt="Автомобіль Grand Transfer для міжнародного VIP трансферу"
                  fill
                  priority
                  className="object-cover object-[72%_center] md:object-contain md:object-right-bottom"
                  sizes="100vw"
                />
                <div className="contacts-hero-overlay absolute inset-0" />
              </div>

              <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-6 md:min-h-[560px] md:grid-cols-[minmax(0,1fr)_430px] md:px-10 md:py-12 lg:px-12 lg:py-14">
                <div className="max-w-[39rem] self-center">
                  <p className="eyebrow-lux">КОНТАКТИ</p>
                  <h1 className="section-title-lux mt-5 max-w-[36rem] text-[clamp(2.5rem,5vw,4.6rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--champagne)]">
                    Завжди на зв’язку
                    <br />
                    для вашого комфорту
                  </h1>
                  <p className="mt-6 max-w-[33rem] text-[1rem] leading-[1.82] text-[var(--muted)] md:text-[1.08rem]">
                    Ми доступні 24/7, щоб відповісти на ваші запитання,
                    проконсультувати та організувати вашу поїздку.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {contactFeatures.map(({ title, subtitle, Icon }) => (
                      <div key={title} className="contacts-hero-badge">
                        <span className="contacts-icon-orb">
                          <Icon className="h-[24px] w-[24px]" />
                        </span>
                        <div>
                          <p className="text-[0.98rem] font-semibold text-[var(--text)]">
                            {title}
                          </p>
                          <p className="mt-1 text-[0.82rem] uppercase tracking-[0.18em] text-[rgba(216,185,130,0.76)]">
                            {subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block" aria-hidden="true" />
              </div>
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[44rem]">
              <p className="eyebrow-lux">ЗВ’ЯЖІТЬСЯ З НАМИ ЗРУЧНИМ СПОСОБОМ</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 2xl:grid-cols-6">
              {contactMethods.map(({ title, value, actionLabel, href, Icon, kind }) => (
                <article key={title} className="contacts-method-card">
                  <span className="contacts-method-icon">
                    <Icon className="h-[30px] w-[30px]" />
                  </span>
                  <p className="mt-5 text-[1.08rem] font-semibold tracking-[-0.02em] text-[var(--text)]">
                    {title}
                  </p>
                  <p className="mt-2 min-h-[3.1rem] text-[0.92rem] leading-[1.65] text-[var(--muted)]">
                    {value}
                  </p>
                  <a
                    href={href}
                    onClick={() =>
                      handleMethodClick({ title, value, actionLabel, href, Icon, kind })
                    }
                    target={
                      kind === "telegram" ||
                      kind === "whatsapp"
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      kind === "telegram" ||
                      kind === "whatsapp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="contacts-method-button mt-5"
                  >
                    {actionLabel}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div
                id="contacts-form"
                className="route-card h-full rounded-[26px] px-5 py-6 sm:px-6 md:px-8 md:py-8"
              >
                <p className="eyebrow-lux">НАПИШІТЬ НАМ</p>
                <h2 className="section-title-lux mt-4 text-[clamp(2rem,3.6vw,3.1rem)] font-medium leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
                  Напишіть нам
                </h2>

                <form noValidate onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <TextField
                    label="Ім’я"
                    name="full_name"
                    value={values.fullName}
                    onChange={handleFieldChange("fullName")}
                    placeholder="Ваше ім’я"
                    autoComplete="name"
                    error={errors.fullName}
                    fieldClassName="h-[56px] rounded-[16px] px-4 text-[0.94rem]"
                  />
                  <PhoneField
                    label="Телефон"
                    phoneValue={values.phone}
                    phonePlaceholder="Ваш телефон"
                    phoneMaxLength={formPhoneMaxLength}
                    onPhoneChange={handlePhoneChange}
                    error={errors.phone}
                    inputClassName="h-[56px] rounded-[16px] px-4 text-[0.94rem]"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleFieldChange("email")}
                    placeholder="Email"
                    autoComplete="email"
                    error={errors.email}
                    fieldClassName="h-[56px] rounded-[16px] px-4 text-[0.94rem]"
                  />
                  <TextAreaField
                    label="Ваше повідомлення"
                    name="message"
                    value={values.message}
                    onChange={handleFieldChange("message")}
                    placeholder="Ваше повідомлення"
                    error={errors.message}
                    fieldClassName="min-h-[156px] rounded-[16px] px-4 py-3 text-[0.94rem] leading-[1.7]"
                  />

                  <button
                    type="submit"
                    className="button-gold inline-flex h-[54px] w-full items-center justify-center rounded-[14px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em]"
                  >
                    НАДІСЛАТИ ПОВІДОМЛЕННЯ
                  </button>
                </form>

                <p className="mt-4 text-[0.84rem] leading-[1.6] text-[rgba(183,178,168,0.76)]">
                  Ми гарантуємо конфіденційність ваших даних
                </p>
              </div>

              <div className="map-shell contacts-zones-shell relative overflow-hidden rounded-[26px]">
                <Image
                  src={contactsMapImage}
                  alt="Карта зон обслуговування Grand Transfer: Україна, Молдова, Польща, Румунія"
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="contacts-zones-overlay absolute inset-0" />

                <div className="relative z-10 max-w-[23rem] px-5 py-6 sm:px-6 md:px-8 md:py-8">
                  <p className="eyebrow-lux">ЗОНИ ОБСЛУГОВУВАННЯ</p>
                  <h2 className="section-title-lux mt-4 text-[clamp(2rem,3.6vw,3.1rem)] font-medium leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
                    Зони обслуговування
                  </h2>
                  <p className="mt-4 text-[0.92rem] uppercase tracking-[0.18em] text-[rgba(216,185,130,0.78)]">
                    Україна • Молдова • Польща • Румунія
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="relative z-10 mt-12 md:mt-16">
            <div className="max-w-[34rem]">
              <p className="eyebrow-lux">ШВИДКІ ВІДПОВІДІ</p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqColumns.map((column, columnIndex) => (
                <div key={`contacts-faq-column-${columnIndex}`} className="space-y-3">
                  {column.map(({ question, answer }, itemIndex) => {
                    const index = columnIndex * 3 + itemIndex;
                    const isOpen = openFaqIndex === index;

                    return (
                      <article
                        key={question}
                        className={`faq-item ${isOpen ? "is-open" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleFaqToggle(index, question)}
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

          <section className="relative z-10 mt-12 md:mt-16">
            <div className="route-card contacts-final-cta rounded-[26px] px-5 py-6 sm:px-6 md:px-8 md:py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex max-w-[39rem] items-start gap-4">
                  <span className="contacts-cta-icon">
                    <SupportIcon className="h-[30px] w-[30px]" />
                  </span>
                  <div>
                    <h2 className="section-title-lux text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--text)]">
                      Потрібна допомога прямо зараз?
                    </h2>
                    <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                      Зателефонуйте нам або напишіть у месенджер — ми на
                      зв’язку 24/7.
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${phoneHref}`}
                  onClick={() =>
                    trackPhoneClick({
                      phone: phoneHref,
                      location: "contacts_final_cta",
                      pageType: "contacts"
                    })
                  }
                  className="button-gold inline-flex h-[54px] w-full items-center justify-center rounded-[12px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] sm:w-auto"
                >
                  ПОДЗВОНИТИ
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter pageType="contacts" currentLanguage="ua" />

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
          id="mobile-drawer-kontakty"
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
              pageType="contacts"
              phoneHref={phoneHref}
              phoneLabel={phoneNumber}
              compactLabel="Подзвонити"
              className="inline-flex"
            />
            <a
              href="#contacts-form"
              onClick={() => setMenuOpen(false)}
              onClickCapture={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "contacts"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              ЗАМОВИТИ
            </a>
          </div>
        </aside>
      </div>

      <SuccessPopup
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        pageType="contacts"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
        eyebrowText="Повідомлення надіслано"
        titleText="Дякуємо за повідомлення"
        bodyText="Ми зв’яжемося з вами найближчим часом через вказаний контакт."
      />
      <FloatingContactWidget
        pageType="contacts"
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

function ClockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.45" />
      <path
        d="M12 7.8v4.7l3.2 1.9"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlashIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.6 3.8 7 13.1h4.25L10.4 20.2l6.6-9.3h-4.25l.85-7.1Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.3 4.7h2.1l1.1 4-1.4 1.4a13.2 13.2 0 0 0 4.8 4.8l1.4-1.4 4 1.1v2.1a1.8 1.8 0 0 1-1.8 1.8A14.8 14.8 0 0 1 5.5 6.5 1.8 1.8 0 0 1 7.3 4.7Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="m5.6 7.5 6.4 5 6.4-5"
        stroke="currentColor"
        strokeWidth="1.45"
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

function WhatsAppIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M13.601 2.326A7.84 7.84 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.398.366 2.763 1.061 3.966L0 16l4.204-1.102a7.93 7.93 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326ZM7.994 14.521a6.58 6.58 0 0 1-3.356-.92l-.24-.143-2.494.654.666-2.433-.156-.25a6.57 6.57 0 0 1-1.007-3.505c0-3.626 2.956-6.582 6.591-6.582a6.54 6.54 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.588-6.592 6.588Zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.588-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34a8 8 0 0 0-.38-.007.73.73 0 0 0-.529.247c-.182.198-.692.677-.692 1.654s.71 1.916.81 2.049c.098.133 1.398 2.135 3.383 2.992.473.205.84.327 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232Z"
      />
    </svg>
  );
}

function ViberIcon({ className = "h-4 w-4" }: IconProps) {
  return <FontAwesomeIcon icon={faViber} className={className} aria-hidden="true" />;
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
