import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default ClientLayout;
