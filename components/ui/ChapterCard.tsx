import { FiUser } from "react-icons/fi";
import type { Chapter } from "@/types";

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const imageUrl = chapter.image ?? "";
  const imageAlt = chapter.image
    ? `${chapter.churchName} — ${chapter.chapterName}`
    : "Chapter or church building";

  return (
    <article className="chapter-card flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-56 w-full">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
            role="img"
            aria-label={imageAlt}
          />
        ) : (
          <div
            className="absolute inset-0 bg-slate-200 dark:bg-slate-700"
            aria-hidden
          />
        )}
        {chapter.status === "active" && (
          <div className="absolute top-4 right-4 bg-green-200 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Active
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-navy-deep dark:text-white text-xl font-bold">
            {chapter.churchName}
          </h3>
          <p className="text-primary font-semibold text-sm">
            {chapter.chapterName}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 overflow-hidden shrink-0">
            <FiUser size={20} aria-hidden />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Councilors
            </span>
            <span className="text-sm font-bold text-navy-deep dark:text-slate-200">
              {chapter.commander}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
