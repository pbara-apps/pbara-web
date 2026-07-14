"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiClock } from "react-icons/fi";
import { fadeInUp, motionSafe, mountProps } from "@/lib/animations";

type StatusKind = "unavailable" | "closed" | "success";

interface RegistrationStatusCardProps {
  kind: StatusKind;
  programTitle?: string;
}

const copy: Record<
  StatusKind,
  {
    icon: typeof FiAlertCircle;
    title: string;
    body: (title?: string) => string;
    cta: string;
  }
> = {
  unavailable: {
    icon: FiAlertCircle,
    title: "Registration not available",
    body: () =>
      "This registration link is inactive or could not be found. Please confirm you have the correct link, or contact our support team if you believe this is an error.",
    cta: "Browse open registrations",
  },
  closed: {
    icon: FiClock,
    title: "Registration closed",
    body: (title) =>
      title
        ? `Registration for “${title}” has closed. Late submissions are no longer accepted through this portal.`
        : "The registration deadline for this program has passed. Submissions are no longer accepted through this portal.",
    cta: "View other registrations",
  },
  success: {
    icon: FiCheckCircle,
    title: "Registration received",
    body: () =>
      "Your submission is pending verification. Payment is not confirmed yet — our team will review your proof of payment and entries, then follow up if needed. You may also contact our support team to check your status.",
    cta: "Back to registrations",
  },
};

export function RegistrationStatusCard({
  kind,
  programTitle,
}: RegistrationStatusCardProps) {
  const reduced = useReducedMotion();
  const { icon: Icon, title, body, cta } = copy[kind];
  const tone =
    kind === "success"
      ? "border-emerald-200/80 bg-emerald-50/80 text-emerald-900"
      : kind === "closed"
        ? "border-amber-200/80 bg-amber-50/70 text-amber-950"
        : "border-slate-200 bg-white text-text-dark";

  const iconTone =
    kind === "success"
      ? "bg-emerald-100 text-emerald-700"
      : kind === "closed"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-primary";

  return (
    <motion.div
      {...mountProps(reduced)}
      variants={motionSafe(reduced, fadeInUp)}
      className={`mx-auto max-w-xl rounded-2xl border px-8 py-12 text-center shadow-sm ${tone}`}
    >
      <div
        className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${iconTone}`}
      >
        <Icon size={26} aria-hidden />
      </div>
      <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
        {body(programTitle)}
      </p>
      <Button
        as={Link}
        href="/registration"
        endContent={<FiArrowRight size={16} />}
        className="mt-8 h-11 bg-primary font-semibold text-white shadow-md"
      >
        {cta}
      </Button>
    </motion.div>
  );
}
