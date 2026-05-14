"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  trackFormError,
  trackFormSubmit,
  trackFormSuccessPopupShow,
  type PageType
} from "./tracking";

type TransferFormName =
  | "homepage_quick_form"
  | "homepage_booking_form"
  | "route_quick_form"
  | "route_booking_form"
  | "not_found_form";

type TransferFormValues = {
  fullName: string;
  phoneNumber: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  passengers: string;
  carClass: string;
  comment: string;
};

type TransferFormErrors = Partial<
  Record<"fullName" | "phone" | "fromCity" | "toCity" | "travelDate", string>
>;

type UseTransferFormOptions = {
  formName: TransferFormName;
  pageType: PageType;
  route: string | null;
  requireDate?: boolean;
  initialValues?: Partial<TransferFormValues>;
  language?: "ua" | "ru";
};

type LeadMeta = {
  pageUrl: string;
  userAgent: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

const defaultValues: TransferFormValues = {
  fullName: "",
  phoneNumber: "",
  fromCity: "",
  toCity: "",
  travelDate: "",
  passengers: "",
  carClass: "",
  comment: ""
};

const errorFieldMap: Record<keyof TransferFormErrors, string> = {
  fullName: "name",
  phone: "phone",
  fromCity: "from",
  toCity: "to",
  travelDate: "date"
};

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function groupDigits(digits: string, groups: number[]) {
  const parts: string[] = [];
  let cursor = 0;

  groups.forEach((groupSize) => {
    if (cursor >= digits.length) {
      return;
    }

    parts.push(digits.slice(cursor, cursor + groupSize));
    cursor += groupSize;
  });

  if (cursor < digits.length) {
    parts.push(digits.slice(cursor));
  }

  return parts.join(" ");
}

function calculateDaysUntilTrip(travelDate: string, today: string) {
  const tripDate = parseDateString(travelDate);
  const todayDate = parseDateString(today);
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return Math.max(
    0,
    Math.round((tripDate.getTime() - todayDate.getTime()) / millisecondsInDay)
  );
}

function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "").slice(0, 15);
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

function phoneDigitsLength(value: string) {
  return value.replace(/\D/g, "").length;
}

function formatPhoneNumber(value: string) {
  const normalized = normalizePhoneNumber(value);
  const hasLeadingPlus = normalized.startsWith("+");
  const digits = normalized.replace(/\D/g, "");

  if (!digits) {
    return hasLeadingPlus ? "+" : "";
  }

  return `${hasLeadingPlus ? "+" : ""}${groupDigits(digits, [3, 3, 3, 3, 3])}`;
}

function collectLeadMeta(): LeadMeta {
  if (typeof window === "undefined") {
    return {
      pageUrl: "",
      userAgent: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      utmTerm: ""
    };
  }

  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  return {
    pageUrl: currentUrl.toString(),
    userAgent: window.navigator.userAgent,
    utmSource: searchParams.get("utm_source") || "",
    utmMedium: searchParams.get("utm_medium") || "",
    utmCampaign: searchParams.get("utm_campaign") || "",
    utmContent: searchParams.get("utm_content") || "",
    utmTerm: searchParams.get("utm_term") || ""
  };
}

export function useTransferForm({
  formName,
  pageType,
  route,
  requireDate = false,
  initialValues,
  language = "ua"
}: UseTransferFormOptions) {
  const isRu = language === "ru";
  const [values, setValues] = useState<TransferFormValues>({
    ...defaultValues,
    ...initialValues
  });
  const [errors, setErrors] = useState<TransferFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const today = useMemo(() => toLocalDateString(new Date()), []);
  const phoneDisplayValue = formatPhoneNumber(values.phoneNumber);
  const phoneMaxLength = 16;

  function clearFieldError(field: keyof TransferFormErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateField<K extends keyof TransferFormValues>(
    field: K,
    value: TransferFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
    setSubmitError(null);

    if (field === "fullName") clearFieldError("fullName");
    if (field === "fromCity") clearFieldError("fromCity");
    if (field === "toCity") clearFieldError("toCity");
    if (field === "travelDate") clearFieldError("travelDate");
  }

  function handleTextChange(field: keyof TransferFormValues) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      updateField(field, event.target.value);
    };
  }

  function handlePhoneNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const sanitizedPhone = normalizePhoneNumber(event.target.value);

    setValues((current) => ({
      ...current,
      phoneNumber: sanitizedPhone
    }));
    setSubmitError(null);
    clearFieldError("phone");
  }

  function validate() {
    const nextErrors: TransferFormErrors = {};
    const normalizedPhone = normalizePhoneNumber(values.phoneNumber);
    const digitsLength = phoneDigitsLength(normalizedPhone);

    if (digitsLength === 0) {
      nextErrors.phone = isRu
        ? "Укажите номер телефона."
        : "Вкажіть номер телефону.";
    } else if (digitsLength < 8 || digitsLength > 15) {
      nextErrors.phone = isRu
        ? "Введите корректный номер телефона."
        : "Введіть коректний номер телефону";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      trackFormError({
        formName,
        pageType,
        route,
        fromCity: values.fromCity.trim(),
        toCity: values.toCity.trim(),
        phoneEntered: digitsLength > 0,
        errorFields: Object.keys(nextErrors).map(
          (field) => errorFieldMap[field as keyof TransferFormErrors]
        )
      });
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const normalizedPhone = normalizePhoneNumber(values.phoneNumber);
    const leadMeta = collectLeadMeta();

    trackFormSubmit({
      formName,
      pageType,
      route,
      fromCity: values.fromCity.trim(),
      toCity: values.toCity.trim(),
      phoneFull: normalizedPhone,
      phoneEntered: phoneDigitsLength(normalizedPhone) > 0,
      selectedDate: values.travelDate || null,
      daysUntilTrip: requireDate && values.travelDate
        ? calculateDaysUntilTrip(values.travelDate, today)
        : null
    });

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/telegram-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          form_name: formName,
          name: values.fullName.trim() || null,
          phone: normalizedPhone,
          from: values.fromCity.trim() || null,
          to: values.toCity.trim() || null,
          date: values.travelDate || null,
          passengers: values.passengers || null,
          car_class: values.carClass || null,
          comment: values.comment.trim() || null,
          page_url: leadMeta.pageUrl || null,
          user_agent: leadMeta.userAgent || null,
          utm_source: leadMeta.utmSource || null,
          utm_medium: leadMeta.utmMedium || null,
          utm_campaign: leadMeta.utmCampaign || null,
          utm_content: leadMeta.utmContent || null,
          utm_term: leadMeta.utmTerm || null
        })
      });

      if (!response.ok) {
        throw new Error("telegram_lead_failed");
      }

      trackFormSuccessPopupShow({ formName, pageType, route });
      setIsSuccessOpen(true);
    } catch {
      setSubmitError(
        isRu
          ? "Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram."
          : "Не вдалося надіслати заявку. Спробуйте ще раз або напишіть у Telegram."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    isSuccessOpen,
    today,
    phoneMaxLength,
    phoneDisplayValue,
    closeSuccessModal: () => setIsSuccessOpen(false),
    handleSubmit,
    handleTextChange,
    handlePhoneNumberChange
  };
}
