"use client";

import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { ExecutivesSkeleton } from "@/components/sections/CurrentExecutivesGrid";
import { formatChurchName } from "@/lib/format";
import { useGetPublicCounsellors } from "@/service/apis/church";
import { Eyebrow } from "../site/primitives";

/**
 * Current church counsellors, from the admin portal. Each church has one
 * counsellor who looks after its chapters. Hidden if the list can't load.
 */
export function ChapterCounsellorsGrid() {

  const { data = [], isLoading, isError } = useGetPublicCounsellors();

  if (isLoading) return <ExecutivesSkeleton count={4} />;
  if (isError) return null;
  if (data.length === 0) {
    return null
  }

  return (
    <div className="container-site">
      <div className="mb-12 max-w-2xl">
        <Eyebrow index="CC">In every church</Eyebrow>
        <h2 id="counsellors-heading" className="display-md mt-5 text-ink">
          Chapter Counsellors
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Each church has a counsellor who guides its Royal Ambassadors chapters, supports their
          presidents and secretaries, and keeps the association connected to every congregation.
        </p>
      </div>
      <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 min-[400px]:gap-x-5 md:grid-cols-3 md:gap-y-12 lg:grid-cols-4">
        {data?.map((c) => (
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
    </div>
  );
}
