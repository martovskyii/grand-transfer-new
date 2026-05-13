"use client";

import { useEffect } from "react";
import {
  EMAIL_ADDRESS,
  EMAIL_HREF,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  TELEGRAM_URL,
  TIKTOK_URL,
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

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  return (
    <div className={cx("language-switcher", className)} aria-label="Мови">
      {["UA", "RU", "EN"].map((language) => (
        <button
          key={language}
          type="button"
          className={`language-switcher-item ${language === "UA" ? "is-active" : ""}`}
        >
          {language}
        </button>
      ))}
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
    <div className="mt-5 flex flex-col gap-3 text-[0.95rem] text-[rgba(247,243,234,0.86)]">
      <a
        href={PHONE_TEL_HREF}
        onClick={() =>
          trackPhoneClick({
            phone: PHONE_TEL_HREF.replace("tel:", ""),
            location: "footer",
            pageType
          })
        }
        className="transition hover:text-[var(--soft-gold)]"
      >
        {PHONE_DISPLAY}
      </a>
      <a href={EMAIL_HREF} className="transition hover:text-[var(--soft-gold)]">
        {EMAIL_ADDRESS}
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
        className="transition hover:text-[var(--soft-gold)]"
      >
        Telegram
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackSocialClick({
            channel: "instagram",
            location: "footer",
            pageType
          })
        }
        className="transition hover:text-[var(--soft-gold)]"
      >
        Instagram
      </a>
      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackSocialClick({
            channel: "tiktok",
            location: "footer",
            pageType
          })
        }
        className="transition hover:text-[var(--soft-gold)]"
      >
        TikTok
      </a>
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackSocialClick({
            channel: "youtube",
            location: "footer",
            pageType
          })
        }
        className="transition hover:text-[var(--soft-gold)]"
      >
        YouTube
      </a>
    </div>
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
  noteText = "Якщо питання термінове — натисніть “Подзвонити зараз”."
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
        aria-label="Закрити повідомлення"
        className="success-popup-overlay"
        onClick={onClose}
      />
      <div className="success-popup-card">
        <button
          type="button"
          aria-label="Закрити"
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
            Подзвонити зараз
          </a>
          <button
            type="button"
            onClick={onClose}
            className="button-outline inline-flex h-[52px] items-center justify-center rounded-[14px] px-7 text-[0.76rem] font-bold uppercase tracking-[0.1em]"
          >
            Закрити
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
