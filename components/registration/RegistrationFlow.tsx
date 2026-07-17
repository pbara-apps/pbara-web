"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RegistrationStatusCard } from "@/components/registration/RegistrationStatusCard";
import { RegistrationStep1 } from "@/components/registration/RegistrationStep1";
import { RegistrationStep2 } from "@/components/registration/RegistrationStep2";
import { RegistrationSuccessPreview } from "@/components/registration/RegistrationSuccessPreview";
import { fastTransition } from "@/lib/animations";
import {
  getProgramFetchErrorKind,
  useGetPublicProgramBySlug,
} from "@/service/apis/program";
import type { CreatedRegistration } from "@/types";

interface RegistrationFlowProps {
  slug: string;
}

type Step = 1 | 2;

export function RegistrationFlow({ slug }: RegistrationFlowProps) {
  const reduced = useReducedMotion();
  const { data, isPending, isFetching, isError, error, failureCount, refetch } =
    useGetPublicProgramBySlug(slug);
  const [step, setStep] = useState<Step>(1);
  const [createdRegistration, setCreatedRegistration] =
    useState<CreatedRegistration | null>(null);

  // AnimatePresence mode="wait" mounts the next step after exit, so a ref on
  // Step 2 is often still null in this effect. Scroll the window instead.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduced ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, reduced]);

  if (isPending || (isFetching && !data)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <Spinner
          label={failureCount > 0 ? "wait a moment" : "Loading registration…"}
          color="primary"
        />
      </div>
    );
  }

  if (isError || !data?.program) {
    const kind =
      isError && getProgramFetchErrorKind(error) === "server"
        ? "load_failed"
        : "unavailable";

    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationStatusCard
          kind={kind}
          onRetry={kind === "load_failed" ? () => void refetch() : undefined}
          isRetrying={kind === "load_failed" && isFetching}
        />
      </div>
    );
  }

  const { program, isClosed } = data;

  if (isClosed) {
    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationStatusCard kind="closed" programTitle={program.title} />
      </div>
    );
  }

  if (createdRegistration) {
    return (
      <div className="px-4 py-16 md:py-24">
        <RegistrationSuccessPreview registration={createdRegistration} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(200,168,75,0.14),_transparent_60%),linear-gradient(180deg,_rgba(27,36,82,0.06),_transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        <ol className="mb-8 flex items-center gap-3" aria-label="Progress">
          <li className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                step >= 1
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-text-muted"
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
                step >= 2
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-text-muted"
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
            exit={
              reduced ? undefined : { opacity: 0, x: step === 1 ? 16 : -16 }
            }
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
                onSuccess={setCreatedRegistration}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
