import type { Metadata } from "next";
import HomePageClient, { type HomepageRoute } from "../home-page-client";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grand Transfer | VIP трансферы Украина — Молдова — Польша",
  description: "Частные VIP трансферы между Украиной, Молдовой и Польшей.",
  alternates: {
    canonical: "/ru"
  }
};

async function getHomepageRoutes(): Promise<HomepageRoute[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("routes")
    .select("slug, from_city, to_city, price_from")
    .eq("is_active", true)
    .eq("lang", "ru")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[homepage-ru] Failed to fetch routes:", error);
    return [];
  }

  return (data as HomepageRoute[] | null) || [];
}

export default async function RussianHomePage() {
  const initialHomepageRoutes = await getHomepageRoutes();

  return (
    <HomePageClient
      initialHomepageRoutes={initialHomepageRoutes}
      currentLanguage="ru"
      routeLanguage="ru"
      routeHrefPrefix="/ru"
    />
  );
}
