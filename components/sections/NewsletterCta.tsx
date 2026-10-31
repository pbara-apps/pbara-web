"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useSubscribeNewsletter } from "@/service/apis/subscriber";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      const res = await subscribe.mutateAsync({ email: value, source: "newsletter-cta" });
      successToast(res?.message ?? "You're subscribed! We'll keep you posted.", "Subscribed");
      setEmail("");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ??
          "Unable to subscribe right now. Please try again.",
        "Subscription failed",
      );
    }
  }

  return (
    <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribe.isPending}
        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="Email for newsletter"
      />
      <Button
        type="submit"
        isLoading={subscribe.isPending}
        className="bg-gold text-primary font-semibold shrink-0"
      >
        Keep me posted
      </Button>
    </form>
  );
}
