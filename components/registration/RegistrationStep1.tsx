"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiCopy } from "react-icons/fi";
import { fadeInUp, motionSafe, mountProps } from "@/lib/animations";
import type { RegistrationProgram } from "@/types";

interface RegistrationStep1Props {
  program: RegistrationProgram;
  onContinue: () => void;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RegistrationStep1({
  program,
  onContinue,
}: RegistrationStep1Props) {
  const reduced = useReducedMotion();
  const [agreed, setAgreed] = useState(false);
  const [copied, setCopied] = useState(false);

  const terms =
    program.termsAndConditions?.trim() ||
    "By proceeding, you confirm that payment will be made to the official account listed above, that the details you submit are accurate, and that registration remains subject to verification by PBA Royal Ambassadors.";

  const hasFlyer = Boolean(program.flyerImageUrl);

  async function copyAccountNumber() {
    const value = program.bankDetails.accountNumber;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function FlyerImage({ className }: { className?: string }) {
    if (!program.flyerImageUrl) return null;
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm ${className ?? ""}`}
      >
        <Image
          src={program.flyerImageUrl}
          alt={`${program.title} flyer`}
          width={1200}
          height={1600}
          className="h-auto w-full object-contain"
          sizes="(max-width: 1024px) 100vw, 42vw"
          priority
        />
      </div>
    );
  }

  return (
    <motion.div
      {...mountProps(reduced)}
      variants={motionSafe(reduced, fadeInUp)}
      className="space-y-8"
    >
      <FlyerImage className="lg:hidden" />

      <div
        className={`grid gap-8 lg:items-start ${
          hasFlyer ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)]" : ""
        }`}
      >
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {program.category}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
              {program.title}
            </h1>
            {program.description ? (
              <p className="max-w-2xl whitespace-pre-wrap text-base leading-relaxed text-text-muted">
                {program.description}
              </p>
            ) : null}
          </header>

          <section
            aria-labelledby="payment-heading"
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-gradient-to-br from-primary via-[#1f2a5c] to-[#2a3568] px-6 py-7 text-white md:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Amount to pay
              </p>
              <p
                id="payment-heading"
                className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl"
              >
                {formatAmount(program.amount)}
              </p>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                Transfer the exact amount to the account below, then continue
                with your registration details and proof of payment.
              </p>
            </div>

            <div className="space-y-5 px-6 py-7 md:px-8">
              <h2 className="font-heading text-lg font-semibold text-text-dark">
                Bank account details
              </h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Bank
                  </dt>
                  <dd className="mt-1 text-base font-medium text-text-dark">
                    {program.bankDetails.bankName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Account name
                  </dt>
                  <dd className="mt-1 text-base font-medium text-text-dark">
                    {program.bankDetails.accountName}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Account number
                  </dt>
                  <dd className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-heading text-xl font-semibold tracking-wider text-primary">
                      {program.bankDetails.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-primary transition-colors hover:border-gold/40 hover:bg-gold/10"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="inline-flex items-center gap-2 text-emerald-700"
                          >
                            <FiCheck size={16} /> Copied
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="inline-flex items-center gap-2"
                          >
                            <FiCopy size={16} /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section
            aria-labelledby="terms-heading"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8"
          >
            <h2
              id="terms-heading"
              className="font-heading text-lg font-semibold text-text-dark"
            >
              Terms and conditions
            </h2>
            <div className="mt-4 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-text-muted">
              {terms}
            </div>
            <div className="mt-5">
              <Checkbox
                isSelected={agreed}
                onValueChange={setAgreed}
                classNames={{
                  label: "text-sm text-text-dark",
                }}
              >
                I agree to the terms and conditions
              </Checkbox>
            </div>
          </section>

          <Button
            type="button"
            isDisabled={!agreed}
            onPress={onContinue}
            className="h-12 w-full bg-primary font-semibold text-white shadow-md transition-opacity data-[disabled=true]:opacity-50 sm:w-auto sm:min-w-[220px]"
          >
            I&apos;ve Made Payment
          </Button>
        </div>

        {hasFlyer ? (
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <FlyerImage />
          </aside>
        ) : null}
      </div>
    </motion.div>
  );
}
