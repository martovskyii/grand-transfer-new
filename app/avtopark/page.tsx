import type { Metadata } from "next";
import AvtoparkPage from "./avtopark-client";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Автопарк Grand Transfer — авто для VIP трансферів",
  description:
    "Оберіть авто для приватного трансферу: комфортні седани, бізнес-клас, преміум авто та мінівени для поїздок Україною, Молдовою, Польщею та Європою.",
  path: "/avtopark"
});

export default function Page() {
  return <AvtoparkPage />;
}
