"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // One client per browser session (not per render).
  const [queryClient] = useState(() => new QueryClient());
  return (
    <HeroUIProvider>
      {/* Skip transform/layout animations for users who prefer reduced motion. */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MotionConfig>

      <ToastProvider />
    </HeroUIProvider>
  );
}
