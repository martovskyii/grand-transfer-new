import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const languages = ["ua"] as const;
const reservedStaticSlugs = new Set([
  "about",
  "avtopark",
  "blog",
  "kontakty",
  "pro-kompaniiu",
  "pro-nas",
  "routes"
]);

type SitemapRouteRecord = {
  slug: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

function toAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
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
  const staticPaths = [
    "/",
    "/avtopark",
    "/blog",
    "/blog/odesa-kyshyniv-transfer",
    "/kontakty",
    "/pro-kompaniiu"
  ];

  const staticEntries = languages.flatMap((language) =>
    staticPaths.map((path) =>
      buildEntry(path, language, {
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1 : 0.8
      })
    )
  );

  const routeEntries = (await fetchActiveRoutes())
    .filter((route) => route.slug && !reservedStaticSlugs.has(route.slug))
    .flatMap((route) => {
      const routePath = `/${route.slug}`;
      const lastModified = route.updated_at || route.created_at || now;

      return languages.map((language) =>
        buildEntry(routePath, language, {
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7
        })
      );
    });

  return [...staticEntries, ...routeEntries];
}
