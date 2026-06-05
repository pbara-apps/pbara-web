"use client";

import { cn } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalDrawer } from "../drawers/GlobalDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const COLLAPSE_KEY = "pba.admin.sidebar.collapsed";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLLAPSE_KEY);
      if (saved !== null) setCollapsed(saved === "1");
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-text-dark">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onToggleCollapse={toggleCollapse}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-300 ease-out",
          collapsed ? "lg:ml-[76px]" : "lg:ml-[280px]",
        )}
      >
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <GlobalDrawer />
    </div>
  );
}
