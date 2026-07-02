"use client";

import { Spinner } from "@heroui/react";
import { useGetPublicEvents } from "@/service/apis/event";
import {
  upcomingEvents as fallbackUpcoming,
  pastEvents as fallbackPast,
} from "@/data/events";
import type { EventItem } from "@/types";
import { PublicEventsView } from "./PublicEventsView";

export function PublicEventsPage() {
  const { data, isLoading, isError } = useGetPublicEvents();

  let upcoming: EventItem[] = fallbackUpcoming;
  let past: EventItem[] = fallbackPast;

  if (data && data.length > 0) {
    upcoming = data.filter((e) => !e.isPast);
    past = data.filter((e) => e.isPast);
  } else if (isError) {
    upcoming = fallbackUpcoming;
    past = fallbackPast;
  } else if (data) {
    upcoming = [];
    past = [];
  }

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return <PublicEventsView upcomingEvents={upcoming} pastEvents={past} />;
}
