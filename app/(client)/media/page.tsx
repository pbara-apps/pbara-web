import type { Metadata } from "next";
import { MediaPageContent } from "@/components/sections/MediaPageContent";

export const metadata: Metadata = {
  title: "Media Gallery and Resources",
  description:
    "Capturing moments of discipline, faith, and leadership from our Royal Ambassadors association. Videos, photo gallery, and downloadable resources.",
  openGraph: {
    title: "Media & Resources | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/media",
  },
  keywords: ["Gallery", "Videos", "Photos", "Downloads", "Resources", "RA media"],
};

export default function MediaPage() {
  return <MediaPageContent />;
}
