"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faViber } from "@fortawesome/free-brands-svg-icons";
import {
  EMAIL_HREF,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  TELEGRAM_URL,
  VIBER_URL,
  WHATSAPP_URL,
} from "../lib/contact-links";
import {
  trackMessengerClick,
  trackPhoneClick,
  type PageType
} from "../lib/tracking";

type LanguageSwitcherProps = {
  className?: string;
  currentLanguage?: "ua" | "ru" | "en";
  links?: Partial<Record<"ua" | "ru" | "en", string>>;
};

type SuccessPopupProps = {
  open: boolean;
  onClose: () => void;
  pageType: PageType;
  phoneHref: string;
  phoneLabel: string;
  eyebrowText?: string;
  titleText?: string;
  bodyText?: string;
  noteText?: string;
  callButtonText?: string;
  closeButtonText?: string;
  closeOverlayLabel?: string;
  closeButtonLabel?: string;
};

type HeaderPhoneLinkProps = {
  pageType: PageType;
  phoneHref: string;
  phoneLabel: string;
  compactLabel?: string;
  iconOnly?: boolean;
  className?: string;
};

type FloatingContactWidgetProps = {
  pageType: PageType;
  phoneHref: string;
  phoneLabel: string;
};

type FooterContactLinksProps = {
  pageType: PageType;
};

type SiteFooterProps = {
  pageType: PageType;
  currentLanguage?: "ua" | "ru" | "en";
  faqHref?: string;
  aboutHref?: string;
  blogHref?: string;
  contactsHref?: string;
};

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function LanguageSwitcher({
  className,
  currentLanguage = "ua",
  links
}: LanguageSwitcherProps) {
  return (
    <div className={cx("language-switcher", className)} aria-label="Мови">
      {[
        { key: "ua" as const, label: "UA" },
        { key: "ru" as const, label: "RU" }
        // EN intentionally omitted: English pages are not implemented, so the
        // non-functional option was removed to avoid dead UI / crawl confusion.
      ].map(({ key, label }) => {
        const href = links?.[key];
        const isActive = currentLanguage === key;
        const itemClassName = `language-switcher-item ${isActive ? "is-active" : ""}`;

        if (href) {
          return (
            <Link
              key={key}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={itemClassName}
            >
              {label}
            </Link>
          );
        }

        return (
          <button
            key={key}
            type="button"
            disabled={!isActive}
            aria-current={isActive ? "page" : undefined}
            className={itemClassName}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function HeaderPhoneLink({
  pageType,
  phoneHref,
  phoneLabel,
  compactLabel,
  iconOnly = false,
  className
}: HeaderPhoneLinkProps) {
  if (iconOnly) {
    return (
      <>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          onClick={() =>
            trackMessengerClick({
              messenger: "whatsapp",
              location: "header",
              pageType
            })
          }
          className="header-phone-link is-icon-only hidden xl:inline-flex"
        >
          <WhatsAppOutlineIcon className="h-[18px] w-[18px] text-[var(--champagne)]" />
        </a>
        <a
          href={VIBER_URL}
          aria-label="Viber"
          onClick={() =>
            trackMessengerClick({
              messenger: "viber",
              location: "header",
              pageType
            })
          }
          className="header-phone-link is-icon-only hidden xl:inline-flex"
        >
          <ViberOutlineIcon className="h-[18px] w-[18px] text-[var(--champagne)]" />
        </a>
        <a
          href={`tel:${phoneHref}`}
          onClick={() =>
            trackPhoneClick({
              phone: phoneHref,
              location: "header",
              pageType
            })
          }
          className={cx("header-phone-link is-icon-only", className)}
        >
          <PhoneIcon className="h-[16px] w-[16px] text-[var(--champagne)]" />
        </a>
      </>
    );
  }

  return (
    <div className={cx("header-contact-links", className)}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        onClick={() =>
          trackMessengerClick({
            messenger: "whatsapp",
            location: "header",
            pageType
          })
        }
        className="header-phone-link is-icon-only"
      >
        <WhatsAppOutlineIcon className="h-[18px] w-[18px] text-[var(--champagne)]" />
      </a>
      <a
        href={VIBER_URL}
        aria-label="Viber"
        onClick={() =>
          trackMessengerClick({
            messenger: "viber",
            location: "header",
            pageType
          })
        }
        className="header-phone-link is-icon-only"
      >
        <ViberOutlineIcon className="h-[18px] w-[18px] text-[var(--champagne)]" />
      </a>
      <a
        href={`tel:${phoneHref}`}
        onClick={() =>
          trackPhoneClick({
            phone: phoneHref,
            location: "header",
            pageType
          })
        }
        className="header-phone-link"
      >
        <PhoneIcon className="h-[16px] w-[16px] text-[var(--champagne)]" />
        <>
          <span className="hidden sm:inline">{phoneLabel}</span>
          {compactLabel ? <span className="sm:hidden">{compactLabel}</span> : null}
        </>
      </a>
    </div>
  );
}

export function FooterContactLinks({ pageType }: FooterContactLinksProps) {
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2.5 text-[0.95rem] text-[rgba(247,243,234,0.86)]">
        <a
          href={PHONE_TEL_HREF}
          onClick={() =>
            trackPhoneClick({
              phone: PHONE_TEL_HREF.replace("tel:", ""),
              location: "footer",
              pageType
            })
          }
          className="footer-contact-link"
        >
          <PhoneIcon className="footer-contact-icon" />
          <span>{PHONE_DISPLAY}</span>
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackMessengerClick({
              messenger: "telegram",
              location: "footer",
              pageType
            })
          }
          className="footer-contact-link"
        >
          <TelegramOutlineIcon className="footer-contact-icon" />
          <span>Telegram</span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackMessengerClick({
              messenger: "whatsapp",
              location: "footer",
              pageType
            })
          }
          className="footer-contact-link"
        >
          <WhatsAppOutlineIcon className="footer-contact-icon" />
          <span>WhatsApp</span>
        </a>
        <a
          href={VIBER_URL}
          onClick={() =>
            trackMessengerClick({
              messenger: "viber",
              location: "footer",
              pageType
            })
          }
          className="footer-contact-link"
        >
          <ViberOutlineIcon className="footer-contact-icon" />
          <span>Viber</span>
        </a>
        <a href={EMAIL_HREF} className="footer-contact-link">
          <MailIcon className="footer-contact-icon" />
          <span>Email</span>
        </a>
      </div>
    </div>
  );
}

export function SiteFooter({
  pageType,
  currentLanguage = "ua",
  faqHref,
  aboutHref = "/pro-kompaniiu",
  blogHref = "/blog",
  contactsHref = "/kontakty"
}: SiteFooterProps) {
  const isRu = currentLanguage === "ru";
  const isEn = currentLanguage === "en";
  const resolvedFaqHref = faqHref || (isRu ? "/ru#faq" : "/#faq");

  const ui = {
    brandDescription: isEn
      ? "Premium international transfers between Ukraine, Moldova and Poland for private, business and VIP clients."
      : isRu
      ? "Премиальные международные трансферы между Украиной, Молдовой и Польшей для частных, бизнес- и VIP-клиентов."
      : "Преміальні міжнародні трансфери між Україною, Молдовою та Польщею для приватних, бізнес- та VIP-клієнтів.",
    brandSubtext: "Private • Business • Airport Transfer",
    popularRoutesTitle: isEn
      ? "Popular routes"
      : isRu
      ? "Популярные маршруты"
      : "Популярні маршрути",
    informationTitle: isEn ? "Information" : isRu ? "Информация" : "Інформація",
    contactsTitle: isEn ? "Contacts" : isRu ? "Контакты" : "Контакти",
    about: isEn ? "About" : isRu ? "О нас" : "Про нас",
    faq: "FAQ",
    blog: isEn ? "Blog" : isRu ? "Блог" : "Блог",
    contacts: isEn ? "Contacts" : isRu ? "Контакты" : "Контакти",
    copyright: isEn
      ? "© 2026 Grand Transfer. All rights reserved."
      : isRu
      ? "© 2026 Grand Transfer. Все права защищены."
      : "© 2026 Grand Transfer. Усі права захищені.",
    seoLine: "VIP transfer Ukraine — Moldova — Poland",
    logoSubtitle: isEn ? "VIP SERVICE" : isRu ? "VIP СЕРВИС" : "VIP СЕРВІС"
  };

  const popularRoutes = isRu
    ? [
        { label: "Одесса — Кишинёв", href: "/ru/odessa-kishinev" },
        { label: "Киев — Кишинёв", href: "/ru/kiev-kishinev" },
        { label: "Львов — Варшава", href: "/ru/lvov-varshava" },
        { label: "Одесса — Варшава", href: "/ru/odessa-varshava" },
        { label: "Днепр — Кишинёв", href: "/ru/dnepr-kishinev" }
      ]
    : isEn
      ? [
          { label: "Odesa — Chisinau", href: "/odesa-kyshyniv" },
          { label: "Kyiv — Chisinau", href: "/kyiv-kyshyniv" },
          { label: "Lviv — Warsaw", href: "/lviv-warsaw" },
          { label: "Odesa — Warsaw", href: "/odesa-warsaw" },
          { label: "Dnipro — Chisinau", href: "/dnipro-kyshyniv" }
        ]
      : [
          { label: "Одеса — Кишинів", href: "/odesa-kyshyniv" },
          { label: "Київ — Кишинів", href: "/kyiv-kyshyniv" },
          { label: "Львів — Варшава", href: "/lviv-warsaw" },
          { label: "Одеса — Варшава", href: "/odesa-warsaw" },
          { label: "Дніпро — Кишинів", href: "/dnipro-kyshyniv" }
        ];

  const informationLinks = [
    { label: ui.about, href: aboutHref },
    { label: ui.faq, href: resolvedFaqHref },
    { label: ui.blog, href: blogHref },
    { label: ui.contacts, href: contactsHref }
  ];

  return (
    <footer
      id="contacts"
      className="relative border-t border-[rgba(216,185,130,0.08)] pb-10 pt-14 md:pb-12 md:pt-16"
    >
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="footer-shell rounded-[30px] px-5 py-8 sm:px-7 md:px-10 md:py-12">
          <div className="site-footer-grid grid gap-10 lg:grid-cols-[1.2fr_0.95fr_0.8fr_1fr] lg:gap-9 xl:gap-12">
            <div className="max-w-[24rem]">
              <div className="footer-brand">
                <div className="luxury-logo-title">GRAND TRANSFER</div>
                <div className="footer-logo-subtitle">{ui.logoSubtitle}</div>
              </div>
              <p className="site-footer-description mt-6">{ui.brandDescription}</p>
              <p className="site-footer-subtext mt-4">{ui.brandSubtext}</p>
            </div>

            <div>
              <h3 className="site-footer-title">{ui.popularRoutesTitle}</h3>
              <div className="site-footer-links mt-5">
                {popularRoutes.map(({ label, href }) => (
                  <Link key={href} href={href} className="site-footer-link site-footer-route-link">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="site-footer-title">{ui.informationTitle}</h3>
              <div className="site-footer-links mt-5">
                {informationLinks.map(({ label, href }) => (
                  <Link key={`${label}-${href}`} href={href} className="site-footer-link">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="site-footer-title">{ui.contactsTitle}</h3>
              <FooterContactLinks pageType={pageType} />
            </div>
          </div>

          <div className="site-footer-bottom mt-10 border-t border-[rgba(216,185,130,0.08)] pt-5">
            <p>{ui.copyright}</p>
            <p className="footer-seo-copy">{ui.seoLine}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SuccessPopup({
  open,
  onClose,
  pageType,
  phoneHref,
  phoneLabel,
  eyebrowText = "Заявку надіслано",
  titleText = "Дякуємо за заявку",
  bodyText = "Дякуємо! Ми скоро зв'яжемося з вами.",
  noteText = "Якщо питання термінове — натисніть “Подзвонити зараз”.",
  callButtonText = "Подзвонити зараз",
  closeButtonText = "Закрити",
  closeOverlayLabel = "Закрити повідомлення",
  closeButtonLabel = "Закрити"
}: SuccessPopupProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="success-popup-shell" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={closeOverlayLabel}
        className="success-popup-overlay"
        onClick={onClose}
      />
      <div className="success-popup-card">
        <button
          type="button"
          aria-label={closeButtonLabel}
          className="success-popup-close"
          onClick={onClose}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <p className="success-popup-eyebrow">{eyebrowText}</p>
        <h3 className="success-popup-title">{titleText}</h3>
        <p className="success-popup-text">{bodyText}</p>
        <div className="success-popup-actions">
          <a
            href={`tel:${phoneHref}`}
            title={phoneLabel}
            onClick={() =>
              trackPhoneClick({
                phone: phoneHref,
                location: "success_popup",
                pageType
              })
            }
            className="button-gold inline-flex h-[52px] items-center justify-center rounded-[14px] px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
          >
            {callButtonText}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="button-outline inline-flex h-[52px] items-center justify-center rounded-[14px] px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
          >
            {closeButtonText}
          </button>
        </div>
        <p className="success-popup-note">{noteText}</p>
      </div>
    </div>
  );
}

export function FloatingContactWidget({
  pageType,
  phoneHref,
  phoneLabel
}: FloatingContactWidgetProps) {
  return (
    <div className="floating-contact-widget">
      <a
        href={`tel:${phoneHref}`}
        aria-label="Зателефонувати"
        title={phoneLabel}
        onClick={() =>
          trackPhoneClick({
            phone: phoneHref,
            location: "floating_contact_widget",
            pageType
          })
        }
        className="floating-contact-trigger"
      >
        <PhoneIcon className="h-6 w-6 sm:h-[26px] sm:w-[26px]" />
      </a>
    </div>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <i className={`bi bi-telephone ${className}`} aria-hidden="true" />;
}

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m5.8 8.1 6.2 4.85 6.2-4.85"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.47 4.38 3.92 10.7c-1.13.45-1.12 1.08-.2 1.36l4.24 1.32 1.63 5.09c.2.62.1.86.77.86.52 0 .75-.24 1.04-.53l2.06-2 4.29 3.16c.79.44 1.35.21 1.55-.73l2.82-13.3c.29-1.15-.44-1.67-1.25-1.31Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m8.52 13.1 9.63-6.1M9.36 18.47l1.42-4.82"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M13.601 2.326A7.84 7.84 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.398.366 2.763 1.061 3.966L0 16l4.204-1.102a7.93 7.93 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326ZM7.994 14.521a6.58 6.58 0 0 1-3.356-.92l-.24-.143-2.494.654.666-2.433-.156-.25a6.57 6.57 0 0 1-1.007-3.505c0-3.626 2.956-6.582 6.591-6.582a6.54 6.54 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.588-6.592 6.588Zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.588-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34a8 8 0 0 0-.38-.007.73.73 0 0 0-.529.247c-.182.198-.692.677-.692 1.654s.71 1.916.81 2.049c.098.133 1.398 2.135 3.383 2.992.473.205.84.327 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232Z"
      />
    </svg>
  );
}

function ViberOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <FontAwesomeIcon icon={faViber} className={className} aria-hidden="true" />;
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
