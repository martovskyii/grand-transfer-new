import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import desktopHero from "../../img/desktop.png";
import { BlogStaticShell } from "../../components/blog-static-shell";

export const metadata: Metadata = {
  title: "Блог про трансфери та поїздки",
  description:
    "Корисна інформація про маршрути, кордон та поїздки між Україною та Європою.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  return (
    <BlogStaticShell
      eyebrow="БЛОГ"
      title="Блог про трансфери та поїздки"
      subtitle="Корисна інформація про маршрути, кордон та поїздки між Україною та Європою."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Блог" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <article className="panel-soft overflow-hidden rounded-[30px] md:grid md:grid-cols-[0.42fr_0.58fr]">
          <div className="relative min-h-[240px]">
            <Image
              src={desktopHero}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.12)_0%,rgba(7,9,8,0.8)_100%)]" />
          </div>
          <div className="p-5 sm:p-6 md:p-8">
            <p className="eyebrow-lux">ОСНОВНИЙ МАРШРУТ</p>
            <h2 className="section-title-lux mt-4 text-[1.95rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.25rem]">
              Трансфер Одеса — Кишинів: як швидко та комфортно дістатися
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.96rem] leading-[1.8] text-[var(--muted)]">
              Розбираємо маршрут Одеса — Кишинів, час у дорозі, вартість
              трансферу, проходження кордону та переваги приватної поїздки.
            </p>
            <Link
              href="/blog/odesa-kyshyniv-transfer"
              className="button-outline mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
            >
              Читати статтю
            </Link>
          </div>
        </article>
      </section>
    </BlogStaticShell>
  );
}
