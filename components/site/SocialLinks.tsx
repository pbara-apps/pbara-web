import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { org_fb_link, org_ig_link, org_twitter_link } from "@/data/contact";
import { cn } from "@/lib/cn";

const SOCIALS = [
  { href: org_fb_link, label: "Facebook", Icon: FaFacebookF },
  { href: org_ig_link, label: "Instagram", Icon: FaInstagram },
  { href: org_twitter_link, label: "X (Twitter)", Icon: FaXTwitter },
].filter((s) => s.href.trim().length > 0);

export const hasSocialLinks = SOCIALS.length > 0;

/**
 * Social profile links. Only profiles configured in data/contact.ts are shown,
 * so the site never links to a generic social homepage.
 */
export function SocialLinks({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  if (!hasSocialLinks) return null;
  return (
    <ul className={cn("flex gap-2", className)} aria-label="Social media">
      {SOCIALS.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
              tone === "dark"
                ? "border-white/15 text-white/70 hover:border-gold hover:text-gold"
                : "border-line text-primary hover:border-primary hover:bg-primary hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
