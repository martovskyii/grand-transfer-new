import type { Metadata } from "next";
import { preload } from "react-dom";
import HomePageClient, { type HomepageRoute } from "./home-page-client";
import { supabase } from "../lib/supabase";
import { buildPageMetadata } from "../lib/seo";
import desktopHero from "../img/general_screen.webp";
import mobileHero from "../img/mob.webp";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "VIP трансфери Україна — Молдова — Польща | Grand Transfer",
  description:
    "Приватні VIP трансфери з України до Молдови, Польщі та Європи. Комфортні авто, досвідчені водії, допомога на кордоні та бронювання 24/7.",
  path: "/"
});

const routeDestinationPriorityTiers = [
  ["кишинів", "кишинёв", "кишинев", "chisinau", "kishinev", "kyshyniv"],
  ["варшава", "warsaw", "warszawa", "varshava"],
  ["київ", "киев", "kyiv", "kiev"]
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

        return (left.to_city || "").localeCompare(right.to_city || "", "uk");
      })
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
    .eq("lang", "ua")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[homepage] Failed to fetch routes:", error);
    return [];
  }

  return prepareHomepageRoutePreview((data as HomepageRoute[] | null) || []);
}

export default async function HomePage() {
  preloadHomeHero();

  const initialHomepageRoutes = await getHomepageRoutes();

  return <HomePageClient initialHomepageRoutes={initialHomepageRoutes} />;
}
