"use client";

import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useCurrentUser((s) => s.token);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/login");
    }
  }, [ready, token, router]);

  if (!ready || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner color="primary" size="lg" />
          <p className="text-sm text-text-muted">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
