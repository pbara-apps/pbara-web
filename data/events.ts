import type { EventItem } from "@/types";

export const upcomingEvents: EventItem[] = [
  {
    id: "1",
    title: "Annual Royal Ambassadors Camp",
    category: "Golden Ambassador",
    date: "2024-08-15",
    venue: "Baptist Camp Grounds",
    description:
      "A week-long camp focused on spiritual growth, outdoor activities, and leadership development for all age groups.",
    status: "open",
    isPast: false,
  },
  {
    id: "2",
    title: "Leadership Training Workshop",
    category: "Training",
    date: "2024-09-05",
    venue: "Association Headquarters",
    description:
      "Intensive workshop for chapter commanders and counselors on discipline, program delivery, and youth mentorship.",
    status: "open",
    isPast: false,
  },
];

export const pastEvents: EventItem[] = [
  {
    id: "3",
    title: "Patrons investiture ceremony",
    category: "Ceremony",
    date: "September 2025",
    venue: "Gateway Baptist Church, Alagbado, Lagos",
    description:
      "Annual awards ceremony honoring outstanding ambassadors and chapters.",
    status: "completed",
    isPast: true,
    image: "/images/patrons.jpeg",
  },
  {
    id: "4",
    title: "Inter-Chapter Sports Meet",
    category: "Sports",
    date: "May 2024",
    venue: "Community Stadium",
    description:
      "Friendly competition fostering teamwork and physical fitness across chapters.",
    status: "completed",
    isPast: true,
  },
  {
    id: "5",
    title: "Community Service Outreach",
    category: "Outreach",
    date: "April 2024",
    venue: "Local Communities",
    description:
      "Multi-chapter community service initiative serving the needy.",
    status: "completed",
    isPast: true,
  },
];

export const allEvents = [...upcomingEvents, ...pastEvents];
