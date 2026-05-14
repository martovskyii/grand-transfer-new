import type { Metadata } from "next";
import type { DynamicRouteData } from "@/components/route-page-supabase-client";
import { supabase } from "@/lib/supabase";

export interface DynamicRoutePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export type DynamicRouteReview = {
  id: string;
  route_slug: string | null;
  name: string | null;
  rating: number | null;
  text: string | null;
  media_url: string | null;
  media_type: string | null;
  status: string | null;
  created_at: string | null;
  route_from_city?: string | null;
  route_to_city?: string | null;
};

export type DynamicRelatedRoute = {
  slug: string | null;
  from_city: string | null;
  to_city: string | null;
  price_from: number | null;
};

export type RouteLanguage = "ua" | "ru";

export type RouteLanguageLinks = Partial<Record<"ua" | "ru" | "en", string>>;

export type RouteAlternatesData = {
  canonicalPath: string;
  languageLinks: RouteLanguageLinks;
  metadataLanguages?: Record<string, string>;
};

export async function getRouteBySlug(
  slug: string,
  lang: RouteLanguage = "ua"
): Promise<DynamicRouteData | null> {
  if (!supabase) {
    return null;
  }

  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

  if (!normalizedSlug) {
    return null;
  }

  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("slug", normalizedSlug)
    .eq("lang", lang)
    .eq("is_active", true)
    .maybeSingle();

  if (process.env.NODE_ENV === "development") {
    console.log("[clean-route] slug:", normalizedSlug);
    console.log("[clean-route] lang:", lang);
    console.log("[clean-route] data:", data);
    console.log("[clean-route] error:", error);
  }

  if (error) {
    console.error("Route fetch error:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data as unknown as DynamicRouteData;
}

function resolveRouteCanonicalPath(
  route: DynamicRouteData | null,
  lang: RouteLanguage = "ua"
) {
  const normalizedSlug =
    typeof route?.slug === "string" ? route.slug.trim() : "";

  if (!normalizedSlug) {
    return lang === "ru" ? "/ru" : "/";
  }

  return lang === "ru" ? `/ru/${normalizedSlug}` : `/${normalizedSlug}`;
}

export async function getRouteAlternates(
  route: DynamicRouteData,
  currentLang: RouteLanguage
): Promise<RouteAlternatesData> {
  const canonicalPath = resolveRouteCanonicalPath(route, currentLang);
  const languageLinks: RouteLanguageLinks = {
    ua: "/",
    ru: "/ru"
  };
  const metadataLanguages: Record<string, string> = {};
  const currentSlug =
    typeof route.slug === "string" ? route.slug.trim() : "";

  if (currentLang === "ua" && currentSlug) {
    languageLinks.ua = canonicalPath;
    metadataLanguages["uk-UA"] = canonicalPath;
  }

  if (currentLang === "ru" && currentSlug) {
    languageLinks.ru = canonicalPath;
    metadataLanguages["ru-UA"] = canonicalPath;
  }

  const translationGroup =
    typeof route.translation_group === "string"
      ? route.translation_group.trim()
      : "";

  if (!translationGroup || !supabase) {
    metadataLanguages["x-default"] = languageLinks.ua || canonicalPath;

    return {
      canonicalPath,
      languageLinks,
      metadataLanguages
    };
  }

  const { data, error } = await supabase
    .from("routes")
    .select("slug, lang")
    .eq("translation_group", translationGroup)
    .eq("is_active", true)
    .in("lang", ["ua", "ru"]);

  if (error) {
    console.error("[route-alternates] Failed to fetch translation group:", error);
    metadataLanguages["x-default"] = languageLinks.ua || canonicalPath;

    return {
      canonicalPath,
      languageLinks,
      metadataLanguages
    };
  }

  for (const item of (data as Array<{ slug: string | null; lang: string | null }> | null) ||
    []) {
    const slug = typeof item.slug === "string" ? item.slug.trim() : "";
    const lang = typeof item.lang === "string" ? item.lang.trim() : "";

    if (!slug) {
      continue;
    }

    if (lang === "ua") {
      const href = `/${slug}`;
      languageLinks.ua = href;
      metadataLanguages["uk-UA"] = href;
    }

    if (lang === "ru") {
      const href = `/ru/${slug}`;
      languageLinks.ru = href;
      metadataLanguages["ru-UA"] = href;
    }
  }

  metadataLanguages["x-default"] = languageLinks.ua || canonicalPath;

  return {
    canonicalPath,
    languageLinks,
    metadataLanguages
  };
}

export function buildRouteMetadata(
  route: DynamicRouteData | null,
  alternatesData?: RouteAlternatesData,
  lang: RouteLanguage = "ua"
): Metadata {
  if (!route) {
    return {
      title: "Маршрут не знайдено | Grand Transfer"
    };
  }

  const canonicalPath =
    alternatesData?.canonicalPath || resolveRouteCanonicalPath(route, lang);

  return {
    title: route.seo_title || route.h1 || "Grand Transfer",
    description: route.seo_description || route.description || undefined,
    alternates: canonicalPath
      ? {
          canonical: canonicalPath,
          languages: alternatesData?.metadataLanguages
        }
      : undefined
  };
}

export async function getApprovedReviews(): Promise<DynamicRouteReview[]> {
  if (!supabase) {
    return [];
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      "id, route_slug, name, rating, text, media_url, media_type, status, created_at"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !reviews) {
    return [];
  }

  const normalizedReviews = reviews as DynamicRouteReview[];
  const routeSlugs = Array.from(
    new Set(
      normalizedReviews
        .map((review) => review.route_slug)
        .filter((slug): slug is string => Boolean(slug))
    )
  );

  if (routeSlugs.length === 0) {
    return normalizedReviews;
  }

  const { data: routes } = await supabase
    .from("routes")
    .select("slug, from_city, to_city")
    .in("slug", routeSlugs);

  const routeMetaBySlug = new Map(
    ((routes as Array<{ slug: string; from_city: string | null; to_city: string | null }> | null) ||
      []).map((route) => [route.slug, route])
  );

  return normalizedReviews.map((review) => {
    const routeMeta = review.route_slug
      ? routeMetaBySlug.get(review.route_slug)
      : null;

    return {
      ...review,
      route_from_city: routeMeta?.from_city ?? null,
      route_to_city: routeMeta?.to_city ?? null
    };
  });
}

export async function getRelatedRoutesForRoute(
  currentSlug: string,
  currentFromCity: string | null,
  currentToCity: string | null,
  lang: RouteLanguage = "ua"
): Promise<DynamicRelatedRoute[]> {
  if (!supabase || !currentSlug) {
    return [];
  }

  const relatedRoutes = new Map<string, DynamicRelatedRoute>();

  if (currentFromCity) {
    const { data } = await supabase
      .from("routes")
      .select("slug, from_city, to_city, price_from")
      .eq("is_active", true)
      .eq("lang", lang)
      .neq("slug", currentSlug)
      .eq("from_city", currentFromCity)
      .order("to_city", { ascending: true })
      .limit(5);

    (data as DynamicRelatedRoute[] | null)?.forEach((route) => {
      if (route.slug) {
        relatedRoutes.set(route.slug, route);
      }
    });
  }

  if (currentToCity && relatedRoutes.size < 5) {
    const { data } = await supabase
      .from("routes")
      .select("slug, from_city, to_city, price_from")
      .eq("is_active", true)
      .eq("lang", lang)
      .neq("slug", currentSlug)
      .eq("to_city", currentToCity)
      .order("from_city", { ascending: true })
      .limit(10);

    (data as DynamicRelatedRoute[] | null)?.forEach((route) => {
      if (route.slug && !relatedRoutes.has(route.slug) && relatedRoutes.size < 5) {
        relatedRoutes.set(route.slug, route);
      }
    });
  }

  return Array.from(relatedRoutes.values()).slice(0, 5);
}
