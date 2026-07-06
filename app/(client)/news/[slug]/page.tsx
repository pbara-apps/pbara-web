import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleView } from "@/components/sections/NewsArticleView";
import {
  fetchPublicNews,
  fetchPublicNewsArticle,
  newsArticlePath,
} from "@/lib/api/news";

type NewsArticlePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const news = await fetchPublicNews();
  return news.map((item) => ({
    slug: item.slug ?? item.id,
  }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const data = await fetchPublicNewsArticle(params.slug);

  if (!data) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { article } = data;
  const canonicalPath = newsArticlePath(article);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://pbara.org.ng${canonicalPath}`,
      type: "article",
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      images: article.image
        ? [
            {
              url: article.image,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const data = await fetchPublicNewsArticle(params.slug);

  if (!data) {
    notFound();
  }

  const { article, related } = data;
  const canonicalPath = newsArticlePath(article);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [article.image] : undefined,
    datePublished: article.date,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: "PBA Royal Ambassadors" },
    publisher: {
      "@type": "Organization",
      name: "Pentecost Baptist Association - Royal Ambassadors",
      logo: {
        "@type": "ImageObject",
        url: "https://pbara.org.ng/images/ra-logo.png",
      },
    },
    mainEntityOfPage: `https://pbara.org.ng${canonicalPath}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <NewsArticleView article={article} related={related} />
    </>
  );
}
