import {
  LuBriefcase,
  LuCalendar,
  LuCalendarPlus,
  LuFilePlus,
  LuImage,
  LuMessageSquare,
  LuNetwork,
  LuNewspaper,
  LuReply,
  LuUsers,
} from "react-icons/lu";
import {
  ActivityFeed,
  type ActivityEntry,
} from "@/components/admin/dashboard/ActivityFeed";
import { DirectorDeskPreview } from "@/components/admin/dashboard/DirectorDeskPreview";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import {
  QuickActions,
  type QuickAction,
} from "@/components/admin/dashboard/QuickActions";
import { SystemStatus } from "@/components/admin/dashboard/SystemStatus";
import WelcomeHeader from "@/components/admin/dashboard/WelcomeHeader";

export const metadata = {
  title: "Dashboard",
};

const kpis = [
  {
    label: "Total Chapters",
    value: "142",
    icon: LuNetwork,
    trend: "up" as const,
    trendValue: "12%",
  },
  {
    label: "Active Officers",
    value: "28",
    icon: LuUsers,
    trend: "up" as const,
    trendValue: "4%",
  },
  {
    label: "Upcoming Events",
    value: "15",
    icon: LuCalendar,
    trend: "flat" as const,
    trendValue: "",
  },
  {
    label: "Published News",
    value: "312",
    icon: LuNewspaper,
    trend: "up" as const,
    trendValue: "24%",
  },
  {
    label: "Gallery Items",
    value: "1,402",
    icon: LuImage,
    trend: "up" as const,
    trendValue: "8%",
  },
  {
    label: "Unread Messages",
    value: "12",
    icon: LuMessageSquare,
    trend: "alert" as const,
    trendValue: "7 New",
  },
];

const activity: ActivityEntry[] = [
  {
    id: "1",
    kind: "publish",
    message: (
      <>
        Admin <span className="font-semibold">Olusola Mark</span> published a
        news article
      </>
    ),
    detail: "Building the Future: Youth Conference 2024 Highlights",
    timestamp: "24 minutes ago",
  },
  {
    id: "2",
    kind: "upload",
    message: (
      <>
        <span className="font-semibold">Victoria Peters</span> added 14 new
        photos to <span className="font-semibold">General Assembly 2023</span>
      </>
    ),
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    kind: "update",
    message: (
      <>
        <span className="font-semibold">Executive Office</span> updated the
        event <span className="font-semibold">Leadership Retreat</span>
      </>
    ),
    timestamp: "Yesterday at 4:12 PM",
  },
  {
    id: "4",
    kind: "user",
    message: (
      <>
        New user <span className="font-semibold">Rev. David Mensah</span> was
        assigned to the <span className="font-semibold">Chapters</span> role
      </>
    ),
    timestamp: "Oct 24, 2023",
  },
];

const quickActions: QuickAction[] = [
  { label: "New News Post", icon: LuFilePlus, href: "/admin/news/new" },
  { label: "New Event", icon: LuCalendarPlus, href: "/admin/event/new" },
  { label: "Reply to Latest Message", icon: LuReply, href: "/admin/message" },
  { label: "Add Office", icon: LuBriefcase, href: "/admin/office/new" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <WelcomeHeader />

      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-6">
          <div
            aria-label="Key metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
          >
            {kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>
          <ActivityFeed entries={activity} />
        </div>
        <div className="space-y-6">
          <DirectorDeskPreview />
          <QuickActions actions={quickActions} />
          <SystemStatus />
        </div>
      </section>
    </div>
  );
}
