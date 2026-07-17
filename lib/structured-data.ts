import {
  EMAIL_ADDRESS,
  PHONE_HREF,
  TELEGRAM_URL,
  WHATSAPP_URL
} from "./contact-links";
import { LOGO_URL, SITE_NAME, SITE_URL, absoluteUrl } from "./seo";

type JsonLdObject = Record<string, unknown>;

/**
 * Organization / LocalBusiness schema describing Grand Transfer.
 * Rendered site-wide from the root layout.
 */
export function buildOrganizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: `+${PHONE_HREF.replace(/^\+/, "")}`,
    email: EMAIL_ADDRESS,
    priceRange: "€€",
    sameAs: [TELEGRAM_URL, WHATSAPP_URL],
    areaServed: [
      { "@type": "Country", name: "Ukraine" },
      { "@type": "Country", name: "Moldova" },
      { "@type": "Country", name: "Poland" },
      { "@type": "Country", name: "Romania" },
      { "@type": "Place", name: "Europe" }
    ],
    serviceType: "Private international transfer service"
  };
}

export type BreadcrumbEntry = {
  name: string;
  /** Relative or absolute URL. Omit for the current (last) item. */
  path?: string;
};

/** BreadcrumbList schema built from visible breadcrumb items. */
export function buildBreadcrumbSchema(items: BreadcrumbEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {})
    }))
  };
}

export type FaqEntry = {
  question: string;
  answer: string;
};

/** FAQPage schema built from the same FAQ data shown on the page. */
export function buildFaqSchema(items: FaqEntry[]): JsonLdObject | null {
  const questions = items.filter(
    (item) => item.question?.trim() && item.answer?.trim()
  );

  if (questions.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export type HowToStep = {
  name: string;
  text?: string;
};

/** HowTo schema built from an existing step-by-step section. */
export function buildHowToSchema(
  name: string,
  steps: HowToStep[]
): JsonLdObject | null {
  const validSteps = steps.filter((step) => step.name?.trim());

  if (validSteps.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: validSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      ...(step.text ? { text: step.text } : {})
    }))
  };
}

export type ReviewRating = {
  rating: number | null;
};

/**
 * AggregateRating fragment computed strictly from real review data.
 * Returns null when there are no usable ratings (never invents values).
 */
export function buildAggregateRating(
  reviews: ReviewRating[]
): JsonLdObject | null {
  const ratings = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number" && rating > 0);

  if (ratings.length === 0) {
    return null;
  }

  const average =
    Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) /
    10;

  return {
    "@type": "AggregateRating",
    ratingValue: average,
    bestRating: 5,
    worstRating: 1,
    ratingCount: ratings.length,
    reviewCount: ratings.length
  };
}

type ProductRatingOptions = {
  name: string;
  description?: string;
  url: string;
  price?: number | null;
  priceCurrency?: string;
  reviews: ReviewRating[];
};

/**
 * Product schema for a route offering, including AggregateRating when real
 * reviews exist. Skips AggregateRating entirely when there are no reviews.
 */
export function buildRouteProductSchema({
  name,
  description,
  url,
  price,
  priceCurrency = "EUR",
  reviews
}: ProductRatingOptions): JsonLdObject {
  const aggregateRating = buildAggregateRating(reviews);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    url: absoluteUrl(url),
    brand: {
      "@type": "Brand",
      name: SITE_NAME
    },
    ...(typeof price === "number"
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency,
            url: absoluteUrl(url),
            availability: "https://schema.org/InStock"
          }
        }
      : {}),
    ...(aggregateRating ? { aggregateRating } : {})
  };
}

type ArticleSchemaOptions = {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  inLanguage?: string;
  datePublished?: string;
  dateModified?: string;
};

/** Article schema for blog posts. Date fields are omitted when unknown. */
export function buildArticleSchema({
  headline,
  description,
  url,
  image,
  inLanguage = "uk-UA",
  datePublished,
  dateModified
}: ArticleSchemaOptions): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    url: absoluteUrl(url),
    mainEntityOfPage: absoluteUrl(url),
    inLanguage,
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL
      }
    }
  };
}
