"use client";

import { useRouter } from "next/navigation";
import {
  LuBriefcase,
  LuCalendar,
  LuImage,
  LuNetwork,
  LuNewspaper,
  LuUsers,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
import { useGetAdminDashboard } from "@/service/apis/admin";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { DashboardActivityItem } from "@/types/admin-dashboard";
import { canWriteAdminContent } from "@/types/user";

dayjs.extend(relativeTime);

function mapActivity(item: DashboardActivityItem): ActivityEntry {
  return {
    id: item.id,
    kind: item.action === "deleted" ? "publish" : item.action === "updated" ? "update" : "upload",
    message: (
      <>
        <span className="font-semibold capitalize">{item.action}</span>{" "}
        <span className="capitalize">{item.kind}</span>:{" "}
        <span className="font-semibold">{item.title}</span>
      </>
    ),
    detail: item.subtitle ? `By ${item.subtitle}` : undefined,
    timestamp: item.timestamp ? dayjs(item.timestamp).fromNow() : "—",
  };
}

export function AdminDashboardContent() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const canManage = canWriteAdminContent(user?.role);
  const quickActions: QuickAction[] = [
    { label: "Create News", icon: LuNewspaper, href: "/admin/news" },
    { label: "Create Event", icon: LuCalendar, href: "/admin/event" },
    { label: "Add Gallery Item", icon: LuImage, href: "/admin/gallery" },
    { label: "Manage Executives", icon: LuUsers, href: "/admin/executive" },
  ].map((action) => ({
    ...action,
    disabled: !canManage,
    disabledReason: "Your role does not allow content creation.",
  }));
  const { data, isLoading, isError, refetch } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3">
        <Spinner color="primary" size="lg" />
        <p className="text-sm text-text-muted">Loading dashboard metrics…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-rose-600">Unable to load dashboard data.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const activity = data.recentActivity.map(mapActivity);

  return (
    <div className="space-y-6 lg:space-y-8">
      <WelcomeHeader />

      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-6">
          <div
            aria-label="Key metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
          >
            <KpiCard label="Published News" value={data.publishedNews} icon={LuNewspaper} />
            <KpiCard label="Upcoming Events" value={data.upcomingEvents} icon={LuCalendar} />
            <KpiCard label="Gallery Items" value={data.activeGallery} icon={LuImage} />
            <KpiCard label="Registered Offices" value={data.totalOffices} icon={LuBriefcase} />
            <KpiCard label="Active Officers" value={data.activeExecutives} icon={LuUsers} />
            <KpiCard label="Total Chapters" value={data.totalChapters} icon={LuNetwork} />
          </div>

          <ActivityFeed
            entries={activity}
            onViewAll={() => router.push("/admin/audit")}
          />
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
