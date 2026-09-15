import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoutePageSupabaseClient from "@/components/route-page-supabase-client";
import {
  buildRouteMetadata,
  getApprovedReviews,
  getRelatedRoutesForRoute,
  getRouteAlternates,
  getRouteBySlug,
  type DynamicRoutePageProps
} from "@/lib/route-page-data";

export const dynamic = "force-dynamic";

const reservedSlugs = new Set(["api", "routes"]);

function isReservedSlug(slug: string) {
  return reservedSlugs.has(slug);
}

export async function generateMetadata({
  params
}: DynamicRoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!slug || isReservedSlug(slug)) {
    return buildRouteMetadata(null, undefined, "en");
  }

  const route = await getRouteBySlug(slug, "en");

  if (!route) {
    return buildRouteMetadata(null, undefined, "en");
  }

  const alternates = await getRouteAlternates(route, "en");

  return buildRouteMetadata(route, alternates, "en");
}

export default async function EnglishDynamicRoutePage({
  params
}: DynamicRoutePageProps) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!slug || isReservedSlug(slug)) {
    notFound();
  }

  const route = await getRouteBySlug(slug, "en");

  if (!route) {
    notFound();
  }

  const alternates = await getRouteAlternates(route, "en");
  const [routeReviews, relatedRoutes] = await Promise.all([
    getApprovedReviews(),
    getRelatedRoutesForRoute(route.slug, route.from_city, route.to_city, "en")
  ]);

  return (
    <RoutePageSupabaseClient
      routeData={route}
      routeReviews={routeReviews}
      relatedRoutes={relatedRoutes}
      currentLanguage="en"
      languageLinks={alternates.languageLinks}
    />
  );
}
