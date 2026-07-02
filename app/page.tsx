import type { Metadata } from "next";
import HomePageClient, { type HomepageRoute } from "./home-page-client";
import { supabase } from "../lib/supabase";
import { buildPageMetadata } from "../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "VIP трансфери Україна — Молдова — Польща | Grand Transfer",
  description:
    "Приватні VIP трансфери з України до Молдови, Польщі та Європи. Комфортні авто, досвідчені водії, допомога на кордоні та бронювання 24/7.",
  path: "/"
});

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

  return (data as HomepageRoute[] | null) || [];
}

export default async function HomePage() {
  const initialHomepageRoutes = await getHomepageRoutes();

  return <HomePageClient initialHomepageRoutes={initialHomepageRoutes} />;
}
