"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { LuChevronRight } from "react-icons/lu";

export interface QuickAction {
  label: string;
  icon: IconType;
  href?: string;
  onClick?: () => void;
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary to-[#040e3d] p-5 shadow-[0_4px_20px_rgba(27,36,82,0.18)] ring-1 ring-white/5">
      <h3 className="text-base font-semibold text-white">Quick Actions</h3>
      <p className="mt-0.5 text-xs text-white/55">
        Jump straight into common tasks
      </p>

      <div className="mt-4 space-y-2">
        {actions.map((a) => {
          const Icon = a.icon;
          const className =
            "group flex w-full items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5 text-left text-sm font-medium text-white transition-all hover:bg-white/[0.12]";

          const content = (
            <>
              <span className="flex items-center justify-center rounded-lg bg-gold/15 text-gold transition-colors">
                <Icon size={20} />
              </span>
              <span className="flex-1">{a.label}</span>
              <LuChevronRight
                size={16}
                className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
              />
            </>
          );

          if (a.href) {
            return (
              <Link key={a.label} href={a.href} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={a.label}
              onClick={a.onClick}
              type="button"
              className={className}
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}
