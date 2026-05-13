import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import routeHeroDesktop from "../../../img/main-2-screen-desk.png";
import { BlogStaticShell } from "../../../components/blog-static-shell";
import { PHONE_TEL_HREF, TELEGRAM_URL } from "../../../lib/contact-links";

export const metadata: Metadata = {
  title: "Трансфер Одеса — Кишинів: ціна, маршрут і час у дорозі",
  description:
    "Як замовити приватний трансфер Одеса — Кишинів, скільки коштує поїздка, скільки часу займає дорога та як проходить маршрут до Молдови.",
  alternates: {
    canonical: "/blog/odesa-kyshyniv-transfer"
  }
};

export default function OdesaKyshynivTransferArticlePage() {
  return (
    <BlogStaticShell
      eyebrow="БЛОГ"
      title="Трансфер Одеса — Кишинів: як швидко та комфортно дістатися"
      subtitle="Корисна інформація про маршрут, час у дорозі, проходження кордону та переваги приватної поїздки."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Блог", href: "/blog" },
        { label: "Трансфер Одеса — Кишинів" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft overflow-hidden rounded-[30px]">
          <div className="relative min-h-[260px] md:min-h-[360px]">
            <Image
              src={routeHeroDesktop}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.16)_0%,rgba(7,9,8,0.82)_100%)]" />
          </div>
          <div className="px-5 py-6 sm:px-7 md:px-10 md:py-10">
            <p className="max-w-[58rem] text-[1rem] leading-[1.85] text-[var(--muted)]">
              Маршрут Одеса — Кишинів є одним із найпопулярніших напрямків для
              приватних поїздок між Україною та Молдовою. Приватний трансфер
              дозволяє їхати без попутників, з індивідуальним графіком,
              комфортним авто та допомогою на ключових етапах маршруту.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="grid gap-6">
          <article className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
            <h2 className="section-title-lux text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2rem]">
              Скільки часу займає дорога Одеса — Кишинів
            </h2>
            <p className="mt-4 max-w-[58rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
              У середньому поїздка займає близько 3–4 годин. Тривалість
              залежить від часу виїзду, трафіку, погодних умов та ситуації на
              кордоні.
            </p>
          </article>

          <article className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
            <h2 className="section-title-lux text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2rem]">
              Скільки коштує трансфер Одеса — Кишинів
            </h2>
            <p className="mt-4 max-w-[58rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
              Орієнтовна вартість приватного трансферу Одеса — Кишинів стартує
              від €170. Фінальна ціна залежить від класу авто, кількості
              пасажирів, багажу, часу подачі та додаткових побажань.
            </p>
          </article>

          <article className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
            <h2 className="section-title-lux text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2rem]">
              Як проходить маршрут і кордон
            </h2>
            <p className="mt-4 max-w-[58rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
              Водій забирає пасажира за погодженою адресою в Одесі та доставляє
              до потрібної адреси в Кишиневі або до аеропорту. На маршруті
              можна погодити зупинки для кави, відпочинку або інших потреб.
            </p>
          </article>

          <article className="panel-soft rounded-[28px] px-5 py-6 sm:px-7 md:px-9 md:py-8">
            <h2 className="section-title-lux text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2rem]">
              Чому обирають приватний трансфер
            </h2>
            <p className="mt-4 max-w-[58rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
              Приватний трансфер підходить для тих, хто хоче їхати без
              пересадок, без попутників і без прив’язки до розкладу. Це зручний
              варіант для бізнес-поїздок, сімейних маршрутів, поїздок в
              аеропорт або індивідуальних подорожей.
            </p>
          </article>
        </div>
      </section>

      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-8 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-[38rem]">
            <p className="eyebrow-lux">КОНТАКТ</p>
            <h2 className="section-title-lux mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.35rem]">
              Потрібен трансфер Одеса — Кишинів?
            </h2>
            <p className="mt-4 text-[0.97rem] leading-[1.85] text-[var(--muted)]">
              Напишіть нам у Telegram або залиште заявку — ми уточнимо маршрут,
              клас авто та фінальну вартість поїздки.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-outline inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
            >
              Написати в Telegram
            </Link>
            <a
              href={PHONE_TEL_HREF}
              className="button-gold inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.1em]"
            >
              Зателефонувати
            </a>
          </div>
        </div>
      </section>
    </BlogStaticShell>
  );
}
