import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { Breadcrumbs } from "@/components/site/PageHero";
import { ReadingProgress, ShareLinks } from "@/components/sections/ArticleChrome";
import sanitizeHtml from "sanitize-html";
import { newsArticlePath } from "@/lib/api/news";
import type { NewsDetail, NewsItem } from "@/types";

interface NewsArticleViewProps {
  article: NewsDetail;
  related: NewsItem[];
}

const FALLBACK_IMAGE = "/images/ra-parade.jpg";

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

function sanitizeArticleHtml(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "a",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href ?? "#",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

export function NewsArticleView({ article, related }: NewsArticleViewProps) {
  const content = article.content?.trim() ?? "";
  const isHtml = isHtmlContent(content);
  const safeHtml = isHtml ? sanitizeArticleHtml(content) : "";
  const paragraphs = isHtml ? [] : contentParagraphs(content);
  const path = newsArticlePath(article);

  return (
    <>
      <ReadingProgress />
      <article className="bg-ivory">
        {/* Header */}
        <header className="container-site pt-8 md:pt-16">
          <Breadcrumbs items={[{ label: "Newsroom", href: "/news" }, { label: article.category }]} />
          <div className="mx-auto mt-8 max-w-4xl md:mt-20 md:text-center">
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-text-muted md:justify-center">
              <Link href={`/news?category=${encodeURIComponent(article.category)}`} className="text-gold hover:text-ink">
                {article.category}
              </Link>
              <span aria-hidden>·</span>
              <time>{article.date}</time>
              {article.readTime != null ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{article.readTime} min read</span>
                </>
              ) : null}
            </p>
            <h1 className="mt-5 font-heading text-[clamp(1.75rem,8vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink text-balance md:mt-7 md:text-[clamp(2.25rem,5.4vw,4.5rem)] md:leading-[1.02] md:tracking-[-0.04em]">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl border-l-2 border-gold pl-4 text-[17px] leading-relaxed text-text-muted text-pretty md:mt-7 md:border-l-0 md:pl-0 md:text-xl">
              {article.excerpt}
            </p>
            <p className="mt-6 text-sm text-text-muted md:mt-8">
              By <span className="font-semibold text-ink">{article.author || "RA Editorial"}</span>
            </p>
          </div>
        </header>

        {/* Image */}
        <div className="container-site mt-8 max-sm:px-0 md:mt-20">
          <div className="relative mx-auto aspect-[4/3] max-w-6xl overflow-hidden bg-mist sm:aspect-[16/9] sm:rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image || FALLBACK_IMAGE}
              alt={article.image ? `${article.title} — Royal Ambassadors` : ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="container-site pb-16 pt-8 md:pb-32 md:pt-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_minmax(0,42rem)_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <p className="eyebrow text-text-muted">Share</p>
                <div className="[&>div]:flex-col [&>div]:items-start">
                  <ShareLinks title={article.title} path={path} />
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              {isHtml ? (
                <div
                  className="rich-text-content text-[17px] md:text-[18px]"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              ) : paragraphs.length > 0 ? (
                <div className="space-y-6 text-[17px] leading-[1.8] md:text-[18px] text-[#1c1e45]">
                  {paragraphs.map((paragraph, i) => (
                    <p
                      key={`${i}-${paragraph.slice(0, 24)}`}
                      className={
                        i === 0
                          ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-7xl first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-primary whitespace-pre-line"
                          : "whitespace-pre-line"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[17px] leading-[1.8] text-[#1c1e45] md:text-[18px]">{article.excerpt}</p>
              )}

              <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
                <Link
                  href="/news"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-ink"
                >
                  <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                  Back to the newsroom
                </Link>
                <div className="lg:hidden">
                  <ShareLinks title={article.title} path={path} />
                </div>
              </div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-white py-14 md:py-28" aria-labelledby="related-heading">
        <div className="container-site">
          <div className="flex items-end justify-between gap-6 border-b-2 border-ink pb-4">
            <h2 id="related-heading" className="eyebrow text-ink">
              Related stories
            </h2>
            <Link href="/news" className="eyebrow text-primary hover:text-ink">
              All news
            </Link>
          </div>

          {related.length === 0 ? (
            <p className="py-10 text-text-muted">No related articles in this category yet.</p>
          ) : (
            <ul className="mt-2 grid gap-x-8 md:mt-10 md:grid-cols-3 md:gap-y-12">
              {related.slice(0, 3).map((item) => (
                <li key={item.id} className="border-b border-line md:border-0">
                  <Link href={newsArticlePath(item)} className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 py-4 md:block md:py-0">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-mist md:aspect-[16/10] md:rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-brand group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="eyebrow text-[10px] text-gold md:mt-5 md:text-[11px]">{item.category} <span className="text-text-muted">· {item.date}</span></p>
                      <h3 className="mt-1.5 flex items-start justify-between gap-4 text-[16px] font-bold leading-snug text-ink transition-colors group-hover:text-primary md:mt-2.5 md:text-lg">
                        <span className="line-clamp-3 md:line-clamp-none">{item.title}</span>
                        <FiArrowUpRight className="mt-1 hidden h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 group-hover:rotate-45 md:block" aria-hidden />
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
