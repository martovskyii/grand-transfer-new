export type PageType = "home" | "route" | "contacts" | "about" | "fleet";

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

const transliterationMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya"
};

export function pushDataLayer(event: DataLayerEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function trackPhoneClick({
  phone,
  location,
  pageType
}: {
  phone: string;
  location: string;
  pageType: PageType;
}) {
  pushDataLayer({
    event: "phone_click",
    phone,
    location,
    page_type: pageType
  });
}

export function trackMessengerClick({
  messenger,
  location,
  pageType
}: {
  messenger: "telegram" | "whatsapp" | "viber";
  location: string;
  pageType: PageType;
}) {
  pushDataLayer({
    event: "messenger_click",
    messenger,
    location,
    page_type: pageType
  });
}

export function trackCtaClick({
  ctaType,
  location,
  pageType,
  target
}: {
  ctaType: string;
  location: string;
  pageType: PageType;
  target?: string;
}) {
  pushDataLayer({
    event: "cta_click",
    cta_type: ctaType,
    location,
    page_type: pageType,
    ...(target ? { target } : {})
  });
}

export function trackFaqOpen({
  question,
  pageType
}: {
  question: string;
  pageType: PageType;
}) {
  pushDataLayer({
    event: "faq_open",
    question,
    page_type: pageType
  });
}

export function trackRouteClick({
  route,
  sourceBlock,
  pageType
}: {
  route: string;
  sourceBlock: "popular_routes" | "similar_routes" | "all_routes";
  pageType: PageType;
}) {
  pushDataLayer({
    event: "route_click",
    route,
    source_block: sourceBlock,
    page_type: pageType
  });
}

export function trackContactWidgetOpen({ pageType }: { pageType: PageType }) {
  pushDataLayer({
    event: "contact_widget_open",
    page_type: pageType
  });
}

export function trackContactOptionClick({
  channel,
  pageType
}: {
  channel: "telegram" | "whatsapp" | "viber" | "phone";
  pageType: PageType;
}) {
  pushDataLayer({
    event: "contact_option_click",
    channel,
    location: "floating_contact_widget",
    page_type: pageType
  });
}

export function trackReviewsScroll({
  location
}: {
  location: "homepage" | "route_page";
}) {
  pushDataLayer({
    event: "reviews_scroll",
    location
  });
}

export function trackReviewClick({
  name,
  route,
  location
}: {
  name: string;
  route: string;
  location: "homepage" | "route_page";
}) {
  pushDataLayer({
    event: "review_click",
    name,
    route,
    location
  });
}

export function trackCarImageOpen({
  pageType,
  route,
  carClass
}: {
  pageType: "route" | "fleet";
  route?: string | null;
  carClass: "comfort" | "business" | "premium" | "minivan";
}) {
  pushDataLayer({
    event: "car_image_open",
    page_type: pageType,
    route: route ?? null,
    car_class: carClass
  });
}

export function trackFormSuccessPopupShow({
  formName,
  pageType,
  route
}: {
  formName: string;
  pageType: PageType;
  route: string | null;
}) {
  pushDataLayer({
    event: "form_success_popup_show",
    form_name: formName,
    page_type: pageType,
    route,
    timestamp: Date.now()
  });
}

export function trackFormSubmit({
  formName,
  pageType,
  route,
  fromCity,
  toCity,
  phoneFull,
  phoneEntered,
  selectedDate,
  daysUntilTrip
}: {
  formName: string;
  pageType: PageType;
  route: string | null;
  fromCity: string;
  toCity: string;
  phoneFull: string;
  phoneEntered: boolean;
  selectedDate: string | null;
  daysUntilTrip: number | null;
}) {
  pushDataLayer({
    event: "form_submit",
    form_name: formName,
    page_type: pageType,
    route,
    from_city: fromCity || null,
    to_city: toCity || null,
    phone_full: phoneFull || null,
    phone_entered: phoneEntered,
    selected_date: selectedDate,
    days_until_trip: daysUntilTrip,
    timestamp: Date.now()
  });
}

export function trackFormError({
  formName,
  pageType,
  route,
  fromCity,
  toCity,
  phoneEntered,
  errorFields
}: {
  formName: string;
  pageType: PageType;
  route: string | null;
  fromCity: string;
  toCity: string;
  phoneEntered: boolean;
  errorFields: string[];
}) {
  pushDataLayer({
    event: "form_error",
    form_name: formName,
    page_type: pageType,
    route,
    from_city: fromCity || null,
    to_city: toCity || null,
    phone_entered: phoneEntered,
    error_fields: errorFields,
    timestamp: Date.now()
  });
}

export function formatRouteId(routeLabel: string) {
  const lowered = routeLabel
    .toLowerCase()
    .replace(/→|—|–|-/g, " ")
    .replace(/[']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return lowered
    .split("")
    .map((char) => {
      if (transliterationMap[char]) {
        return transliterationMap[char];
      }

      if (/[a-z0-9]/.test(char)) {
        return char;
      }

      if (char === " ") {
        return "-";
      }

      return "";
    })
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
