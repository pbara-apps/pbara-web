"use client";

import { Spinner } from "@heroui/react";
import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import { useGetPublicExecutives } from "@/service/apis/executive";
import { executives as fallbackExecutives } from "@/data/executives";

export function CurrentExecutivesGrid() {
  const { data, isLoading, isError } = useGetPublicExecutives();
  const list = data && data.length > 0 ? data : isError ? fallbackExecutives : data ?? [];

  if (isLoading && !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
        Executive officers will appear here once published from the admin portal.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {list.map((exec) => (
        <ExecutiveCard key={exec.id} executive={exec} variant="officer" />
      ))}
    </div>
  );
}
