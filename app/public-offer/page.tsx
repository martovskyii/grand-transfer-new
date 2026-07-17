import type { Metadata } from "next";
import { BlogStaticShell } from "../../components/blog-static-shell";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Публічна оферта | Grand Transfer",
  description:
    "Публічна оферта Grand Transfer: базові умови замовлення приватних міжнародних трансферів.",
  path: "/public-offer"
});

const sections = [
  {
    title: "1. Предмет оферти",
    text:
      "Ця Публічна оферта визначає базові умови надання послуг з організації приватних трансферів між Україною, Молдовою, Польщею та іншими країнами Європи."
  },
  {
    title: "2. Замовлення трансферу",
    text:
      "Клієнт може залишити заявку на сайті, телефоном або через месенджери. Остаточні умови поїздки, включно з маршрутом, часом подачі, класом авто та вартістю, підтверджуються індивідуально."
  },
  {
    title: "3. Вартість та оплата",
    text:
      "Орієнтовні ціни на сайті мають інформаційний характер. Фінальна вартість залежить від маршруту, дати виїзду, класу авто, кількості пасажирів, багажу та додаткових зупинок."
  },
  {
    title: "4. Права та обов’язки сторін",
    text:
      "Grand Transfer зобов’язується організувати поїздку відповідно до погоджених умов. Клієнт зобов’язується надати коректну інформацію про маршрут, час, кількість пасажирів і контактні дані."
  },
  {
    title: "5. Зміни умов",
    text:
      "Умови цієї оферти можуть оновлюватися. Актуальна редакція розміщується на цій сторінці та діє з моменту публікації."
  }
];

export default function PublicOfferPage() {
  return (
    <BlogStaticShell
      eyebrow="ЮРИДИЧНА ІНФОРМАЦІЯ"
      title="Публічна оферта"
      subtitle="Базові умови замовлення та організації приватних трансферів Grand Transfer."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Публічна оферта" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="grid gap-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8"
            >
              <h2 className="section-title-lux text-[1.45rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text)] md:text-[1.85rem]">
                {section.title}
              </h2>
              <p className="mt-4 max-w-[62rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
                {section.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </BlogStaticShell>
  );
}
