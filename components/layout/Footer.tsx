import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight, FiMail, FiMapPin } from "react-icons/fi";
import { org_email } from "@/data/contact";
import { PORTAL_LINKS } from "@/lib/portal";
import { SocialLinks } from "@/components/site/SocialLinks";

const COLUMNS = [
  {
    title: "Association",
    links: [
      { href: "/about", label: "About us" },
      { href: "/about#mission", label: "Mission & vision" },
      { href: "/executives", label: "Executive council" },
      { href: "/chapters", label: "Chapters" },
    ],
  },
  {
    title: "Programs",
    links: [
      { href: "/events", label: "Events & programs" },
      { href: "/registration", label: "Open registrations" },
      { href: "/about#objectives", label: "Cardinal objectives" },
    ],
  },
  {
    title: "Newsroom",
    links: [
      { href: "/news", label: "News & announcements" },
      { href: "/media", label: "Media gallery" },
      { href: "/contact", label: "Contact us" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div className="container-site relative pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gold/60">
                <Image
                  src="/images/ra-logo.png"
                  alt="PBA Royal Ambassadors logo"
                  width={48}
                  height={48}
                  className="rounded-full object-contain"
                />
              </span>
              <span className="leading-none">
                <span className="block font-heading text-lg font-extrabold tracking-[-0.02em]">
                  Royal Ambassadors
                </span>
                <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Pentecost Baptist Association
                </span>
              </span>
            </Link>

            <p className="mt-10 max-w-md font-heading text-[28px] font-bold leading-[1.15] tracking-[-0.03em] text-white md:text-[34px]">
              Touching the lives of boys…{" "}
              <span className="text-gold">impacting the eternity of men.</span>
            </p>

            <SocialLinks className="mt-10" />
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow text-white/45">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[15px] text-white/80 transition-colors hover:text-gold"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-3">
              <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
                <address className="not-italic">
                  <h3 className="eyebrow text-white/45">Secretariat</h3>
                  <p className="mt-4 flex items-start gap-2.5 text-[15px] text-white/80">
                    <FiMapPin className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    Lagos, Nigeria
                  </p>
                  <p className="mt-2 flex items-center gap-2.5 text-[15px]">
                    <FiMail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <a
                      href={`mailto:${org_email}`}
                      className="text-white/80 transition-colors hover:text-gold"
                    >
                      {org_email}
                    </a>
                  </p>
                </address>
                <div>
                  <h3 className="eyebrow text-white/45">Portals</h3>
                  <ul className="mt-4 space-y-2">
                    {PORTAL_LINKS.map((p) => (
                      <li key={p.href}>
                        <a
                          href={p.href}
                          className="group inline-flex items-center gap-1.5 text-[15px] text-white/80 transition-colors hover:text-gold"
                        >
                          {p.label}
                          <FiArrowUpRight
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oversized sign-off */}
        {/* Sized so the verse wraps to about two lines across the footer width. */}
        <div aria-hidden className="pointer-events-none mt-20 select-none">
          <p className="max-w-[16ch] font-heading text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-white/[0.07]">
            We are ambassadors for Christ. <sub>2 Cor. 5:20</sub>
          </p>
          <p className="eyebrow mt-4 pb-6 text-white/25"></p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Pentecost Baptist Association Royal Ambassadors. All
            rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}
