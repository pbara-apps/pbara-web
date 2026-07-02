"use client";

import {
  Chip,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
  useGetExecutivesForSettings,
  useUpdateExecutiveRole,
} from "@/service/apis/settings";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  EXECUTIVE_ROLES,
  ROLE_LABELS,
  isSuperAdmin,
  type ExecutiveRole,
} from "@/types/user";

export default function SettingsAdminPage() {
  const { user } = useCurrentUser();
  const superAdmin = isSuperAdmin(user?.role);
  const { data: executives = [], isLoading, isError } =
    useGetExecutivesForSettings(superAdmin);
  const updateRole = useUpdateExecutiveRole();

  const handleRoleChange = async (id: string, role: ExecutiveRole) => {
    try {
      await updateRole.mutateAsync({ id, role });
      successToast("Executive role updated.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Unable to update role.",
        "Error",
      );
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Manage your account and organization access controls."
      />

      <section className="rounded-2xl border border-text-dark/[0.05] bg-surface p-6 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <h2 className="text-base font-semibold text-primary">Your Account</h2>
        <p className="mt-1 text-sm text-text-muted">
          Signed in as {user?.name ?? "Admin"}
          {user?.email ? ` (${user.email})` : ""}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
            {user?.role ? ROLE_LABELS[user.role] : "Admin"}
          </Chip>
        </div>
      </section>

      {superAdmin ? (
        <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
          <div className="border-b border-text-dark/[0.05] px-6 py-5">
            <h2 className="text-base font-semibold text-primary">
              Executive Role Assignment
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Assign access roles for each executive who can sign in to the admin
              portal.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner color="primary" />
            </div>
          ) : isError ? (
            <p className="py-16 text-center text-sm text-rose-600">
              Unable to load executives.
            </p>
          ) : (
            <Table
              aria-label="Executive roles"
              classNames={{
                th: "bg-background/50 text-[11px] uppercase tracking-wide text-text-muted",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Executive</TableColumn>
                <TableColumn>Office</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Access Role</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No executives found.">
                {executives.map((exec) => (
                  <TableRow key={exec.id}>
                    <TableCell>
                      <p className="text-sm font-medium text-text-dark">
                        {exec.name}
                      </p>
                      <p className="text-xs text-text-muted">{exec.chapterName}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{exec.officeName || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-text-muted">
                        {exec.email || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        aria-label={`Role for ${exec.name}`}
                        selectedKeys={[exec.role ?? "admin"]}
                        size="sm"
                        className="max-w-[180px]"
                        variant="bordered"
                        isDisabled={
                          updateRole.isPending || exec.id === user?.id
                        }
                        onSelectionChange={(keys) => {
                          const role = Array.from(keys)[0] as ExecutiveRole;
                          if (role && role !== exec.role) {
                            handleRoleChange(exec.id, role);
                          }
                        }}
                      >
                        <>
                          {EXECUTIVE_ROLES.map((role) => (
                            <SelectItem key={role}>{ROLE_LABELS[role]}</SelectItem>
                          ))}
                        </>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-text-dark/10 bg-background/40 p-6">
          <h2 className="text-base font-semibold text-text-dark">
            Role Assignment
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Only super admins can assign roles to executives. Contact your
            organization super admin if you need access changes.
          </p>
        </section>
      )}
    </div>
  );
}
