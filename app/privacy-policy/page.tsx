import type { Metadata } from "next";
import { BlogStaticShell } from "../../components/blog-static-shell";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Політика конфіденційності | Grand Transfer",
  description:
    "Політика конфіденційності Grand Transfer: обробка заявок, контактних даних та комунікація з клієнтами.",
  path: "/privacy-policy"
});

const sections = [
  {
    title: "1. Загальні положення",
    text:
      "Ця Політика конфіденційності описує, як Grand Transfer обробляє інформацію, яку клієнт залишає на сайті під час замовлення трансферу або звернення через форму, телефон чи месенджери."
  },
  {
    title: "2. Які дані ми можемо отримувати",
    text:
      "Ми можемо отримувати ім’я, номер телефону, маршрут поїздки, дату виїзду, кількість пасажирів, побажання до класу авто та коментарі, які клієнт добровільно передає через сайт."
  },
  {
    title: "3. Для чого використовуються дані",
    text:
      "Контактні дані використовуються для уточнення маршруту, розрахунку вартості, підтвердження поїздки, комунікації з клієнтом та покращення якості сервісу."
  },
  {
    title: "4. Передача даних третім особам",
    text:
      "Ми не продаємо персональні дані. Інформація може передаватися лише водіям або партнерам, які безпосередньо залучені до організації трансферу, у межах необхідного для виконання замовлення."
  },
  {
    title: "5. Зв’язок з нами",
    text:
      "Якщо у вас є питання щодо обробки персональних даних, напишіть нам на email або зверніться через контактні канали, вказані на сайті."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <BlogStaticShell
      eyebrow="ЮРИДИЧНА ІНФОРМАЦІЯ"
      title="Політика конфіденційності"
      subtitle="Базові правила обробки контактних даних клієнтів Grand Transfer."
      breadcrumbs={[
        { label: "Головна", href: "/" },
        { label: "Політика конфіденційності" }
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
