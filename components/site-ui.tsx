"use client";

import { useEffect, useRef, useState } from "react";
import {
  trackContactOptionClick,
  trackContactWidgetOpen,
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
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!widgetRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleToggle() {
    setOpen((current) => {
      const next = !current;
      if (next) {
        trackContactWidgetOpen({ pageType });
      }
      return next;
    });
  }

  return (
    <div ref={widgetRef} className="floating-contact-widget">
      <div className={`floating-contact-menu ${open ? "is-open" : ""}`}>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            trackContactOptionClick({ channel: "instagram", pageType });
            trackSocialClick({
              channel: "instagram",
              location: "floating_contact_widget",
              pageType
            });
            setOpen(false);
          }}
          className="floating-contact-item"
        >
          <InstagramIcon className="h-4 w-4" />
          <span>Instagram</span>
        </a>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            trackContactOptionClick({ channel: "telegram", pageType });
            trackMessengerClick({
              messenger: "telegram",
              location: "floating_contact_widget",
              pageType
            });
            setOpen(false);
          }}
          className="floating-contact-item"
        >
          <TelegramIcon className="h-4 w-4" />
          <span>Telegram</span>
        </a>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            trackContactOptionClick({ channel: "whatsapp", pageType });
            trackMessengerClick({
              messenger: "whatsapp",
              location: "floating_contact_widget",
              pageType
            });
            setOpen(false);
          }}
          className="floating-contact-item"
        >
          <MessageIcon className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>
        <a
          href={`tel:${phoneHref}`}
          onClick={() => {
            trackContactOptionClick({ channel: "phone", pageType });
            trackPhoneClick({
              phone: phoneHref,
              location: "floating_contact_widget",
              pageType
            });
            setOpen(false);
          }}
          className="floating-contact-item"
        >
          <PhoneIcon className="h-4 w-4" />
          <span>{phoneLabel}</span>
        </a>
      </div>

      <button
        type="button"
        aria-label="Відкрити контакти"
        aria-expanded={open}
        onClick={handleToggle}
        className="floating-contact-trigger"
      >
        <PhoneIcon className="h-6 w-6 sm:h-[26px] sm:w-[26px]" />
      </button>
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

function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
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

function MessageIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 11.3c0 4.1-3.7 7.4-8.3 7.4-.82 0-1.62-.1-2.35-.32L4 20l1.76-4.5A6.94 6.94 0 0 1 3.4 11.3C3.4 7.2 7.1 4 11.7 4S20 7.2 20 11.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="4.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.7" cy="7.5" r="0.9" fill="currentColor" />
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
