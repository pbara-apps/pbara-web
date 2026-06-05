import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin · PBA RA CMS",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
