"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import bookingBg from "../img/booking-bg.png";
import {
  PhoneField,
  TextField
} from "./lux-form-fields";
import {
  FloatingContactWidget,
  HeaderPhoneLink,
  LanguageSwitcher,
  SuccessPopup
} from "./site-ui";
import {
  trackCtaClick,
  trackMessengerClick,
  trackPhoneClick
} from "../lib/tracking";
import { useTransferForm } from "../lib/use-transfer-form";

const navItems = [
  { label: "ГОЛОВНА", href: "/" },
  { label: "НАПРЯМКИ", href: "/#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТИ", href: "/kontakty" },
  { label: "ПРО НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

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
const telegramHref = "https://t.me/grand_transfer_com";

const trustPoints = [
  "Подача 24/7",
  "Приватний трансфер без попутників",
  "Допомога на кордоні"
];

export function NotFoundPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const notFoundForm = useTransferForm({
    formName: "not_found_form",
    pageType: "about",
    route: null
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
                  pageType="about"
                  phoneHref={phoneHref}
                  phoneLabel={phoneNumber}
                  iconOnly
                  className="hidden lg:inline-flex"
                />
                <LanguageSwitcher />
                <a
                  href="#not-found-form"
                  onClick={() =>
                    trackCtaClick({
                      ctaType: "order",
                      location: "header",
                      pageType: "about",
                      target: "not-found-form"
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
                  aria-controls="not-found-mobile-drawer"
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
            <div className="hero-shell relative overflow-hidden rounded-[32px] border border-[rgba(216,185,130,0.16)]">
              <Image
                src={bookingBg}
                alt=""
                aria-hidden="true"
                fill
                priority
                className="object-cover object-[28%_center]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,6,0.76)_0%,rgba(5,7,6,0.72)_35%,rgba(5,7,6,0.84)_62%,rgba(5,7,6,0.94)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,7,0.12)_0%,rgba(6,8,7,0.56)_100%)]" />

              <div className="relative z-10 px-5 py-8 sm:px-7 md:px-10 md:py-10 lg:px-12 lg:py-12">
                <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
                  <p className="eyebrow-lux">404</p>
                  <h1 className="headline-lux mt-5 text-[2.45rem] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--text)] sm:text-[3rem] md:text-[3.85rem]">
                    Сторінка не знайдена
                  </h1>
                  <p className="mt-5 max-w-[38rem] text-[1rem] leading-[1.8] text-[var(--muted)] md:text-[1.04rem]">
                    Можливо, ви перейшли за неправильним посиланням або маршрут
                    більше недоступний.
                  </p>
                  <p className="mt-3 max-w-[34rem] text-[0.95rem] leading-[1.8] text-[rgba(247,243,234,0.74)]">
                    Ми допоможемо підібрати потрібний трансфер під ваш запит.
                  </p>

                  <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                    <a
                      href="#not-found-form"
                      onClick={() =>
                        trackCtaClick({
                          ctaType: "order",
                          location: "not_found_hero",
                          pageType: "about",
                          target: "not-found-form"
                        })
                      }
                      className="button-gold inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em] md:text-[0.8rem] lg:tracking-[0.12em]"
                    >
                      ЗАМОВИТИ ТРАНСФЕР
                    </a>
                    <Link
                      href="/"
                      className="button-outline inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em] md:text-[0.8rem] lg:tracking-[0.12em]"
                    >
                      НА ГОЛОВНУ
                    </Link>
                  </div>

                  <div className="mt-4 flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                    <a
                      href={telegramHref}
                      onClick={() =>
                        trackMessengerClick({
                          messenger: "telegram",
                          location: "not_found_hero",
                          pageType: "about"
                        })
                      }
                      className="button-outline inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-semibold tracking-[0.08em]"
                    >
                      Написати в Telegram
                    </a>
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        trackMessengerClick({
                          messenger: "whatsapp",
                          location: "not_found_hero",
                          pageType: "about"
                        });
                      }}
                      className="button-outline inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-semibold tracking-[0.08em]"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${phoneHref}`}
                      onClick={() =>
                        trackPhoneClick({
                          phone: phoneHref,
                          location: "not_found_hero",
                          pageType: "about"
                        })
                      }
                      className="button-outline inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-semibold tracking-[0.08em]"
                    >
                      Зателефонувати
                    </a>
                  </div>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {trustPoints.map((item) => (
                      <span key={item} className="hero-chip chip-compact inline-flex rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[rgba(247,243,234,0.82)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="not-found-form" className="relative z-10 mt-12 scroll-mt-28 md:mt-16 md:scroll-mt-32">
            <div className="booking-shell rounded-[32px] px-5 py-6 sm:px-7 md:px-9 md:py-9 lg:grid lg:grid-cols-[0.4fr_0.6fr] lg:gap-10 lg:px-12 lg:py-12">
              <div className="max-w-[24rem]">
                <p className="eyebrow-lux">ЗАЯВКА</p>
                <h2 className="booking-heading-lux mt-4 text-[2.3rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] md:text-[2.95rem] lg:text-[3.2rem]">
                  Підберемо потрібний маршрут
                </h2>
                <p className="mt-5 text-[0.98rem] leading-[1.85] text-[var(--muted)]">
                  Залиште коротку заявку, і ми підкажемо доступний трансфер,
                  клас авто та формат поїздки.
                </p>
              </div>

              <div className="panel-form mt-8 rounded-[28px] p-4 sm:p-5 md:mt-10 md:p-6 lg:mt-0">
                <form
                  noValidate
                  onSubmit={notFoundForm.handleSubmit}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <TextField
                    label="Ім’я"
                    name="full_name"
                    value={notFoundForm.values.fullName}
                    onChange={notFoundForm.handleTextChange("fullName")}
                    placeholder="Ім'я"
                    autoComplete="name"
                    error={notFoundForm.errors.fullName}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <PhoneField
                    label="Телефон"
                    phoneValue={notFoundForm.phoneDisplayValue}
                    phonePlaceholder="Ваш телефон"
                    phoneMaxLength={notFoundForm.phoneMaxLength}
                    onPhoneChange={notFoundForm.handlePhoneNumberChange}
                    error={notFoundForm.errors.phone}
                    inputClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label="Звідки"
                    name="from_city"
                    value={notFoundForm.values.fromCity}
                    onChange={notFoundForm.handleTextChange("fromCity")}
                    placeholder="Місто виїзду"
                    error={notFoundForm.errors.fromCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                  <TextField
                    label="Куди"
                    name="to_city"
                    value={notFoundForm.values.toCity}
                    onChange={notFoundForm.handleTextChange("toCity")}
                    placeholder="Місто прибуття"
                    error={notFoundForm.errors.toCity}
                    fieldClassName="h-14 rounded-[15px] px-4 text-[0.95rem]"
                  />
                                    {notFoundForm.submitError ? (
                    <p className="field-error md:col-span-2">{notFoundForm.submitError}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={notFoundForm.isSubmitting}
                    onClick={() =>
                      trackCtaClick({
                        ctaType: "order",
                        location: "not_found_form",
                        pageType: "about"
                      })
                    }
                    className="button-gold md:col-span-2 inline-flex h-14 items-center justify-center rounded-[16px] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] lg:tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    ЗАМОВИТИ
                  </button>
                </form>
              </div>
            </div>
          </section>
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
          id="not-found-mobile-drawer"
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

          <LanguageSwitcher className="mt-8 self-start" />

          <div className="mt-auto space-y-5 pt-10">
            <HeaderPhoneLink
              pageType="about"
              phoneHref={phoneHref}
              phoneLabel={phoneNumber}
              compactLabel="Подзвонити"
              className="inline-flex"
            />
            <a
              href="#not-found-form"
              onClick={() => setMenuOpen(false)}
              onClickCapture={() =>
                trackCtaClick({
                  ctaType: "order",
                  location: "header",
                  pageType: "about",
                  target: "not-found-form"
                })
              }
              className="button-gold inline-flex h-[52px] w-full items-center justify-center rounded-full px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
            >
              ЗАМОВИТИ
            </a>
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
                        pageType: "about"
                      })
                    }
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    {phoneNumber}
                  </a>
                  <a
                    href={telegramHref}
                    onClick={() =>
                      trackMessengerClick({
                        messenger: "telegram",
                        location: "footer",
                        pageType: "about"
                      })
                    }
                    className="transition hover:text-[var(--soft-gold)]"
                  >
                    Telegram
                  </a>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      trackMessengerClick({
                        messenger: "whatsapp",
                        location: "footer",
                        pageType: "about"
                      });
                    }}
                    className="transition hover:text-[var(--soft-gold)]"
                  >
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

      <SuccessPopup
        open={notFoundForm.isSuccessOpen}
        onClose={notFoundForm.closeSuccessModal}
        pageType="about"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
      <FloatingContactWidget
        pageType="about"
        phoneHref={phoneHref}
        phoneLabel={phoneNumber}
      />
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
