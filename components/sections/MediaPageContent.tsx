"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiDownload, FiFileText, FiImage, FiShield, FiVideo } from "react-icons/fi";
import { MdPalette } from "react-icons/md";
import { downloads } from "@/data/downloads";
import { PhotoPreviewCard, VideoPreviewCard } from "@/components/media/GalleryPreviewCards";
import {
  MediaViewerModal,
  type MediaViewerItem,
} from "@/components/media/MediaViewerModal";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { useGetPublicGallery } from "@/service/apis/gallery";
import { cn } from "@/lib/cn";
import type { DownloadItem } from "@/types";

/**
 * Shown only if the gallery API is unreachable: authentic association
 * photos bundled with the site.
 */
const LOCAL_PHOTOS = [
  { src: "/images/ra-colour-party.jpg", alt: "Colour party presenting the flags", category: "Parade" },
  { src: "/images/ra-salute.jpg", alt: "A young ambassador saluting", category: "Parade" },
  { src: "/images/ra-march.jpg", alt: "An ambassador marching on the parade ground", category: "Parade" },
  { src: "/images/ra-officers-salute.jpg", alt: "Association officers saluting", category: "Leadership" },
  { src: "/images/ra-ambassadors.jpg", alt: "Four Royal Ambassadors in uniform", category: "Ambassadors" },
  { src: "/images/ra-parade.jpg", alt: "Ambassadors and auxiliary in parade formation", category: "Parade" },
  { src: "/images/image1.jpeg", alt: "Ambassadors at a church ceremony", category: "Ceremony" },
  { src: "/images/patrons.jpeg", alt: "Officers at the patrons investiture", category: "Ceremony" },
  { src: "/images/ra-auxiliary.jpg", alt: "Ambassadors and auxiliary group photo", category: "Parade" },
  { src: "/images/event-cv.jpeg", alt: "Association gathering in a church hall", category: "Gatherings" },
  { src: "/images/ra-assembly.jpg", alt: "Ambassadors, auxiliary and leaders outdoors", category: "Parade" },
];

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  document: FiFileText,
  shield: MdPalette,
  calendar: FiCalendar,
  badge: FiShield,
};

type TabKey = "photos" | "videos" | "downloads";

export function MediaPageContent() {
  const [tab, setTab] = useState<TabKey>("photos");
  const [category, setCategory] = useState("All");
  const [viewer, setViewer] = useState<{ set: "photos" | "videos"; index: number } | null>(null);
  const { data: photosData, isLoading: photosLoading, isError: photosError } = useGetPublicGallery("photo");
  const { data: videosData, isLoading: videosLoading } = useGetPublicGallery("video");

  const photos = useMemo(() => {
    if (photosData && photosData.length > 0) {
      return photosData.map((item) => ({
        id: item.id,
        src: item.url,
        alt: item.alt || item.title,
        title: item.title,
        category: item.category || "General",
      }));
    }
    if (photosError) {
      return LOCAL_PHOTOS.map((p, i) => ({ id: `local-${i}`, src: p.src, alt: p.alt, title: p.alt, category: p.category }));
    }
    return [];
  }, [photosData, photosError]);

  const videos = useMemo(
    () =>
      (videosData ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        url: item.url,
        alt: item.alt || item.title,
      })),
    [videosData],
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(photos.map((p) => p.category)))],
    [photos],
  );
  const shownPhotos = category === "All" ? photos : photos.filter((p) => p.category === category);

  const photoItems: MediaViewerItem[] = shownPhotos.map((p) => ({ type: "photo", url: p.src, title: p.title, alt: p.alt }));
  const videoItems: MediaViewerItem[] = videos.map((v) => ({ type: "video", url: v.url, title: v.title, alt: v.alt }));
  const viewerItems = viewer?.set === "videos" ? videoItems : photoItems;

  const tabs: { key: TabKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: "photos", label: "Photos", icon: FiImage, count: photos.length },
    { key: "videos", label: "Videos", icon: FiVideo, count: videos.length },
    { key: "downloads", label: "Downloads", icon: FiDownload, count: downloads.length },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Media gallery" }]}
        eyebrow="Media & resources"
        title="Moments of discipline, faith and leadership."
        description="Photographs and videos from across the association, plus resources for chapters and counsellors."
        image="/images/ra-parade.jpg"
        imagePosition="center 40%"
      />

      {/* Tabs */}
      <div className="sticky top-[72px] z-30 border-b border-line bg-ivory/90 backdrop-blur-xl">
        <div className="container-site flex items-center justify-between gap-6">
          <div className="no-scrollbar flex gap-1 overflow-x-auto py-3" role="tablist" aria-label="Media sections">
            {tabs.map(({ key, label, icon: Icon, count }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                    active ? "bg-ink text-white" : "text-text-muted hover:bg-white hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  <span className={cn("rounded-full px-1.5 font-mono text-[11px] tabular-nums", active ? "bg-white/15" : "bg-mist")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="min-h-[60vh] bg-ivory pb-16 pt-6 md:pb-32 md:pt-12">
        <div className="container-site">
          {/* Photos */}
          {tab === "photos" && (
            <div role="tabpanel" aria-label="Photos">
              {categories.length > 2 ? (
                <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:mx-0 md:mb-10 md:flex-wrap md:overflow-visible md:px-0" role="group" aria-label="Filter photos by category">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={category === c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "min-h-[40px] shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                        category === c
                          ? "border-ink bg-ink text-white"
                          : "border-line bg-white text-text-muted hover:border-ink hover:text-ink",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ) : null}

              {photosLoading ? (
                <div className="columns-2 gap-2 md:gap-4 lg:columns-3" aria-hidden>
                  {[320, 220, 280, 240, 300, 200].map((h, i) => (
                    <div key={i} className="mb-2 animate-pulse rounded-xl bg-mist md:mb-4" style={{ height: h * 0.7 }} />
                  ))}
                </div>
              ) : shownPhotos.length === 0 ? (
                <EmptyState text="Photos will appear here once published from the admin portal." />
              ) : (
                <>
                {/* Phones: lead photo full width, the rest in a tight two-column mosaic. */}
                <div className="md:hidden" key={`m-${category}`}>
                  <Reveal y={16}>
                    <PhotoPreviewCard
                      src={shownPhotos[0].src}
                      alt={shownPhotos[0].alt}
                      title={shownPhotos[0].title}
                      variant="feature"
                      onOpen={() => setViewer({ set: "photos", index: 0 })}
                    />
                  </Reveal>
                  {shownPhotos.length > 1 ? (
                    <div className="mt-2 columns-2 gap-2">
                      {shownPhotos.slice(1).map((img, i) => (
                        <div key={img.id} className="mb-2 break-inside-avoid">
                          <PhotoPreviewCard
                            src={img.src}
                            alt={img.alt}
                            title={img.title}
                            variant="tile"
                            onOpen={() => setViewer({ set: "photos", index: i + 1 })}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <p className="eyebrow mt-6 text-center text-text-muted">
                    Tap a photo to view · swipe to browse
                  </p>
                </div>
                <div className="hidden columns-2 gap-4 md:block lg:columns-3" key={category}>
                  {shownPhotos.map((img, idx) => (
                    <Reveal key={img.id} className="mb-4 break-inside-avoid" y={20} delay={Math.min(idx, 6) * 0.04}>
                      <PhotoPreviewCard
                        src={img.src}
                        alt={img.alt}
                        title={img.title}
                        onOpen={() => setViewer({ set: "photos", index: idx })}
                      />
                    </Reveal>
                  ))}
                </div>
                </>
              )}
            </div>
          )}

          {/* Videos */}
          {tab === "videos" && (
            <div role="tabpanel" aria-label="Videos">
              {videosLoading ? (
                <div className="grid gap-6 md:grid-cols-2" aria-hidden>
                  {[0, 1].map((i) => (
                    <div key={i} className="aspect-video animate-pulse rounded-xl bg-mist" />
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <EmptyState text="Videos will appear here once published from the admin portal." />
              ) : (
                <Stagger className="grid gap-x-6 gap-y-10 md:grid-cols-2">
                  {videos.map((v, idx) => (
                    <StaggerItem key={v.id}>
                      <VideoPreviewCard
                        url={v.url}
                        title={v.title}
                        alt={v.alt}
                        category={v.category}
                        onOpen={() => setViewer({ set: "videos", index: idx })}
                      />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>
          )}

          {/* Downloads */}
          {tab === "downloads" && (
            <div role="tabpanel" aria-label="Downloads" className="grid gap-6 md:gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="display-md text-ink">Resources &amp; downloads</h2>
                <p className="mt-5 text-[16px] leading-relaxed text-text-muted">
                  Handbooks, crests and calendars for chapters and counsellors.
                  Need something that isn&apos;t here?{" "}
                  <Link href="/contact" className="font-semibold text-primary underline decoration-gold underline-offset-4">
                    Contact the secretariat
                  </Link>
                  .
                </p>
              </div>
              <Stagger as="ul" className="border-t border-line lg:col-span-8">
                {downloads.map((item) => (
                  <StaggerItem as="li" key={item.id} className="border-b border-line">
                    <ResourceRow item={item} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      <MediaViewerModal
        items={viewerItems}
        index={viewer?.index ?? null}
        onIndexChange={(index) => setViewer((v) => (v ? { ...v, index } : v))}
        onClose={() => setViewer(null)}
      />
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-6 py-20 text-center text-text-muted">
      {text}
    </p>
  );
}

function ResourceRow({ item }: { item: DownloadItem }) {
  const Icon = RESOURCE_ICONS[item.icon] ?? FiFileText;
  const inner = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary md:h-14 md:w-14 ring-1 ring-line transition-colors group-hover:bg-gold group-hover:text-ink group-hover:ring-gold">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold text-ink md:text-lg">{item.title}</span>
        <span className="block text-sm text-text-muted">{item.description}</span>
      </span>
      <span className="eyebrow hidden text-text-muted sm:block">{item.fileType}</span>
      {item.available ? (
        <FiDownload className="h-5 w-5 shrink-0 text-ink transition-transform group-hover:translate-y-0.5" aria-hidden />
      ) : (
        <span className="eyebrow shrink-0 rounded-full bg-mist px-3 py-1.5 text-text-muted">Coming soon</span>
      )}
    </>
  );

  if (!item.available) {
    return <div className="flex items-center gap-4 py-5 md:gap-5 md:py-6">{inner}</div>;
  }
  return (
    <a href={item.fileUrl} download className="group flex items-center gap-4 py-5 md:gap-5 md:py-6" aria-label={`Download ${item.title}`}>
      {inner}
    </a>
  );
}
