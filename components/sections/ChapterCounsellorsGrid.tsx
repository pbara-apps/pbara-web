"use client";

import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { ExecutivesSkeleton } from "@/components/sections/CurrentExecutivesGrid";
import { formatChurchName } from "@/lib/format";
import { useGetPublicCounsellors } from "@/service/apis/church";

/**
 * Current church counsellors, from the admin portal. Each church has one
 * counsellor who looks after its chapters. Hidden if the list can't load.
 */
export function ChapterCounsellorsGrid() {
  const { data = [], isLoading, isError } = useGetPublicCounsellors();

  if (isLoading) return <ExecutivesSkeleton count={4} />;
  if (isError) return null;
  if (data.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-6 py-14 text-center text-sm text-text-muted">
        Chapter counsellors will appear here once they are set in the admin portal.
      </p>
    );
  }

  return (
    <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 min-[400px]:gap-x-5 md:grid-cols-3 md:gap-y-12 lg:grid-cols-4">
      {data.map((c) => (
        <StaggerItem key={c.id}>
          <ExecutiveCard
            executive={{
              id: c.id,
              name: c.name,
              image: c.photo,
              position: "Church Counsellor",
              church: formatChurchName(c.church.name),
            }}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
