"use client";

import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from "@heroui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { LuMail, LuSearch, LuTrash2 } from "react-icons/lu";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  useDeleteMessage,
  useDeleteMessagesBulk,
  useGetMessages,
  useMarkMessageRead,
  useMarkMessagesReadBulk,
} from "@/service/apis/message";
import type { AdminMessage } from "@/types/admin";

dayjs.extend(relativeTime);

const PAGE_SIZE = 10;

export default function MessagesAdminPage() {
  const { data: messages = [], isLoading, isError } = useGetMessages();
  const markRead = useMarkMessageRead();
  const markReadBulk = useMarkMessagesReadBulk();
  const deleteMessage = useDeleteMessage();
  const deleteBulk = useDeleteMessagesBulk();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeMessage, setActiveMessage] = useState<AdminMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    label: string;
  } | null>(null);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((msg) => {
      if (statusFilter === "unread" && msg.isRead) return false;
      if (statusFilter === "read" && !msg.isRead) return false;
      if (!q) return true;
      return (
        msg.fullName.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openMessage = async (msg: AdminMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        await markRead.mutateAsync(msg.id);
      } catch {
        // Non-blocking — detail still opens
      }
    }
  };

  const handleMarkSelectedRead = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      await markReadBulk.mutateAsync(ids);
      setSelected(new Set());
      successToast("Selected messages marked as read.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Action failed.",
        "Error",
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBulk.mutateAsync(deleteTarget.ids);
      setSelected(new Set());
      setActiveMessage(null);
      setDeleteTarget(null);
      successToast("Selected messages deleted.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Delete failed.",
        "Error",
      );
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await deleteMessage.mutateAsync(id);
      if (activeMessage?.id === id) setActiveMessage(null);
      successToast("Message deleted.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Delete failed.",
        "Error",
      );
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from the public website."
        stats={
          <>
            <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
              {messages.length} total
            </Chip>
            {unreadCount > 0 ? (
              <Chip size="sm" variant="flat" className="bg-gold/15 text-primary">
                {unreadCount} unread
              </Chip>
            ) : null}
          </>
        }
      />

      <section className="flex flex-wrap gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3">
        <Input
          placeholder="Search by name, email, subject…"
          value={search}
          onValueChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          startContent={<LuSearch size={16} className="text-text-muted" />}
          variant="flat"
          radius="full"
          className="min-w-[240px] flex-1"
          classNames={{
            inputWrapper: "bg-background/60 border border-text-dark/[0.06]",
            input: "text-sm",
          }}
        />
        <Select
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => {
            setStatusFilter(Array.from(keys)[0] as string);
            setPage(1);
          }}
          className="w-40"
          variant="flat"
          radius="md"
          aria-label="Status filter"
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="unread">Unread</SelectItem>
          <SelectItem key="read">Read</SelectItem>
        </Select>
        {selected.size > 0 ? (
          <Button size="sm" variant="flat" onPress={handleMarkSelectedRead}>
            Mark {selected.size} as read
          </Button>
        ) : null}
      </section>

      <BulkActionBar
        count={selected.size}
        entityLabel="Message"
        onClear={() => setSelected(new Set())}
        onDelete={() =>
          setDeleteTarget({
            ids: Array.from(selected),
            label: `${selected.size} messages`,
          })
        }
        deleting={deleteBulk.isPending}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner color="primary" />
            </div>
          ) : isError ? (
            <p className="py-20 text-center text-sm text-rose-600">
              Unable to load messages.
            </p>
          ) : (
            <>
              <Table
                aria-label="Contact messages"
                selectionMode="multiple"
                selectedKeys={selected}
                onSelectionChange={(keys) => {
                  if (keys === "all") {
                    setSelected(new Set(pageItems.map((m) => m.id)));
                  } else {
                    setSelected(new Set(Array.from(keys) as string[]));
                  }
                }}
                classNames={{
                  th: "bg-background/50 text-[11px] uppercase tracking-wide text-text-muted",
                  td: "py-3",
                }}
              >
                <TableHeader>
                  <TableColumn>From</TableColumn>
                  <TableColumn>Subject</TableColumn>
                  <TableColumn>Received</TableColumn>
                  <TableColumn>Status</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No messages yet.">
                  {pageItems.map((msg) => (
                    <TableRow
                      key={msg.id}
                      className={cn(
                        "cursor-pointer",
                        activeMessage?.id === msg.id && "bg-primary/[0.03]",
                        !msg.isRead && "font-medium",
                      )}
                      onClick={() => openMessage(msg)}
                    >
                      <TableCell>
                        <div>
                          <p className="text-sm text-text-dark">{msg.fullName}</p>
                          <p className="text-xs text-text-muted">{msg.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[220px] truncate text-sm">{msg.subject}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-text-muted">
                          {msg.createdAt
                            ? dayjs(msg.createdAt).format("MMM D, YYYY")
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          className={
                            msg.isRead
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gold/15 text-primary"
                          }
                        >
                          {msg.isRead ? "Read" : "New"}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pages > 1 ? (
                <div className="flex justify-center border-t border-text-dark/[0.05] py-4">
                  <Pagination
                    total={pages}
                    page={page}
                    onChange={setPage}
                    size="sm"
                    showControls
                  />
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="rounded-2xl border border-text-dark/[0.05] bg-surface p-6 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
          {activeMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {activeMessage.subject}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {activeMessage.fullName} · {activeMessage.email}
                  </p>
                  {activeMessage.phone ? (
                    <p className="text-xs text-text-muted">{activeMessage.phone}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-text-muted">
                    {activeMessage.createdAt
                      ? dayjs(activeMessage.createdAt).format("MMMM D, YYYY h:mm A")
                      : ""}
                  </p>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  aria-label="Delete message"
                  onPress={() => handleDeleteOne(activeMessage.id)}
                >
                  <LuTrash2 size={16} />
                </Button>
              </div>

              <div className="rounded-xl bg-background/60 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-dark">
                  {activeMessage.message}
                </p>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <LuMail size={14} /> Reply via email
              </a>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-text-muted">
              <LuMail size={32} className="mb-3 opacity-40" />
              <p className="text-sm">Select a message to view details.</p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete messages?"
        message={`This will permanently delete ${deleteTarget?.label ?? "selected messages"}.`}
        confirmLabel="Delete"
        loading={deleteBulk.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSelected}
      />
    </div>
  );
}
