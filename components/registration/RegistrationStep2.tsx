"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Button, Spinner } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiUploadCloud,
} from "react-icons/fi";
import {
  RegistrationEntryBlock,
  type EntryDraft,
  type EntryFieldErrors,
} from "@/components/registration/RegistrationEntryBlock";
import { fadeInUp, motionSafe, mountProps } from "@/lib/animations";
import {
  errorToast,
  warningToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useGetPublicChapters } from "@/service/apis/church";
import {
  useCreateRegistration,
  useUploadRegistrationProof,
} from "@/service/apis/registration";
import { useGetPublicRanks } from "@/service/apis/rank";
import type {
  CreatedRegistration,
  RegistrationProgram,
  RegistrationType,
} from "@/types";

interface RegistrationStep2Props {
  program: RegistrationProgram;
  onBack: () => void;
  onSuccess: (registration: CreatedRegistration) => void;
}

type FormErrors = {
  registrantName?: string;
  registrantPhone?: string;
  proofOfPayment?: string;
  registrationType?: string;
  entries?: Record<string, EntryFieldErrors>;
  submit?: string;
};

type SectionId = "contact" | "proof" | "type" | "participants";

const fieldCx =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-gold focus:ring-2 focus:ring-gold/30";

const labelCx = "mb-1.5 block text-sm font-medium text-text-dark";

function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyEntry(): EntryDraft {
  return {
    id: createEntryId(),
    name: "",
    rankId: "",
    churchId: "",
    sameChurchAsFirst: false,
  };
}

function resolveInitialType(
  mode: RegistrationProgram["registrationMode"],
): RegistrationType {
  if (mode === "bulk") return "bulk";
  return "single";
}

export function RegistrationStep2({
  program,
  onBack,
  onSuccess,
}: RegistrationStep2Props) {
  const reduced = useReducedMotion();
  const proofInputId = useId();
  const { data: ranks = [], isLoading: ranksLoading } = useGetPublicRanks();
  const { data: churches = [], isLoading: churchesLoading } =
    useGetPublicChapters();
  const uploadProof = useUploadRegistrationProof();
  const createRegistration = useCreateRegistration();

  const modeChoice = program.registrationMode === "both";
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    () => resolveInitialType(program.registrationMode),
  );
  const [registrantName, setRegistrantName] = useState("");
  const [registrantPhone, setRegistrantPhone] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [entries, setEntries] = useState<EntryDraft[]>(() => [emptyEntry()]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeSection, setActiveSection] = useState<SectionId>("contact");

  const sections = useMemo(() => {
    const items: { id: SectionId; label: string }[] = [
      { id: "contact", label: "Contact" },
      { id: "proof", label: "Proof" },
    ];
    if (modeChoice) items.push({ id: "type", label: "Type" });
    items.push({ id: "participants", label: "Participants" });
    return items;
  }, [modeChoice]);

  const sortedChurches = useMemo(
    () =>
      [...churches].sort((a, b) =>
        `${a.chapterName} ${a.churchName}`.localeCompare(
          `${b.chapterName} ${b.churchName}`,
        ),
      ),
    [churches],
  );

  const sortedRanks = useMemo(
    () => [...ranks].sort((a, b) => a.name.localeCompare(b.name)),
    [ranks],
  );

  useEffect(() => {
    return () => {
      if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    };
  }, [proofPreviewUrl]);

  useEffect(() => {
    if (registrationType === "single" && entries.length > 1) {
      setEntries((prev) => prev.slice(0, 1));
    }
  }, [registrationType, entries.length]);

  const firstChurchId = entries[0]?.churchId ?? "";

  useEffect(() => {
    setEntries((prev) => {
      let changed = false;
      const next = prev.map((entry, index) => {
        if (index === 0 || !entry.sameChurchAsFirst) return entry;
        if (entry.churchId === firstChurchId) return entry;
        changed = true;
        return { ...entry, churchId: firstChurchId };
      });
      return changed ? next : prev;
    });
  }, [firstChurchId]);

  const isSubmitting = uploadProof.isPending || createRegistration.isPending;

  function goToNextSection(from: SectionId) {
    const order = sections.map((s) => s.id);
    const index = order.indexOf(from);
    const next = order[index + 1];
    if (next) setActiveSection(next);
  }

  function sectionContinue(from: SectionId, label?: string) {
    const order = sections.map((s) => s.id);
    const index = order.indexOf(from);
    if (index < 0 || index >= order.length - 1) return null;
    const nextLabel =
      label ??
      sections.find((s) => s.id === order[index + 1])?.label ??
      "Continue";

    return (
      <Button
        type="button"
        onPress={() => goToNextSection(from)}
        endContent={<FiArrowRight size={16} />}
        className="mt-5 h-11 w-full bg-primary font-semibold text-white lg:hidden"
      >
        Continue to {nextLabel}
      </Button>
    );
  }

  function updateEntry(id: string, patch: Partial<EntryDraft>) {
    setEntries((prev) => {
      const firstChurch = prev[0]?.churchId ?? "";
      return prev.map((entry) => {
        if (entry.id !== id) return entry;
        const next = { ...entry, ...patch };
        if (patch.sameChurchAsFirst === true) {
          next.churchId = firstChurch;
        }
        return next;
      });
    });
    setErrors((prev) => {
      if (!prev.entries?.[id]) return prev;
      const nextEntryErrors = { ...prev.entries };
      delete nextEntryErrors[id];
      return { ...prev, entries: nextEntryErrors, submit: undefined };
    });
  }

  const [scrollToEntryId, setScrollToEntryId] = useState<string | null>(null);

  function addEntry() {
    const entry = emptyEntry();
    setEntries((prev) => [...prev, entry]);
    setActiveSection("participants");
    setScrollToEntryId(entry.id);
  }

  useEffect(() => {
    if (!scrollToEntryId) return;

    let cancelled = false;
    const entryId = scrollToEntryId;
    let retryTimer: number | undefined;
    let attempts = 0;

    const run = () => {
      if (cancelled) return;

      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-entry-block="${entryId}"]`,
        ),
      );

      const block = candidates.find((el) => {
        let node: HTMLElement | null = el;
        while (node) {
          const style = window.getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden") {
            return false;
          }
          node = node.parentElement;
        }
        return el.getClientRects().length > 0;
      });

      if (!block) {
        attempts += 1;
        if (attempts < 20) {
          retryTimer = window.setTimeout(run, 50);
        } else {
          setScrollToEntryId(null);
        }
        return;
      }

      const scrollParent = block.closest<HTMLElement>("[data-entries-scroll]");

      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();
        const offset =
          blockRect.top -
          parentRect.top -
          parentRect.height / 2 +
          blockRect.height / 2;
        scrollParent.scrollTo({
          top: scrollParent.scrollTop + offset,
          behavior: "smooth",
        });
      } else {
        block.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const nameInput = block.querySelector<HTMLInputElement>(
        `[data-entry-name="${entryId}"]`,
      );
      nameInput?.focus({ preventScroll: true });
      setScrollToEntryId(null);
    };

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, [scrollToEntryId, entries.length]);

  function removeEntry(id: string) {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((entry) => entry.id !== id);
    });
  }

  function handleProofChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);

    if (!file) {
      setProofFile(null);
      setProofPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProofFile(null);
      setProofPreviewUrl(null);
      setErrors((prev) => ({
        ...prev,
        proofOfPayment:
          "Please upload an image of your payment proof (max 5MB).",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofFile(null);
      setProofPreviewUrl(null);
      setErrors((prev) => ({
        ...prev,
        proofOfPayment: "Proof of payment must be 5MB or smaller.",
      }));
      e.target.value = "";
      return;
    }

    setProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({
      ...prev,
      proofOfPayment: undefined,
      submit: undefined,
    }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (registrantName.trim().length < 2) {
      next.registrantName = "Enter your full name (at least 2 characters).";
    }
    if (!/^\d{7,15}$/.test(registrantPhone)) {
      next.registrantPhone = "Enter a valid phone number (digits only).";
    }
    if (!proofFile) {
      next.proofOfPayment = "Upload proof of payment to continue.";
    }
    if (modeChoice && !registrationType) {
      next.registrationType = "Choose single or bulk registration.";
    }

    const entryErrors: Record<string, EntryFieldErrors> = {};
    const activeEntries =
      registrationType === "single" ? entries.slice(0, 1) : entries;

    activeEntries.forEach((entry) => {
      const fieldErrors: EntryFieldErrors = {};
      if (entry.name.trim().length < 2) {
        fieldErrors.name = "Name is required.";
      }
      if (!entry.rankId) fieldErrors.rankId = "Select a rank.";
      if (!entry.churchId) fieldErrors.churchId = "Select a church.";
      if (Object.keys(fieldErrors).length > 0) {
        entryErrors[entry.id] = fieldErrors;
      }
    });

    if (Object.keys(entryErrors).length > 0) {
      next.entries = entryErrors;
    }

    return next;
  }

  function validationToastMessage(formErrors: FormErrors): string {
    const parts: string[] = [];
    if (formErrors.registrantName) parts.push("your full name");
    if (formErrors.registrantPhone) parts.push("a valid phone number");
    if (formErrors.proofOfPayment) parts.push("proof of payment");
    if (formErrors.registrationType) parts.push("registration type");
    if (formErrors.entries) {
      const incomplete = Object.keys(formErrors.entries).length;
      parts.push(
        incomplete === 1
          ? "complete participant details"
          : `complete details for ${incomplete} participants`,
      );
    }
    if (parts.length === 0) return "Please complete all required fields.";
    if (parts.length === 1) return `Please provide ${parts[0]}.`;
    if (parts.length === 2)
      return `Please provide ${parts[0]} and ${parts[1]}.`;
    return `Please provide ${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}.`;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      warningToast(
        validationToastMessage(nextErrors),
        "Complete required fields",
      );
      if (nextErrors.registrantName || nextErrors.registrantPhone) {
        setActiveSection("contact");
      } else if (nextErrors.proofOfPayment) {
        setActiveSection("proof");
      } else if (nextErrors.registrationType) {
        setActiveSection("type");
      } else if (nextErrors.entries) {
        setActiveSection("participants");
      }
      return;
    }
    if (!proofFile) return;

    setErrors({});

    try {
      const uploaded = await uploadProof.mutateAsync(proofFile);
      const activeEntries =
        registrationType === "single" ? entries.slice(0, 1) : entries;

      const created = await createRegistration.mutateAsync({
        programId: program.id,
        registrantName: registrantName.trim(),
        registrantPhone: registrantPhone.trim(),
        proofOfPaymentUrl: uploaded.url,
        registrationType,
        entries: activeEntries.map((entry) => ({
          name: entry.name.trim(),
          rank: entry.rankId,
          church: entry.churchId,
        })),
      });

      onSuccess(created);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ??
        "Unable to submit registration. Please check your connection and try again.";
      setErrors({ submit: message });
      errorToast(message, "Submission failed");
    }
  }

  const contactPanel = (
    <section
      id="reg-section-contact"
      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6"
    >
      <h2 className="font-heading text-base font-semibold text-text-dark md:text-lg">
        Your contact details
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Person submitting this registration.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="registrant-name" className={labelCx}>
            Full name
          </label>
          <input
            id="registrant-name"
            type="text"
            value={registrantName}
            onChange={(e) => {
              setRegistrantName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                registrantName: undefined,
                submit: undefined,
              }));
            }}
            className={fieldCx}
            autoComplete="name"
          />
          {errors.registrantName ? (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.registrantName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="registrant-phone" className={labelCx}>
            Phone number
          </label>
          <input
            id="registrant-phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            value={registrantPhone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
              setRegistrantPhone(digitsOnly);
              setErrors((prev) => ({
                ...prev,
                registrantPhone: undefined,
                submit: undefined,
              }));
            }}
            onKeyDown={(e) => {
              if (
                e.ctrlKey ||
                e.metaKey ||
                e.altKey ||
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "Tab" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Home" ||
                e.key === "End"
              ) {
                return;
              }
              if (!/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              const digitsOnly = pasted.replace(/\D/g, "").slice(0, 15);
              setRegistrantPhone(digitsOnly);
              setErrors((prev) => ({
                ...prev,
                registrantPhone: undefined,
                submit: undefined,
              }));
            }}
            className={fieldCx}
            placeholder="08012345678"
            autoComplete="tel"
          />
          {errors.registrantPhone ? (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.registrantPhone}
            </p>
          ) : null}
        </div>
      </div>
      {sectionContinue("contact")}
    </section>
  );

  const proofPanel = (
    <section
      id="reg-section-proof"
      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6"
    >
      <h2 className="font-heading text-base font-semibold text-text-dark md:text-lg">
        Proof of payment
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Clear image of your transfer receipt (max 5MB).
      </p>
      <label
        htmlFor={proofInputId}
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center transition-colors hover:border-gold/50 hover:bg-gold/5 lg:flex-row lg:justify-start lg:gap-5 lg:text-left"
      >
        {proofPreviewUrl ? (
          <div className="flex h-24 w-full max-w-[10rem] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 lg:h-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proofPreviewUrl}
              alt="Proof of payment preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <FiUploadCloud size={20} />
          </span>
        )}
        <span>
          <span className="block text-sm font-medium text-text-dark">
            {proofFile ? proofFile.name : "Choose image file"}
          </span>
          <span className="mt-0.5 block text-xs text-text-muted">
            Click to browse · JPEG, PNG, or similar
          </span>
        </span>
        <input
          id={proofInputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleProofChange}
        />
      </label>
      {errors.proofOfPayment ? (
        <p className="mt-2 text-xs text-red-600">{errors.proofOfPayment}</p>
      ) : null}
      {sectionContinue("proof")}
    </section>
  );

  const typePanel = modeChoice ? (
    <section
      id="reg-section-type"
      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6"
    >
      <h2 className="font-heading text-base font-semibold text-text-dark md:text-lg">
        Registration type
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              value: "single" as const,
              label: "Single",
              hint: "One participant",
            },
            {
              value: "bulk" as const,
              label: "Bulk",
              hint: "Multiple participants",
            },
          ] as const
        ).map((option) => {
          const selected = registrationType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setRegistrationType(option.value);
                setErrors((prev) => ({
                  ...prev,
                  registrationType: undefined,
                  submit: undefined,
                }));
              }}
              className={`rounded-xl border px-4 py-3.5 text-left transition-colors ${
                selected
                  ? "border-gold bg-gold/10 ring-2 ring-gold/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="block font-heading font-semibold text-text-dark">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
      {errors.registrationType ? (
        <p className="mt-2 text-xs text-red-600">{errors.registrationType}</p>
      ) : null}
      {sectionContinue("type")}
    </section>
  ) : null;

  const submitButton = (
    <Button
      type="submit"
      isDisabled={isSubmitting}
      isLoading={isSubmitting}
      spinner={<Spinner size="sm" color="white" />}
      className="h-12 min-w-[200px] flex-1 bg-primary font-semibold text-white shadow-md data-[disabled=true]:opacity-50 sm:flex-none"
    >
      {isSubmitting ? "Submitting…" : "Submit registration"}
    </Button>
  );

  const addAnotherButton = (
    <Button
      type="button"
      variant="bordered"
      onPress={addEntry}
      startContent={<FiPlus size={16} />}
      className="h-12 min-w-[180px] flex-1 border-primary/25 text-primary sm:flex-none"
    >
      Add another participant
    </Button>
  );

  const actionBar = (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center ${
        registrationType === "bulk" ? "sm:justify-between" : "sm:justify-end"
      }`}
    >
      {registrationType === "bulk" ? (
        <>
          {submitButton}
          {addAnotherButton}
        </>
      ) : (
        submitButton
      )}
    </div>
  );

  const participantsPanel = (
    <section
      id="reg-section-participants"
      className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-4 md:px-6">
        <h2 className="font-heading text-base font-semibold text-text-dark md:text-lg">
          {registrationType === "bulk" ? "Participants" : "Participant details"}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {registrationType === "bulk"
            ? `${entries.length} entr${entries.length === 1 ? "y" : "ies"} — scroll this panel to review all.`
            : "Enter the details for the person being registered."}
        </p>
      </div>

      <div
        data-entries-scroll
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 md:px-6 lg:max-h-[min(28rem,52vh)]"
      >
        {(registrationType === "single" ? entries.slice(0, 1) : entries).map(
          (entry, index) => (
            <RegistrationEntryBlock
              key={entry.id}
              index={index}
              entry={entry}
              ranks={sortedRanks}
              churches={sortedChurches}
              ranksLoading={ranksLoading}
              churchesLoading={churchesLoading}
              canRemove={registrationType === "bulk" && entries.length > 1}
              showSameChurchToggle={registrationType === "bulk" && index > 0}
              errors={errors.entries?.[entry.id]}
              onChange={(patch) => updateEntry(entry.id, patch)}
              onRemove={() => removeEntry(entry.id)}
            />
          ),
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-4 md:px-6">
        {actionBar}
      </div>
    </section>
  );

  return (
    <motion.form
      {...mountProps(reduced)}
      variants={motionSafe(reduced, fadeInUp)}
      onSubmit={handleSubmit}
      className="space-y-0"
      noValidate
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold"
          >
            <FiArrowLeft size={16} /> Back to payment details
          </button>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Complete registration
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted md:text-base">
            Move between sections below — your progress stays in place as you
            fill each part.
          </p>
        </div>
        <p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-text-muted">
          {program.title}
        </p>
      </div>

      <nav
        aria-label="Form sections"
        className="sticky top-16 z-20 -mx-1 mb-6 overflow-x-auto px-1 pb-1 lg:hidden"
      >
        <div className="inline-flex min-w-full gap-2 rounded-xl border border-slate-200/90 bg-white/95 p-1.5 shadow-sm backdrop-blur sm:min-w-0">
          {sections.map((section) => {
            const selected = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-muted hover:bg-slate-50 hover:text-primary"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile / tablet: one section at a time */}
      <div className="space-y-5 lg:hidden">
        {activeSection === "contact" ? contactPanel : null}
        {activeSection === "proof" ? proofPanel : null}
        {activeSection === "type" ? typePanel : null}
        {activeSection === "participants" ? participantsPanel : null}
      </div>

      {/* Large screens: two columns — details + participants */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-2 lg:items-start">
        <div className="space-y-5">
          {contactPanel}
          {proofPanel}
          {typePanel}
        </div>
        <div className="lg:sticky lg:top-32 lg:self-start">
          {participantsPanel}
        </div>
      </div>

      {errors.submit ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errors.submit}
        </div>
      ) : null}
    </motion.form>
  );
}
