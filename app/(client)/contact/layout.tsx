import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact the Royal Ambassadors headquarters. Send a message or find our address, phone, and email.",
  openGraph: {
    title: "Contact | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/contact",
  },
  keywords: ["Contact", "Headquarters", "PBA RA", "Get in touch"],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
