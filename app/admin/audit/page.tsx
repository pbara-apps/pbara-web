"use client";

import {
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
} from "@heroui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { LuFileText, LuSearch } from "react-icons/lu";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { useGetAuditLogs } from "@/service/apis/audit";

dayjs.extend(relativeTime);

const PAGE_SIZE = 12;

const actionColors: Record<string, string> = {
  created: "bg-emerald-100 text-emerald-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-rose-100 text-rose-700",
};

export default function AuditAdminPage() {
  const { data: logs = [], isLoading, isError } = useGetAuditLogs(200);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const entityTypes = useMemo(
    () => Array.from(new Set(logs.map((l) => l.entityType))).sort(),
    [logs],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (entityFilter !== "all" && log.entityType !== entityFilter) return false;
      if (!q) return true;
      return (
        log.entityTitle.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    });
  }, [logs, search, entityFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Log"
        description="Track administrative actions across news, events, gallery, and leadership records."
        stats={
          <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
            {logs.length} entries
          </Chip>
        }
      />

      <section className="flex flex-wrap gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3">
        <Input
          placeholder="Search by title, actor, action…"
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
          selectedKeys={[entityFilter]}
          onSelectionChange={(keys) => {
            setEntityFilter(Array.from(keys)[0] as string);
            setPage(1);
          }}
          className="w-44"
          variant="flat"
          radius="md"
          aria-label="Entity type"
        >
          <SelectItem key="all">All Entities</SelectItem>
          <>
            {entityTypes.map((t) => (
              <SelectItem key={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </>
        </Select>
      </section>

      <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner color="primary" />
          </div>
        ) : isError ? (
          <p className="py-20 text-center text-sm text-rose-600">
            Unable to load audit logs.
          </p>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <LuFileText size={28} className="text-primary/40" />
            <p className="text-sm text-text-muted">
              Audit entries will appear here as content is created or modified.
            </p>
          </div>
        ) : (
          <>
            <Table removeWrapper aria-label="Audit log" classNames={{ th: "bg-background/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted", td: "py-3 text-sm" }}>
              <TableHeader>
                <TableColumn>Action</TableColumn>
                <TableColumn>Entity</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Actor</TableColumn>
                <TableColumn>When</TableColumn>
              </TableHeader>
              <TableBody>
                {pageItems.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Chip size="sm" variant="flat" className={actionColors[log.action] ?? ""}>
                        {log.action}
                      </Chip>
                    </TableCell>
                    <TableCell className="capitalize text-text-muted">{log.entityType}</TableCell>
                    <TableCell className="font-medium text-text-dark">{log.entityTitle}</TableCell>
                    <TableCell className="text-text-muted">{log.actorName}</TableCell>
                    <TableCell className="text-text-muted">
                      {log.timestamp ? dayjs(log.timestamp).fromNow() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center border-t border-text-dark/[0.05] px-5 py-3">
              <Pagination total={pages} page={page} onChange={setPage} size="sm" showControls radius="md" />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
