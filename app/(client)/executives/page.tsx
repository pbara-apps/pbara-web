import type { Metadata } from "next";
import Link from "next/link";
import { MdMilitaryTech } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi2";
import { PastOfficersTable } from "@/components/ui/PastOfficersTable";
import { CurrentExecutivesGrid } from "@/components/sections/CurrentExecutivesGrid";
import { PatronsSection } from "@/components/sections/CurrentPatronsGrid";
import { pastOfficers } from "@/data/pastOfficers";

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
        <CurrentExecutivesGrid />
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

      <PatronsSection />
    </main>
  );
}
