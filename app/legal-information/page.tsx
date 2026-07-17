import type { Metadata } from "next";
import { BlogStaticShell } from "../../components/blog-static-shell";
import { EMAIL_ADDRESS, PHONE_DISPLAY } from "../../lib/contact-links";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Юридична інформація | Grand Transfer",
  description:
    "Юридична інформація Grand Transfer: контактні дані, адреса для звернень та базова інформація про сервіс.",
  path: "/legal-information"
});

const companyDetails = [
  { label: "Назва сервісу", value: "Grand Transfer" },
  { label: "Напрям діяльності", value: "Організація приватних міжнародних трансферів" },
  { label: "Телефон", value: PHONE_DISPLAY },
  { label: "Email", value: EMAIL_ADDRESS },
  {
    label: "Адреса офісу",
    value: "Польський узвіз, 11, Одеса, Одеська область, 65000"
  }
];

const trustItems = [
  {
    title: "Водії",
    text:
      "До поїздок залучаються досвідчені водії, які працюють з міжміськими та міжнародними маршрутами."
  },
  {
    title: "Документи та авто",
    text:
      "Перед поїздкою узгоджується клас авто, маршрут і ключові умови. Автомобілі допускаються до рейсів з урахуванням технічного стану та базових вимог безпеки."
  },
  {
    title: "Страхування",
    text:
      "Поїздки виконуються на автомобілях з обов’язковими документами та страховим покриттям відповідно до вимог законодавства."
  },
  {
    title: "Маршрут і кордон",
    text:
      "На міжнародних маршрутах водій допомагає зорієнтуватися під час поїздки, зупинок та проходження прикордонного контролю."
  }
];

export default function LegalInformationPage() {
  return (
    <BlogStaticShell
      eyebrow="ЮРИДИЧНА ІНФОРМАЦІЯ"
      title="Юридична інформація"
      subtitle="Контактні та організаційні дані сервісу Grand Transfer."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Юридична інформація" }
      ]}
    >
      <section className="relative z-10 mt-10 md:mt-12 xl:mt-14">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-9">
          <div className="grid gap-4 md:grid-cols-2">
            {companyDetails.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[rgba(216,185,130,0.12)] bg-[rgba(255,255,255,0.025)] px-4 py-4"
              >
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  {item.label}
                </p>
                <p className="mt-2 text-[0.98rem] leading-[1.75] text-[rgba(247,243,234,0.86)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-[64rem] text-[0.95rem] leading-[1.85] text-[var(--muted)]">
            Інформація на цій сторінці є базовою довідковою інформацією для
            клієнтів, рекламних платформ та партнерів. Реквізити та службові
            дані можуть оновлюватися після уточнення юридичної інформації
            компанії.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-6 md:mt-8">
        <div className="panel-soft rounded-[30px] px-5 py-6 sm:px-7 md:px-9 md:py-9">
          <p className="eyebrow-lux">ДОВІРА ТА БЕЗПЕКА</p>
          <h2 className="section-title-lux mt-4 text-[1.8rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--text)] md:text-[2.3rem]">
            Водії, документи та міжнародні маршрути
          </h2>
          <p className="mt-4 max-w-[62rem] text-[0.97rem] leading-[1.85] text-[var(--muted)]">
            Для трансферів між Україною, Молдовою та країнами Європи важливі не
            лише комфорт авто, а й зрозуміла організація поїздки, коректні
            документи та досвід водія на маршруті.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {trustItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[20px] border border-[rgba(216,185,130,0.12)] bg-[rgba(255,255,255,0.025)] px-4 py-4"
              >
                <h3 className="text-[1.02rem] font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-[1.78] text-[var(--muted)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </BlogStaticShell>
  );
}
