import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoutePageSupabaseClient from "@/components/route-page-supabase-client";
import {
  buildRouteMetadata,
  getRouteAlternates,
  getApprovedReviews,
  getRelatedRoutesForRoute,
  getRouteBySlug,
  type DynamicRoutePageProps
} from "@/lib/route-page-data";

export const dynamic = "force-dynamic";

const reservedSlugs = new Set([
  "api",
  "avtopark",
  "blog",
  "kontakty",
  "legal-information",
  "about",
  "pro-kompaniiu",
  "privacy-policy",
  "public-offer",
  "routes",
  "ru"
]);

function isReservedSlug(slug: string) {
  return reservedSlugs.has(slug);
}

export async function generateMetadata({
  params
}: DynamicRoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!slug || isReservedSlug(slug)) {
    return buildRouteMetadata(null);
  }

  const route = await getRouteBySlug(slug, "ua");

  if (!route) {
    return buildRouteMetadata(null);
  }

  const alternates = await getRouteAlternates(route, "ua");

  return buildRouteMetadata(route, alternates, "ua");
}

export default async function CleanDynamicRoutePage({
  params
}: DynamicRoutePageProps) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!slug || isReservedSlug(slug)) {
    notFound();
  }

  const route = await getRouteBySlug(slug, "ua");

  if (!route) {
    notFound();
  }

  const alternates = await getRouteAlternates(route, "ua");
  const [routeReviews, relatedRoutes] = await Promise.all([
    getApprovedReviews(),
    getRelatedRoutesForRoute(route.slug, route.from_city, route.to_city, "ua")
  ]);

  return (
    <RoutePageSupabaseClient
      routeData={route}
      routeReviews={routeReviews}
      relatedRoutes={relatedRoutes}
      currentLanguage="ua"
      languageLinks={alternates.languageLinks}
    />
  );
}
