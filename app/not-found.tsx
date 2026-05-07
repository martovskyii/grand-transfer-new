import type { Metadata } from "next";
import { NotFoundPage } from "../components/not-found-page";

export const metadata: Metadata = {
  title: "404 | Grand Transfer",
  description:
    "Сторінка не знайдена. Замовте приватний трансфер Україна — Молдова — Польща."
};

export default function NotFound() {
  return <NotFoundPage />;
}
