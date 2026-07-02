import type { Metadata } from "next";
import Link from "next/link";
import { MdMilitaryTech } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi2";
import { FiAward } from "react-icons/fi";
import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import { PastOfficersTable } from "@/components/ui/PastOfficersTable";
import { executives } from "@/data/executives";
import { pastOfficers } from "@/data/pastOfficers";
import { patrons } from "@/data/patrons";
import { cn } from "@heroui/react";

export const metadata: Metadata = {
  title: "Executive Leadership and Patrons",
  alternates: {
    canonical: "/executives",
  },
  description:
    "Meet the dedicated officers and patrons guiding the Royal Ambassadors of Pentecost Baptist Association. Our leadership is committed to fostering spiritual growth and discipline.",
  openGraph: {
    title: "Executive Leadership | PBA Royal Ambassadors",
    description: "Current executive officers, past officers, and our patrons.",
    url: "https://pbara.org.ng/executives",
  },
  keywords: ["Leadership", "Executive", "Patrons", "Officers", "PBA RA"],
};

export default function ExecutivesPage() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-12">
      {/* Hero Section */}
      <div className="flex flex-col gap-8 md:flex-row items-center mb-16">
        <div
          className="w-full md:w-1/2 aspect-video bg-cover bg-center rounded-xl shadow-lg border-4 border-white dark:border-slate-800"
          style={{ backgroundImage: `url("/images/patrons.jpeg")` }}
          role="img"
          aria-label="Group of professional Christian leaders in conference room"
        />
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Executive Leadership and Patrons
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Meet the dedicated officers and patrons guiding the Royal
            Ambassadors of Pentecost Baptist Association. Our leadership is
            committed to fostering spiritual growth and discipline.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="#current-officers"
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-primary/20 transition-all min-h-[44px]"
            >
              Meet the Team
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border-2 border-primary/20 text-primary px-6 py-3 rounded-lg font-bold text-base hover:bg-primary/5 min-h-[44px]"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </div>

      {/* Current Executives Grid */}
      <section
        id="current-officers"
        className="mb-20"
        aria-labelledby="officers-heading"
      >
        <div className="flex items-center gap-3 mb-8">
          <MdMilitaryTech
            size={32}
            className="text-primary shrink-0"
            aria-hidden
          />
          <h2
            id="officers-heading"
            className="text-slate-900 dark:text-slate-100 text-3xl font-bold"
          >
            Current Executive Officers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {executives.map((exec) => (
            <ExecutiveCard key={exec.id} executive={exec} variant="officer" />
          ))}
        </div>
      </section>

      {/* Past Officers Table */}
      <section className="mb-20" aria-labelledby="past-heading">
        <div className="flex items-center gap-3 mb-8">
          <HiOutlineClock
            size={32}
            className="text-primary shrink-0"
            aria-hidden
          />
          <h2
            id="past-heading"
            className="text-slate-900 dark:text-slate-100 text-3xl font-bold"
          >
            Past Officers
          </h2>
        </div>
        <PastOfficersTable officers={pastOfficers} />
      </section>

      {/* Patrons Section */}
      <section className="mb-20" aria-labelledby="patrons-heading">
        <div className="mb-8 sapce-y-1">
          <div className="flex items-center gap-3">
            <FiAward size={32} className="text-primary shrink-0" aria-hidden />
            <h2
              id="patrons-heading"
              className="text-slate-900 dark:text-slate-100 text-3xl font-bold"
            >
              Our Patrons
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-base ps-2">
            {" "}
            Dignified elders and leaders providing spiritual guidance and
            support to the association.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {patrons.map((patron) => (
            <div
              key={patron.name}
              className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={patron.image ?? "/images/ra-logo.png"}
                  alt={patron.name}
                  className={cn(
                    "w-full h-full object-cover",
                    !patron.image && "grayscale",
                  )}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {patron.name}
                </h3>
                <p className="text-primary font-bold text-sm uppercase mb-3">
                  {patron.role}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                  &quot;{patron.quote}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
