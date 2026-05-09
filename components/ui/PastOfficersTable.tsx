"use client";

import type { PastOfficer } from "@/types";
import { cn } from "@heroui/react";

interface PastOfficersTableProps {
  officers: PastOfficer[];
}

export function PastOfficersTable({ officers }: PastOfficersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table
        className="min-w-full divide-y divide-slate-200 dark:divide-slate-700"
        aria-label="Past officers"
      >
        <thead className="bg-primary/5 dark:bg-primary/10">
          <tr>
            <th
              className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              scope="col"
            >
              Year of Service
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              scope="col"
            >
              Name
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              scope="col"
            >
              Post
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              scope="col"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
          {officers.map((o) => (
            <tr key={o.id} className="hover:bg-primary/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                {o.yearStart} — {o.yearEnd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                {o.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                {o.post}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span
                  className={cn(
                    "px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full",
                    o.status === "Completed"
                      ? "bg-green-100 dark:bg-green-700"
                      : "bg-red-100 dark:bg-red-700",
                  )}
                >
                  {o.status === "Completed" ? "Completed" : "Active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
