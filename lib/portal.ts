/** Base address of the portal app (admin + chapter portals). */
export const PORTAL_URL = (
  process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.pbara.org.ng"
).replace(/\/$/, "");

export const PORTAL_LINKS = [
  {
    label: "Chapter Login",
    hint: "Counsellors, presidents & secretaries",
    href: `${PORTAL_URL}/chapter/login`,
  },
  {
    label: "Admin Login",
    hint: "Association executives",
    href: `${PORTAL_URL}/login`,
  },
];
