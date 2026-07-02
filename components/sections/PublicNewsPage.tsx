"use client";

import { Spinner } from "@heroui/react";
import { Suspense } from "react";
import { NewsPageContent } from "@/components/sections/NewsPageContent";
import { newsItems as fallbackNews } from "@/data/news";
import { useGetPublicNews } from "@/service/apis/news";

function NewsPageInner() {
  const { data, isLoading, isError } = useGetPublicNews();
  const news = data && data.length > 0 ? data : isError ? fallbackNews : data ?? [];

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return <NewsPageContent news={news} />;
}

export function PublicNewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner color="primary" />
        </div>
      }
    >
      <NewsPageInner />
    </Suspense>
  );
}
