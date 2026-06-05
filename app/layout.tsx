import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: "variable",
});

const baseUrl = "https://pbara.org.ng";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pentecost Baptist Association - Royal Ambassadors",
  url: baseUrl,
  logo: `${baseUrl}/images/ra-logo.png`,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "PBA Royal Ambassadors | Pentecost Baptist Association",
    template: "%s | PBA Royal Ambassadors",
  },
  description:
    "Royal Ambassadors of Nigeria — building godly boys into disciplined men of faith and integrity through the Pentecost Baptist Association.",
  keywords: [
    "Royal Ambassadors",
    "PBA",
    "Pentecost Baptist",
    "Nigeria",
    "Christian youth",
    "RA",
  ],
  openGraph: {
    title: "PBA Royal Ambassadors | Pentecost Baptist Association",
    description:
      "Building godly ambassadors for Christ through discipline, character development, and the Word of God.",
    url: baseUrl,
    siteName: "PBA Royal Ambassadors",
    images: [
      {
        url: "/images/ra-logo.png",
        width: 512,
        height: 512,
        alt: "Royal Ambassadors logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Iosevka+Charon:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-dark font-body antialiased">
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
