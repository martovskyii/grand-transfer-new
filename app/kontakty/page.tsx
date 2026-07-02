import type { Metadata } from "next";
import KontaktyPage from "./kontakty-client";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Контакти Grand Transfer — замовити VIP трансфер",
  description:
    "Звʼяжіться з Grand Transfer для бронювання приватного міжнародного трансферу. Телефон, месенджери, соціальні мережі та підтримка 24/7.",
  path: "/kontakty"
});

export default function Page() {
  return <KontaktyPage />;
}
