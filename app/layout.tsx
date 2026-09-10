import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import favicon from "../img/favicon.png";
import { JsonLd } from "../components/json-ld";
import { buildOrganizationSchema } from "../lib/structured-data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL
} from "../lib/seo";
import "./globals.css";

const gtmId = "GTM-T6LRC7TX";
const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${SITE_NAME} — VIP трансфери між Україною та Європою`,
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "uk_UA",
    url: siteUrl,
    images: [DEFAULT_OG_IMAGE]
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE.url]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <JsonLd data={buildOrganizationSchema()} />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`
          }}
        />
      </body>
    </html>
  );
}
