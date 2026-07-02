"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  EMAIL_ADDRESS,
  EMAIL_HREF,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  TELEGRAM_URL,
  TIKTOK_URL,
  WHATSAPP_URL,
  YOUTUBE_URL
} from "../lib/contact-links";
import {
  trackMessengerClick,
  trackPhoneClick,
  trackSocialClick,
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
  return (
    <a
      href={`tel:${phoneHref}`}
      onClick={() =>
        trackPhoneClick({
          phone: phoneHref,
          location: "header",
          pageType
        })
      }
      className={cx("header-phone-link", iconOnly && "is-icon-only", className)}
    >
      <PhoneIcon className="h-[16px] w-[16px] text-[var(--champagne)]" />
      {!iconOnly ? (
        <>
          <span className="hidden sm:inline">{phoneLabel}</span>
          {compactLabel ? <span className="sm:hidden">{compactLabel}</span> : null}
        </>
      ) : null}
    </a>
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
        <a href={EMAIL_HREF} className="footer-contact-link">
          <MailIcon className="footer-contact-icon" />
          <span>Email</span>
        </a>
      </div>

      <div className="footer-social-row mt-5">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          onClick={() =>
            trackSocialClick({
              channel: "instagram",
              location: "footer",
              pageType
            })
          }
          className="footer-social-button"
        >
          <InstagramOutlineIcon className="footer-social-icon" />
        </a>
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          onClick={() =>
            trackSocialClick({
              channel: "tiktok",
              location: "footer",
              pageType
            })
          }
          className="footer-social-button"
        >
          <TikTokOutlineIcon className="footer-social-icon" />
        </a>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          onClick={() =>
            trackSocialClick({
              channel: "youtube",
              location: "footer",
              pageType
            })
          }
          className="footer-social-button"
        >
          <YouTubeOutlineIcon className="footer-social-icon" />
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
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.5 4.9c.38-.4.94-.55 1.45-.38l2.18.71c.63.2.98.87.8 1.5l-.55 1.92a1.3 1.3 0 0 0 .3 1.23l2.45 2.44c.32.32.78.43 1.21.3l1.93-.54c.63-.18 1.29.16 1.5.79l.7 2.19c.18.51.03 1.07-.37 1.45l-1.09 1.04c-.83.8-2.07 1.1-3.19.76-2.03-.6-4.22-2.03-6.22-4.03-2-2-3.42-4.18-4.03-6.22-.33-1.12-.03-2.36.77-3.18L7.5 4.9Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
    </svg>
  );
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 20a7.9 7.9 0 0 0 4-.98l3.1.78-.84-3A8 8 0 1 0 12 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.8c.2-.5.5-.6.8-.6h.7c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.7c.5 1 .9 1.5 1.7 2.2.7.7 1.3 1.1 2.2 1.6l.8-.6c.2-.1.4-.1.6 0l1.4.6c.3.1.4.3.4.5v.7c0 .4-.1.6-.5.8-.6.3-1.3.4-2 .2-1.1-.2-2.3-.9-3.7-2.2-1.4-1.3-2.2-2.5-2.5-3.7-.2-.8-.1-1.5.1-2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" />
    </svg>
  );
}

function TikTokOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.2 5.2c.53 1.4 1.57 2.48 2.97 3.02.77.3 1.6.45 2.43.42v2.7a7.26 7.26 0 0 1-4.02-1.17v4.3a5.08 5.08 0 1 1-5.08-5.08c.37 0 .73.04 1.08.11v2.79a2.44 2.44 0 1 0 1.98 2.39V5.2h2.64Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeOutlineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.1 8.4c-.18-.75-.77-1.34-1.52-1.52C17.24 6.5 12 6.5 12 6.5s-5.24 0-6.58.38c-.75.18-1.34.77-1.52 1.52C3.5 9.74 3.5 12 3.5 12s0 2.26.4 3.6c.18.75.77 1.34 1.52 1.52 1.34.38 6.58.38 6.58.38s5.24 0 6.58-.38c.75-.18 1.34-.77 1.52-1.52.4-1.34.4-3.6.4-3.6s0-2.26-.4-3.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m10.3 14.75 4.1-2.75-4.1-2.75v5.5Z"
        fill="currentColor"
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
