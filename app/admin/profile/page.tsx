"use client";

import { Avatar, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ROLE_LABELS, canWriteAdminContent } from "@/types/user";

function initials(name?: string) {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function AdminProfilePage() {
  const { user } = useCurrentUser();
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : "Admin";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Profile"
        description="Account identity, role scope, and administrative access summary."
      />

      <Card className="border border-text-dark/[0.06] bg-surface shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
        <CardHeader className="border-b border-text-dark/[0.06] px-6 py-5">
          <h2 className="text-base font-semibold text-primary">Profile Overview</h2>
        </CardHeader>
        <CardBody className="grid gap-6 px-6 py-6 sm:grid-cols-[140px_1fr]">
          <div className="flex justify-center sm:justify-start">
            <Avatar
              size="lg"
              name={user?.name ?? "Admin"}
              showFallback
              fallback={<span>{initials(user?.name)}</span>}
              classNames={{
                base: "h-28 w-28 bg-gradient-to-br from-primary to-[#121f55] text-2xl font-bold text-white",
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">Full Name</p>
              <p className="mt-1 text-lg font-semibold text-text-dark">{user?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">Email</p>
              <p className="mt-1 text-sm text-text-dark">{user?.email ?? "—"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
                {roleLabel}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className={
                  canWriteAdminContent(user?.role)
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }
              >
                {canWriteAdminContent(user?.role) ? "Write access enabled" : "Read-only access"}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
