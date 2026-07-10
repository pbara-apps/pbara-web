"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { formatEventDateLabel } from "@/lib/event-date";
import { useGetPublicChapters } from "@/service/apis/church";
import { useSubmitContactMessage } from "@/service/apis/message";
import type { EventItem } from "@/types";

interface EventInterestModalProps {
  event: EventItem | null;
  onClose: () => void;
}

const fieldCx =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/40 dark:border-slate-700 dark:bg-slate-900";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "Guest", last_name: "Guest" };
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

function chapterLabel(chapterName: string, churchName: string) {
  if (chapterName && churchName && chapterName !== churchName) {
    return `${chapterName} · ${churchName}`;
  }
  return chapterName || churchName;
}

export function EventInterestModal({
  event,
  onClose,
}: EventInterestModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isExternal, setIsExternal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [externalChapter, setExternalChapter] = useState("");
  const submitMessage = useSubmitContactMessage();
  const { data: chapters = [], isLoading: chaptersLoading } =
    useGetPublicChapters();

  const sortedChapters = useMemo(
    () =>
      [...chapters].sort((a, b) =>
        chapterLabel(a.chapterName, a.churchName).localeCompare(
          chapterLabel(b.chapterName, b.churchName),
        ),
      ),
    [chapters],
  );

  useEffect(() => {
    if (!event) return;
    setName("");
    setEmail("");
    setPhone("");
    setIsExternal(false);
    setSelectedChapterId("");
    setExternalChapter("");
  }, [event]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail) {
      errorToast("Please provide your name and email so we can follow up.");
      return;
    }

    let chapterValue = "";
    if (isExternal) {
      chapterValue = externalChapter.trim();
    } else if (selectedChapterId) {
      const selected = sortedChapters.find((c) => c.id === selectedChapterId);
      chapterValue = selected
        ? chapterLabel(selected.chapterName, selected.churchName)
        : "";
    }

    const { first_name, last_name } = splitName(trimmedName);
    const dateLabel = formatEventDateLabel(event.date, event.endDate);
    const messageLines = [
      `Event interest registration request.`,
      `Event: ${event.title}`,
      `Date: ${dateLabel}`,
      `Venue: ${event.venue}`,
      chapterValue
        ? `Chapter: ${chapterValue}${isExternal ? " (external)" : ""}`
        : null,
      trimmedPhone ? `Phone: ${trimmedPhone}` : null,
      `Please follow up when registration opens.`,
    ].filter(Boolean);

    try {
      await submitMessage.mutateAsync({
        first_name,
        last_name,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        subject: `Event interest: ${event.title}`,
        message: messageLines.join("\n"),
      });
      successToast(
        "Thanks — we’ve noted your interest and will follow up.",
        "Interest recorded",
      );
      onClose();
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ??
          "Unable to submit your interest. Please try again.",
        "Submit failed",
      );
    }
  }

  return (
    <Modal
      isOpen={!!event}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-slate-900",
        header: "border-b border-slate-200 dark:border-slate-800",
        footer: "border-t border-slate-200 dark:border-slate-800",
      }}
    >
      <ModalContent>
        {() =>
          event ? (
            <>
              <ModalHeader className="flex flex-col items-start gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Express interest
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {event.title}
                </h2>
              </ModalHeader>

              <ModalBody className="gap-5 py-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <p className="flex items-center gap-2">
                      <FiCalendar
                        size={15}
                        className="shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>
                        {formatEventDateLabel(event.date, event.endDate)}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMapPin
                        size={15}
                        className="shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{event.venue}</span>
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Online registration isn’t open yet — leave your details and
                    we’ll follow up.
                  </p>
                </div>

                <form
                  id="event-interest-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="interest-name"
                      className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      Full name
                    </label>
                    <input
                      id="interest-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className={fieldCx}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="interest-email"
                        className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200"
                      >
                        Email
                      </label>
                      <input
                        id="interest-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={fieldCx}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="interest-phone"
                        className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200"
                      >
                        Phone{" "}
                        <span className="font-normal text-slate-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="interest-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className={fieldCx}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor={
                          isExternal
                            ? "interest-chapter-external"
                            : "interest-chapter"
                        }
                        className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                      >
                        Chapter{" "}
                        <span className="font-normal text-slate-400">
                          (optional)
                        </span>
                      </label>
                      <label
                        htmlFor="interest-external"
                        className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <input
                          id="interest-external"
                          type="checkbox"
                          checked={isExternal}
                          onChange={(e) => {
                            const next = e.target.checked;
                            setIsExternal(next);
                            if (next) setSelectedChapterId("");
                            else setExternalChapter("");
                          }}
                          className="size-4 rounded border-slate-300 text-primary focus:ring-accent-gold"
                        />
                        External
                      </label>
                    </div>

                    {isExternal ? (
                      <input
                        id="interest-chapter-external"
                        type="text"
                        value={externalChapter}
                        onChange={(e) => setExternalChapter(e.target.value)}
                        placeholder="Enter your chapter or church"
                        className={fieldCx}
                      />
                    ) : (
                      <select
                        id="interest-chapter"
                        value={selectedChapterId}
                        onChange={(e) => setSelectedChapterId(e.target.value)}
                        disabled={chaptersLoading}
                        className={`${fieldCx} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="">
                          {chaptersLoading
                            ? "Loading chapters…"
                            : "Select a chapter"}
                        </option>
                        {sortedChapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            {chapterLabel(
                              chapter.chapterName,
                              chapter.churchName,
                            )}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </form>
              </ModalBody>

              <ModalFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/contact"
                  className="text-center text-sm font-semibold text-primary hover:underline sm:text-left"
                  onClick={onClose}
                >
                  Have questions? Contact us
                </Link>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    type="button"
                    variant="bordered"
                    className="flex-1 border-slate-200 sm:flex-none"
                    onPress={onClose}
                    isDisabled={submitMessage.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="event-interest-form"
                    className="flex-1 bg-accent-gold font-bold text-slate-900 sm:flex-none"
                    isLoading={submitMessage.isPending}
                    spinner={<Spinner size="sm" color="current" />}
                  >
                    I’m interested
                  </Button>
                </div>
              </ModalFooter>
            </>
          ) : null
        }
      </ModalContent>
    </Modal>
  );
}
