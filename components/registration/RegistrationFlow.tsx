"use client";

import { useState } from "react";
import { Spinner } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RegistrationStatusCard } from "@/components/registration/RegistrationStatusCard";
import { RegistrationStep1 } from "@/components/registration/RegistrationStep1";
import { RegistrationStep2 } from "@/components/registration/RegistrationStep2";
import { fastTransition } from "@/lib/animations";
import { useGetPublicProgramBySlug } from "@/service/apis/program";

interface RegistrationFlowProps {
  slug: string;
}

type Step = 1 | 2;

export function RegistrationFlow({ slug }: RegistrationFlowProps) {
  const reduced = useReducedMotion();
  const { data, isLoading, isError } = useGetPublicProgramBySlug(slug);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-24">
        <Spinner label="Loading registration…" color="primary" />
      </div>
    );
  }

  if (isError || !data?.program) {
    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationStatusCard kind="unavailable" />
      </div>
    );
  }

  const { program, isClosed } = data;

  if (isClosed) {
    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationStatusCard
          kind="closed"
          programTitle={program.title}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationStatusCard
          kind="success"
          programTitle={program.title}
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(200,168,75,0.14),_transparent_60%),linear-gradient(180deg,_rgba(27,36,82,0.06),_transparent)]"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-12 md:py-16">
        <ol className="mb-8 flex items-center gap-3" aria-label="Progress">
          <li className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                step >= 1 ? "bg-primary text-white" : "bg-slate-200 text-text-muted"
              }`}
            >
              1
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                step === 1 ? "text-primary" : "text-text-muted"
              }`}
            >
              Payment
            </span>
          </li>
          <li
            aria-hidden
            className={`h-px flex-1 ${
              step > 1 ? "bg-primary" : "bg-slate-200"
            }`}
          />
          <li className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                step >= 2 ? "bg-primary text-white" : "bg-slate-200 text-text-muted"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                step === 2 ? "text-primary" : "text-text-muted"
              }`}
            >
              Details
            </span>
          </li>
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: step === 1 ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: step === 1 ? 16 : -16 }}
            transition={fastTransition}
          >
            {step === 1 ? (
              <RegistrationStep1
                program={program}
                onContinue={() => setStep(2)}
              />
            ) : (
              <RegistrationStep2
                program={program}
                onBack={() => setStep(1)}
                onSuccess={() => setSubmitted(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
