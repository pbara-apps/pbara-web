import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for PBA Royal Ambassadors website.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-text-dark">Terms of Service</h1>
      <p className="text-text-muted mt-4">This page will be updated with the association&apos;s terms of service.</p>
    </div>
  );
}
