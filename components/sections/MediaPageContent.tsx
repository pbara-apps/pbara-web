"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiVideo, FiImage, FiDownload, FiFilter, FiZoomIn, FiPlay, FiChevronRight, FiFileText, FiCalendar, FiShield } from "react-icons/fi";
import { MdPalette } from "react-icons/md";
import { downloads } from "@/data/downloads";
import { useGetPublicGallery } from "@/service/apis/gallery";
import type { DownloadItem } from "@/types";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDbuA3HgV4-xWDkGO1eQD9VSAI3OkXvDxx1aqDIYd3dEr7RfU_RnqEBo_m2q4I_U2TyU7PTB-_eakJGe5_lvsKT8WZ-hEbRWDDcloyRN1kod_eYBCybPeYEZJ75pKRf7BK9lRlLvcv5K_6VbM-yu_w2fTMS9InuKsRwPAzFO5VsOP5fkQFvbr0gnymPDUPVxT18tFnKVtz0AqG37VJ6D0T1Pn0JPhz7OMk-ejDCBbsrQSU2mJ6h6GwsiRlHWOoel14GbLsmFLfazbs";

const GALLERY_IMAGES = [
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuALK8ox3DA0lC4s6Lw2dY-ileMKqIrqPFiM1JDEIwYo_JPdt_rvrc2earBXn0FyPlH68gaMe_eBPN8vjz1ImM9UArFvV7T1tPcg7SO_vo_AUsvvGJEDhYJObp_22W6veIG-_f_2Edzf3e1H7OxcugYDz5mbyP4Yd6Ox1b1OVAkpOp9SUR1oy4eMG1C3nPftRwKX1VpzPDUq8Fwb3i201AHXIwu-EvU9O1kItMx09o1QyRblB9VomKQQ9b8gj8MBJR_uen59ifI6snw", alt: "Uniformed youth group in prayer circle" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-5DYhUJ-5bFWIj82R3hpr_LTnEiwSzrXPeTPzQNr40SUwFS7XG8REaFroC4vymZ-o2IVd8xbTpKrcdjB-_EH9LXqi_hQCSi-p5RWtoQUEETldbxgp03OjyFCOwzjpqLjg4J2MwTaDFUzqkuqAlyNL-eC92JvV0GGEnMmLMQECzSeqKnXI75UQKvMW6UTtWTiIWrXjCp0TSlOXz3WaFMjisquwCv0ldlcaLL52kXfN62ONAUwXtP_lPXVSaV4PlTaDTkvffvaN4SQ", alt: "Marching band in military style uniforms" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDBNRVV3Y22WmnpD9rZQ2BmPrU74FzZ5pisqoF_SC3srOuBFpYW6luQbHhy1QUv4l9F_gU-U2FPvtLZRiyHYrobgGlnyI1QJyd70xXBdV27mT3mPGl7VlBjDO0BQLUjDPgrG3dzZSIj4twZbgRPyu39R4Zll8n7HGKTLKAJ7CoK8HMNfqRDicg2Jp2pDYWGk_MAwvXAsVjHw6VXQUKKHW02DtZA858ELgJ8roMN3e4h4OJiPGnaSWVqsMIZqmYfLzDMjD_0DQy3l0", alt: "Outdoor camping activity for youth" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZqvVMqyIhYhoX_taV56WerWWE4OCa3OO57HqQpJ0_Ftum1rgqdZp123_Fxi_BbYDmbk8dOL_sqvbeBkMwm0NsAClOrhEdJTf1xbNAJtrPMZ7ilvjW5b9Bg5xJYUAw9zXaEDZE7QlIUMrGpD8HsvaUbxXd8hbjRo2AIUtvxeIv7wRXtLscsIoakp18KX8jbLRparRWG4kaUF3Rnd86THoMVGTKu8907rpZC7LJBQKpd95oFcHg6QSQ-J7cfjtDUPXmR0UWvbRsh_k", alt: "Leadership training session presentation" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvinvW92nBw2XdoTs0xRoCcHheMmHdJuZhhiuJUWQn1Qxe6IEK-tPBSnZkiDVaeDPLVmnNsCDgqrPATApDzxR8L7Yh_ExIHayZs-BsvX6ThXQOxwwyYsjunb7dcAyc9Pj3Z4aRA3HXmxjMKyQiaHHhfxQ6Xzp24sE1JqHM9kcCt4ZV2NgVhHt9efrBF5Pq_DnpCbPwn0mlC1WKYflfx4LSSrO95lsu9UXyoZvyMHE69f2u_Q3pZpkcG8vgH2Gm8F7vbtkBQHF7CzA", alt: "Award ceremony for young ambassadors" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT9nFx_Iobs8UvDm8XocX_QxIndpisihcMzZvinUwnOVTkR7LVfh_7iO7oFqEh2--VPUGBP_DXDiJdUCPiqUAn8_Qa8Pdx7P8HUlvoplBbptlUggZTnySBnJJ4nnJh8QQa6o6OecjPgRggbrrY6jxk-LhATlZFhB-_TFe4rTIS9WvaPyPRiRX-FjC6Gbrdl-jUXlcSzU7zxNJU7_WNJV42cyosk1bpkoe5sQD9QhG6EJbX5hbVDha5E7IvzDI3mzO9tCXKp72zxUE", alt: "Group of boys marching in line" },
];

const VIDEOS = [
  { id: "1", title: "Marching Drill Fundamentals: Phase I", date: "Sept 12, 2023", duration: "12:45", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIwpnNjHoXFrbONcTcNPKciRCNs4xrlDtRiWq_oKiDfYUedl48Ime3l_MAlAb6VXwjzF1551aJy9duZxOUAR9j3f8nuZv8sOs9N_5SkYBD0Xbc83u5EM6fFvxNcE5UBcM2JAsZ2iA602U1swWJJgN-DIAtWoS_s4gWfTTUZmuuSLBajOJ7AMJCmAcZZ8HohPG0aQpi8m5ZUZ4JCcyPOvfIx9Eyz_k-0gLq7O7ewqvEJhxnZlgP4nrGn17XPiLqWvZ0C83BjZKgoTU", imageAlt: "Soldiers in uniform marching in formation" },
  { id: "2", title: "Association Brass Band Practice Highlights", date: "Aug 28, 2023", duration: "08:20", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhbypa5ZueFahgZ2xNxO3dJPvtcJdAOQ_5O_TUbZEj7-ctmd1AMUkciIm69o0QQnrB1wY0pY5N2AN4K2pX7Y1ZjJmgRi0Qaqje_wbXxRw5VgI2vkMYMOgiiWKYf_69mKaEBkzLSJ905-B8zhhDtZg2FJih9aDczlKpIj6WjIZP01weAnM_WpNsmwAciFiNka9lklp2aY9rKdpNfduelNwiKXOJnk7iHhjOasolEr_8JFvxiHzyMXlqE7SgvJv22A6clyPD9zZghEc", imageAlt: "Close up of brass instruments in a band" },
  { id: "3", title: "Ambassador Leadership Seminar: Series A", date: "July 15, 2023", duration: "24:15", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq-A0HG50T52Oodlh-EjvuB9HmWuy3VFpMwd77QE1wKjjz-HbgZtQ4alxkYLdoB0PQHYTLukzHGmXXwVDy2rDYVMfW8dv84qFZU5FQg3i5ci0r3xsqf5_yTyUtRglB57fdeHRY6Mr7tTb_lwErHkM6xa_EaMRX90m56rXDbfXVnLSauDUP4THSegYpMe2ywLTU6_PIA6Ep1VvIp4kQE0DEKV8S-xjFD0umn0nWoRPaiYATUsira15W3ER9AMKzZmYY-SV1UwwuBDw", imageAlt: "A group of people listening to a speaker in an auditorium" },
  { id: "4", title: "Standard Protocols for Inspection", date: "June 30, 2023", duration: "15:50", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_9e9FGZ_oaFMpjEbRT7dmmFDdKPdIGar1doIr-AhfLXC6oAzX-fqlHF8GU155_33bFzz2K4jn4GNT9CgGLkeJdHQ1pVyb2NJ0IjegzLrfx3_Ldd1x2a0XDDpDVZO2DTbXOgcxgW5MXjmpOS-GKlDfVy7AldeSpu9FlwNFv_BV6UozC-thwcCeTb2_J7W8gg9TQDni_6bf8aFgtYFD2zSZ_IUCPtOhJXgO8Ny3hd7sDbScXLTmLlasMGYvmyJ5kbH9PN3cXj0ZBk", imageAlt: "Two people shaking hands professionally" },
];

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  document: FiFileText,
  shield: MdPalette,
  calendar: FiCalendar,
  badge: FiShield,
};

type TabKey = "videos" | "photos" | "downloads";

export function MediaPageContent() {
  const [tab, setTab] = useState<TabKey>("photos");
  const { data: photosData } = useGetPublicGallery("photo");
  const { data: videosData } = useGetPublicGallery("video");

  const galleryImages = useMemo(() => {
    if (photosData && photosData.length > 0) {
      return photosData.map((item) => ({ src: item.url, alt: item.alt || item.title }));
    }
    return GALLERY_IMAGES;
  }, [photosData]);

  const videos = useMemo(() => {
    if (videosData && videosData.length > 0) {
      return videosData.map((item) => ({
        id: item.id,
        title: item.title,
        date: item.category,
        duration: "—",
        image: item.url,
        imageAlt: item.alt || item.title,
      }));
    }
    return VIDEOS;
  }, [videosData]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-20 py-8">
      {/* Hero Section */}
      <div className="@container mb-8">
        <div className="relative h-64 md:h-80 overflow-hidden rounded-xl bg-slate-900 group">
          <div
            className="absolute inset-0 opacity-60 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
            role="img"
            aria-label="Young boys in uniform marching in a parade formation"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" aria-hidden />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-white text-4xl font-bold leading-tight mb-2">
              Media Gallery &amp; Resources
            </h1>
            <p className="text-slate-300 max-w-xl">
              Capturing moments of discipline, faith, and leadership from our Royal Ambassadors association.
            </p>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-primary/20 mb-8 overflow-x-auto whitespace-nowrap" role="tablist" aria-label="Media sections">
        {[
          { key: "videos" as TabKey, label: "Videos", icon: FiVideo },
          { key: "photos" as TabKey, label: "Photo Gallery", icon: FiImage },
          { key: "downloads" as TabKey, label: "Downloads", icon: FiDownload },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-all ${
                isActive
                  ? "border-primary text-primary bg-primary/5 font-bold"
                  : "border-transparent text-slate-500 hover:text-primary"
              }`}
            >
              <Icon size={20} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      {/* Videos Tab */}
      {tab === "videos" && (
        <section className="mb-16" aria-label="Training Parades videos">
          <div className="flex justify-between items-end mb-8 border-l-4 border-accent-gold pl-4">
            <div>
              <h3 className="text-primary dark:text-white text-xl font-bold uppercase tracking-wide">
                Training Parades
              </h3>
              <p className="text-slate-500 text-sm">
                Instructional drills and ceremonial parade footage
              </p>
            </div>
            <Link
              href="#"
              className="text-primary dark:text-accent-gold text-sm font-bold flex items-center gap-1 hover:underline"
            >
              VIEW ALL <FiChevronRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((v) => (
              <div key={v.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md border border-slate-200 dark:border-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${v.image}")` }}
                    role="img"
                    aria-label={v.imageAlt}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiPlay size={40} className="text-white" aria-hidden />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {v.duration}
                  </span>
                </div>
                <h4 className="text-primary dark:text-slate-200 font-bold text-sm leading-snug group-hover:text-accent-gold transition-colors">
                  {v.title}
                </h4>
                <p className="text-slate-500 text-[11px] mt-1 uppercase font-bold tracking-wider">
                  {v.date}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery Tab */}
      {tab === "photos" && (
        <>
          <section className="mb-16" aria-labelledby="gallery-heading">
            <div className="flex items-center justify-between mb-6">
              <h3 id="gallery-heading" className="text-2xl font-bold border-l-4 border-accent-gold pl-4">
                Latest Event Highlights
              </h3>
              <button
                type="button"
                className="p-2 rounded border border-primary/20 text-primary hover:bg-primary/10"
                aria-label="Filter gallery"
              >
                <FiFilter size={20} aria-hidden />
              </button>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="break-inside-avoid relative group rounded-lg overflow-hidden border border-primary/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto block"
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiZoomIn size={40} className="text-white" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources & Downloads (shown under gallery on Photo tab) */}
          <section className="mb-16" aria-labelledby="resources-heading">
            <div className="flex items-center justify-between mb-8">
              <h3 id="resources-heading" className="text-2xl font-bold border-l-4 border-accent-gold pl-4">
                Resources &amp; Downloads
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloads.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Downloads Tab */}
      {tab === "downloads" && (
        <section className="mb-16" aria-labelledby="downloads-heading">
          <div className="flex items-center justify-between mb-8">
            <h3 id="downloads-heading" className="text-2xl font-bold border-l-4 border-accent-gold pl-4">
              Resources &amp; Downloads
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ResourceCard({ item }: { item: DownloadItem }) {
  const IconComponent = RESOURCE_ICONS[item.icon] ?? FiFileText;
  return (
    <div className="flex items-center p-4 bg-white dark:bg-slate-900/30 rounded-xl border border-primary/10 hover:border-accent-gold transition-all group">
      <div className="size-16 flex items-center justify-center bg-primary/10 text-primary rounded-lg group-hover:bg-accent-gold group-hover:text-white transition-colors shrink-0">
        <IconComponent size={28} aria-hidden />
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 dark:text-slate-200">
          {item.title}
        </h4>
        <p className="text-sm text-slate-500">{item.description}</p>
      </div>
      <a
        href={item.fileUrl}
        download
        className="p-2 text-primary hover:bg-primary/10 rounded-full shrink-0"
        aria-label={`Download ${item.title}`}
      >
        <FiDownload size={22} aria-hidden />
      </a>
    </div>
  );
}
