import { permanentRedirect } from "next/navigation";
import type { DynamicRoutePageProps } from "@/lib/route-page-data";

export default async function LegacyDynamicRouteRedirect({
  params
}: DynamicRoutePageProps) {
  const { slug } = await params;

  permanentRedirect(`/${slug}`);
}
