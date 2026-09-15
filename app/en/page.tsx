import type { Metadata } from "next";
import { preload } from "react-dom";
import HomePageClient, { type HomepageRoute } from "../home-page-client";
import { supabase } from "../../lib/supabase";
import { buildPageMetadata } from "../../lib/seo";
import desktopHero from "../../img/general_screen.webp";
import mobileHero from "../../img/mob.webp";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Grand Transfer | VIP transfers Ukraine — Moldova — Poland",
  description:
    "Private VIP transfers between Ukraine, Moldova and Poland with premium vehicles and 24/7 booking.",
  path: "/en",
  locale: "en_US"
});

const routePreviewLimitPerCity = 10;

const routeDestinationPriorityTiers = [
  ["chisinau", "kishinev", "kyshyniv"],
  ["warsaw", "warszawa", "varshava"],
  ["kyiv", "kiev"]
];

function getRouteDestinationPriority(toCity: string | null) {
  const normalized = (toCity || "").trim().toLowerCase();

  if (!normalized) {
    return routeDestinationPriorityTiers.length;
  }

  const tierIndex = routeDestinationPriorityTiers.findIndex((tier) =>
    tier.includes(normalized)
  );

  return tierIndex === -1 ? routeDestinationPriorityTiers.length : tierIndex;
}

function prepareHomepageRoutePreview(routes: HomepageRoute[]) {
  const groupedRoutes = new Map<string, HomepageRoute[]>();

  for (const route of routes) {
    const fromCity = route.from_city?.trim();

    if (!fromCity) {
      continue;
    }

    const currentRoutes = groupedRoutes.get(fromCity) || [];
    currentRoutes.push(route);
    groupedRoutes.set(fromCity, currentRoutes);
  }

  return Array.from(groupedRoutes.values()).flatMap((routesFromCity) =>
    routesFromCity
      .sort((left, right) => {
        const leftPriority = getRouteDestinationPriority(left.to_city);
        const rightPriority = getRouteDestinationPriority(right.to_city);

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return (left.to_city || "").localeCompare(right.to_city || "", "en");
      })
      .slice(0, routePreviewLimitPerCity)
  );
}

function preloadHomeHero() {
  preload(mobileHero.src, {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 767px)",
    type: "image/webp"
  });
  preload(desktopHero.src, {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 768px)",
    type: "image/webp"
  });
}

async function getHomepageRoutes(): Promise<HomepageRoute[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("routes")
    .select("slug, from_city, to_city, price_from, duration")
    .eq("is_active", true)
    .eq("lang", "en")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[homepage-en] Failed to fetch routes:", error);
    return [];
  }

  return prepareHomepageRoutePreview((data as HomepageRoute[] | null) || []);
}

export default async function EnglishHomePage() {
  preloadHomeHero();

  const initialHomepageRoutes = await getHomepageRoutes();

  return (
    <HomePageClient
      initialHomepageRoutes={initialHomepageRoutes}
      currentLanguage="en"
      routeHrefPrefix="/en"
    />
  );
}
