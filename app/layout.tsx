import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
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
    default:
      "Royal Ambassadors of Nigeria | Pentecost Baptist Association (PBA)",
    template: "%s | PBA Royal Ambassadors",
  },
  alternates: {
    canonical: "/",
  },
  description:
    "Royal Ambassadors of Nigeria, Pentecost Baptist Association — building godly boys into disciplined men of faith and integrity through Christian discipleship, leadership, camping, missions, and community service.",
  keywords: [
    "PBA Royal Ambassadors",
    "Royal Ambassadors Nigeria",
    "Royal Ambassadors of Nigeria",
    "Pentecost Baptist Association",
    "Pentecost Baptist Association Royal Ambassadors",
    "Royal Ambassadors Lagos",
    "Royal Ambassadors Pentecost Baptist Association",
    "Baptist Boys Organization",
    "Royal Ambassadors Lagos West Baptist Conference",
    "Lagos West Baptist Conference",
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
  verification: {
    google: "1SpDl3NFPdCg3E0PQGKP3rMZinMvfgL1YSxuz6Cjaoc",
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
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
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
