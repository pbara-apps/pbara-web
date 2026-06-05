import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for PBA Royal Ambassadors website.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-text-dark">Privacy Policy</h1>
      <p className="text-text-muted mt-4">This page will be updated with the association&apos;s privacy policy.</p>
    </div>
  );
}
