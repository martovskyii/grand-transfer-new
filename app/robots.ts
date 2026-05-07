import type { MetadataRoute } from "next";

const defaultSiteUrl = "https://www.grand-transfer.com";
const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(
  /\/+$/,
  ""
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
