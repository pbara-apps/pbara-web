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
import { FiArrowLeft, FiPlus, FiUploadCloud } from "react-icons/fi";
import {
  RegistrationEntryBlock,
  type EntryDraft,
  type EntryFieldErrors,
} from "@/components/registration/RegistrationEntryBlock";
import { fadeInUp, motionSafe, mountProps } from "@/lib/animations";
import { useGetPublicChapters } from "@/service/apis/church";
import {
  useCreateRegistration,
  useUploadRegistrationProof,
} from "@/service/apis/registration";
import { useGetPublicRanks } from "@/service/apis/rank";
import type {
  RegistrationProgram,
  RegistrationType,
} from "@/types";

interface RegistrationStep2Props {
  program: RegistrationProgram;
  onBack: () => void;
  onSuccess: () => void;
}

type FormErrors = {
  registrantName?: string;
  registrantPhone?: string;
  proofOfPayment?: string;
  registrationType?: string;
  entries?: Record<string, EntryFieldErrors>;
  submit?: string;
};

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

  const isSubmitting =
    uploadProof.isPending || createRegistration.isPending;

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

  function addEntry() {
    setEntries((prev) => [...prev, emptyEntry()]);
  }

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
        proofOfPayment: "Please upload an image of your payment proof (max 5MB).",
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
    setErrors((prev) => ({ ...prev, proofOfPayment: undefined, submit: undefined }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (registrantName.trim().length < 2) {
      next.registrantName = "Enter your full name (at least 2 characters).";
    }
    if (registrantPhone.trim().length < 7) {
      next.registrantPhone = "Enter a valid phone number.";
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

  const requiredComplete = useMemo(() => {
    const activeEntries =
      registrationType === "single" ? entries.slice(0, 1) : entries;
    if (registrantName.trim().length < 2) return false;
    if (registrantPhone.trim().length < 7) return false;
    if (!proofFile) return false;
    return activeEntries.every(
      (entry) =>
        entry.name.trim().length >= 2 &&
        Boolean(entry.rankId) &&
        Boolean(entry.churchId),
    );
  }, [
    registrantName,
    registrantPhone,
    proofFile,
    entries,
    registrationType,
  ]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (!proofFile) return;

    setErrors({});

    try {
      const uploaded = await uploadProof.mutateAsync(proofFile);
      const activeEntries =
        registrationType === "single" ? entries.slice(0, 1) : entries;

      await createRegistration.mutateAsync({
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

      onSuccess();
    } catch (err) {
      setErrors({
        submit:
          (err as { message?: string })?.message ??
          "Unable to submit registration. Please check your connection and try again.",
      });
    }
  }

  return (
    <motion.form
      {...mountProps(reduced)}
      variants={motionSafe(reduced, fadeInUp)}
      onSubmit={handleSubmit}
      className="space-y-8"
      noValidate
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
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
            Provide your details, upload proof of payment, and list each
            participant below.
          </p>
        </div>
        <p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-text-muted">
          {program.title}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-heading text-lg font-semibold text-text-dark">
          Your contact details
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          This is the person submitting this registration.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              value={registrantPhone}
              onChange={(e) => {
                setRegistrantPhone(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  registrantPhone: undefined,
                  submit: undefined,
                }));
              }}
              className={fieldCx}
              placeholder="+234…"
              autoComplete="tel"
            />
            {errors.registrantPhone ? (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.registrantPhone}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-heading text-lg font-semibold text-text-dark">
          Proof of payment
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Upload a clear image of your transfer receipt (JPEG, PNG, or similar ·
          max 5MB).
        </p>
        <label
          htmlFor={proofInputId}
          className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-8 text-center transition-colors hover:border-gold/50 hover:bg-gold/5"
        >
          {proofPreviewUrl ? (
            <div className="flex h-36 w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofPreviewUrl}
                alt="Proof of payment preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <FiUploadCloud size={22} />
            </span>
          )}
          <span className="text-sm font-medium text-text-dark">
            {proofFile ? proofFile.name : "Choose image file"}
          </span>
          <span className="text-xs text-text-muted">Click to browse</span>
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
      </section>

      {modeChoice ? (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-heading text-lg font-semibold text-text-dark">
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
                  className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                    selected
                      ? "border-gold bg-gold/10 ring-2 ring-gold/30"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="block font-heading font-semibold text-text-dark">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs text-text-muted">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.registrationType ? (
            <p className="mt-2 text-xs text-red-600">
              {errors.registrationType}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-dark">
              {registrationType === "bulk"
                ? "Participants"
                : "Participant details"}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {registrationType === "bulk"
                ? "Add each person included in this registration."
                : "Enter the details for the person being registered."}
            </p>
          </div>
          {registrationType === "bulk" ? (
            <Button
              type="button"
              variant="bordered"
              onPress={addEntry}
              startContent={<FiPlus size={16} />}
              className="border-primary/20 text-primary"
            >
              Add another
            </Button>
          ) : null}
        </div>

        <div className="space-y-4">
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
                showSameChurchToggle={
                  registrationType === "bulk" && index > 0
                }
                errors={errors.entries?.[entry.id]}
                onChange={(patch) => updateEntry(entry.id, patch)}
                onRemove={() => removeEntry(entry.id)}
              />
            ),
          )}
        </div>
      </section>

      {errors.submit ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errors.submit}
        </div>
      ) : null}

      <Button
        type="submit"
        isDisabled={!requiredComplete || isSubmitting}
        isLoading={isSubmitting}
        spinner={<Spinner size="sm" color="white" />}
        className="h-12 w-full bg-primary font-semibold text-white shadow-md data-[disabled=true]:opacity-50 sm:w-auto sm:min-w-[220px]"
      >
        {isSubmitting ? "Submitting…" : "Submit registration"}
      </Button>
    </motion.form>
  );
}
