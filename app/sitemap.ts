import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const defaultSiteUrl = "https://www.grand-transfer.com";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(
  /\/+$/,
  ""
);
const reservedStaticSlugs = new Set([
  "about",
  "api",
  "avtopark",
  "blog",
  "en",
  "kontakty",
  "legal-information",
  "pro-kompaniiu",
  "privacy-policy",
  "public-offer",
  "ru",
  "routes",
  "sitemap.xml",
  "robots.txt"
]);

type SitemapRouteRecord = {
  slug: string | null;
  lang?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

function toAbsoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
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
  options: Pick<
    MetadataRoute.Sitemap[number],
    "priority" | "changeFrequency" | "lastModified"
  >
): MetadataRoute.Sitemap[number] {
  return {
    url: toAbsoluteUrl(path),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority
  };
}

async function fetchPriorityRoutes(): Promise<SitemapRouteRecord[]> {
  const client = supabase;

  if (!client) {
    return [];
  }

  const fetchRoutes = (columns: string) =>
    client
      .from("routes")
      .select(columns)
      .eq("is_active", true)
      .in("lang", ["ua", "ru", "en"])
      .eq("sitemap_priority", true)
      .order("lang", { ascending: true })
      .order("slug", { ascending: true });

  const { data, error } = await fetchRoutes("slug, lang, updated_at, created_at");

  if (!error) {
    return (data as unknown as SitemapRouteRecord[] | null) || [];
  }

  console.error("[sitemap] Failed to fetch priority routes with updated_at:", error);

  const fallbackResult = await fetchRoutes("slug, lang, created_at");

  if (fallbackResult.error) {
    console.error("[sitemap] Failed to fetch priority routes:", fallbackResult.error);
    return [];
  }

  return (fallbackResult.data as unknown as SitemapRouteRecord[] | null) || [];
}

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  const staticPaths = [
    "/",
    "/ru",
    "/en",
    "/avtopark",
    "/blog",
    "/blog/odesa-kyshyniv-transfer",
    "/kontakty",
    "/legal-information",
    "/privacy-policy",
    "/pro-kompaniiu",
    "/public-offer",
    "/routes",
    "/ru/routes",
    "/en/routes"
  ] as const;

  for (const path of staticPaths) {
    const entry = buildEntry(path, {
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.8
    });

    entries.set(entry.url, entry);
  }

  for (const route of await fetchPriorityRoutes()) {
    const slug = typeof route.slug === "string" ? route.slug.trim() : "";
    const lang = typeof route.lang === "string" ? route.lang.trim() : "";

    if (!slug || reservedStaticSlugs.has(slug)) {
      continue;
    }

    const routePath =
      lang === "ru" ? `/ru/${slug}` : lang === "en" ? `/en/${slug}` : `/${slug}`;
    const lastModified = resolveLastModified(route.updated_at, route.created_at, now);

    const entry = buildEntry(routePath, {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7
    });

    entries.set(entry.url, entry);
  }

  return Array.from(entries.values());
}
