import type { Metadata } from "next";
import ProKompaniiuPage from "./pro-kompaniiu-client";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Про Grand Transfer — приватні міжнародні трансфери",
  description:
    "Grand Transfer організовує приватні міжнародні поїздки з України до Молдови, Польщі та Європи. Досвідчені водії, комфортні авто та підтримка на всьому маршруті.",
  path: "/pro-kompaniiu"
});

export default function Page() {
  return <ProKompaniiuPage />;
}
