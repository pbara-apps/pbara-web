import type { EventItem } from "@/types";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import {
  FiUsers,
  FiCalendar,
  // FiAward
} from "react-icons/fi";

export const stats = [
  {
    end: 21,
    label: "Active Chapters",
    suffix: "+",
    icon: HiOutlineBuildingOffice2,
  },
  { end: 500, label: "Total Ambassadors", suffix: "+", icon: FiUsers },
  { end: 14, label: "Years of Impact", suffix: "+", icon: FiCalendar },
  // { end: 15, label: "Awards Won", suffix: "+", icon: FiAward },
];

export const upcomingEvents: EventItem[] = [
  {
    id: "1",
    title: "Inter-chapter football competition",
    category: "Golden Ambassador",
    date: "2026-07-12",
    venue: "Oke odo high senior school ile epo, lagos",
    description:
      "The competition is open to all chapters of the association. Pentecost Baptist association participated in the competition",
    status: "open",
    isPast: false,
  },
  {
    id: "2",
    title: "Annual Royal Ambassadors Camp",
    category: "Golden Ambassador",
    date: "2026-08-06",
    endDate: "2026-08-09",
    venue: "First Baptist Church, Badagry",
    description:
      "A week-long camp focused on spiritual growth, outdoor activities, and leadership development for all age groups.",
    status: "open",
    isPast: false,
  },
  {
    id: "3",
    title: "National Leadership Training Conference",
    category: "Training",
    date: "2026-10-05",
    venue: "Royal Ambassadors of Nigeria",
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
