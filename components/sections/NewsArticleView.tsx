import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import { newsArticlePath } from "@/lib/api/news";
import type { NewsDetail, NewsItem } from "@/types";

interface NewsArticleViewProps {
  article: NewsDetail;
  related: NewsItem[];
}

function articleImageSrc(image?: string) {
  return image || "/images/ra-logo.png";
}

function isHtmlContent(content: string) {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}

function contentParagraphs(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return [];

  return trimmed
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function NewsArticleView({ article, related }: NewsArticleViewProps) {
  const content = article.content?.trim() ?? "";
  const isHtml = isHtmlContent(content);
  const paragraphs = isHtml ? [] : contentParagraphs(content);
  const imageSrc = articleImageSrc(article.image);
  const imageAlt = article.image
    ? `${article.title} — Royal Ambassadors`
    : "Royal Ambassadors logo used as placeholder for article image";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 lg:px-20">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-gold"
      >
        <FiArrowLeft size={16} aria-hidden />
        Back to all news
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] lg:gap-12">
        <article>
          <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-primary/5">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              {article.category}
            </span>
            <span className="text-text-muted">{article.date}</span>
            {article.readTime != null && (
              <span className="flex items-center gap-1 text-text-muted">
                <FiClock size={14} aria-hidden />
                {article.readTime} min read
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight text-text-dark md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.author && (
            <p className="mt-4 text-sm font-medium text-text-muted">
              By {article.author}
            </p>
          )}

          <p className="mt-6 text-lg leading-relaxed text-text-muted">
            {article.excerpt}
          </p>

          <div className="mt-8 max-w-none">
            {isHtml ? (
              <div
                className="rich-text-content text-base"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mb-5 text-base leading-relaxed text-text-dark"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base leading-relaxed text-text-dark">
                {article.excerpt}
              </p>
            )}
          </div>
        </article>

        <aside className="lg:pt-2">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-lg font-bold text-text-dark">
              Related News
            </h2>

            {related.length === 0 ? (
              <p className="text-sm text-text-muted">
                No related articles in this category yet.
              </p>
            ) : (
              <ul className="space-y-5">
                {related.map((item) => {
                  const href = newsArticlePath(item);
                  const thumb = articleImageSrc(item.image);

                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className="group flex gap-3 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                          <Image
                            src={thumb}
                            alt={
                              item.image
                                ? `${item.title} thumbnail`
                                : "Royal Ambassadors logo"
                            }
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {item.category}
                          </p>
                          <h3 className="line-clamp-2 text-sm font-semibold text-text-dark transition-colors group-hover:text-primary">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-text-muted">
                            {item.date}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <Link
              href="/news"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.03] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              View all news
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
