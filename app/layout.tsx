import type { Metadata } from "next";
import type { ReactNode } from "react";
import favicon from "../img/favicon.png";
import "./globals.css";

const defaultSiteUrl = "https://www.grand-transfer.com";
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
      <body>{children}</body>
    </html>
  );
}
