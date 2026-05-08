import type { Metadata } from "next";
import { BlogStaticShell } from "@/components/blog-static-shell";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Усі напрямки трансферів | Grand Transfer",
  description:
    "Приватні трансфери між Україною, Молдовою, Польщею, Угорщиною та Румунією з подачею під ваш графік.",
  alternates: {
    canonical: "/routes"
  }
};

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
    .eq("lang", "ua")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[routes-page] Failed to fetch routes:", error);
    return [];
  }

  return (data as RouteDirectoryItem[] | null) || [];
}

export default async function RoutesPage() {
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
      eyebrow="НАПРЯМКИ"
      title="Усі напрямки трансферів"
      subtitle="Приватні трансфери між Україною, Молдовою, Польщею, Угорщиною та Румунією з індивідуальною подачею авто, без попутників і з маршрутом під ваш графік."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Усі напрямки" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
          <p className="max-w-[64rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
            На цій сторінці зібрані актуальні напрямки Grand Transfer для
            приватних поїздок між Україною, Молдовою, Польщею, Угорщиною та
            Румунією. Оберіть місто подачі та перейдіть до маршруту, щоб
            переглянути деталі, орієнтовну вартість і доступні класи авто.
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
                        href={`/${route.slug}`}
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
            Напрямки скоро з’являться.
          </div>
        )}
      </section>
    </BlogStaticShell>
  );
}
