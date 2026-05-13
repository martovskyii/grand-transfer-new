import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import favicon from "../img/favicon.png";
import "./globals.css";

const defaultSiteUrl = "https://www.grand-transfer.com";
const gtmId = "GTM-T6LRC7TX";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(
  /\/+$/,
  ""
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Grand Transfer",
  description: "VIP трансфери між Україною та Молдовою.",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src
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
