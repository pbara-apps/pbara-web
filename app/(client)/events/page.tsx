import type { Metadata } from "next";
import { PublicEventsPage } from "@/components/sections/PublicEventsPage";

export const metadata: Metadata = {
  title: "Events and Programs",
  alternates: {
    canonical: "/events",
  },
  description:
    "Upcoming Royal Ambassadors events, camps, training workshops, and past events archive. Strengthening faith and discipline through fellowship and service.",
  openGraph: {
    title: "Events and Programs | PBA Royal Ambassadors",
    url: "https://www.pbara.org.ng/events",
  },
  keywords: ["Events", "Programs", "Camps", "Training", "RA calendar"],
};

export default function EventsPage() {
  return <PublicEventsPage />;
}
