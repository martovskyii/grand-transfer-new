import type { Metadata } from "next";
import { BlogStaticShell } from "@/components/blog-static-shell";
import { supabase } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "All transfer routes | Grand Transfer",
  description:
    "Private transfers between Ukraine, Moldova, Poland, Hungary and Romania with pickup matched to your schedule.",
  path: "/en/routes",
  locale: "en_US"
});

type RouteDirectoryItem = {
  slug: string | null;
  from_city: string | null;
  to_city: string | null;
};

async function getDirectoryRoutes(): Promise<RouteDirectoryItem[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("routes")
    .select("slug, from_city, to_city")
    .eq("is_active", true)
    .eq("lang", "en")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[en-routes-page] Failed to fetch routes:", error);
    return [];
  }

  return (data as RouteDirectoryItem[] | null) || [];
}

export default async function EnRoutesPage() {
  const routes = await getDirectoryRoutes();
  const groupedRoutes = routes.reduce<Map<string, RouteDirectoryItem[]>>((acc, route) => {
    const slug = typeof route.slug === "string" ? route.slug.trim() : "";
    const fromCity = typeof route.from_city === "string" ? route.from_city.trim() : "";
    const toCity = typeof route.to_city === "string" ? route.to_city.trim() : "";

    if (!slug || !fromCity || !toCity) {
      return acc;
    }

    const bucket = acc.get(fromCity) || [];
    bucket.push({ ...route, slug, from_city: fromCity, to_city: toCity });
    acc.set(fromCity, bucket);

    return acc;
  }, new Map());

  const routeGroups = Array.from(groupedRoutes.entries());

  return (
    <BlogStaticShell
      eyebrow="ROUTES"
      title="All transfer routes"
      subtitle="Private transfers between Ukraine, Moldova, Poland, Hungary and Romania with individual vehicle pickup, no shared passengers and a route matched to your schedule."
      currentLanguage="en"
      languageLinks={{ ua: "/routes", ru: "/ru/routes", en: "/en/routes" }}
      breadcrumbs={[
        { label: "Home", href: "/en" },
        { label: "All routes" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
          <p className="max-w-[64rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
            This page contains active Grand Transfer routes for private trips
            between Ukraine, Moldova, Poland, Hungary and Romania. Choose a
            pickup city and open a route page to view details, approximate
            pricing and available vehicle classes.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        {routeGroups.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {routeGroups.map(([fromCity, items]) => (
              <article
                key={fromCity}
                className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-8"
              >
                <p className="eyebrow-lux">{fromCity}</p>
                <ul className="mt-5 grid gap-3">
                  {items.map((route) => (
                    <li key={route.slug}>
                      <a
                        href={`/en/${route.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[0.93rem] text-[rgba(247,243,234,0.9)] transition hover:border-[rgba(230,213,195,0.28)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--soft-gold)]"
                      >
                        <span>
                          {route.from_city} → {route.to_city}
                        </span>
                        <span className="text-[var(--soft-gold)] transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel-soft rounded-[28px] px-5 py-6 text-[0.96rem] leading-[1.8] text-[var(--muted)] sm:px-7 md:px-9 md:py-8">
            Routes will appear soon.
          </div>
        )}
      </section>
    </BlogStaticShell>
  );
}
