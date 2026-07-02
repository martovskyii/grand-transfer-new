import type { Metadata } from "next";
import ogImageAsset from "../img/desktop.png";
import faviconAsset from "../img/favicon.png";

/**
 * Central SEO configuration and helpers.
 *
 * Note on the base domain: the codebase (layout metadataBase, sitemap, robots,
 * Vercel config) consistently uses the `www.grand-transfer.com` host, so we keep
 * that here to avoid canonical/host inconsistencies. All canonical values are
 * emitted as absolute URLs against this base.
 */
const defaultSiteUrl = "https://www.grand-transfer.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl
).replace(/\/+$/, "");

export const SITE_NAME = "Grand Transfer";

export const DEFAULT_DESCRIPTION =
  "Приватні VIP трансфери з України до Молдови, Польщі та Європи. Комфортні авто, досвідчені водії, допомога на кордоні та бронювання 24/7.";

/** Absolute URL to the default Open Graph / Twitter share image. */
export const DEFAULT_OG_IMAGE = {
  url: absoluteUrl(ogImageAsset.src),
  width: ogImageAsset.width,
  height: ogImageAsset.height,
  alt: "Grand Transfer — приватні VIP трансфери між Україною та Європою"
};

/** Absolute URL to the brand logo, used in structured data. */
export const LOGO_URL = absoluteUrl(faviconAsset.src);

/** Turn a relative path (or already-absolute URL) into an absolute URL. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path, `${SITE_URL}/`).toString();
}

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  /** Self-referencing canonical path, e.g. "/avtopark". */
  path: string;
  /** Override the default share image (absolute URL). */
  image?: string;
  locale?: string;
  ogType?: "website" | "article";
};

/**
 * Build a complete Metadata object with a unique title/description, a
 * self-referencing canonical URL and full Open Graph + Twitter Card tags.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  locale = "uk_UA",
  ogType = "website"
}: BuildPageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? { url: image, alt: title }
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
      locale,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url]
    }
  };
}
