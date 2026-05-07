import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const defaultSiteUrl = "https://www.grand-transfer.com";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(
  /\/+$/,
  ""
);
const languages = ["ua"] as const;
const reservedStaticSlugs = new Set([
  "about",
  "api",
  "avtopark",
  "blog",
  "kontakty",
  "pro-kompaniiu",
  "routes",
  "sitemap.xml",
  "robots.txt"
]);

type SitemapRouteRecord = {
  slug: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

function toAbsoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}

function buildLocalizedPath(
  path: string,
  language: (typeof languages)[number]
) {
  if (language === "ua") {
    return path;
  }

  return path === "/" ? `/${language}` : `/${language}${path}`;
}

function resolveLastModified(
  updatedAt: string | null | undefined,
  createdAt: string | null | undefined,
  fallback: Date
) {
  const source = updatedAt || createdAt;

  if (!source) {
    return fallback;
  }

  const parsed = new Date(source);

  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function buildEntry(
  path: string,
  language: (typeof languages)[number],
  options: Pick<
    MetadataRoute.Sitemap[number],
    "priority" | "changeFrequency" | "lastModified"
  >
): MetadataRoute.Sitemap[number] {
  return {
    url: toAbsoluteUrl(buildLocalizedPath(path, language)),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority
  };
}

async function fetchActiveRoutes(): Promise<SitemapRouteRecord[]> {
  if (!supabase) {
    return [];
  }

  const attempts = [
    "slug, updated_at, created_at",
    "slug, created_at",
    "slug"
  ] as const;

  for (const selectFields of attempts) {
    const { data, error } = await supabase
      .from("routes")
      .select(selectFields)
      .eq("is_active", true)
      .eq("lang", "ua")
      .order("slug", { ascending: true });

    if (!error && data) {
      return data as unknown as SitemapRouteRecord[];
    }
  }

  return [];
}

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  const staticPaths = [
    "/",
    "/avtopark",
    "/blog",
    "/blog/odesa-kyshyniv-transfer",
    "/kontakty",
    "/pro-kompaniiu"
  ] as const;

  for (const language of languages) {
    for (const path of staticPaths) {
      const entry = buildEntry(path, language, {
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1 : 0.8
      });

      entries.set(entry.url, entry);
    }
  }

  for (const route of await fetchActiveRoutes()) {
    const slug = typeof route.slug === "string" ? route.slug.trim() : "";

    if (!slug || reservedStaticSlugs.has(slug)) {
      continue;
    }

    const routePath = `/${slug}`;
    const lastModified = resolveLastModified(route.updated_at, route.created_at, now);

    for (const language of languages) {
      const entry = buildEntry(routePath, language, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7
      });

      entries.set(entry.url, entry);
    }
  }

  return Array.from(entries.values());
}
