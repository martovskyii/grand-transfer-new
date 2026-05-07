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

export async function getRouteBySlug(
  slug: string
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
    .eq("is_active", true)
    .maybeSingle();

  if (process.env.NODE_ENV === "development") {
    console.log("[clean-route] slug:", normalizedSlug);
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

export function buildRouteMetadata(route: DynamicRouteData | null): Metadata {
  if (!route) {
    return {
      title: "Маршрут не знайдено | Grand Transfer"
    };
  }

  return {
    title: route.seo_title || route.h1 || "Grand Transfer",
    description: route.seo_description || route.description || undefined
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
  currentToCity: string | null
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
