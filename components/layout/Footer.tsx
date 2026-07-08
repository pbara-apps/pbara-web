import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const quickLinks = [
  { href: "/about", label: "Our History" },
  { href: "/executives", label: "Executive Council" },
  { href: "/chapters", label: "State Chapters" },
  { href: "/events", label: "RA Parting System" },
  { href: "/media", label: "Gallery" },
];

const resourceLinks = [
  { href: "/#resources", label: "Counselor's Handbook" },
  { href: "/events", label: "Program Guides" },
  { href: "/#song-book", label: "Song Book" },
  { href: "/news", label: "Annual Reports" },
  { href: "/magazine", label: "Magazine Back Home" },
];

/**
 * Dark navy footer, 4 columns: logo + tagline + social; Navigation; Resources; Contact Secretariat
 */
export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Branding & Social */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/ra-logo.png"
                alt="PBA Royal Ambassadors logo"
                width={36}
                height={36}
                className="rounded-full object-contain"
              />
              <span className="font-heading font-semibold">RA PENTECOST</span>
            </Link>
            <p className="text-sm text-white/80 max-w-xs">
              Dedicated to the holistic growth of boys within the Pentecost
              Baptist Association through spiritual mentorship, physical
              training, and social service.
            </p>
            <div className="flex gap-3" aria-label="Social media">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-gold transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-gold transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Twitter"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-gold transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/80 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/80 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Secretariat */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Secretariat
            </h3>
            <address className="text-sm text-white/80 not-italic space-y-2">
              <p className="flex items-start gap-2">
                <FiMapPin
                  size={18}
                  className="text-gold shrink-0 mt-0.5"
                  aria-hidden
                />
                {/* Secretariat Complex, Baptist Building,  */}
                Lagos, Nigeria
              </p>
              <p className="flex items-center gap-2">
                <FiMail size={18} className="text-gold shrink-0" aria-hidden />
                <a
                  href="mailto:info@pbara.org.ng"
                  className="hover:text-gold transition-colors"
                >
                  info@pbara.org.ng
                </a>
              </p>
              <p className="flex items-center gap-2">
                <FiPhone size={18} className="text-gold shrink-0" aria-hidden />
                <a
                  href="tel:+2348012345678"
                  className="hover:text-gold transition-colors"
                >
                  +234 (0) 801 234 5678
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} Pentecost Baptist Association – Royal
            Ambassadors. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
