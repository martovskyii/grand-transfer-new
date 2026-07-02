import type { Metadata } from "next";
import { BlogStaticShell } from "@/components/blog-static-shell";
import { supabase } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Все направления трансферов | Grand Transfer",
  description:
    "Частные трансферы между Украиной, Молдовой, Польшей, Венгрией и Румынией с подачей под ваш график.",
  path: "/ru/routes",
  locale: "ru_RU"
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
    .eq("lang", "ru")
    .order("from_city", { ascending: true })
    .order("to_city", { ascending: true });

  if (error) {
    console.error("[ru-routes-page] Failed to fetch routes:", error);
    return [];
  }

  return (data as RouteDirectoryItem[] | null) || [];
}

const ruNavItems = [
  { label: "ГЛАВНАЯ", href: "/ru" },
  { label: "НАПРАВЛЕНИЯ", href: "/ru#directions" },
  { label: "АВТОПАРК", href: "/avtopark" },
  { label: "КОНТАКТЫ", href: "/kontakty" },
  { label: "О НАС", href: "/pro-kompaniiu" },
  { label: "БЛОГ", href: "/blog" }
];

export default async function RuRoutesPage() {
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
      eyebrow="НАПРАВЛЕНИЯ"
      title="Все направления трансферов"
      subtitle="Частные трансферы между Украиной, Молдовой, Польшей, Венгрией и Румынией с индивидуальной подачей авто, без попутчиков и с маршрутом под ваш график."
      currentLanguage="ru"
      languageLinks={{ ua: "/routes", ru: "/ru/routes" }}
      navItems={ruNavItems}
      breadcrumbs={[
        { label: "Главная", href: "/ru" },
        { label: "Все направления" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
          <p className="max-w-[64rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
            На этой странице собраны актуальные направления Grand Transfer для
            частных поездок между Украиной, Молдовой, Польшей, Венгрией и
            Румынией. Выберите город подачи и перейдите к маршруту, чтобы
            посмотреть детали, ориентировочную стоимость и доступные классы авто.
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
                        href={`/ru/${route.slug}`}
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
            Направления скоро появятся.
          </div>
        )}
      </section>
    </BlogStaticShell>
  );
}
