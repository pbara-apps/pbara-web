import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found on the PBA Royal Ambassadors website.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <NotFoundView />
      <Footer />
    </>
  );
}
