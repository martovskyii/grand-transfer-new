import HomePageClient, { type HomepageRoute } from "./home-page-client";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

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
