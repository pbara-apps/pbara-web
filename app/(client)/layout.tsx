import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <div id="content">{children}</div>
      <Footer />
    </>
  );
};

export default ClientLayout;
